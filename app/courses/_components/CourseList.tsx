"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export interface Exercise {
  name: string;
  slug: string;
  xp: number;
  difficultyLevel?: string;
}

export interface Chapter {
  chapterId: number;
  courseId: number;
  name: string;
  description: string;
  exercises: Exercise[];
}

export interface Course {
  id: number;
  courseId: number;
  title: string | null;
  description: string | null;
  banner: string;
  level: string | null;
  tag: string | null;
  chapters?: Chapter[];
  userEnroll?: boolean;
  courseEnrollInfo?: { xpEarned: number, enrollDate: any };
}

export default function CourseList() {
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/course');
        setCourseList(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
      {loading ? (
        // Loading UI
        Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-[200px] w-full rounded-xl bg-zinc-800 align-top" />
        ))
      ) : (
        // Render UI
        courseList.map((course) => (
          <Link href={`/courses/${course.courseId}`} key={course.id}>
            <div className="border-4 border-zinc-700 bg-zinc-800 rounded-xl p-4 hover:bg-zinc-900 cursor-pointer transition-colors flex flex-col h-full">
              <Image
                src={course.banner?.trimEnd() || "/placeholder.jpg"}
                alt={course.title || "Course Banner"}
                width={500}
                height={200}
                className="rounded-t-xl object-cover h-[200px] w-full"
              />
              
              <div className="flex-grow flex flex-col justify-between mt-4">
                <div>
                  <h2 className="text-2xl font-game text-white mb-2">{course.title}</h2>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {course.description}
                  </p>
                </div>
                
                <div className="mt-4 flex items-center">
                  <span className="bg-zinc-800 text-xs px-3 py-1 rounded-md border-2 border-zinc-600 font-game text-gray-300">
                    {course.level || 'beginner'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
