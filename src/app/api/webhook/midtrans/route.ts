import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transactions, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
// @ts-ignore
import midtransClient from "midtrans-client";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verification signature key
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const hash = crypto
      .createHash("sha512")
      .update(body.order_id + body.status_code + body.gross_amount + serverKey)
      .digest("hex");

    if (body.signature_key !== hash) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const orderId = body.order_id;
    const transactionStatus = body.transaction_status;
    const fraudStatus = body.fraud_status;
    const paymentType = body.payment_type;

    let finalStatus = "pending";

    if (transactionStatus === "capture") {
      if (fraudStatus === "challenge") {
        finalStatus = "challenge";
      } else if (fraudStatus === "accept") {
        finalStatus = "settlement";
      }
    } else if (transactionStatus === "settlement") {
      finalStatus = "settlement";
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      finalStatus = "expire";
    } else if (transactionStatus === "pending") {
      finalStatus = "pending";
    }

    // Update transaction in db
    await db.update(transactions)
      .set({ status: finalStatus, paymentType })
      .where(eq(transactions.orderId, orderId));

    // If payment successful, upgrade user
    if (finalStatus === "settlement") {
      const txRows = await db.select().from(transactions).where(eq(transactions.orderId, orderId)).limit(1);
      if (txRows.length > 0) {
        const tx = txRows[0];
        // Upgrade the user to the plan they purchased
        await db.update(users).set({ plan: tx.plan }).where(eq(users.id, tx.userId));
      }
    }

    return NextResponse.json({ success: true, message: "OK" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
