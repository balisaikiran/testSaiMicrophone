# CodeInterviewAssist - Enhanced Edition

> ## ⚠️ IMPORTANT NOTICE TO THE COMMUNITY ⚠️
> 
> **This is a free, open-source initiative - NOT a full-service product!**
> 
> There are numerous paid interview preparation tools charging hundreds of dollars for comprehensive features like live audio capture, automated answer generation, and more. This project is fundamentally different:
> 
> - This is a **small, non-profit, community-driven project** with zero financial incentive behind it
> - The entire codebase is freely available for anyone to use, modify, or extend
> - Want features like voice support? You're welcome to integrate tools like OpenAI's Whisper or other APIs
> - New features should come through **community contributions** - it's unreasonable to expect a single maintainer to implement premium features for free
> - The maintainer receives no portfolio benefit, monetary compensation, or recognition for this work
> 
> **Before submitting feature requests or expecting personalized support, please understand this project exists purely as a community resource.** If you value what's been created, the best way to show appreciation is by contributing code, documentation, or helping other users.

> ## 🔑 API KEY INFORMATION - UPDATED
>
> We have tested and confirmed that **both Gemini and OpenAI APIs work properly** with the current version. If you are experiencing issues with your API keys:
>
> - Try deleting your API key entry from the config file located in your user data directory
> - Log out and log back in to the application
> - Check your API key dashboard to verify the key is active and has sufficient credits
> - Ensure you're using the correct API key format (OpenAI keys start with "sk-")
>
> The configuration file is stored at: `C:\Users\[USERNAME]\AppData\Roaming\interview-coder-v1\config.json` (on Windows) or `/Users/[USERNAME]/Library/Application Support/interview-coder-v1/config.json` (on macOS)

## Free, Open-Source AI-Powered Interview Preparation Tool - Enhanced Edition

This enhanced version provides a powerful alternative to premium coding interview platforms with advanced features inspired by modern screen capture and automation tools. It delivers comprehensive functionality including screen recording, file management, text extraction, and advanced AI analysis - all running locally on your machine.

### New Enhanced Features

#### 🎥 Advanced Screen Capture
- **Screen Recording**: Record your entire screen or specific applications during practice sessions
- **Multi-format Support**: Export recordings in WebM format with high quality
- **Real-time Controls**: Pause, resume, and stop recordings with visual feedback
- **Automatic Screenshot Integration**: Seamlessly integrate with existing screenshot workflow

#### 📁 File Management System
- **Drag & Drop Upload**: Upload multiple files simultaneously
- **File Organization**: Create folders and organize your interview materials
- **Batch Processing**: Process multiple files at once with AI analysis
- **Export/Import**: Download files and maintain your interview preparation library
- **Search Functionality**: Quickly find files by name or type

#### 📝 Text Extraction & OCR
- **Image to Text**: Extract text from screenshots and uploaded images
- **AI Enhancement**: Clean up and format extracted text automatically
- **Multiple Sources**: Extract from screenshots, uploaded images, or clipboard
- **Export Options**: Save extracted text as files or copy to clipboard
- **Smart Processing**: Automatically detect and correct OCR errors

#### 🎤 Enhanced Audio Features
- **Voice Recording**: Record your explanations and convert to text
- **System Audio Monitoring**: Listen to interview audio for context (with proper consent)
- **Speech-to-Text**: Automatic transcription using OpenAI Whisper
- **Audio Analysis**: Process interview audio for better assistance

#### 📊 Activity Logging
- **Comprehensive Tracking**: Log all activities including screenshots, recordings, and AI interactions
- **Performance Analytics**: Track your preparation progress over time
- **Export Logs**: Export activity data for analysis
- **Error Tracking**: Monitor and debug issues with detailed logging

#### 🔧 Advanced Automation
- **Batch File Processing**: Process multiple files simultaneously
- **Custom Workflows**: Create automated sequences for repetitive tasks
- **Smart Integration**: All features work together seamlessly
- **Background Processing**: Non-blocking operations for better performance

### Why This Enhanced Version Exists

The best coding interview tools are often behind expensive paywalls, making them inaccessible to many students and job seekers. This enhanced version provides enterprise-level functionality without the cost barrier, letting you:

- Use your own API key (pay only for what you use)
- Run everything locally on your machine with complete privacy
- Access advanced features typically found in premium tools
- Make customizations to suit your specific needs
- Learn from and contribute to an open-source tool

### Customization Possibilities

The enhanced codebase is designed to be highly adaptable:

- **AI Models**: Though currently using OpenAI's models, you can modify the code to integrate with other providers like Claude, Deepseek, Llama, or any model with an API
- **File Formats**: Add support for additional file types and formats
- **Recording Options**: Extend screen recording with different codecs and quality settings
- **Automation Scripts**: Create custom automation workflows for your specific needs
- **UI Themes**: Customize the interface to your preferences
- **Integration APIs**: Connect with other tools and services

All it takes is modest JavaScript/TypeScript knowledge and understanding of the APIs you want to integrate.

## Enhanced Features

- 🎯 99% Invisibility: Undetectable window that bypasses most screen capture methods
- 📸 Smart Screenshot Capture: Capture both question text and code separately for better analysis
- 🎥 **Screen Recording**: Record your screen during practice sessions with pause/resume controls
- 📁 **File Management**: Upload, organize, and manage your interview preparation materials
- 📝 **Text Extraction**: Extract text from images using AI-powered OCR
- 🎤 **Audio Recording**: Record voice explanations and convert speech to text
- 🎧 **System Audio**: Monitor interview audio for contextual assistance
- 🤖 AI-Powered Analysis: Automatically extracts and analyzes coding problems using GPT-4o
- 💡 Solution Generation: Get detailed explanations and solutions with time/space complexity analysis
- 🔧 Real-time Debugging: Debug your code with AI assistance and structured feedback
- 📊 **Activity Logging**: Track all your preparation activities with detailed analytics
- 🎨 Advanced Window Management: Freely move, resize, change opacity, and zoom the window
- 🔄 Model Selection: Choose between GPT-4o and GPT-4o-mini for different processing stages
- 🔒 Privacy-Focused: Your API key and data never leave your computer except for OpenAI API calls

## Global Commands

The application uses unidentifiable global keyboard shortcuts that won't be detected by browsers or other applications:

- Toggle Window Visibility: [Control or Cmd + B]
- Move Window: [Control or Cmd + Arrow keys]
- Take Screenshot: [Control or Cmd + H]
- Delete Last Screenshot: [Control or Cmd + L]
- Process Screenshots: [Control or Cmd + Enter]
- Start New Problem: [Control or Cmd + R]
- Quit: [Control or Cmd + Q]
- Decrease Opacity: [Control or Cmd + []
- Increase Opacity: [Control or Cmd + ]]
- Zoom Out: [Control or Cmd + -]
- Reset Zoom: [Control or Cmd + 0]
- Zoom In: [Control or Cmd + =]

## Enhanced Workflow

### 1. Screen Recording Workflow
1. **Start Recording**: Use the screen recording feature to capture your practice sessions
2. **Pause/Resume**: Control recording with real-time feedback
3. **Auto-Analysis**: Recorded sessions can be analyzed for improvement suggestions
4. **Export**: Save recordings for later review or sharing with mentors

### 2. File Management Workflow
1. **Upload Materials**: Drag and drop interview questions, code samples, or reference materials
2. **Organize**: Create folders to categorize different types of problems or companies
3. **Search**: Quickly find specific files using the built-in search functionality
4. **Batch Process**: Analyze multiple files simultaneously with AI

### 3. Text Extraction Workflow
1. **Capture**: Take screenshots of problems or upload images with text
2. **Extract**: AI automatically extracts and cleans up the text
3. **Enhance**: Improve formatting and fix OCR errors automatically
4. **Export**: Save extracted text for further analysis or documentation

### 4. Audio-Enhanced Preparation
1. **Record Explanations**: Use voice recording to explain your thought process
2. **Transcribe**: Automatically convert speech to text for documentation
3. **Monitor Context**: Listen to interview audio for better contextual assistance
4. **Analyze**: Process audio content for insights and improvements

## Invisibility Compatibility

The application is invisible to:

- Zoom versions below 6.1.6 (inclusive)
- All browser-based screen recording software
- All versions of Discord
- Mac OS _screenshot_ functionality (Command + Shift + 3/4)

Note: The application is **NOT** invisible to:

- Zoom versions 6.1.6 and above
  - https://zoom.en.uptodown.com/mac/versions (link to downgrade Zoom if needed)
- Mac OS native screen _recording_ (Command + Shift + 5)

## Prerequisites

- Node.js (v16 or higher)
- npm or bun package manager
- OpenAI API Key
- Screen Recording Permission for Terminal/IDE
  - On macOS:
    1. Go to System Preferences > Security & Privacy > Privacy > Screen Recording
    2. Ensure that CodeInterviewAssist has screen recording permission enabled
    3. Restart CodeInterviewAssist after enabling permissions
  - On Windows:
    - No additional permissions needed
  - On Linux:
    - May require `xhost` access depending on your distribution

## Running the Enhanced Application

### Quick Start

1. Clone the repository:

```bash
git clone https://github.com/greeneu/interview-coder-withoupaywall-opensource.git
cd interview-coder-withoupaywall-opensource
```

2. Install dependencies:

```bash
npm install
```

3. **RECOMMENDED**: Clean any previous builds:

```bash
npm run clean
```

4. Run the appropriate script for your platform:

**For Windows:**
```bash
stealth-run.bat
```

**For macOS/Linux:**
```bash
# Make the script executable first
chmod +x stealth-run.sh
./stealth-run.sh
```

**IMPORTANT**: The application window will be invisible by default! Use Ctrl+B (or Cmd+B on Mac) to toggle visibility.

### Building Distributable Packages

To create installable packages for distribution:

**For macOS (DMG):**
```bash
npm run package-mac
```

**For Windows (Installer):**
```bash
npm run package-win
```

The packaged applications will be available in the `release` directory.

## Enhanced Features Usage Guide

### Screen Recording
1. Open the Advanced Features panel
2. Navigate to the "Capture" tab
3. Click "Start Recording" to begin screen capture
4. Use pause/resume controls as needed
5. Click "Stop" to finish and save the recording

### File Management
1. Access the "Files" tab in Advanced Features
2. Drag and drop files or use the upload button
3. Create folders to organize your materials
4. Use search to quickly find specific files
5. Download or delete files as needed

### Text Extraction
1. Go to the "Text" tab in Advanced Features
2. Upload an image or take a screenshot
3. AI will automatically extract and clean the text
4. Use the "Enhance" button to improve formatting
5. Copy or download the extracted text

### Audio Features
1. Navigate to the "Audio" tab
2. Use "Voice Recording" for speech-to-text
3. Enable "System Audio" for interview monitoring
4. All audio is processed locally for privacy

### Activity Logging
1. The Activity Logger automatically tracks all actions
2. View detailed logs of your preparation sessions
3. Export logs for analysis or sharing
4. Filter by activity type or success/failure

## Comparison with Premium Tools

| Feature | Premium Tools (Paid) | Enhanced CodeInterviewAssist |
|---------|------------------------|-------------------------------|
| Price | $60-200/month | Free (only pay for API usage) |
| Screen Recording | ✅ | ✅ |
| File Management | ✅ | ✅ |
| Text Extraction/OCR | ✅ | ✅ |
| Audio Recording | ✅ | ✅ |
| System Audio Monitoring | ✅ | ✅ |
| Activity Logging | ✅ | ✅ |
| Batch Processing | ✅ | ✅ |
| Solution Generation | ✅ | ✅ |
| Debugging Assistance | ✅ | ✅ |
| Invisibility | ✅ | ✅ |
| Multi-language Support | ✅ | ✅ |
| Privacy | Server-processed | 100% Local Processing |
| Customization | Limited | Full Source Code Access |
| Model Selection | Limited | Multiple AI Providers |

## Tech Stack

- Electron
- React
- TypeScript
- Vite
- Tailwind CSS
- Radix UI Components
- OpenAI API
- Web APIs for media capture
- File System APIs
- Speech Recognition APIs

## Enhanced Architecture

The enhanced version includes several new architectural components:

### Frontend Components
- `ScreenCaptureManager`: Handles screen recording and screenshot capture
- `FileManager`: Manages file uploads, organization, and downloads
- `TextExtractor`: AI-powered text extraction from images
- `AdvancedFeaturesPanel`: Unified interface for all enhanced features
- `ActivityLogger`: Tracks and displays user activity

### Backend Helpers
- `AdvancedFeaturesHelper`: Coordinates enhanced functionality
- Enhanced `AudioHelper`: Improved audio processing capabilities
- Enhanced `CustomPromptHelper`: Advanced prompt processing
- Enhanced `ProcessingHelper`: Improved AI integration

### Data Flow
1. **Capture**: Screen recording, screenshots, file uploads
2. **Process**: AI analysis, text extraction, audio transcription
3. **Store**: Local file management and activity logging
4. **Analyze**: Batch processing and advanced AI features
5. **Export**: Multiple export formats and sharing options

## Configuration

- **OpenAI API Key**: Your personal API key is stored locally and only used for API calls to OpenAI
- **Model Selection**: Choose between GPT-4o and GPT-4o-mini for each stage of processing
- **File Storage**: All files are stored locally in your user data directory
- **Activity Logging**: Comprehensive logging of all application activities
- **Privacy Settings**: Control what data is processed and how
- **Export Options**: Configure default export formats and locations

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).

### What This Means

- You are free to use, modify, and distribute this software
- If you modify the code, you must make your changes available under the same license
- If you run a modified version on a network server, you must make the source code available to users
- We strongly encourage you to contribute improvements back to the main project

See the [LICENSE-SHORT](LICENSE-SHORT) file for a summary of terms or visit [GNU AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html) for the full license text.

### Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## Disclaimer and Ethical Usage

This tool is intended as a learning aid and practice assistant. While it can help you understand problems and solution approaches during interviews, consider these ethical guidelines:

- Be honest about using assistance tools if asked directly in an interview
- Use this tool to learn concepts, not just to get answers
- Recognize that understanding solutions is more valuable than simply presenting them
- In take-home assignments, make sure you thoroughly understand any solutions you submit
- Respect privacy when using audio monitoring features
- Obtain proper consent before recording any interview audio

Remember that the purpose of technical interviews is to assess your problem-solving skills and understanding. This tool works best when used to enhance your learning, not as a substitute for it.

## Support and Questions

If you have questions or need support, please open an issue on the GitHub repository.

---

> **Remember:** This is a community resource. If you find it valuable, consider contributing rather than just requesting features. The project grows through collective effort, not individual demands.

## Enhanced Features Roadmap

### Planned Enhancements
- **Video Analysis**: AI-powered analysis of recorded practice sessions
- **Performance Metrics**: Detailed analytics on preparation progress
- **Cloud Sync**: Optional cloud synchronization for multi-device access
- **Collaboration Tools**: Share practice sessions with mentors or study groups
- **Advanced Automation**: Custom scripting for repetitive tasks
- **Integration APIs**: Connect with popular coding platforms and tools

### Community Contributions Welcome
- Additional file format support
- New AI model integrations
- Enhanced automation scripts
- UI/UX improvements
- Performance optimizations
- Documentation improvements

The enhanced version represents a significant evolution of the original Interview Coder, providing enterprise-level functionality while maintaining the core principles of privacy, customization, and community-driven development.