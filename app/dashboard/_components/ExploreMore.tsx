"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Star, ArrowRight } from "lucide-react";

interface Course {
  courseId: number;
  title: string;
  banner: string;
  level: string;
}

export default function ExploreMore() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all courses to populate the discovery section
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Using our existing course API to get the platform-wide catalog
        const response = await axios.get('/api/course');
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses for dashboard discovery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="mt-8">
        <Skeleton className="h-8 w-48 mb-6 bg-zinc-800" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Skeleton className="h-40 w-full rounded-3xl bg-zinc-800/50" />
          <Skeleton className="h-40 w-full rounded-3xl bg-zinc-800/50" />
        </div>
      </div>
    );
  }

  // If there are no courses at all, we hide the section to maintain a clean UI
  if (courses.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="font-game text-2xl tracking-tight text-white/90">Explore New Quests</h2>
        <Link 
            href="/courses" 
            className="text-[10px] font-game text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-[0.2em] flex items-center gap-2 group"
        >
          Browse All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {courses.slice(0, 2).map((course) => (
          <Link 
            key={course.courseId} 
            href={`/courses/${course.courseId}`}
            className="group"
          >
            <div className="flex gap-5 bg-zinc-900/30 p-5 rounded-[2rem] border border-zinc-800/50 transition-all duration-300 hover:bg-zinc-900/60 hover:border-zinc-700/50 hover:shadow-2xl hover:shadow-yellow-500/5 h-full active:scale-[0.98]">
              <div className="relative shrink-0">
                <Image
                  src={course.banner?.trimEnd()}
                  alt={course.title}
                  width={90}
                  height={90}
                  className="w-[90px] h-[90px] object-cover rounded-3xl group-hover:scale-105 transition-transform duration-500 shadow-2xl shadow-black/80"
                />
                {/* Subtle highlight overlay on hover */}
                <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
              </div>
              
              <div className="flex flex-col justify-between py-1">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                     <Star className="w-2.5 h-2.5 text-yellow-600 fill-yellow-600" />
                     <span className="text-[9px] font-mono text-zinc-600 uppercase font-bold tracking-widest">New Route Found</span>
                  </div>
                  <h3 className="font-game text-lg text-zinc-300 group-hover:text-white transition-colors line-clamp-2 leading-tight">
                    {course.title}
                  </h3>
                </div>
                
                <div className="flex items-center gap-3 mt-4">
                   <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950/50 border border-zinc-800">
                      <BookOpen className="w-3 h-3 text-zinc-600" />
                      <span className="font-mono text-[9px] uppercase font-black text-zinc-500 tracking-tighter">{course.level}</span>
                   </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {courses.length > 2 && (
        <div className="mt-8 flex justify-center w-full">
          <Link href="/courses" className="w-full">
            <button className="w-full bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white font-game py-4 rounded-2xl transition-all uppercase text-xs tracking-[0.2em] shadow-lg active:scale-[0.99] group">
              Explore More Courses <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
