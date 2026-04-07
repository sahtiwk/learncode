import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
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
                {chapter.exercises?.map((exercise, i) => (
                  <div key={i} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-xl ml-16">
                    <span className="text-gray-300 font-medium font-game">
                      {exercise.name}
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            {/* @ts-ignore custom variant definition from user space */}
                            <Button disabled variant="pixel-disable" className="opacity-50 cursor-not-allowed font-game">
                              {exercise.xp} XP
                            </Button>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-black text-white border-zinc-700">
                          <p>Please enroll first</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
