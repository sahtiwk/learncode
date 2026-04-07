"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import ContentSection from './_components/ContentSection';

export default function PlaygroundPage() {
  const { courseId, chapterId, exerciseSlug } = useParams<{ 
    courseId: string; 
    chapterId: string; 
    exerciseSlug: string 
  }>();
  
  const [exerciseDetail, setExerciseDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchExercise = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/exercise', {
        courseId,
        chapterId,
        exerciseId: exerciseSlug
      });
      setExerciseDetail(response.data);
    } catch (error) {
      console.error("Error fetching exercise", error);
    } finally {
      setLoading(false);
    }
  }, [courseId, chapterId, exerciseSlug]);

  useEffect(() => {
    if (exerciseSlug) fetchExercise();
  }, [exerciseSlug, fetchExercise]);

  return (
    <div className="h-[calc(100vh-64px)] w-full overflow-hidden bg-black">
      <SplitterLayout 
        primaryMinSize={40} 
        secondaryInitialSize={60}
      >
        {/* Left Pane: Theory & Quests */}
        <ContentSection exerciseDetail={exerciseDetail} loading={loading} />

        {/* Right Pane: Marketplace / Editor Integration Placeholder */}
        <div className="h-full bg-zinc-950 flex flex-col relative">
           <div className="absolute top-0 left-0 w-full p-4 border-b border-zinc-800 bg-zinc-900/30 flex justify-between items-center h-14">
              <span className="text-zinc-500 font-game text-xs tracking-widest uppercase">Forge Editor Workspace</span>
              <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                 <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                 <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              </div>
           </div>
           
           <div className="m-auto text-center p-12">
              <div className="text-6xl mb-6 grayscale opacity-20 group-hover:grayscale-0 transition-all">
                ⌨️
              </div>
              <p className="text-zinc-600 font-game italic uppercase tracking-[0.2em] text-xs leading-loose">
                Initializing Code Environment...<br/>
                <span className="text-zinc-800">Advanced IDE Interface Phase 4</span>
              </p>
              
              <div className="mt-8 flex justify-center gap-4">
                 <div className="h-1 w-12 bg-zinc-900 rounded-full animate-pulse" />
                 <div className="h-1 w-12 bg-zinc-900 rounded-full animate-pulse delay-75" />
                 <div className="h-1 w-12 bg-zinc-900 rounded-full animate-pulse delay-150" />
              </div>
           </div>

           {/* Console Placeholder */}
           <div className="absolute bottom-0 left-0 w-full h-32 border-t border-zinc-900 bg-black/40 p-4">
              <div className="text-zinc-700 font-mono text-xs uppercase mb-2 select-none">Console Output</div>
              <div className="text-zinc-800 font-mono text-xs italic">Waiting for compiler initialization...</div>
           </div>
        </div>
      </SplitterLayout>
    </div>
  );
}
