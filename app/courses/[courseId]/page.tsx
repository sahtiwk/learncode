"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import CourseDetailBanner from './_components/CourseDetailBanner';
import CourseChapters from './_components/CourseChapters';
import CourseStatus from './_components/CourseStatus';
import { Course } from '../_components/CourseList';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params?.courseId;
  const [courseDetail, setCourseDetail] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCourseDetail = useCallback(async () => {
    if (!courseId) return;
    try {
      const response = await axios.get(`/api/course?courseId=${courseId}`);
      setCourseDetail(response.data);
    } catch (error) {
      console.error("Failed to fetch course details:", error);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseDetail();
  }, [fetchCourseDetail]);

  const refreshData = () => {
    fetchCourseDetail();
  };

  return (
    <div className="w-full">
      <div className="p-10 md:px-24 lg:px-36 grid grid-cols-1 xl:grid-cols-4 gap-10 mt-6">
        <div className="xl:col-span-3">
          <CourseDetailBanner courseDetail={courseDetail} loading={loading} refreshData={refreshData} />
          <CourseChapters courseDetail={courseDetail} loading={loading} />
        </div>
        <div className="xl:col-span-1">
          <CourseStatus courseDetail={courseDetail} loading={loading} />
        </div>
      </div>
    </div>
  );
}
