import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/config/db';
import { exercise } from '@/config/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { courseId, chapterId, exerciseId } = await req.json();

    if (!courseId || !chapterId || !exerciseId) {
      return NextResponse.json({ error: 'Missing courseId, chapterId, or exerciseId' }, { status: 400 });
    }

    const result = await db.select().from(exercise).where(
      and(
        eq(exercise.courseId, parseInt(courseId)),
        eq(exercise.chapterId, parseInt(chapterId)),
        eq(exercise.exerciseId, exerciseId)
      )
    );

    if (result.length === 0) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error fetching exercise", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
