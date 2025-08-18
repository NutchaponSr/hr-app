"use client";

import { useIsMutating, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export const SavingIndicator = () => {
  const isMutating = useIsMutating();
  const queryClient = useQueryClient();
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    if (isMutating > 0) {
      setSaveState('saving');
      setLastError(null);
    } else if (saveState === 'saving') {
      // Check if there were any recent errors
      const mutationCache = queryClient.getMutationCache();
      const recentMutations = mutationCache.getAll().slice(-5); // Check last 5 mutations
      const hasError = recentMutations.some(mutation =>
        mutation.state.status === 'error' &&
        Date.now() - (mutation.state.submittedAt || 0) < 5000 // Within last 5 seconds
      );

      if (hasError) {
        const errorMutation = recentMutations.find(m => m.state.status === 'error');
        setSaveState('error');
        setLastError(errorMutation?.state.error?.message || 'Save failed');
      } else {
        setSaveState('saved');
      }
    }
  }, [isMutating, queryClient, saveState]);

  // Auto-hide saved/error states after 3 seconds
  useEffect(() => {
    if (saveState === 'saved' || saveState === 'error') {
      const timer = setTimeout(() => {
        setSaveState('idle');
        setLastError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveState]);

  if (saveState === 'idle') return null;

  const getStateConfig = () => {
    switch (saveState) {
      case 'saving':
        return {
          bgColor: 'bg-blue-50 border-blue-200',
          dotColor: 'bg-blue-500 animate-pulse',
          textColor: 'text-blue-700',
          text: 'Saving...',
          icon: null
        };
      case 'saved':
        return {
          bgColor: 'bg-green-50 border-green-200',
          dotColor: 'bg-green-500',
          textColor: 'text-green-700',
          text: 'Saved',
          icon: '✓'
        };
      case 'error':
        return {
          bgColor: 'bg-red-50 border-red-200',
          dotColor: 'bg-red-500',
          textColor: 'text-red-700',
          text: lastError || 'Save failed',
          icon: '✕'
        };
      default:
        return null;
    }
  };

  const config = getStateConfig();
  
  if (!config) return null;

  return (
    <div className={cn(
      "flex items-center gap-2 px-2 py-1 rounded-md transition-all duration-200",
      config.bgColor
    )}>
      <div className="flex items-center gap-1">
        {config.icon ? (
          <span className={cn("text-xs font-bold", config.textColor)}>
            {config.icon}
          </span>
        ) : (
          <div className={cn("size-2 rounded-full", config.dotColor)} />
        )}
      </div>
      <span className={cn("text-xs font-medium", config.textColor)}>
        {config.text}
      </span>
    </div>
  );
};