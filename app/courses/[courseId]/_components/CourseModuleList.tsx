"use client";

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Course } from '../../_components/CourseList';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Props {
  courseDetail: Course | null;
  loading: boolean;
}

export default function CourseModuleList({ courseDetail, loading }: Props) {
  // Safe helper to handle any data format (String vs Object)
  const getExercises = (chapter: any) => {
    if (!chapter) return [];
    try {
      // Handle the case where the exercises field might be 'exercises' or missing
      const rawData = chapter.exercises;
      if (!rawData) return [];
      
      const parsed = typeof rawData === 'string' 
        ? JSON.parse(rawData) 
        : (Array.isArray(rawData) ? rawData : []);
        
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Critical Error: Failed to parse exercises:", e);
      return [];
    }
  };

  const isExerciseCompleted = (chapterId: number, slug: string) => {
    return courseDetail?.completedExercise?.some(
      (ce: any) => ce.chapterId === chapterId && ce.exerciseId === slug
    );
  };

  const isExerciseLocked = (chapterIndex: number, exerciseIndex: number) => {
    if (!courseDetail?.userEnroll) return true;
    if (chapterIndex === 0 && exerciseIndex === 0) return false;

    const currentChapter = courseDetail.chapters?.[chapterIndex];
    if (exerciseIndex > 0) {
      const exercises = getExercises(currentChapter);
      const prevExercise = exercises[exerciseIndex - 1];
      return !isExerciseCompleted(currentChapter?.chapterId!, prevExercise?.slug!);
    } else {
      const prevChapter = courseDetail.chapters?.[chapterIndex - 1];
      const prevExercises = getExercises(prevChapter);
      const lastExercise = prevExercises[prevExercises.length - 1];
      return !isExerciseCompleted(prevChapter?.chapterId!, lastExercise?.slug!);
    }
  };

  const getGlobalExerciseNumber = (chapterIndex: number, exerciseIndex: number) => {
    let count = 0;
    try {
        for (let i = 0; i < chapterIndex; i++) {
            const exercises = getExercises(courseDetail?.chapters![i]);
            count += exercises.length;
        }
    } catch (e) { console.error(e); }
    return count + exerciseIndex + 1;
  };

  if (loading) {
    return (
      <div className="space-y-6 mt-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-3xl bg-zinc-900/50 border border-zinc-800" />
        ))}
      </div>
    );
  }

  // Double check if data actually exists
  if (!courseDetail || !courseDetail.chapters || courseDetail.chapters.length === 0) {
    return (
      <div className="mt-12 p-12 rounded-3xl border-2 border-dashed border-zinc-800 bg-zinc-950/20 text-center space-y-6">
        <div className="flex justify-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-700 text-3xl">?!</div>
        </div>
        <div className="space-y-2">
            <p className="font-game text-white text-lg uppercase tracking-widest">No Quests Detected</p>
            <p className="text-zinc-500 text-xs font-mono max-w-md mx-auto">
                WE FOUND THE COURSE, BUT NO MODULES HAVE BEEN ASSIGNED YET. PLEASE CHECK THE DATABASE SEEDER.
            </p>
        </div>
        <div className="pt-4">
             <Button variant="outline" className="text-[10px] font-game h-8 border-zinc-800" onClick={() => window.location.reload()}>Re-Scan Path</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-16">
      {/* CHAPTER INDICATOR FOR DEBUGGING */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl mb-8 flex items-center justify-between">
          <span className="text-[10px] font-game text-emerald-500 uppercase tracking-widest">Data Synchronization Active</span>
          <span className="text-[10px] font-mono text-zinc-500">{courseDetail.chapters.length} Modules Loaded</span>
      </div>

      {courseDetail.chapters.map((chapter, index) => {
        const exercises = getExercises(chapter);
        
        return (
          <div key={chapter.chapterId || index} className="space-y-8">
            {/* High-Contrast Chapter Header */}
            <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-zinc-900 border-2 border-zinc-800 rounded-2xl flex items-center justify-center font-game text-3xl text-yellow-500 shadow-2xl shadow-yellow-500/5 group-hover:border-yellow-500/40 transition-all pt-1">
                    {index + 1}
                </div>
                <div className="flex flex-col gap-1 flex-1">
                    <h3 className="text-3xl font-game text-white tracking-tight uppercase">
                        {chapter.name || `Quest Module ${index + 1}`}
                    </h3>
                    <div className="flex items-center gap-4">
                        <span className="text-zinc-600 text-[10px] font-mono uppercase tracking-[0.2em]">
                            {chapter.description || "The journey continues deeper into the core systems"}
                        </span>
                        <div className="h-[1px] flex-1 bg-zinc-900"></div>
                    </div>
                </div>
            </div>

            {/* Mission Cards Grid */}
            <div className="grid grid-cols-1 gap-6 sm:ml-22">
              {exercises.length > 0 ? (
                exercises.map((exercise: any, i: number) => {
                  const completed = isExerciseCompleted(chapter.chapterId, exercise.slug);
                  const locked = isExerciseLocked(index, i);
                  const globalNum = getGlobalExerciseNumber(index, i);
                  
                  return (
                    <div 
                      key={i} 
                      className={`group relative flex items-center justify-between p-8 bg-zinc-950/80 border-2 border-zinc-900 rounded-[2.5rem] transition-all hover:bg-zinc-900/40 hover:border-zinc-700 shadow-xl ${locked ? 'opacity-30 grayscale pointer-events-none' : 'hover:-translate-y-1'}`}
                    >
                      <div className="flex items-center gap-10">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em] font-mono">
                                Mission {globalNum}
                            </span>
                            <span className="text-white font-game text-base group-hover:text-yellow-500 transition-colors uppercase leading-none mt-1">
                                {exercise.name || "Untitled Objective"}
                            </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="h-10 w-[1px] bg-zinc-900 hidden sm:block"></div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="min-w-[120px] flex justify-end">
                                 {completed ? (
                                  <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 px-8 py-3 rounded-2xl text-[10px] font-game uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/5">
                                    Secured
                                  </div>
                                ) : (
                                  !locked ? (
                                    <Link href={`/courses/${courseDetail.courseId}/${chapter.chapterId}/${exercise.slug}`}>
                                      <Button 
                                        variant="pixel" 
                                        className="font-game h-12 px-10 text-[12px] hover:shadow-yellow-500/30 active:scale-95 transition-all"
                                      >
                                        Deploy {exercise.xp} XP
                                      </Button>
                                    </Link>
                                  ) : (
                                    <Button 
                                      disabled
                                      variant="pixel-disable" 
                                      className="font-game h-12 px-10 text-[12px] opacity-40"
                                    >
                                      Locked
                                    </Button>
                                  )
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="bg-black text-white border-zinc-700 text-[10px] font-game uppercase tracking-widest px-5 py-3 shadow-2xl">
                               {locked ? "Quest Level Restricted" : completed ? "Objective Secured" : "Initiate Quest Deployment"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-10 bg-zinc-950/20 border-2 border-dashed border-zinc-900 rounded-[2.5rem] text-center">
                     <p className="text-zinc-700 text-[10px] font-game uppercase tracking-widest">No active missions detected in this sector</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
