import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/config/db';
import { completedExercise, usersTable, enrollCourse } from '@/config/schema';
import { currentUser } from '@clerk/nextjs/server';
import { eq, and, sql } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { courseId, chapterId, exerciseId, xp } = await req.json();
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Check if already completed
    const existingCompletion = await db.select()
      .from(completedExercise)
      .where(
        and(
          eq(completedExercise.courseId, parseInt(courseId)),
          eq(completedExercise.chapterId, parseInt(chapterId)),
          eq(completedExercise.exerciseId, exerciseId),
          eq(completedExercise.userId, userEmail)
        )
      );

    if (existingCompletion.length > 0) {
      return NextResponse.json({ 
        success: true,
        message: 'Quest already completed. No additional XP awarded.',
        xpAwarded: false
      });
    }

    // 1. Log completion in completed_exercise table
    await db.insert(completedExercise).values({
      courseId: parseInt(courseId),
      chapterId: parseInt(chapterId),
      exerciseId: exerciseId, // Storing the slug
      userId: userEmail,
    });

    // 2. Increment global points for the user
    // Atomic update using sql utility to prevent state calculation errors
    await db.update(usersTable)
      .set({
        points: sql`${usersTable.points} + ${parseInt(xp)}`
      })
      .where(eq(usersTable.email, userEmail));

    // 3. Increment course-specific experience (xpEarned)
    await db.update(enrollCourse)
      .set({
        xpEarned: sql`${enrollCourse.xpEarned} + ${parseInt(xp)}`
      })
      .where(
        and(
          eq(enrollCourse.courseId, parseInt(courseId)),
          eq(enrollCourse.userId, userEmail)
        )
      );

    return NextResponse.json({ 
      success: true,
      message: 'Quest completed and rewards synchronized.' 
    });
    
  } catch (error) {
    console.error("Error marking exercise complete:", error);
    return NextResponse.json({ 
      error: 'Failed to record completion or synchronize XP.' 
    }, { status: 500 });
  }
}
