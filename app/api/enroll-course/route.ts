import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/config/db';
import { enrollCourse } from '@/config/schema';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user || user.emailAddresses.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { courseId } = body;
    
    if (courseId === undefined) {
      return NextResponse.json({ error: 'Missing courseId' }, { status: 400 });
    }
    
    const userId = user.emailAddresses[0].emailAddress;
    
    const result = await db.insert(enrollCourse).values({
      courseId,
      userId,
      xpEarned: 0
    }).returning();
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error enrolling", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
