"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Group, Panel, Separator } from 'react-resizable-panels';
import ContentSection from './_components/ContentSection';
import CodeEditor from './_components/CodeEditor';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// TypeScript Interfaces for strict lesson data
export interface ExerciseData {
  id: number;
  courseId: number;
  chapterId: number;
  exerciseId: string;
  exerciseName: string;
}

export interface ExerciseContent {
  content: string;
  task: string;
  hint: string;
  starterCode: Record<string, string>;
  regex: string;
  output: string;
  hintXp: number;
}

export interface CourseExercise {
  chapter: {
    id: number;
    courseId: number;
    chapterId: number;
    name: string;
    description: string;
    exercises: any[]; // Array of exercise metadata from courseChapters
  };
  exercise: ExerciseData & { content: ExerciseContent };
}

export default function PlaygroundPage() {
  const { courseId, chapterId, exerciseSlug } = useParams<{ 
    courseId: string; 
    chapterId: string; 
    exerciseSlug: string 
  }>();
  
  const router = useRouter();
  const [courseExerciseData, setCourseExerciseData] = useState<CourseExercise | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchExercise = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/exercise', {
        courseId,
        chapterId,
        exerciseId: exerciseSlug
      });
      setCourseExerciseData(response.data);
    } catch (error) {
      console.error("Error fetching exercise data", error);
    } finally {
      setLoading(false);
    }
  }, [courseId, chapterId, exerciseSlug]);

  useEffect(() => {
    if (exerciseSlug) fetchExercise();
  }, [exerciseSlug, fetchExercise]);

  // Navigation Logic
  const getNavSlugs = () => {
    if (!courseExerciseData?.chapter?.exercises) return { prev: null, next: null };
    
    const exercises = courseExerciseData.chapter.exercises;
    const currentIndex = exercises.findIndex((e: any) => e.slug === exerciseSlug);
    
    return {
      prev: currentIndex > 0 ? exercises[currentIndex - 1].slug : null,
      next: currentIndex < exercises.length - 1 ? exercises[currentIndex + 1].slug : null
    };
  };

  const { prev, next } = getNavSlugs();

  return (
    <div className="h-screen w-full flex flex-col bg-black overflow-hidden">
      <div className="flex-1 overflow-hidden relative">
        <Group orientation="horizontal" className="h-full">
          {/* Left Pane: Theory & Text-based Quests */}
          <Panel defaultSize={50} minSize={30}>
            <ContentSection 
              courseExerciseData={courseExerciseData} 
              loading={loading} 
            />
          </Panel>

          <Separator className="w-1.5 bg-zinc-900 hover:bg-indigo-500 transition-colors duration-200" />

          {/* Right Pane: Live Integrated Development Environment */}
          <Panel defaultSize={50} minSize={30}>
            <CodeEditor 
              courseExerciseData={courseExerciseData} 
              loading={loading} 
            />
          </Panel>
        </Group>
      </div>

      {/* Persistent Quest Navigation Footer */}
      <footer className="h-20 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between px-10 shadow-[0_-4px_50px_rgba(0,0,0,0.5)] z-50">
          <Button 
            variant="ghost" 
            disabled={!prev}
            onClick={() => router.push(`/courses/${courseId}/${chapterId}/${prev}`)}
            className="font-game text-zinc-500 hover:text-white flex items-center gap-2 group transition-all h-12 uppercase tracking-widest text-xs"
          >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Previous Quest
          </Button>

          <div className="flex flex-col items-center">
             <div className="text-[10px] font-game text-zinc-800 uppercase tracking-[0.3em] mb-1 select-none">Chapter Progress</div>
             <div className="text-zinc-500 font-game text-xs tracking-tighter">{courseExerciseData?.chapter?.name || "..."}</div>
          </div>

          <Button 
            variant="ghost" 
            disabled={!next}
            onClick={() => router.push(`/courses/${courseId}/${chapterId}/${next}`)}
            className="font-game text-zinc-500 hover:text-white flex items-center gap-2 group transition-all h-12 uppercase tracking-widest text-xs"
          >
            Next Quest
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
      </footer>
    </div>
  );
}
