import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Sidebar } from './sidebar';
import { Module } from '@prisma/client';
import { ModuleIcon } from './lessons/modules/icons';
import { CompletedModules } from '@/lib/types';
import { Check } from 'lucide-react';
import { FinishLesson } from './finish-lession';

export type LessonSidebarProps = {
  modules: Module[];
  setCurrentModule: (module: Module) => void;
  currentModule: Module;
  moduleStates: CompletedModules;
  endLesson: () => Promise<boolean>;
  setSidebarWidth: (width: number) => void;
};

export function LessonSidebarDesktop({ modules, setCurrentModule, currentModule, moduleStates, endLesson, setSidebarWidth }: LessonSidebarProps) {
  const sidebarRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setLocalSidebarWidth] = useState(268); // initial width in px
  const minSidebarWidth = 250; // minimum width in px
  const maxSidebarWidth = 400; // maximum width in px

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = window.innerWidth - mouseMoveEvent.clientX - 2;
        if (newWidth >= minSidebarWidth && newWidth <= maxSidebarWidth) {

          setLocalSidebarWidth(newWidth);
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing, setSidebarWidth]
  );

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  let allModulesCompleted = moduleStates.every(m => m.responded);

  return (
    <div
      ref={sidebarRef}
      className="absolute inset-y-0 right-0 z-30 border-l hidden lg:flex flex-col shadow-lg px-4"
      style={{ width: sidebarWidth }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="flex-1">
        {modules.map((module) => (
          <div
            key={module.id}
            className={`w-full py-3 flex items-center justify-start gap-2 px-4 h-12 my-2 cursor-pointer rounded-md transition-colors ${
              module.id === currentModule?.id ? 'bg-zinc-200 font-semibold dark:bg-zinc-800' : 'hover:bg-zinc-200/40 dark:hover:bg-zinc-300/10'
            }`}
            onClick={() => setCurrentModule(module)}
          >
            <ModuleIcon type={module.moduleType} className="shrink-0" />
            <span className="text-left px-2">{module.topic || `Module ${module.moduleNumber}`}</span>
            {moduleStates.find((m) => m.moduleNumber === module.moduleNumber)?.responded && (
              <Check className="ml-auto size-5 text-green-500" />
            )}
          </div>
        ))}
        <br />
        {allModulesCompleted && (<FinishLesson endLesson={endLesson} />)}
      </div>
      <div
        className="w-2 cursor-col-resize bg-transparent absolute top-0 left-0 bottom-0 z-40"
        onMouseDown={startResizing}
      />
    </div>
  );
}
