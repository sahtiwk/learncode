import { integer, pgTable, varchar, serial, json, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    clerkId: varchar({ length: 255 }).unique().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    points: integer().notNull().default(0),
    subscription: varchar({ length: 255 }).notNull().default("free"),
});

export const courses = pgTable("courses", {
    id: serial("id").primaryKey(),
    courseId: integer("courseId").unique(),
    title: varchar("title"),
    description: varchar("description"),
    banner: varchar("banner").notNull(),
    level: varchar("level").default('beginner'),
    tag: varchar("tag"),
});

export const courseChapters = pgTable("courseChapters", {
    id: serial("id").primaryKey(),
    courseId: integer("courseId").notNull(),
    chapterId: integer("chapterId").notNull(),
    name: varchar("name").notNull(),
    description: varchar("description").notNull(),
    exercises: json("exercises").notNull(),
});

export const enrollCourse = pgTable("enrollCourse", {
    id: serial("id").primaryKey(),
    courseId: integer("courseId").notNull(),
    userId: varchar("userId").notNull(),
    enrollDate: timestamp("enrollDate").defaultNow(),
    xpEarned: integer("xpEarned").default(0),
});

export const completedExercise = pgTable("completed_exercise", {
    id: serial("id").primaryKey(),
    courseId: integer("courseId").notNull(),
    chapterId: integer("chapterId").notNull(),
    exerciseId: varchar("exerciseId").notNull(),
    userId: varchar("userId").notNull(),
});

export const exercise = pgTable("exercise", {
    id: serial("id").primaryKey(),
    courseId: integer("courseId").notNull(),
    chapterId: integer("chapterId").notNull(),
    exerciseId: varchar("exerciseId").notNull(), 
    exerciseName: varchar("exerciseName").notNull(),
    content: json("content").notNull(),
});
