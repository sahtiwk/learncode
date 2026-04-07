import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/config/db';
import { courses, courseChapters, enrollCourse } from '@/config/schema';
import { eq, and } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';

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
      
      let userEnroll = false;
      let courseEnrollInfo = undefined;
      
      const user = await currentUser();
      if (user && user.emailAddresses.length > 0) {
        const userId = user.emailAddresses[0].emailAddress;
        const enrollResult = await db.select().from(enrollCourse).where(and(eq(enrollCourse.courseId, courseId), eq(enrollCourse.userId, userId)));
        if (enrollResult.length > 0) {
          userEnroll = true;
          courseEnrollInfo = {
             xpEarned: enrollResult[0].xpEarned,
             enrollDate: enrollResult[0].enrollDate
          };
        }
      }
      
      return NextResponse.json({
        ...course,
        chapters: chaptersResult,
        userEnroll,
        courseEnrollInfo
      });
    }

    const result = await db.select().from(courses);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching courses", error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
