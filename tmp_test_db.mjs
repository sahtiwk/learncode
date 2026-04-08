import { db } from './config/db.js';
import { courseChapters } from './config/schema.js';
import { eq } from 'drizzle-orm';

async function testFetch() {
  try {
    const chapters = await db.select().from(courseChapters).where(eq(courseChapters.courseId, 2));
    console.log("Chapters for Course 2:", JSON.stringify(chapters, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

testFetch();
