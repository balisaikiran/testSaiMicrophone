import { app, ipcMain } from "electron"
import path from "path"
import fs from "fs"
import { configHelper } from "./ConfigHelper"

export class AudioHelper {
  private isRecording = false
  private mediaRecorder: any = null
  private audioChunks: Blob[] = []
  private stream: MediaStream | null = null

  constructor() {
    this.setupIpcHandlers()
  }

  private setupIpcHandlers() {
    // Start audio recording
    ipcMain.handle("start-audio-recording", async () => {
      try {
        return await this.startRecording()
      } catch (error) {
        console.error("Error starting audio recording:", error)
        return { success: false, error: error.message }
      }
    })

    // Stop audio recording
    ipcMain.handle("stop-audio-recording", async () => {
      try {
        return await this.stopRecording()
      } catch (error) {
        console.error("Error stopping audio recording:", error)
        return { success: false, error: error.message }
      }
    })

    // Process audio with speech recognition
    ipcMain.handle("process-audio-to-text", async (event, audioData) => {
      try {
        return await this.processAudioToText(audioData)
      } catch (error) {
        console.error("Error processing audio to text:", error)
        return { success: false, error: error.message }
      }
    })

    // Start system audio capture (for interview context)
    ipcMain.handle("start-system-audio-capture", async () => {
      try {
        return await this.startSystemAudioCapture()
      } catch (error) {
        console.error("Error starting system audio capture:", error)
        return { success: false, error: error.message }
      }
    })

    // Stop system audio capture
    ipcMain.handle("stop-system-audio-capture", async () => {
      try {
        return await this.stopSystemAudioCapture()
      } catch (error) {
        console.error("Error stopping system audio capture:", error)
        return { success: false, error: error.message }
      }
    })
  }

  private async startRecording(): Promise<{ success: boolean; error?: string }> {
    if (this.isRecording) {
      return { success: false, error: "Recording already in progress" }
    }

    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000 // Optimal for speech recognition
        } 
      })

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      this.audioChunks = []
      this.isRecording = true

      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      }

      this.mediaRecorder.start(1000) // Collect data every second
      
      return { success: true }
    } catch (error) {
      console.error("Failed to start recording:", error)
      return { success: false, error: "Failed to access microphone. Please check permissions." }
    }
  }

  private async stopRecording(): Promise<{ success: boolean; audioData?: string; error?: string }> {
    if (!this.isRecording || !this.mediaRecorder) {
      return { success: false, error: "No recording in progress" }
    }

    return new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' })
        const reader = new FileReader()
        
        reader.onloadend = () => {
          const base64Audio = reader.result as string
          this.cleanup()
          resolve({ 
            success: true, 
            audioData: base64Audio.split(',')[1] // Remove data URL prefix
          })
        }
        
        reader.readAsDataURL(audioBlob)
      }

      this.mediaRecorder.stop()
      this.isRecording = false
    })
  }

  private async processAudioToText(audioData: string): Promise<{ success: boolean; text?: string; error?: string }> {
    try {
      const config = configHelper.loadConfig()
      
      if (!config.apiKey) {
        return { success: false, error: "OpenAI API key not configured" }
      }

      // Convert base64 to buffer
      const audioBuffer = Buffer.from(audioData, 'base64')
      
      // Save temporary audio file
      const tempDir = path.join(app.getPath('temp'), 'interview-coder-audio')
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true })
      }
      
      const tempAudioPath = path.join(tempDir, `audio-${Date.now()}.webm`)
      fs.writeFileSync(tempAudioPath, audioBuffer)

      // Use OpenAI Whisper API for speech recognition
      const FormData = require('form-data')
      const axios = require('axios')
      
      const formData = new FormData()
      formData.append('file', fs.createReadStream(tempAudioPath))
      formData.append('model', 'whisper-1')
      formData.append('language', 'en') // Can be made configurable
      
      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            ...formData.getHeaders()
          }
        }
      )

      // Clean up temp file
      fs.unlinkSync(tempAudioPath)

      return { 
        success: true, 
        text: response.data.text 
      }
    } catch (error) {
      console.error("Error processing audio to text:", error)
      return { 
        success: false, 
        error: "Failed to convert speech to text. Please check your API key and try again." 
      }
    }
  }

  private async startSystemAudioCapture(): Promise<{ success: boolean; error?: string }> {
    try {
      // Note: System audio capture requires special permissions and setup
      // This is a simplified implementation - full implementation would require
      // platform-specific audio capture libraries
      
      console.log("System audio capture started (placeholder implementation)")
      
      // For a full implementation, you would use:
      // - Windows: WASAPI or DirectSound
      // - macOS: Core Audio
      // - Linux: PulseAudio or ALSA
      
      return { success: true }
    } catch (error) {
      return { success: false, error: "System audio capture not yet implemented" }
    }
  }

  private async stopSystemAudioCapture(): Promise<{ success: boolean; error?: string }> {
    console.log("System audio capture stopped")
    return { success: true }
  }

  private cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }
    this.mediaRecorder = null
    this.audioChunks = []
    this.isRecording = false
  }
}