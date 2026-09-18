import React, { useState, useEffect } from 'react';

interface PreloaderProps {
  onLoaded?: () => void;
  minDurationMs?: number;
}

export const Preloader: React.FC<PreloaderProps> = ({
  onLoaded,
  minDurationMs = 1800,
}) => {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const startTime = performance.now();
    let animationFrameId: number;

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min((elapsed / minDurationMs) * 100, 100);

      // Smooth easing out near the end
      setProgress(Math.floor(rawProgress));

      if (rawProgress < 100) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        // Small delay at 100% for optical completeness before fading out
        setTimeout(() => {
          setIsCompleted(true);
          // Wait for smooth fade-out CSS transition to finish before hiding completely
          setTimeout(() => {
            setIsHidden(true);
            if (onLoaded) onLoaded();
          }, 600);
        }, 250);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [minDurationMs, onLoaded]);

  if (isHidden) {
    return null;
  }

  // SVG circular calculations
  const size = 160;
  const strokeWidth = 5;
  const center = size / 2;
  const radius = center - strokeWidth - 6; // ~66px radius
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      id="preloader-overlay"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050810] select-none transition-opacity duration-700 ease-out ${
        isCompleted ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        display: isHidden ? 'none' : 'flex',
      }}
      aria-hidden={isCompleted}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Background ambient radial glow */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>

      {/* Centered Preloader Box */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* 2. Loading Percentage (Directly ABOVE the company logo) */}
        <div className="mb-4 flex flex-col items-center">
          <span className="text-xl sm:text-2xl font-mono font-bold text-blue-400 tracking-wider drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]">
            {progress}%
          </span>
          <span className="text-[10px] sm:text-xs font-mono text-slate-400 tracking-widest uppercase mt-0.5">
            INITIALIZING SECURITY MATRIX
          </span>
        </div>

        {/* 1 & 3. Centered Logo with Clean Blue Circular Progress Line */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
          {/* SVG Circular Progress Ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 transform"
            viewBox={`0 0 ${size} ${size}`}
          >
            {/* Background track circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#0f1d38"
              strokeWidth={strokeWidth}
              className="opacity-75"
            />
            {/* Animated Blue Progress Line */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#3b82f6"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-[stroke-dashoffset] duration-150 ease-out"
              style={{
                filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.75))',
              }}
            />
          </svg>

          {/* Centered Logo Image inside the ring */}
          <div className="w-24 h-24 sm:w-30 sm:h-30 rounded-full p-1.5 bg-[#090f1d] border border-blue-500/30 overflow-hidden shadow-[0_0_20px_rgba(37,99,235,0.25)] flex items-center justify-center">
            <img
              src="https://i.postimg.cc/gJLZN8H0/Whats-App-Image-2026-09-18-at-4-31-02-PM.jpg"
              alt="Company Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full select-none pointer-events-none"
            />
          </div>
        </div>

        {/* Subtle status label below */}
        <div className="mt-5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-xs font-mono text-slate-400">
            {progress < 40
              ? 'Loading definitions...'
              : progress < 80
              ? 'Calibrating CVSS v3.1...'
              : progress < 100
              ? 'Syncing bounty benchmarks...'
              : 'Ready'}
          </span>
        </div>
      </div>
    </div>
  );
};
