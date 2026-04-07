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
        chapter.exercises?.forEach(ex => {
          count++;
          xp += ex.xp;
        });
      });
      setTotalExercises(count);
      setTotalXP(xp);
    }
  }, [courseDetail]);

  if (loading) {
    return <div className="p-6 bg-zinc-900 rounded-xl animate-pulse h-40"></div>;
  }

  return (
    <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 sticky top-10">
      <h2 className="text-2xl font-game text-white mb-8">Course Progress</h2>
      
      <div className="space-y-8">
        {/* Exercises Section */}
        <div className="flex gap-4 items-center">
          <Image src="/books.png" alt="book" width={50} height={50} className="object-contain" />
          <div className="flex-1 w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="font-game text-white text-lg">Exercises</span>
              <span className="font-game text-white text-lg">0/{totalExercises}</span>
            </div>
            <Progress value={0} className="h-2 bg-zinc-800" />
          </div>
        </div>

        {/* XP Section */}
        <div className="flex gap-4 items-center">
          <Image src="/star.png" alt="star" width={50} height={50} className="object-contain" />
          <div className="flex-1 w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="font-game text-white text-lg">XP Earned</span>
              <span className="font-game text-white text-lg">0/{totalXP}</span>
            </div>
            <Progress value={0} className="h-2 bg-zinc-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
