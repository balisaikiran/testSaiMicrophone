import React, { useState, useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import ScreenshotQueue from "../components/Queue/ScreenshotQueue"
import QueueCommands from "../components/Queue/QueueCommands"
import { AdvancedFeaturesPanel } from "../components/AdvancedFeatures/AdvancedFeaturesPanel"
import { ActivityLogger } from "../components/ActivityLogger/ActivityLogger"

import { useToast } from "../contexts/toast"
import { Screenshot } from "../types/screenshots"

async function fetchScreenshots(): Promise<Screenshot[]> {
  try {
    const existing = await window.electronAPI.getScreenshots()
    return existing
  } catch (error) {
    console.error("Error loading screenshots:", error)
    throw error
  }
}

interface QueueProps {
  setView: (view: "queue" | "solutions" | "debug") => void
  credits: number
  currentLanguage: string
  setLanguage: (language: string) => void
}

const Queue: React.FC<QueueProps> = ({
  setView,
  credits,
  currentLanguage,
  setLanguage
}) => {
  const { showToast } = useToast()

  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [tooltipHeight, setTooltipHeight] = useState(0)
  const [customResponse, setCustomResponse] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const {
    data: screenshots = [],
    isLoading,
    refetch
  } = useQuery<Screenshot[]>({
    queryKey: ["screenshots"],
    queryFn: fetchScreenshots,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false
  })

  const handleDeleteScreenshot = async (index: number) => {
    const screenshotToDelete = screenshots[index]

    try {
      const response = await window.electronAPI.deleteScreenshot(
        screenshotToDelete.path
      )

      if (response.success) {
        refetch() // Refetch screenshots instead of managing state directly
        
        // Log activity
        if ((window as any).logActivity) {
          (window as any).logActivity(
            'screenshot',
            `Screenshot deleted: ${screenshotToDelete.path}`,
            { path: screenshotToDelete.path },
            undefined,
            true
          );
        }
      } else {
        console.error("Failed to delete screenshot:", response.error)
        showToast("Error", "Failed to delete the screenshot file", "error")
        
        // Log failed activity
        if ((window as any).logActivity) {
          (window as any).logActivity(
            'screenshot',
            `Failed to delete screenshot: ${response.error}`,
            { path: screenshotToDelete.path, error: response.error },
            undefined,
            false
          );
        }
      }
    } catch (error) {
      console.error("Error deleting screenshot:", error)
      
      // Log failed activity
      if ((window as any).logActivity) {
        (window as any).logActivity(
          'screenshot',
          `Error deleting screenshot: ${error}`,
          { path: screenshotToDelete.path, error: error },
          undefined,
          false
        );
      }
    }
  }

  const handleAdvancedFeatureUsed = (feature: string, data: any) => {
    // Log the advanced feature usage
    if ((window as any).logActivity) {
      (window as any).logActivity(
        feature as any,
        `Advanced feature used: ${feature}`,
        data,
        undefined,
        true
      );
    }

    // Handle specific feature responses
    if (feature === 'custom_prompt' && data.response) {
      setCustomResponse(data.response);
    }
    
    showToast(
      "Feature Used", 
      `${feature.replace('_', ' ')} completed successfully`, 
      "success"
    );
  }

  useEffect(() => {
    // Height update logic
    const updateDimensions = () => {
      if (contentRef.current) {
        let contentHeight = contentRef.current.scrollHeight
        const contentWidth = contentRef.current.scrollWidth
        if (isTooltipVisible) {
          contentHeight += tooltipHeight
        }
        window.electronAPI.updateContentDimensions({
          width: contentWidth,
          height: contentHeight
        })
      }
    }

    // Initialize resize observer
    const resizeObserver = new ResizeObserver(updateDimensions)
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current)
    }
    updateDimensions()

    // Set up event listeners
    const cleanupFunctions = [
      window.electronAPI.onScreenshotTaken(() => {
        refetch()
        
        // Log screenshot activity
        if ((window as any).logActivity) {
          (window as any).logActivity(
            'screenshot',
            'Screenshot captured successfully',
            undefined,
            undefined,
            true
          );
        }
      }),
      window.electronAPI.onResetView(() => refetch()),
      window.electronAPI.onDeleteLastScreenshot(async () => {
        if (screenshots.length > 0) {
          const lastScreenshot = screenshots[screenshots.length - 1];
          await handleDeleteScreenshot(screenshots.length - 1);
        } else {
          showToast("No Screenshots", "There are no screenshots to delete", "neutral");
        }
      }),
      window.electronAPI.onSolutionError((error: string) => {
        showToast(
          "Processing Failed",
          "There was an error processing your screenshots.",
          "error"
        )
        setView("queue") // Revert to queue if processing fails
        console.error("Processing error:", error)
        
        // Log error activity
        if ((window as any).logActivity) {
          (window as any).logActivity(
            'screenshot',
            `Solution processing failed: ${error}`,
            { error },
            undefined,
            false
          );
        }
      }),
      window.electronAPI.onProcessingNoScreenshots(() => {
        showToast(
          "No Screenshots",
          "There are no screenshots to process.",
          "neutral"
        )
      }),
    ]

    return () => {
      resizeObserver.disconnect()
      cleanupFunctions.forEach((cleanup) => cleanup())
    }
  }, [isTooltipVisible, tooltipHeight, screenshots])

  const handleTooltipVisibilityChange = (visible: boolean, height: number) => {
    setIsTooltipVisible(visible)
    setTooltipHeight(height)
  }

  const handleOpenSettings = () => {
    window.electronAPI.openSettingsPortal();
  };
  
  return (
    <div ref={contentRef} className={`bg-transparent w-1/2`}>
      <div className="px-4 py-3">
        <div className="space-y-3 w-fit">
          <ScreenshotQueue
            isLoading={false}
            screenshots={screenshots}
            onDeleteScreenshot={handleDeleteScreenshot}
          />

          <QueueCommands
            onTooltipVisibilityChange={handleTooltipVisibilityChange}
            screenshotCount={screenshots.length}
            credits={credits}
            currentLanguage={currentLanguage}
            setLanguage={setLanguage}
          />

          {/* Advanced Features Panel */}
          <AdvancedFeaturesPanel
            onFeatureUsed={handleAdvancedFeatureUsed}
            className="mt-4"
          />

          {/* Activity Logger */}
          <ActivityLogger className="mt-4" />

          {/* Custom Response Display */}
          {customResponse && (
            <div className="mt-4 p-4 bg-black/60 border border-white/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-white">AI Response</h3>
                <button
                  onClick={() => setCustomResponse(null)}
                  className="text-white/70 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="text-sm text-white/90 whitespace-pre-wrap">
                {customResponse}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Queue