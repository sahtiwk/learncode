"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import CourseDetailBanner from './_components/CourseDetailBanner';
import CourseModuleList from './_components/CourseModuleList';
import CourseStatus from './_components/CourseStatus';
import UpgradeToPro from './_components/UpgradeToPro';
import { Course } from '../_components/CourseList';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params?.courseId;
  const [courseDetail, setCourseDetail] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch comprehensive course details including enrollment and chapter data
  const fetchCourseDetail = useCallback(async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      const response = await axios.get(`/api/course?courseId=${courseId}`);
      setCourseDetail(response.data);
      
      // Diagnostic logging for curriculum verification
      if (response.data?.chapters) {
          console.log(`[Curriculum Diagnostic] Course ${courseId}: Loaded ${response.data.chapters.length} chapters.`);
          response.data.chapters.forEach((ch: any, i: number) => {
              console.log(`  - Chapter ${i+1}: ${ch.name || 'MISSING NAME'} (ID: ${ch.chapterId})`);
          });
      }
    } catch (error) {
      console.error("Failed to fetch course details:", error);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseDetail();
  }, [fetchCourseDetail]);

  const refreshData = () => {
    fetchCourseDetail();
  };

  return (
    <div className="w-full bg-black/20 min-h-screen">
      {/* Container with optimized padding for premium look */}
      <div className="p-6 sm:p-10 md:px-16 lg:px-24 xl:px-32 max-w-[1600px] mx-auto">
        
        {/* Row 1: Status Section (Banner + Course Progress) */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
          <div className="xl:col-span-3">
             <CourseDetailBanner courseDetail={courseDetail} loading={loading} refreshData={refreshData} />
          </div>
          <div className="xl:col-span-1 h-full flex flex-col pt-0 sm:pt-6">
             <CourseStatus courseDetail={courseDetail} loading={loading} />
          </div>
        </div>
        
        {/* Row 2: Curriculum Hub & Sidebar Upgrades */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 lg:gap-12 mt-12 items-start">
          
          {/* Left Column: Sequential Quest Modules */}
          <div className="xl:col-span-3 space-y-12">
            <div className="flex flex-col gap-2">
                <h2 className="font-game text-2xl text-white tracking-tight px-1 uppercase">Curriculum Hub</h2>
                <p className="text-zinc-500 text-xs px-1 font-mono uppercase tracking-[0.2em]">Master the path to enlightenment</p>
            </div>
            {/* New High-Fidelity Module List Replacement */}
            <CourseModuleList courseDetail={courseDetail} loading={loading} />
          </div>

          {/* Right Column: Sidebar Upgrades (Sticky) */}
          <div className="xl:col-span-1 space-y-0 xl:sticky xl:top-24 h-fit">
            <UpgradeToPro />
          </div>
        </div>
        
      </div>
    </div>
  );
}
