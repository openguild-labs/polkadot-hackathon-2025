'use client';

import { CheckCircle2, Copy, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CreateLinkAnimationProps {
  link: string;
  onAnimationComplete: () => void;
}

export function CreateLinkAnimation({ link, onAnimationComplete }: CreateLinkAnimationProps) {
  const [stage, setStage] = useState<'creating' | 'copying' | 'complete'>('creating');
  
  // Trigger the animation sequence
  useState(() => {
    setTimeout(() => {
      setStage('copying');
      setTimeout(() => {
        setStage('complete');
        navigator.clipboard.writeText(link);
        setTimeout(onAnimationComplete, 1000);
      }, 1000);
    }, 1000);
  });

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="relative">
        <div
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500",
            stage === 'creating' && "bg-primary/20",
            stage === 'copying' && "bg-secondary/20",
            stage === 'complete' && "bg-green-500/20"
          )}
        >
          {stage === 'creating' && (
            <LinkIcon className="w-8 h-8 text-primary animate-pulse" />
          )}
          {stage === 'copying' && (
            <Copy className="w-8 h-8 text-secondary animate-bounce" />
          )}
          {stage === 'complete' && (
            <CheckCircle2 className="w-8 h-8 text-green-500 animate-in zoom-in" />
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        {stage === 'creating' && "Creating your link..."}
        {stage === 'copying' && "Copying to clipboard..."}
        {stage === 'complete' && "Link copied successfully!"}
      </p>
    </div>
  );
}