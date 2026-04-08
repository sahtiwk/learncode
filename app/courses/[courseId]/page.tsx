"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import CourseDetailBanner from './_components/CourseDetailBanner';
import CourseModuleList from './_components/CourseModuleList';
import CourseStatus from './_components/CourseStatus';
import UpgradeToPro from './_components/UpgradeToPro';
import { Course } from '../_components/CourseList';
import Confetti from 'react-confetti';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params?.courseId;
  const [courseDetail, setCourseDetail] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

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

  useEffect(() => {
    // Client-side execution only
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('completed') === 'true') {
      setIsCompleted(true);
      // Clean up the URL neatly
      window.history.replaceState(null, '', `/courses/${courseId}`);
      
      // Dismiss the overlay after a glorious celebration
      setTimeout(() => {
        setIsCompleted(false);
      }, 8000);
    }
  }, [courseId]);

  const refreshData = () => {
    fetchCourseDetail();
  };

  return (
    <div className="w-full bg-black/20 min-h-screen relative">
      
      {/* GLORIOUS CELEBRATION LAYER */}
      {isCompleted && windowSize.width > 0 && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={800} gravity={0.12} />
            
            <div className="bg-zinc-950 p-12 rounded-[3rem] border-4 border-yellow-500 shadow-[0_0_150px_rgba(234,179,8,0.3)] flex flex-col items-center animate-in zoom-in-50 duration-700 fade-in slide-in-from-bottom-20">
                <h1 className="text-7xl font-game text-yellow-400 uppercase drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                   Course Mastered!
                </h1>
                
                <p className="mt-8 text-zinc-300 font-mono text-xl uppercase tracking-[0.2em] text-center max-w-lg leading-relaxed">
                   You have successfully completed all quests and proven your mastery over this sector.
                </p>
                
                <div className="mt-10 px-8 py-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-yellow-500/80 font-game text-base uppercase tracking-[0.3em] flex items-center gap-4">
                   <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
                   Max XP Authenticated
                   <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
                </div>
            </div>
        </div>
      )}

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
                <h2 className="font-game text-4xl text-white tracking-tight px-1 uppercase">Curriculum Hub</h2>
                <p className="text-zinc-500 text-sm px-1 font-mono uppercase tracking-[0.2em]">Master the path to enlightenment</p>
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
