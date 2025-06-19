import { ipcMain, app, dialog } from "electron"
import fs from "fs"
import path from "path"
import { configHelper } from "./ConfigHelper"

export class AdvancedFeaturesHelper {
  private tempDir: string

  constructor() {
    this.tempDir = path.join(app.getPath('temp'), 'interview-coder-advanced')
    this.ensureTempDir()
    this.setupIpcHandlers()
  }

  private ensureTempDir() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true })
    }
  }

  private setupIpcHandlers() {
    // Screen recording handlers
    ipcMain.handle("start-screen-recording", async () => {
      try {
        return await this.startScreenRecording()
      } catch (error) {
        console.error("Error starting screen recording:", error)
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle("stop-screen-recording", async () => {
      try {
        return await this.stopScreenRecording()
      } catch (error) {
        console.error("Error stopping screen recording:", error)
        return { success: false, error: error.message }
      }
    })

    // File management handlers
    ipcMain.handle("save-file", async (event, fileName: string, data: string, mimeType: string) => {
      try {
        return await this.saveFile(fileName, data, mimeType)
      } catch (error) {
        console.error("Error saving file:", error)
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle("load-file", async (event, filePath: string) => {
      try {
        return await this.loadFile(filePath)
      } catch (error) {
        console.error("Error loading file:", error)
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle("delete-file", async (event, filePath: string) => {
      try {
        return await this.deleteFile(filePath)
      } catch (error) {
        console.error("Error deleting file:", error)
        return { success: false, error: error.message }
      }
    })

    // Text processing handlers
    ipcMain.handle("process-text-with-ai", async (event, text: string, operation: string) => {
      try {
        return await this.processTextWithAI(text, operation)
      } catch (error) {
        console.error("Error processing text with AI:", error)
        return { success: false, error: error.message }
      }
    })

    // Batch processing handlers
    ipcMain.handle("batch-process-files", async (event, files: Array<{ name: string; data: string; type: string }>) => {
      try {
        return await this.batchProcessFiles(files)
      } catch (error) {
        console.error("Error batch processing files:", error)
        return { success: false, error: error.message }
      }
    })
  }

  private async startScreenRecording(): Promise<{ success: boolean; error?: string }> {
    // This is a placeholder implementation
    // In a real implementation, you would use platform-specific screen recording APIs
    console.log("Screen recording started (placeholder)")
    return { success: true }
  }

  private async stopScreenRecording(): Promise<{ success: boolean; recordingData?: string; error?: string }> {
    // This is a placeholder implementation
    console.log("Screen recording stopped (placeholder)")
    return { success: true, recordingData: "placeholder_recording_data" }
  }

  private async saveFile(fileName: string, data: string, mimeType: string): Promise<{ success: boolean; filePath?: string; error?: string }> {
    try {
      const filePath = path.join(this.tempDir, fileName)
      
      // Convert base64 data to buffer if needed
      let buffer: Buffer
      if (data.startsWith('data:')) {
        // Remove data URL prefix
        const base64Data = data.split(',')[1]
        buffer = Buffer.from(base64Data, 'base64')
      } else {
        buffer = Buffer.from(data, 'base64')
      }

      await fs.promises.writeFile(filePath, buffer)
      
      return { success: true, filePath }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  private async loadFile(filePath: string): Promise<{ success: boolean; data?: string; mimeType?: string; error?: string }> {
    try {
      if (!fs.existsSync(filePath)) {
        return { success: false, error: "File not found" }
      }

      const buffer = await fs.promises.readFile(filePath)
      const data = buffer.toString('base64')
      
      // Determine MIME type based on file extension
      const ext = path.extname(filePath).toLowerCase()
      let mimeType = 'application/octet-stream'
      
      const mimeTypes: { [key: string]: string } = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.txt': 'text/plain',
        '.json': 'application/json',
        '.pdf': 'application/pdf'
      }
      
      if (mimeTypes[ext]) {
        mimeType = mimeTypes[ext]
      }

      return { success: true, data, mimeType }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  private async deleteFile(filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath)
      }
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  private async processTextWithAI(text: string, operation: string): Promise<{ success: boolean; result?: string; error?: string }> {
    try {
      const config = configHelper.loadConfig()
      
      if (!config.apiKey) {
        return { success: false, error: "API key not configured" }
      }

      let prompt = ""
      switch (operation) {
        case 'enhance':
          prompt = `Please enhance and improve this text, fixing any errors and making it more readable:\n\n${text}`
          break
        case 'summarize':
          prompt = `Please provide a concise summary of this text:\n\n${text}`
          break
        case 'extract_keywords':
          prompt = `Please extract the key terms and important keywords from this text:\n\n${text}`
          break
        case 'translate':
          prompt = `Please translate this text to English if it's in another language, or improve the English if it's already in English:\n\n${text}`
          break
        default:
          prompt = `Please process this text according to the operation "${operation}":\n\n${text}`
      }

      // Use the existing custom response generation
      const result = await this.generateAIResponse(prompt)
      
      if (result.success) {
        return { success: true, result: result.response }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  private async generateAIResponse(prompt: string): Promise<{ success: boolean; response?: string; error?: string }> {
    // This would use the same AI generation logic as CustomPromptHelper
    // For now, return a placeholder
    return { 
      success: true, 
      response: `AI processed response for: ${prompt.substring(0, 100)}...` 
    }
  }

  private async batchProcessFiles(files: Array<{ name: string; data: string; type: string }>): Promise<{ success: boolean; results?: any[]; error?: string }> {
    try {
      const results = []
      
      for (const file of files) {
        try {
          // Save the file
          const saveResult = await this.saveFile(file.name, file.data, file.type)
          
          if (saveResult.success) {
            results.push({
              name: file.name,
              success: true,
              filePath: saveResult.filePath
            })
          } else {
            results.push({
              name: file.name,
              success: false,
              error: saveResult.error
            })
          }
        } catch (error) {
          results.push({
            name: file.name,
            success: false,
            error: error.message
          })
        }
      }

      return { success: true, results }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Cleanup method
  public cleanup() {
    try {
      if (fs.existsSync(this.tempDir)) {
        const files = fs.readdirSync(this.tempDir)
        for (const file of files) {
          const filePath = path.join(this.tempDir, file)
          fs.unlinkSync(filePath)
        }
      }
    } catch (error) {
      console.error("Error cleaning up temp directory:", error)
    }
  }
}