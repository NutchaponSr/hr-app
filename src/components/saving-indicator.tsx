"use client"

import { useState, useEffect } from "react"
import { BsArrowClockwise, BsCloudCheck, BsCloudSlash } from "react-icons/bs"
import { useIsMutating, useQueryClient } from "@tanstack/react-query"

type SaveState = "idle" | "saving" | "saved" | "error"

interface Props {
  label: string
  autoResetDelay?: number
}

const SAVE_STATE_CONFIG = {
  idle: { icon: null, text: (label: string) => label },
  saving: {
    icon: BsArrowClockwise,
    text: () => "Saving...",
    iconClass: "animate-spin",
  },
  saved: {
    icon: BsCloudCheck,
    text: () => "Saved to database",
  },
  error: {
    icon: BsCloudSlash,
    text: () => "Save failed",
  },
} as const

export const SavingIndicator = ({ label, autoResetDelay = 3000 }: Props) => {
  const isMutating = useIsMutating()
  const queryClient = useQueryClient()

  const [saveState, setSaveState] = useState<SaveState>("idle")
  const [lastError, setLastError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle mutation state changes
  useEffect(() => {
    if (!mounted) return

    if (isMutating > 0) {
      setSaveState("saving")
      setLastError(null)
    } else if (saveState === "saving") {
      // Check for recent errors in mutation cache
      const mutationCache = queryClient.getMutationCache()
      const recentMutations = mutationCache.getAll().slice(-5)

      const recentError = recentMutations.find(
        (mutation) => mutation.state.status === "error" && Date.now() - (mutation.state.submittedAt || 0) < 5000,
      )

      if (recentError) {
        setSaveState("error")
        setLastError(recentError.state.error?.message || "Unknown error")
      } else {
        setSaveState("saved")
      }
    }
  }, [isMutating, queryClient, saveState, mounted])

  // Auto-reset after delay
  useEffect(() => {
    if (saveState === "saved" || saveState === "error") {
      const timer = setTimeout(() => {
        setSaveState("idle")
        setLastError(null)
      }, autoResetDelay)

      return () => clearTimeout(timer)
    }
  }, [saveState, autoResetDelay])

  const config = SAVE_STATE_CONFIG[saveState]
  const IconComponent = config.icon
  const text = config.text(label)

  return (
    <div className="flex items-center gap-1 text-xs text-tertiary font-normal select-none whitespace-nowrap me-2 transition-opacity">
      {mounted && IconComponent && (
        <IconComponent className={`size-4 stroke-[0.2] ${"iconClass" in config ? config.iconClass : ""}`} />
      )}
      <span>{text}</span>
      {mounted && lastError && saveState === "error" && (
        <span className="text-destructive ml-1" title={lastError}>
          - {lastError.length > 20 ? `${lastError.slice(0, 20)}...` : lastError}
        </span>
      )}
    </div>
  )
}
