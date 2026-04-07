import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  exerciseDetail: any;
  loading: boolean;
}

export default function ContentSection({ exerciseDetail, loading }: Props) {
  if (loading) {
    return (
      <div className="p-8 space-y-8 bg-zinc-950 h-full">
        <Skeleton className="h-12 w-3/4 bg-zinc-800 rounded-xl" />
        <Skeleton className="h-64 w-full bg-zinc-800 rounded-xl" />
        <Skeleton className="h-32 w-full bg-zinc-800 rounded-xl" />
        <Skeleton className="h-24 w-full bg-zinc-800 rounded-xl" />
      </div>
    );
  }

  if (!exerciseDetail) {
    return (
      <div className="h-full flex items-center justify-center bg-zinc-950 text-zinc-500 font-game italic">
        Exercise quest not found.
      </div>
    );
  }

  return (
    <div className="p-8 overflow-y-auto h-full bg-zinc-950 border-r border-zinc-800 scrollbar-hide selection:bg-yellow-500/30 selection:text-yellow-200">
      {/* Theory / Story Content */}
      <div 
        className="prose prose-invert max-w-none prose-p:text-gray-400 prose-code:text-yellow-500 prose-li:text-gray-400 prose-headings:font-game"
        dangerouslySetInnerHTML={{ __html: exerciseDetail?.content?.content }}
      />
      
      {/* Task Section */}
      <div className="mt-12 p-6 bg-zinc-900/50 border-2 border-zinc-800 rounded-3xl shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 group-hover:w-2 transition-all" />
         <h3 className="text-2xl font-game text-yellow-500 mb-6 flex items-center gap-3">
           <span className="bg-yellow-500/10 p-2 rounded-xl">📜</span>
           Current Quest
         </h3>
         <div 
            className="text-gray-200 leading-relaxed text-lg font-medium"
            dangerouslySetInnerHTML={{ __html: exerciseDetail?.content?.task }} 
         />
      </div>

      {/* Hint Section */}
      <div className="mt-8 p-6 bg-blue-500/5 border-2 border-blue-500/20 rounded-3xl group">
         <h3 className="text-xl font-game text-blue-400 mb-4 flex items-center gap-3">
           <span className="bg-blue-500/10 p-2 rounded-xl">💡</span>
           Oracle Hint
         </h3>
         <div 
            className="text-gray-400 italic"
            dangerouslySetInnerHTML={{ __html: exerciseDetail?.content?.hint }} 
         />
      </div>
    </div>
  );
}
