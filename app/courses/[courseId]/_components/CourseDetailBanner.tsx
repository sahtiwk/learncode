import React, { useState } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Course } from '../../_components/CourseList';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';

interface Props {
  courseDetail: Course | null;
  loading: boolean;
  refreshData: () => void;
}

export default function CourseDetailBanner({ courseDetail, loading, refreshData }: Props) {
  const [enrollLoading, setEnrollLoading] = useState(false);

  if (loading || !courseDetail) {
    return <Skeleton className="h-[300px] w-full rounded-xl bg-zinc-800" />;
  }

  const enrollCourse = async () => {
    try {
      setEnrollLoading(true);
      await axios.post('/api/enroll-course', {
        courseId: courseDetail.courseId
      });
      toast.success("Course Enrolled");
      refreshData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to enroll course");
    } finally {
      setEnrollLoading(false);
    }
  };

  return (
    <div className="relative h-[350px] w-full rounded-xl overflow-hidden mt-6">
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
          {courseDetail.userEnroll ? (
            <Button variant={"pixel" as any} size="lg" className="opacity-90">
              Continue Learning
            </Button>
          ) : (
            <Button variant={"pixel" as any} size="lg" onClick={enrollCourse} disabled={enrollLoading}>
              {enrollLoading ? <Loader className="animate-spin" /> : "Enroll Now"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
