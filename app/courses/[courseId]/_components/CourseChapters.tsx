"use client";

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Course } from '../../_components/CourseList';

interface Props {
  courseDetail: Course | null;
  loading: boolean;
}

export default function CourseChapters({ courseDetail, loading }: Props) {
  if (loading || !courseDetail || !courseDetail.chapters || courseDetail.chapters.length === 0) {
    return (
      <div className="mt-8 space-y-4">
        <Skeleton className="h-16 w-full rounded-xl bg-zinc-800/50" />
        <Skeleton className="h-16 w-full rounded-xl bg-zinc-800/50" />
        <Skeleton className="h-16 w-full rounded-xl bg-zinc-800/50" />
      </div>
    );
  }

  // Safely parse exercises from a chapter (handling JSON strings if needed)
  const getExercises = (chapter: any) => {
    if (!chapter || !chapter.exercises) return [];
    try {
      return typeof chapter.exercises === 'string' 
        ? JSON.parse(chapter.exercises) 
        : chapter.exercises;
    } catch (e) {
      console.error("Failed to parse exercises for chapter:", chapter.chapterId, e);
      return [];
    }
  };

  // Check if an exercise is completed by comparing chapter and SLUG
  const isExerciseCompleted = (chapterId: number, slug: string) => {
    return courseDetail?.completedExercise?.some(
      (ce: any) => ce.chapterId === chapterId && ce.exerciseId === slug
    );
  };

  // Progression logic: exercise is locked if it's not the first one and the previous isn't done
  const isExerciseLocked = (chapterIndex: number, exerciseIndex: number) => {
    if (!courseDetail?.userEnroll) return true;
    if (chapterIndex === 0 && exerciseIndex === 0) return false;

    const currentChapter = courseDetail.chapters?.[chapterIndex];
    if (exerciseIndex > 0) {
      const chapterId = currentChapter?.chapterId;
      const exercises = getExercises(currentChapter);
      const prevExercise = exercises[exerciseIndex - 1];
      return !isExerciseCompleted(chapterId!, prevExercise?.slug!);
    } else {
      const prevChapterIndex = chapterIndex - 1;
      const prevChapter = courseDetail.chapters?.[prevChapterIndex];
      const prevExercises = getExercises(prevChapter);
      const lastExercise = prevExercises[prevExercises.length - 1];
      return !isExerciseCompleted(prevChapter?.chapterId!, lastExercise?.slug!);
    }
  };

  // Helper to calculate sequential global exercise number across all chapters
  const getGlobalExerciseNumber = (chapterIndex: number, exerciseIndex: number) => {
    let count = 0;
    for (let i = 0; i < chapterIndex; i++) {
        const exercises = getExercises(courseDetail.chapters![i]);
        count += exercises.length;
    }
    return count + exerciseIndex + 1;
  };

  return (
    <div className="mt-8 bg-black/40 border border-zinc-900 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
      <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-4">
        {courseDetail.chapters.map((chapter, index) => (
          <AccordionItem value={`item-${index}`} key={chapter.chapterId} className="border border-zinc-900 rounded-3xl bg-zinc-950/20 overflow-hidden">
            <AccordionTrigger className="px-7 py-7 hover:no-underline hover:bg-zinc-900/40 transition-all group border-none">
              <div className="flex items-center gap-6 text-left w-full">
                <div className="bg-zinc-900 w-12 h-12 flex flex-shrink-0 items-center justify-center rounded-full text-zinc-500 group-data-[state=open]:text-yellow-500 font-game text-xl border border-zinc-800 group-data-[state=open]:border-yellow-500/40 transition-all pt-1 shadow-inner">
                  {index + 1}
                </div>
                <div className="flex flex-col gap-1 overflow-hidden">
                    <span className="text-xl text-zinc-400 group-data-[state=open]:text-white font-game tracking-tight transition-colors line-clamp-1">
                      {chapter.name || "Module " + (index+1)}
                    </span>
                    <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-[0.2em] group-data-[state=open]:text-zinc-500">
                        {chapter.description ? (chapter.description.length > 50 ? chapter.description.substring(0, 50) + "..." : chapter.description) : "Expanding the Path"}
                    </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-8 px-7 bg-zinc-950/40">
              <div className="space-y-4">
                {(() => {
                  const exercises = getExercises(chapter);

                  return exercises?.map((exercise: any, i: number) => {
                    const completed = isExerciseCompleted(chapter.chapterId, exercise.slug);
                    const locked = isExerciseLocked(index, i);
                    const globalNum = getGlobalExerciseNumber(index, i);
                    
                    return (
                      <div 
                          key={i} 
                          className={`flex flex-wrap sm:flex-nowrap items-center justify-between gap-6 bg-zinc-900/20 border border-zinc-900/50 p-6 rounded-2xl sm:ml-12 transition-all duration-300 hover:bg-zinc-900/40 hover:border-zinc-800 ${locked ? 'opacity-30 grayscale pointer-events-none' : ''}`}
                      >
                        <div className="flex items-center gap-8 flex-1">
                           <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] font-mono whitespace-nowrap min-w-[100px]">
                              Excercise {globalNum}
                           </span>
                           <span className="text-zinc-200 font-game text-sm flex-1 leading-snug">
                             {exercise.name}
                           </span>
                        </div>
                        
                        <div className="shrink-0 flex items-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="min-w-[100px] flex justify-end">
                                   {completed ? (
                                    <div className="bg-emerald-500/5 text-emerald-500/80 border border-emerald-500/20 px-5 py-2 rounded-xl text-[9px] font-game uppercase tracking-[0.1em] shadow-sm">
                                      Mastered
                                    </div>
                                  ) : (
                                    !locked ? (
                                      <Link href={`/courses/${courseDetail.courseId}/${chapter.chapterId}/${exercise.slug}`}>
                                        <Button 
                                          variant="pixel" 
                                          className="font-game transition-all active:scale-95 px-7 h-10 text-[11px] shadow-xl shadow-yellow-500/5"
                                        >
                                          {exercise.xp} XP
                                        </Button>
                                      </Link>
                                    ) : (
                                      <Button 
                                        disabled
                                        variant="pixel-disable" 
                                        className="font-game px-7 h-10 text-[11px] opacity-40"
                                      >
                                        {exercise.xp} XP
                                      </Button>
                                    )
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="bg-black text-white border-zinc-800 px-4 py-2 text-xs font-game tracking-widest uppercase">
                                <p>
                                  {!courseDetail.userEnroll 
                                    ? "Enroll to begin" 
                                    : locked 
                                      ? "Quest Locked" 
                                      : completed 
                                        ? "Knowledge Secured" 
                                        : "Start Quest"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
