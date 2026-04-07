"use client";

import React, { useState } from 'react';
import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackCodeEditor, 
  SandpackPreview 
} from "@codesandbox/sandpack-react";
import { CourseExercise } from '../page';
import EditorControls from './EditorControls';

interface Props {
  courseExerciseData: CourseExercise | null;
  loading: boolean;
}

export default function CodeEditor({ courseExerciseData, loading }: Props) {
  const [showPreview, setShowPreview] = useState(false); // Default: hidden for a "Zen" coding feel

  if (loading) {
    return (
      <div className="h-full w-full bg-zinc-950 animate-pulse flex items-center justify-center">
        <div className="text-zinc-800 font-game uppercase tracking-[0.5em]">Synchronizing IDE...</div>
      </div>
    );
  }

  const exercise = courseExerciseData?.exercise;
  const starterCode = exercise?.content?.starterCode || { "/index.html": "" };

  return (
    <div className="h-full flex flex-col flex-1 pt-2">
      {/* Scope-level CSS to force Sandpack's internal preview into dark mode */}
      <style>{`
        .sp-preview-container, .sp-preview-iframe { 
          background-color: #09090b !important; 
          color-scheme: dark !important; 
        }
        .sp-layout {
          border: none !important;
        }
      `}</style>

      <SandpackProvider 
        template="static"
        theme="dark"
        files={starterCode}
        options={{
          autoReload: false,
          autorun: false,
        }}
      >
        <div className="flex-1 flex flex-col" style={{ height: 'calc(100vh - 160px)' }}>
          <SandpackLayout className="flex-1 !rounded-none !border-none !bg-transparent h-full flex transition-all duration-500">
            {/* If preview is hidden, the editor takes full flex-1 (100%) */}
            <SandpackCodeEditor 
              style={{ flex: showPreview ? 2 : 1, height: '100%' }}
              className="!h-full font-mono text-xs no-scrollbar !bg-zinc-950"
              showTabs
              showLineNumbers
              closableTabs={false}
            />
            
            {/* Conditional Rendering of the Preview screen */}
            {showPreview && (
              <SandpackPreview 
                style={{ flex: 1, height: '100%', backgroundColor: 'transparent' }}
                className="!h-full border-l border-zinc-900 overflow-hidden animate-in fade-in slide-in-from-right-10 duration-500"
                showOpenInCodeSandbox={false}
                showRefreshButton={false}
              />
            )}
          </SandpackLayout>
          
          {/* Controls with Toggle state */}
          <EditorControls 
            courseExerciseData={courseExerciseData} 
            showPreview={showPreview}
            setShowPreview={setShowPreview}
          />
        </div>
      </SandpackProvider>
    </div>
  );
}
