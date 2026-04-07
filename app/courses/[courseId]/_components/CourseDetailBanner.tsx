import React from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Course } from '../../_components/CourseList';

interface Props {
  courseDetail: Course | null;
  loading: boolean;
}

export default function CourseDetailBanner({ courseDetail, loading }: Props) {
  if (loading || !courseDetail) {
    return <Skeleton className="h-[300px] w-full rounded-xl bg-zinc-800" />;
  }

  return (
    <div className="relative h-[350px] w-full rounded-xl overflow-hidden">
      <Image
        src={courseDetail.banner?.trimEnd() || "/placeholder.jpg"}
        alt={courseDetail.title || "Course"}
        width={1000}
        height={350}
        className="object-cover w-full h-full absolute"
        priority
      />
      <div className="absolute top-0 w-full h-full p-10 z-10 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center">
        <h1 className="text-6xl font-game text-white drop-shadow-md">
          {courseDetail.title}
        </h1>
        <p className="text-gray-300 mt-4 max-w-lg text-lg drop-shadow-sm">
          {courseDetail.description}
        </p>
        
        <div className="mt-8">
          <Button variant="pixel" size="lg">
            Enroll Now
          </Button>
        </div>
      </div>
    </div>
  );
}
