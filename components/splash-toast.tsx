"use client";

import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface SplashToastProps {
  message: string;
  duration?: number;
  onComplete?: () => void;
  dismissDuration?: number;
  toastId?: string | number;
}

export function SplashToast({
  message,
  duration = 3, // in seconds
  onComplete,
  dismissDuration = 0.15, // in seconds. Waktu sebelum toast di-dismiss setelah complete
  toastId
}: SplashToastProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 100; // Update every 100ms for smooth animation
    const step = (interval / (duration * 1000)) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete?.();

            // Auto dismiss after specified duration
            if (dismissDuration !== undefined && toastId !== undefined) {
              setTimeout(() => {
                toast.dismiss(toastId);
              }, dismissDuration * 1000);
            }
          }, 0);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration, onComplete, dismissDuration, toastId]);

  return (
    <div className="p-4 bg-background border rounded-lg shadow-lg min-w-[250px]">
      <div className="text-[13px] mb-2">{message}</div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
