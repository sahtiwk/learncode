"use client";

import React from 'react';
import { useSandpack } from "@codesandbox/sandpack-react";
import { Button } from '@/components/ui/button';
import { Play, CheckCircle, Monitor, EyeOff } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { CourseExercise } from '../page';

interface Props {
  courseExerciseData: CourseExercise | null;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
}

export default function EditorControls({ courseExerciseData, showPreview, setShowPreview }: Props) {
  const { sandpack } = useSandpack();

  const handleRunCode = () => {
    sandpack.runSandpack();
    // If user clicks run but preview is hidden, show it automatically for feedback
    if (!showPreview) setShowPreview(true);
  };

  const handleMarkCompleted = async () => {
    try {
      const exercise = courseExerciseData?.exercise;
      if (!exercise) return;

      const response = await axios.post('/api/exercise/complete', {
        courseId: exercise.courseId,
        chapterId: exercise.chapterId,
        exerciseId: exercise.exerciseId, // Slug
        xp: exercise.content.hintXp || 20
      });

      if (response.data) {
        if (response.data.xpAwarded === false) {
           toast.success("Quest updated! Ready for next mission.");
        } else {
           toast.success("Quest Completed! XP Awarded.");
        }

        // Determine next route via resume API
        const resumeRes = await axios.post('/api/user-resume', { courseId: exercise.courseId });
        const nextData = resumeRes.data;

        if (nextData.completed) {
           window.location.href = `/courses/${exercise.courseId}?completed=true`;
        } else {
           window.location.href = `/courses/${nextData.courseId}/${nextData.chapterId}/${nextData.exerciseSlug}`;
        }
      }
    } catch (error) {
      console.error("Error marking completion", error);
      toast.error("Failed to sync progress.");
    }
  };

  return (
    <div className="flex justify-between items-center p-4 bg-zinc-900 border-t border-zinc-800 z-20 transition-all duration-300">
      <div className="flex gap-4">
        {/* Run Button */}
        <Button 
          onClick={handleRunCode}
          variant="secondary"
          className="font-game flex items-center gap-2 px-6 bg-zinc-800 hover:bg-zinc-700 text-white transition-all active:scale-95"
        >
          <Play className="w-3 h-3 fill-white" />
          Run
        </Button>

        {/* Toggle Preview Button */}
        <Button 
          onClick={() => setShowPreview(!showPreview)}
          variant="outline"
          className={`font-game flex items-center gap-2 px-6 border-zinc-700 transition-all group ${
            showPreview ? "bg-zinc-800 text-zinc-300" : "bg-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          {showPreview ? (
            <><EyeOff className="w-4 h-4 group-hover:scale-110" /> Hide Preview</>
          ) : (
            <><Monitor className="w-4 h-4 group-hover:scale-110" /> Show Preview</>
          )}
        </Button>
      </div>

      {/* Completion Button */}
      <Button 
        onClick={handleMarkCompleted}
        variant="pixel"
        className="font-game flex items-center gap-2 px-6 transition-all active:scale-95 shadow-lg shadow-yellow-500/10"
      >
        <CheckCircle className="w-4 h-4" />
        Finish Quest
      </Button>
    </div>
  );
}
