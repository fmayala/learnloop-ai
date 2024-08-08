import React from 'react';
import { Module } from '@prisma/client';
import { FaMusic } from 'react-icons/fa'; // Using music icon for audio
import { ModuleIcon } from './icons';

interface AudioProps {
  module: Module;
}

export function Audio({ module }: AudioProps) {
  return (
    <div className="rounded-lg border bg-background p-8">
      <div className="flex items-center mb-4">
        <h2 className="text-base font-bold ml-2">
          {module.topic || 'Audio Title'}
        </h2>
      </div>
      <p className="text-md mb-4 text-muted-foreground">
        {module.description || 'This is a short summary of the audio content, providing an overview of what listeners can expect.'}
      </p>
      <div className="flex flex-col space-y-4">
        {/* Audio player element */}
        <audio controls className="w-full">
          {/* <source src={module.content || 'path/to/your/audio/file.mp3'} type="audio/mpeg" /> */}
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
}
export function AudioDisplay({ module }: AudioProps) {
  return (
    <div className="rounded-lg border bg-background p-8 w-full">
      <div className="flex items-center mb-4">
        <h2 className="text-base font-bold ml-2">
          {module.topic || 'Audio Title'}
        </h2>
      </div>
      <p className="text-base leading-9 text-muted-foreground">
        {module.description || 'This is a short summary of the audio content, providing an overview of what listeners can expect.'}
      </p>
      <div className="flex flex-col space-y-4">
        {/* Audio player element */}
        <audio controls className="w-full">
          {/* <source src={module.content || 'path/to/your/audio/file.mp3'} type="audio/mpeg" /> */}
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
}

