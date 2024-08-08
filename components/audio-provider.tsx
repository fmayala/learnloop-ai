// components/AudioRecorder.tsx
"use client";
import useAudioCapture from "@/lib/hooks/useAudioWebSocket";
import React, { FC } from "react";

const AudioRecorder: FC = () => {
  const { isCapturing, message, startCapture, stopCapture } = useAudioCapture();

  return (
    <div className="grid grid-cols-2">
      <button onClick={() => (isCapturing ? stopCapture() : startCapture())}>
        {isCapturing ? "Stop Capturing" : "Start Capturing"}
      </button>
      <div className="flex flex-col gap-2 w-96">
        <h1 className="font-bold text-xl">audio output</h1>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AudioRecorder;
