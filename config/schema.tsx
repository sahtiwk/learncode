import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    clerkId: varchar({ length: 255 }).unique().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    points: integer().notNull().default(0),
    subscription: varchar({ length: 255 }).notNull().default("free"),

});
