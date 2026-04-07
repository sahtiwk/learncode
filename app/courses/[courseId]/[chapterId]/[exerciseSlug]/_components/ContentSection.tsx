import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { CourseExercise } from '../page';
import { Lightbulb } from 'lucide-react';

interface Props {
  courseExerciseData: CourseExercise | null;
  loading: boolean;
}

export default function ContentSection({ courseExerciseData, loading }: Props) {
  if (loading) {
    return (
      <div className="p-8 space-y-8 bg-zinc-950 h-full">
        <Skeleton className="w-full h-[300px] rounded-xl bg-zinc-800" />
        <Skeleton className="w-full h-[150px] rounded-xl bg-zinc-800" />
        <Skeleton className="w-full h-[100px] rounded-xl bg-zinc-800" />
      </div>
    );
  }

  const exercise = courseExerciseData?.exercise;

  if (!exercise) {
     return (
        <div className="h-full flex items-center justify-center bg-zinc-950 text-zinc-700 font-game lowercase tracking-tighter">
           quest data not synchronized.
        </div>
     );
  }

  return (
    <div className="p-8 overflow-y-auto h-full bg-zinc-950 border-r border-zinc-900 scrollbar-hide selection:bg-yellow-500/20 selection:text-yellow-200">
      {/* 1. Theory & Context */}
      <div 
        className="prose prose-invert max-w-none prose-p:text-zinc-400 prose-code:text-yellow-500/80 prose-li:text-zinc-400 prose-headings:font-game"
        dangerouslySetInnerHTML={{ __html: exercise?.content?.content }}
      />
      
      {/* 2. Quest / Task Section */}
      <div className="mt-12 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl">
         <h3 className="text-xl font-game text-white mb-6 uppercase tracking-widest text-sm">Active Quest</h3>
         <div 
            className="text-zinc-300 leading-relaxed bg-zinc-800 p-5 rounded-xl border border-zinc-700 shadow-inner"
            dangerouslySetInnerHTML={{ __html: exercise?.content?.task }} 
         />
      </div>

      {/* 3. Oracle Hint Section */}
      <div className="mt-8 p-6 bg-yellow-500/5 rounded-2xl border border-yellow-500/10">
         <div className="flex items-center gap-3 mb-4">
           <Lightbulb className="text-yellow-400 w-5 h-5 animate-pulse" />
           <h3 className="text-sm font-game text-yellow-400/80 uppercase tracking-widest">Oracle Hint</h3>
         </div>
         <div 
            className="text-zinc-400 italic text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: exercise?.content?.hint }} 
         />
      </div>
    </div>
  );
}
