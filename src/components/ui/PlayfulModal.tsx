"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarIcon } from "@/components/SidebarIcon";

interface PlayfulModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const PlayfulModal = ({ isOpen, onClose, title, children, footer }: PlayfulModalProps) => {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl shadow-2xl flex flex-col rounded-3xl overflow-hidden border-2 border-white/50 dark:border-zinc-800/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-200/50 p-6 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
              <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                {title}
              </h2>
              <button 
                onClick={onClose} 
                className="rounded-full p-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 transition-colors cursor-pointer"
              >
                <SidebarIcon name="x" className="size-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              {children}
            </div>

            {footer && (
              <div className="border-t border-zinc-200/50 bg-zinc-50/80 p-6 dark:border-zinc-800/50 dark:bg-zinc-900/80 backdrop-blur-sm flex justify-end gap-3 rounded-b-3xl">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
