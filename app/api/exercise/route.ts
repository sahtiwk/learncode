import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/config/db';
import { exercise, courseChapters } from '@/config/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { courseId, chapterId, exerciseId } = await req.json();

    if (!courseId || !chapterId || !exerciseId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // 1. Fetch chapter metadata (for the full list of exercises)
    const chapterResult = await db.select()
      .from(courseChapters)
      .where(
        and(
          eq(courseChapters.courseId, parseInt(courseId)),
          eq(courseChapters.chapterId, parseInt(chapterId))
        )
      );

    // 2. Fetch specific exercise content (theory, task, hint, starterCode)
    const exerciseResult = await db.select()
      .from(exercise)
      .where(
        and(
          eq(exercise.courseId, parseInt(courseId)),
          eq(exercise.chapterId, parseInt(chapterId)),
          eq(exercise.exerciseId, exerciseId)
        )
      );

    if (chapterResult.length === 0 || exerciseResult.length === 0) {
      return NextResponse.json({ error: 'Data not found' }, { status: 404 });
    }

    // Combine results for frontend navigation and content rendering
    return NextResponse.json({
      chapter: chapterResult[0],
      exercise: exerciseResult[0]
    });
  } catch (error) {
    console.error("Error in dual-query API", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
