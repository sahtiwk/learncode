"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";
import CourseProgress from "./CourseProgress";
import ContinueCard from "./ContinueCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function EnrollCourses() {
  const [enrolledList, setEnrolledList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real progress data from our new API route
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/user-progress');
        setEnrolledList(response.data);
      } catch (error) {
        console.error("Error fetching enrollments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  if (loading) {
     return (
        <div className="bg-zinc-900 p-7 rounded-2xl w-full">
           <Skeleton className="h-8 w-48 mb-8 bg-zinc-800" />
           <div className="space-y-6">
              <Skeleton className="h-44 w-full rounded-2xl bg-zinc-800" />
              <Skeleton className="h-44 w-full rounded-2xl bg-zinc-800" />
           </div>
        </div>
     );
  }

  return (
    <div className="flex flex-col items-center bg-zinc-900 p-7 rounded-2xl w-full">
      <h2 className="font-game text-2xl mb-8 self-start tracking-tight">Active Quests</h2>
      
      {enrolledList.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full py-12">
          <Image
            src="/books.png"
            alt="books"
            width={120}
            height={120}
            className="w-[120px] h-[120px] object-contain opacity-10 grayscale"
          />
          <p className="text-zinc-600 mt-8 font-game text-sm uppercase tracking-[0.2em]">
            No active quests found.
          </p>
          <Link href="/courses" className="mt-8">
            <Button variant="pixel" className="font-game text-lg px-10 shadow-lg shadow-yellow-500/5">
              Begin Adventure
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full">
          {enrolledList.map((course: any, index: number) => (
             <div key={index} className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-zinc-950 p-8 rounded-3xl border border-zinc-900 transition-all shadow-xl group hover:border-zinc-800/50">
                <Link href={`/courses/${course.courseId}`} className="shrink-0">
                  <Image 
                    src={course.banner?.trimEnd()} 
                    alt={course.title} 
                    width={140} 
                    height={140} 
                    className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-2xl group-hover:scale-105 transition-all duration-500 shadow-2xl" 
                  />
                </Link>
                
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/courses/${course.courseId}`}>
                      <h3 className="font-game text-xl text-zinc-100 group-hover:text-white transition-colors line-clamp-1">
                        {course.title}
                      </h3>
                    </Link>
                    <span className="hidden sm:inline-block text-[9px] font-mono text-zinc-700 font-bold bg-zinc-900/30 px-2 py-1 rounded-md border border-zinc-800/50 tracking-tighter">
                      CID:{course.courseId}
                    </span>
                  </div>
                  
                  {/* Real-time Progress Bar Integration */}
                  <CourseProgress percentage={course.percentage} />
                  
                  {/* Smart Resume Trigger per course */}
                  <ContinueCard courseId={course.courseId} />
                </div>
             </div>
          ))}
          
          <Link href="/courses" className="mt-6 self-center md:self-start">
             <Button variant="ghost" className="font-game text-zinc-600 hover:text-zinc-400 transition-colors uppercase text-[10px] tracking-[0.3em]">
               Discover More Realms
             </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
