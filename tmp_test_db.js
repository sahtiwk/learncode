const { db } = require('./config/db');
const { courseChapters } = require('./config/schema');
const { eq } = require('drizzle-orm');

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
