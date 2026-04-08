import { db } from './config/db.js';
import { courses, courseChapters } from './config/schema.js';

async function checkData() {
  try {
    const allCourses = await db.select().from(courses);
    console.log("Found", allCourses.length, "courses.");
    
    for (const c of allCourses) {
        const chapters = await db.select().from(courseChapters).where({ courseId: c.courseId });
        console.log(`Course ${c.courseId} (${c.title}): ${chapters.length} chapters.`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
