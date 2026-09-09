"use client";

import React, { useState } from "react";

interface InfoTooltipProps {
  text: string;
  title?: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export default function InfoTooltip({
  text,
  title,
  position = "top",
  className = "",
}: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Position classes
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className={`relative inline-flex items-center align-middle group ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      onClick={(e) => {
        e.stopPropagation();
        setIsVisible(!isVisible);
      }}
    >
      <button
        type="button"
        className="w-3.5 h-3.5 rounded-full bg-slate-800/80 hover:bg-cyan-900/80 text-slate-400 hover:text-cyan-300 border border-slate-700/60 flex items-center justify-center text-[10px] font-semibold leading-none cursor-help transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-400"
        aria-label={title || "Information"}
      >
        ⓘ
      </button>

      {isVisible && (
        <div
          role="tooltip"
          className={`absolute ${positionClasses[position]} z-50 w-52 sm:w-64 p-2.5 rounded-lg bg-slate-900/95 border border-slate-700/90 text-slate-200 text-xs shadow-2xl backdrop-blur-md pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95`}
        >
          {title && (
            <div className="font-semibold text-cyan-300 mb-1 flex items-center gap-1.5 border-b border-slate-800 pb-1">
              <span>{title}</span>
            </div>
          )}
          <p className="text-slate-300 leading-normal text-[11px] font-normal">
            {text}
          </p>
        </div>
      )}
    </div>
  );
}
