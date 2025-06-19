export interface ElectronAPI {
  // Original methods
  openSubscriptionPortal: (authData: {
    id: string
    email: string
  }) => Promise<{ success: boolean; error?: string }>
  updateContentDimensions: (dimensions: {
    width: number
    height: number
  }) => Promise<void>
  clearStore: () => Promise<{ success: boolean; error?: string }>
  getScreenshots: () => Promise<{
    success: boolean
    previews?: Array<{ path: string; preview: string }> | null
    error?: string
  }>
  deleteScreenshot: (
    path: string
  ) => Promise<{ success: boolean; error?: string }>
  onScreenshotTaken: (
    callback: (data: { path: string; preview: string }) => void
  ) => () => void
  onResetView: (callback: () => void) => () => void
  onSolutionStart: (callback: () => void) => () => void
  onDebugStart: (callback: () => void) => () => void
  onDebugSuccess: (callback: (data: any) => void) => () => void
  onSolutionError: (callback: (error: string) => void) => () => void
  onProcessingNoScreenshots: (callback: () => void) => () => void
  onProblemExtracted: (callback: (data: any) => void) => () => void
  onSolutionSuccess: (callback: (data: any) => void) => () => void
  onUnauthorized: (callback: () => void) => () => void
  onDebugError: (callback: (error: string) => void) => () => void
  openExternal: (url: string) => void
  toggleMainWindow: () => Promise<{ success: boolean; error?: string }>
  triggerScreenshot: () => Promise<{ success: boolean; error?: string }>
  triggerProcessScreenshots: () => Promise<{ success: boolean; error?: string }>
  triggerReset: () => Promise<{ success: boolean; error?: string }>
  triggerMoveLeft: () => Promise<{ success: boolean; error?: string }>
  triggerMoveRight: () => Promise<{ success: boolean; error?: string }>
  triggerMoveUp: () => Promise<{ success: boolean; error?: string }>
  triggerMoveDown: () => Promise<{ success: boolean; error?: string }>
  onSubscriptionUpdated: (callback: () => void) => () => void
  onSubscriptionPortalClosed: (callback: () => void) => () => void
  startUpdate: () => Promise<{ success: boolean; error?: string }>
  installUpdate: () => void
  onUpdateAvailable: (callback: (info: any) => void) => () => void
  onUpdateDownloaded: (callback: (info: any) => void) => () => void

  decrementCredits: () => Promise<void>
  setInitialCredits: (credits: number) => Promise<void>
  onCreditsUpdated: (callback: (credits: number) => void) => () => void
  onOutOfCredits: (callback: () => void) => () => void
  openSettingsPortal: () => Promise<void>
  getPlatform: () => string
  
  // New methods for OpenAI integration
  getConfig: () => Promise<{ apiKey: string; model: string }>
  updateConfig: (config: { apiKey?: string; model?: string }) => Promise<boolean>
  checkApiKey: () => Promise<boolean>
  validateApiKey: (apiKey: string) => Promise<{ valid: boolean; error?: string }>
  openLink: (url: string) => void
  onApiKeyInvalid: (callback: () => void) => () => void
  removeListener: (eventName: string, callback: (...args: any[]) => void) => void

  // Enhanced Features - Audio Recording
  startAudioRecording: () => Promise<{ success: boolean; error?: string }>
  stopAudioRecording: () => Promise<{ success: boolean; audioData?: string; error?: string }>
  processAudioToText: (audioData: string) => Promise<{ success: boolean; text?: string; error?: string }>

  // Enhanced Features - System Audio Capture
  startSystemAudioCapture: () => Promise<{ success: boolean; error?: string }>
  stopSystemAudioCapture: () => Promise<{ success: boolean; error?: string }>

  // Enhanced Features - Custom Prompts
  analyzeScreenshotForPrompt: (screenshotData: string, userPrompt: string) => Promise<{ success: boolean; analysis?: any; error?: string }>
  generateCustomResponse: (prompt: string, context: any) => Promise<{ success: boolean; response?: string; error?: string }>
  analyzeMultipleScreenshots: (screenshots: Array<{ data: string; description?: string }>, analysisType: string) => Promise<{ success: boolean; analysis?: any; error?: string }>

  // Advanced Features - Screen Recording
  startScreenRecording: () => Promise<{ success: boolean; error?: string }>
  stopScreenRecording: () => Promise<{ success: boolean; recordingData?: string; error?: string }>

  // Advanced Features - File Management
  saveFile: (fileName: string, data: string, mimeType: string) => Promise<{ success: boolean; filePath?: string; error?: string }>
  loadFile: (filePath: string) => Promise<{ success: boolean; data?: string; mimeType?: string; error?: string }>
  deleteFile: (filePath: string) => Promise<{ success: boolean; error?: string }>

  // Advanced Features - Text Processing
  processTextWithAI: (text: string, operation: string) => Promise<{ success: boolean; result?: string; error?: string }>

  // Advanced Features - Batch Processing
  batchProcessFiles: (files: Array<{ name: string; data: string; type: string }>) => Promise<{ success: boolean; results?: any[]; error?: string }>

  // Delete last screenshot
  deleteLastScreenshot: () => Promise<{ success: boolean; error?: string }>
  onDeleteLastScreenshot: (callback: () => void) => () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
    electron: {
      ipcRenderer: {
        on: (channel: string, func: (...args: any[]) => void) => void
        removeListener: (
          channel: string,
          func: (...args: any[]) => void
        ) => void
      }
    }
    __CREDITS__: number
    __LANGUAGE__: string
    __IS_INITIALIZED__: boolean
    __AUTH_TOKEN__?: string | null
    logActivity?: (
      type: 'screenshot' | 'recording' | 'text_extraction' | 'file_upload' | 'custom_prompt' | 'audio_transcription' | 'system_audio',
      description: string,
      data?: any,
      duration?: number,
      success?: boolean
    ) => void
  }
}