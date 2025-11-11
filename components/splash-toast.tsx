"use client";

import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export interface SplashToastProps {
  message: string;
  duration?: number;
  onComplete?: () => void;
}

export function SplashToast({ message, duration = 3, onComplete }: SplashToastProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 100; // Update every 100ms for smooth animation
    const step = (interval / (duration * 1000)) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          onComplete?.();
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration, onComplete]);

  return (
    <div className="p-4 bg-background border rounded-lg shadow-lg min-w-[250px]">
      <div className="text-sm font-medium mb-2">{message}</div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
