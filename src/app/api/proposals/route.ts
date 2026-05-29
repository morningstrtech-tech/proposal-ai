import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { proposals } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

// GET — Fetch user's proposal history
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    const history = await db
      .select()
      .from(proposals)
      .where(eq(proposals.userId, session.user.id))
      .orderBy(desc(proposals.createdAt));

    return NextResponse.json({ proposals: history });
  } catch (error: unknown) {
    console.error("Fetch history error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE — Remove a specific proposal by id
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const proposalId = searchParams.get("id");

    if (!proposalId) {
      return NextResponse.json(
        { error: "Proposal ID diperlukan." },
        { status: 400 }
      );
    }

    // Only delete if the proposal belongs to the authenticated user
    const result = await db
      .delete(proposals)
      .where(
        and(
          eq(proposals.id, proposalId),
          eq(proposals.userId, session.user.id)
        )
      );

    return NextResponse.json({ success: true, deleted: proposalId });
  } catch (error: unknown) {
    console.error("Delete proposal error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
