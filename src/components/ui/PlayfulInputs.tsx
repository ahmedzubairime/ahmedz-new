"use client";

import React, { forwardRef, SelectHTMLAttributes, InputHTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PlayfulInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const PlayfulInput = forwardRef<HTMLInputElement, PlayfulInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className={`space-y-1 ${className}`}>
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ms-1">
          {label}
        </label>
        <div className="relative group">
          <input
            ref={ref}
            className={`w-full rounded-2xl border-2 bg-white/50 dark:bg-zinc-900/50 px-4 py-3 outline-none backdrop-blur-md transition-all 
            ${error
                ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20"
                : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/20"
              }
            shadow-sm focus:shadow-md`}
            {...props}
          />
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-xs font-medium text-rose-500 ms-1 mt-1"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
PlayfulInput.displayName = "PlayfulInput";

interface PlayfulTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const PlayfulTextarea = forwardRef<HTMLTextAreaElement, PlayfulTextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className={`space-y-1 ${className}`}>
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ms-1">
          {label}
        </label>
        <div className="relative group">
          <textarea
            ref={ref}
            className={`w-full resize-none rounded-2xl border-2 bg-white/50 dark:bg-zinc-900/50 px-4 py-3 outline-none backdrop-blur-md transition-all 
            ${error
                ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20"
                : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/20"
              }
            shadow-sm focus:shadow-md`}
            {...props}
          />
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-xs font-medium text-rose-500 ms-1 mt-1"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
PlayfulTextarea.displayName = "PlayfulTextarea";

interface PlayfulSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const PlayfulSelect = forwardRef<HTMLSelectElement, PlayfulSelectProps>(
  ({ label, error, options, className = "", ...props }, ref) => {
    return (
      <div className={`space-y-1 ${className}`}>
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ms-1">
          {label}
        </label>
        <div className="relative group">
          <select
            ref={ref}
            className={`w-full appearance-none rounded-2xl border-2 bg-white/50 dark:bg-zinc-900/50 py-3 ps-4 pe-10 outline-none backdrop-blur-md transition-all cursor-pointer
            ${error
                ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20"
                : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/20"
              }
            shadow-sm focus:shadow-md dark:text-white`}
            {...props}
          >
            <option value="" disabled hidden>
              Select...
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-4 text-zinc-500">
            <svg className="size-4 opacity-50 transition-transform group-hover:translate-y-0.5 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-xs font-medium text-rose-500 ms-1 mt-1"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
PlayfulSelect.displayName = "PlayfulSelect";

interface PlayfulSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const PlayfulSwitch = ({ label, checked, onChange }: PlayfulSwitchProps) => {
  return (
    <div className="flex items-center gap-3">
      <div
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full px-1 transition-colors duration-300 
          ${checked ? "bg-[var(--brand-primary)] shadow-lg shadow-[var(--brand-primary)]/20 justify-end" : "bg-zinc-200 dark:bg-zinc-700 justify-start"}`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          className="inline-block size-6 rounded-full bg-white shadow-md"
        />
      </div>
      <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200 cursor-pointer select-none" onClick={() => onChange(!checked)}>
        {label}
      </span>
    </div>
  );
};

export const PlayfulButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }>(
  ({ className = "", variant = "primary", children, ...props }, ref) => {
    const variants = {
      primary: "bg-[var(--brand-primary)] text-white shadow-lg shadow-[var(--brand-primary)]/20 hover:shadow-xl hover:shadow-[var(--brand-primary)]/30 hover:-translate-y-1 active:scale-95",
      secondary: "bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 hover:-translate-y-1 active:scale-95",
      danger: "bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:shadow-xl hover:shadow-rose-500/30 hover:-translate-y-1 active:scale-95",
    };

    return (
      <button
        ref={ref}
        className={`overflow-hidden relative inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
PlayfulButton.displayName = "PlayfulButton";
