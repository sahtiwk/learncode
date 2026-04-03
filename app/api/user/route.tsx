// app/api/user/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { usersTable } from "@/config/schema";
import { db } from "@/config/db";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Rate limit: 20 requests per minute per IP
  const clientId = getClientIdentifier(req);
  const limiter = rateLimit(`user:${clientId}`, {
    maxRequests: 20,
    intervalMs: 60_000,
  });

  if (!limiter.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(limiter.resetIn / 1000)) },
      }
    );
  }

  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    // Check if user already exists
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    let dbUser = users[0];

    // If user does not exist, create a new record
    if (!dbUser) {
      const newUser = await db
        .insert(usersTable)
        .values({
          name: user.fullName || user.firstName || "Anonymous",
          email: email,
          clerkId: user.id, // ✅ THIS WAS MISSING
        })
        .onConflictDoNothing()
        .returning();

      if (newUser.length > 0) {
        dbUser = newUser[0];
      } else {
        // Fallback in case onConflictDoNothing didn't return a record (meaning it already exists)
        const existingUsers = await db.select().from(usersTable).where(eq(usersTable.email, email));
        dbUser = existingUsers[0];
      }
    }

    // Return user info
    return NextResponse.json({ user: dbUser });
  } catch (error) {
    console.error("User API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
