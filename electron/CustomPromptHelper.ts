import { OpenAI } from "openai"
import { configHelper } from "./ConfigHelper"
import fs from "fs"
import path from "path"
import { app, ipcMain } from "electron"

export class CustomPromptHelper {
  private openaiClient: OpenAI | null = null

  constructor() {
    this.initializeClient()
    this.setupIpcHandlers()
    
    // Listen for config changes
    configHelper.on('config-updated', () => {
      this.initializeClient()
    })
  }

  private initializeClient() {
    const config = configHelper.loadConfig()
    if (config.apiKey && config.apiProvider === "openai") {
      this.openaiClient = new OpenAI({ 
        apiKey: config.apiKey,
        timeout: 60000,
        maxRetries: 2
      })
    } else {
      this.openaiClient = null
    }
  }

  private setupIpcHandlers() {
    // Analyze screenshot and generate custom prompt
    ipcMain.handle("analyze-screenshot-for-prompt", async (event, screenshotData, userPrompt) => {
      try {
        return await this.analyzeScreenshotForPrompt(screenshotData, userPrompt)
      } catch (error) {
        console.error("Error analyzing screenshot for prompt:", error)
        return { success: false, error: error.message }
      }
    })

    // Generate response based on custom prompt and context
    ipcMain.handle("generate-custom-response", async (event, prompt, context) => {
      try {
        return await this.generateCustomResponse(prompt, context)
      } catch (error) {
        console.error("Error generating custom response:", error)
        return { success: false, error: error.message }
      }
    })

    // Process multiple screenshots with custom analysis
    ipcMain.handle("analyze-multiple-screenshots", async (event, screenshots, analysisType) => {
      try {
        return await this.analyzeMultipleScreenshots(screenshots, analysisType)
      } catch (error) {
        console.error("Error analyzing multiple screenshots:", error)
        return { success: false, error: error.message }
      }
    })
  }

  private async analyzeScreenshotForPrompt(
    screenshotData: string, 
    userPrompt: string
  ): Promise<{ success: boolean; analysis?: any; error?: string }> {
    if (!this.openaiClient) {
      return { success: false, error: "OpenAI client not initialized" }
    }

    try {
      const messages = [
        {
          role: "system" as const,
          content: `You are an expert at analyzing screenshots and generating contextual prompts. 
          Analyze the provided screenshot and the user's custom prompt to create a comprehensive analysis.
          
          Return your response in JSON format with these fields:
          - content_type: What type of content is shown (code, problem statement, error message, etc.)
          - key_elements: Array of important elements identified in the screenshot
          - suggested_prompt: An enhanced version of the user's prompt based on the screenshot content
          - context_analysis: Detailed analysis of what the screenshot shows
          - recommended_action: What the user should do next based on the content`
        },
        {
          role: "user" as const,
          content: [
            {
              type: "text" as const,
              text: `User's custom prompt: "${userPrompt}"\n\nPlease analyze this screenshot and enhance the prompt based on what you see.`
            },
            {
              type: "image_url" as const,
              image_url: { url: `data:image/png;base64,${screenshotData}` }
            }
          ]
        }
      ]

      const response = await this.openaiClient.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
        max_tokens: 2000,
        temperature: 0.3
      })

      const responseText = response.choices[0].message.content
      let analysis

      try {
        // Try to parse as JSON first
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0])
        } else {
          // Fallback to structured text parsing
          analysis = {
            content_type: "unknown",
            key_elements: ["Screenshot analysis available"],
            suggested_prompt: userPrompt,
            context_analysis: responseText,
            recommended_action: "Review the analysis and proceed accordingly"
          }
        }
      } catch (parseError) {
        // If JSON parsing fails, create a structured response
        analysis = {
          content_type: "text_analysis",
          key_elements: ["Analysis completed"],
          suggested_prompt: userPrompt,
          context_analysis: responseText,
          recommended_action: "Review the provided analysis"
        }
      }

      return { success: true, analysis }
    } catch (error) {
      console.error("Error in screenshot analysis:", error)
      return { success: false, error: "Failed to analyze screenshot" }
    }
  }

  private async generateCustomResponse(
    prompt: string, 
    context: any
  ): Promise<{ success: boolean; response?: string; error?: string }> {
    if (!this.openaiClient) {
      return { success: false, error: "OpenAI client not initialized" }
    }

    try {
      const config = configHelper.loadConfig()
      const language = config.language || "python"

      const systemPrompt = `You are an expert coding interview assistant. Generate a helpful response based on the user's custom prompt and the provided context.

Context Information:
- Programming Language: ${language}
- Content Type: ${context?.content_type || "unknown"}
- Key Elements: ${context?.key_elements?.join(", ") || "none"}
- Previous Analysis: ${context?.context_analysis || "none"}

Provide a clear, actionable response that directly addresses the user's prompt while considering the context.`

      const response = await this.openaiClient.chat.completions.create({
        model: config.solutionModel || "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        max_tokens: 3000,
        temperature: 0.4
      })

      return { 
        success: true, 
        response: response.choices[0].message.content 
      }
    } catch (error) {
      console.error("Error generating custom response:", error)
      return { success: false, error: "Failed to generate response" }
    }
  }

  private async analyzeMultipleScreenshots(
    screenshots: Array<{ data: string; description?: string }>,
    analysisType: string
  ): Promise<{ success: boolean; analysis?: any; error?: string }> {
    if (!this.openaiClient) {
      return { success: false, error: "OpenAI client not initialized" }
    }

    try {
      const imageContent = screenshots.map((screenshot, index) => ({
        type: "image_url" as const,
        image_url: { url: `data:image/png;base64,${screenshot.data}` }
      }))

      const messages = [
        {
          role: "system" as const,
          content: `You are analyzing multiple screenshots for ${analysisType}. 
          Provide a comprehensive analysis that connects the information across all screenshots.
          
          Return JSON with:
          - overall_analysis: Summary of all screenshots together
          - individual_insights: Array of insights for each screenshot
          - connections: How the screenshots relate to each other
          - recommendations: What actions to take based on the complete picture`
        },
        {
          role: "user" as const,
          content: [
            {
              type: "text" as const,
              text: `Please analyze these ${screenshots.length} screenshots for ${analysisType}. Look for connections and provide comprehensive insights.`
            },
            ...imageContent
          ]
        }
      ]

      const response = await this.openaiClient.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
        max_tokens: 4000,
        temperature: 0.3
      })

      const responseText = response.choices[0].message.content
      let analysis

      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0])
        } else {
          analysis = {
            overall_analysis: responseText,
            individual_insights: screenshots.map((_, i) => `Analysis for screenshot ${i + 1}`),
            connections: "See overall analysis",
            recommendations: "Review the provided analysis"
          }
        }
      } catch (parseError) {
        analysis = {
          overall_analysis: responseText,
          individual_insights: [],
          connections: "Analysis completed",
          recommendations: "Review the provided insights"
        }
      }

      return { success: true, analysis }
    } catch (error) {
      console.error("Error analyzing multiple screenshots:", error)
      return { success: false, error: "Failed to analyze screenshots" }
    }
  }
}