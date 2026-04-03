// app/api/webhooks/clerk/route.ts
export const runtime = "nodejs";

import { Webhook } from "svix";
import { headers } from "next/headers";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Rate limit: 30 requests per minute per IP
  const clientId = getClientIdentifier(req);
  const limiter = rateLimit(`webhook:${clientId}`, {
    maxRequests: 30,
    intervalMs: 60_000,
  });

  if (!limiter.success) {
    return new Response("Too many requests", {
      status: 429,
      headers: { "Retry-After": String(Math.ceil(limiter.resetIn / 1000)) },
    });
  }

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not configured");
    return new Response("Server configuration error", { status: 500 });
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get payload
  const payload = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: any;

  // Verify payload with headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  const eventType = evt.type;

  // Handle user creation
  if (eventType === "user.created") {
    const user = evt.data;
    const emailData = user.email_addresses?.[0]?.email_address;
    
    if (emailData) {
       try {
        await db
          .insert(usersTable)
          .values({
            clerkId: user.id,
            name: user.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : "Anonymous",
            email: emailData,
          })
          .onConflictDoNothing({ target: usersTable.clerkId });
          
        return new Response("User synchronized successfully", { status: 200 });
      } catch (error) {
         console.error("Database Insert Error:", error);
         return new Response("Error saving user to database", { status: 500 });
      }
    } else {
        return new Response("Error: No email provided by Clerk payload", { status: 400 });
    }
  }

  // Handle user update
  if (eventType === "user.updated") {
    const user = evt.data;
    const emailData = user.email_addresses?.[0]?.email_address;
    
    if (emailData) {
      try {
        await db
          .update(usersTable)
          .set({
            name: user.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : "Anonymous",
            email: emailData,
          })
          .where(eq(usersTable.clerkId, user.id));
          
        return new Response("User updated successfully", { status: 200 });
      } catch (error) {
         console.error("Database Update Error:", error);
         return new Response("Error updating user in database", { status: 500 });
      }
    }
  }

  // Handle user deletion
  if (eventType === "user.deleted") {
    const user = evt.data;
    
    try {
      await db
        .delete(usersTable)
        .where(eq(usersTable.clerkId, user.id));
        
      return new Response("User deleted successfully", { status: 200 });
    } catch (error) {
       console.error("Database Delete Error:", error);
       return new Response("Error deleting user from database", { status: 500 });
    }
  }

  // Acknowledge other event types
  return new Response("Webhook received", { status: 200 });
}
