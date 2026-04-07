import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/config/db';
import { courses, courseChapters } from '@/config/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const courseIdParam = searchParams.get('courseId');

    if (courseIdParam) {
      const courseId = parseInt(courseIdParam);
      const courseResult = await db.select().from(courses).where(eq(courses.courseId, courseId));
      
      if (courseResult.length === 0) {
         return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }
      
      const course = courseResult[0];
      const chaptersResult = await db.select().from(courseChapters).where(eq(courseChapters.courseId, courseId));
      
      return NextResponse.json({
        ...course,
        chapters: chaptersResult
      });
    }

    const result = await db.select().from(courses);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching courses", error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
