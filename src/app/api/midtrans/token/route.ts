import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { transactions } from "@/lib/db/schema";
import { PLAN_DETAILS, type Plan } from "@/lib/subscription";
// @ts-ignore
import midtransClient from "midtrans-client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();

    if (!plan || (plan !== "PRO" && plan !== "ULTRA")) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Determine price
    // Note: We strip 'Rp ' and '.' then parse to int
    const rawPrice = PLAN_DETAILS[plan as Plan].price;
    const priceAmount = parseInt(rawPrice.replace(/[^0-9]/g, ""), 10);

    if (isNaN(priceAmount) || priceAmount <= 0) {
      return NextResponse.json({ error: "Invalid price configuration" }, { status: 500 });
    }

    // Generate Order ID
    const orderId = `tx_${Date.now()}_${session.user.id.slice(0, 5)}`;

    // Save transaction to DB
    await db.insert(transactions).values({
      orderId,
      userId: session.user.id,
      plan: plan as Plan,
      grossAmount: priceAmount,
      status: "pending",
    });

    // Create Snap API instance
    const snap = new midtransClient.Snap({
      isProduction: process.env.NODE_ENV === "production" && !!process.env.MIDTRANS_IS_PRODUCTION,
      serverKey: process.env.MIDTRANS_SERVER_KEY || "",
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "",
    });

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: priceAmount,
      },
      customer_details: {
        first_name: session.user.name || "User",
        email: session.user.email || "",
      },
      item_details: [
        {
          id: `plan_${plan.toLowerCase()}`,
          price: priceAmount,
          quantity: 1,
          name: `PROPOSAL.AI ${plan} Plan`,
        },
      ],
    };

    const transaction = await snap.createTransaction(parameter);
    
    // Save the token to db (optional but good for tracking)
    await db.update(transactions)
      .set({ snapToken: transaction.token, snapRedirectUrl: transaction.redirect_url })
      .where({ orderId });

    return NextResponse.json({ token: transaction.token, redirect_url: transaction.redirect_url });
  } catch (error: any) {
    console.error("Midtrans Token Error:", error);
    return NextResponse.json(
      { error: "Gagal membuat transaksi: " + error.message },
      { status: 500 }
    );
  }
}
