import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { enrollCourse, courses } from "@/config/schema";
import { eq } from "drizzle-orm";

async function EnrollCourses() {
  const user = await currentUser();
  let enrolledList: any[] = [];
  
  if (user && user.emailAddresses.length > 0) {
    const userEmail = user.emailAddresses[0].emailAddress;
    
    enrolledList = await db.select({
      courseId: courses.courseId,
      title: courses.title,
      banner: courses.banner,
    })
    .from(enrollCourse)
    .innerJoin(courses, eq(enrollCourse.courseId, courses.courseId))
    .where(eq(enrollCourse.userId, userEmail));
  }

  return (
    <div className="flex flex-col items-center bg-zinc-900 p-7 rounded-2xl w-full">
      <h2 className="font-game text-2xl mb-4 self-start">Your Enrolled Courses</h2>
      
      {enrolledList.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full">
          <Image
            src="/books.png"
            alt="books"
            width={200}
            height={200}
            className="w-[200px] h-[200px] object-contain"
          />
          <p className="text-gray-400 mt-4 text-sm">
            You don&apos;t have any enrolled courses
          </p>
          <Link href="/courses" className="mt-5">
            {/* @ts-ignore custom variant definition from user space */}
            <Button variant="pixel" className="font-game text-lg">
              Browse all courses
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {enrolledList.map((course: any, index: number) => (
             <Link href={`/courses/${course.courseId}`} key={index}>
               <div className="flex gap-4 items-center bg-zinc-950 p-4 rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all cursor-pointer">
                 <Image src={course.banner?.trimEnd()} alt={course.title} width={100} height={100} className="w-20 h-20 object-cover rounded-lg" />
                 <h3 className="font-game text-xl text-white ml-2">{course.title}</h3>
               </div>
             </Link>
          ))}
          <Link href="/courses" className="mt-2 self-start">
             {/* @ts-ignore custom variant definition from user space */}
             <Button variant="pixel" className="font-game text-md">
               Browse more courses
             </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default EnrollCourses;
