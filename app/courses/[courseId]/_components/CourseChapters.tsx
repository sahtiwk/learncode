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
        <Skeleton className="h-16 w-full rounded-xl bg-zinc-800" />
        <Skeleton className="h-16 w-full rounded-xl bg-zinc-800" />
        <Skeleton className="h-16 w-full rounded-xl bg-zinc-800" />
      </div>
    );
  }

  const isExerciseCompleted = (chapterId: number, exerciseIndex: number) => {
    return courseDetail?.completedExercise?.some(
      (ce) => ce.chapterId === chapterId && ce.exerciseId === exerciseIndex + 1
    );
  };

  const isExerciseLocked = (chapterIndex: number, exerciseIndex: number) => {
    if (!courseDetail?.userEnroll) return true;
    if (chapterIndex === 0 && exerciseIndex === 0) return false;

    if (exerciseIndex > 0) {
      const chapterId = courseDetail.chapters?.[chapterIndex].chapterId;
      return !isExerciseCompleted(chapterId!, exerciseIndex - 1);
    } else {
      const prevChapterIndex = chapterIndex - 1;
      const prevChapter = courseDetail.chapters?.[prevChapterIndex];
      const lastExerciseIndex = (prevChapter?.exercises?.length || 1) - 1;
      return !isExerciseCompleted(prevChapter?.chapterId!, lastExerciseIndex);
    }
  };

  return (
    <div className="mt-8 bg-zinc-950 border border-zinc-800 rounded-xl p-4">
      <Accordion type="single" collapsible className="w-full">
        {courseDetail.chapters.map((chapter, index) => (
          <AccordionItem value={`item-${index}`} key={chapter.chapterId} className="border-none">
            <AccordionTrigger className="px-4 py-5 hover:no-underline hover:bg-zinc-900/50 rounded-xl transition-colors">
              <div className="flex items-center gap-6">
                <div className="bg-zinc-900 w-12 h-12 flex items-center justify-center rounded-full text-white font-game text-xl leading-none pt-2">
                  {index + 1}
                </div>
                <span className="text-xl text-white font-game">
                  {chapter.name}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6 px-4">
              <div className="space-y-3">
                {chapter.exercises?.map((exercise, i) => {
                  const completed = isExerciseCompleted(chapter.chapterId, i);
                  const locked = isExerciseLocked(index, i);
                  
                  return (
                    <div key={i} className={`flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-xl ml-16 ${locked ? 'opacity-50' : ''}`}>
                      <span className="text-gray-300 font-medium font-game">
                        {exercise.name}
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                               {completed ? (
                                <Button disabled variant="secondary" className="bg-zinc-700 text-zinc-400 font-game cursor-default">
                                  Completed
                                </Button>
                              ) : (
                                !locked ? (
                                  <Link href={`/courses/${courseDetail.courseId}/${chapter.chapterId}/${exercise.slug}`}>
                                    <Button 
                                      variant="pixel" 
                                      className="font-game transition-all active:scale-95 px-8"
                                    >
                                      {exercise.xp} XP
                                    </Button>
                                  </Link>
                                ) : (
                                  <Button 
                                    disabled
                                    variant="pixel-disable" 
                                    className="font-game cursor-not-allowed px-8"
                                  >
                                    {exercise.xp} XP
                                  </Button>
                                )
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-black text-white border-zinc-700">
                            <p>
                              {!courseDetail.userEnroll 
                                ? "Please enroll first" 
                                : locked 
                                  ? "Complete previous exercise to unlock" 
                                  : completed 
                                    ? "Already completed!" 
                                    : "Start exercise"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
