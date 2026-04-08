import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { Course } from '../../_components/CourseList';

interface Props {
  courseDetail: Course | null;
  loading: boolean;
}

export default function CourseStatus({ courseDetail, loading }: Props) {
  const [totalExercises, setTotalExercises] = useState(0);
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    if (courseDetail && courseDetail.chapters) {
      let count = 0;
      let xp = 0;
      courseDetail.chapters.forEach(chapter => {
        // Robust handling of JSON-stored exercises
        let exercises = [];
        try {
          exercises = typeof chapter.exercises === 'string' 
            ? JSON.parse(chapter.exercises) 
            : (chapter.exercises || []);
        } catch (e) {
          console.error("Parse error in CourseStatus:", e);
        }

        if (Array.isArray(exercises)) {
          exercises.forEach((ex: any) => {
            count++;
            xp += ex.xp || 0;
          });
        }
      });
      setTotalExercises(count);
      setTotalXP(xp);
    }
  }, [courseDetail]);

  const updateProgress = (currentValue: number, totalValue: number) => {
    if (!totalValue) return 0;
    return (currentValue / totalValue) * 100;
  };

  if (loading) {
    return (
      <div className="bg-zinc-950 p-7 rounded-[2rem] border border-zinc-900 mt-6 shadow-2xl animate-pulse">
        <div className="h-6 w-32 bg-zinc-900 rounded-md mb-8"></div>
        <div className="space-y-10">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-zinc-900 rounded-2xl"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-zinc-900 rounded w-1/2"></div>
              <div className="h-2 bg-zinc-900 rounded-full w-full"></div>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-zinc-900 rounded-2xl"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-zinc-900 rounded w-1/2"></div>
              <div className="h-2 bg-zinc-900 rounded-full w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const xpEarned = courseDetail?.courseEnrollInfo?.xpEarned || 0;
  const exercisesCompletedCount = courseDetail?.completedExercise?.length || 0;
  
  // Safely default to 1 for the progress bar if total is 0 to avoid NaN, but display 0/0
  const exercisesProgress = totalExercises > 0 ? updateProgress(exercisesCompletedCount, totalExercises) : 0;
  const xpProgress = totalXP > 0 ? updateProgress(xpEarned, totalXP) : 0;

  return (
    <div className="bg-zinc-950 p-8 rounded-[2rem] border border-zinc-900 sticky top-10 shadow-2xl transition-all hover:border-zinc-800 backdrop-blur-sm h-full flex flex-col justify-center min-h-[350px]">
      <h2 className="text-xl font-game text-white/90 mb-10 tracking-tight">Course Progress</h2>
      
      <div className="space-y-10">
        {/* Exercises Section */}
        <div className="flex gap-5 items-center group">
          <div className="bg-zinc-950/50 p-3 rounded-2xl border border-zinc-900/50 group-hover:scale-110 transition-transform duration-300 shadow-inner">
            <Image src="/tree.png" alt="exercises" width={32} height={32} className="w-8 h-8 object-contain" />
          </div>
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-2">
              <span className="font-game text-zinc-500 text-[10px] uppercase tracking-[0.2em]">Exercises</span>
              <span className="font-mono text-[10px] font-black text-zinc-400">{exercisesCompletedCount}/{totalExercises}</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/20">
               <div 
                 className="h-full bg-blue-500/60 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                 style={{ width: `${exercisesProgress}%` }} 
               />
            </div>
          </div>
        </div>

        {/* XP Section */}
        <div className="flex gap-5 items-center group">
          <div className="bg-zinc-950/50 p-3 rounded-2xl border border-zinc-900/50 group-hover:scale-110 transition-transform duration-300 shadow-inner">
            <Image src="/star.png" alt="star" width={32} height={32} className="w-8 h-8 object-contain" />
          </div>
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-2">
              <span className="font-game text-yellow-500/60 text-[10px] uppercase tracking-[0.2em]">XP Earned</span>
              <span className="font-mono text-[10px] font-black text-zinc-400">{xpEarned}/{totalXP}</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/20">
               <div 
                 className="h-full bg-yellow-500/60 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(234,179,8,0.3)]" 
                 style={{ width: `${xpProgress}%` }} 
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
