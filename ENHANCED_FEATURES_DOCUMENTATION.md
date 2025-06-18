# Enhanced Interview Assistant Features Documentation

## Overview

This document provides comprehensive documentation for the enhanced features added to the Interview Coder application, including custom prompts with screenshot analysis, audio input capabilities, and real-time audio analysis for interview context.

## Features Implemented

### 1. Custom Prompt with Screenshot Analysis

#### Description
Allows users to create detailed prompts with multiple screenshots and receive AI-powered analysis and responses tailored to the specific content.

#### Components
- **CustomPromptDialog**: Main interface for creating custom prompts
- **CustomPromptHelper**: Backend processing for screenshot analysis and prompt enhancement

#### Usage
1. Click "Custom Prompt" in the Enhanced Features panel
2. Enter your prompt text
3. Add screenshots by:
   - Taking new screenshots with the camera button
   - Uploading existing images
4. Submit for AI analysis and response

#### API Integration
- Uses OpenAI GPT-4o Vision API for screenshot analysis
- Automatically enhances user prompts based on screenshot content
- Supports multiple screenshots with contextual analysis

### 2. Audio Input for Responses

#### Description
Enables users to provide voice input that gets converted to text using speech recognition technology.

#### Components
- **AudioRecorder**: React component for recording and processing audio
- **AudioHelper**: Backend audio processing and speech-to-text conversion

#### Features
- Real-time audio recording with visual feedback
- Speech-to-text conversion using OpenAI Whisper API
- Audio level indicators and recording timer
- Support for various accents and speech patterns

#### Usage
1. Click the microphone button in any prompt interface
2. Speak clearly into your microphone
3. Stop recording to automatically convert speech to text
4. Text is added to your prompt automatically

#### Technical Details
- Uses WebRTC MediaRecorder API for audio capture
- Supports WebM audio format with Opus codec
- 16kHz sample rate optimized for speech recognition
- Automatic noise suppression and echo cancellation

### 3. Real-time Audio Analysis for Interview Context

#### Description
Monitors system audio during video calls to provide context-aware assistance based on interviewer questions and conversation flow.

#### Components
- **SystemAudioCapture**: Interface for controlling audio monitoring
- **AudioHelper**: Backend system audio capture (placeholder implementation)

#### Features
- Real-time audio level monitoring
- Privacy-conscious design with clear indicators
- Context-aware response generation
- Compliance considerations built-in

#### Usage
1. Click "Listen to Interview" in the Enhanced Features panel
2. Grant necessary permissions when prompted
3. The system monitors audio and provides contextual insights
4. Stop monitoring when no longer needed

#### Privacy & Compliance
- Clear visual indicators when audio monitoring is active
- User consent required before activation
- Audio data processed locally when possible
- Compliance with privacy regulations

## Installation & Setup

### Prerequisites
- Node.js v16 or higher
- OpenAI API key with access to:
  - GPT-4o Vision API
  - Whisper API
- Microphone access permissions
- System audio capture permissions (platform-specific)

### Configuration
1. Set up your OpenAI API key in the application settings
2. Grant microphone permissions when prompted
3. For system audio capture:
   - **Windows**: No additional setup required
   - **macOS**: Grant screen recording permissions
   - **Linux**: May require PulseAudio configuration

## API Usage & Costs

### OpenAI API Calls
- **Screenshot Analysis**: Uses GPT-4o Vision API (~$0.01-0.03 per image)
- **Speech Recognition**: Uses Whisper API (~$0.006 per minute)
- **Text Generation**: Uses GPT-4o API (~$0.03 per 1K tokens)

### Rate Limits
- Whisper API: 50 requests per minute
- GPT-4o Vision: 100 requests per minute
- Automatic retry logic with exponential backoff

## Security Considerations

### Data Privacy
- Audio data processed through OpenAI APIs
- Screenshots analyzed using OpenAI Vision API
- No persistent storage of audio or image data
- API keys stored locally and encrypted

### Permissions Required
- **Microphone Access**: Required for voice input
- **System Audio**: Platform-specific requirements
- **Screen Recording**: Required for screenshot analysis on macOS

## Troubleshooting

### Common Issues

#### Audio Recording Not Working
1. Check microphone permissions in browser/system settings
2. Ensure microphone is not being used by other applications
3. Try refreshing the application
4. Check console for detailed error messages

#### Speech Recognition Errors
1. Verify OpenAI API key has Whisper access
2. Ensure clear speech and minimal background noise
3. Check internet connection stability
4. Verify API quota and billing status

#### System Audio Capture Issues
1. **macOS**: Grant screen recording permissions
2. **Windows**: Run application as administrator if needed
3. **Linux**: Check PulseAudio configuration
4. Ensure no other applications are capturing system audio

#### Screenshot Analysis Failures
1. Verify OpenAI API key has GPT-4o Vision access
2. Check image file size (max 20MB)
3. Ensure images are in supported formats (PNG, JPEG, WebP, GIF)
4. Check API quota and rate limits

### Error Codes
- `MICROPHONE_ACCESS_DENIED`: User denied microphone permissions
- `API_KEY_INVALID`: OpenAI API key is invalid or expired
- `RATE_LIMIT_EXCEEDED`: API rate limit reached
- `AUDIO_PROCESSING_FAILED`: Error in speech-to-text conversion
- `SCREENSHOT_ANALYSIS_FAILED`: Error in image analysis

## Development Notes

### Architecture
- **Frontend**: React components with TypeScript
- **Backend**: Electron main process with IPC communication
- **Audio Processing**: Web APIs + OpenAI Whisper
- **Image Analysis**: OpenAI GPT-4o Vision API

### Key Files
- `electron/AudioHelper.ts`: Audio recording and processing
- `electron/CustomPromptHelper.ts`: Screenshot analysis and prompt enhancement
- `src/components/AudioRecorder/`: Audio recording UI components
- `src/components/CustomPrompt/`: Custom prompt interface
- `src/components/SystemAudio/`: System audio monitoring
- `src/components/EnhancedFeatures/`: Main features panel

### Testing
- Test audio recording in various environments
- Verify screenshot analysis with different image types
- Test system audio capture on all supported platforms
- Validate API error handling and retry logic

## Future Enhancements

### Planned Features
1. **Multi-language Speech Recognition**: Support for non-English interviews
2. **Advanced Audio Analysis**: Sentiment analysis and keyword extraction
3. **Real-time Transcription**: Live transcription during interviews
4. **Custom Model Integration**: Support for local AI models
5. **Enhanced Privacy Mode**: Fully offline processing options

### Performance Optimizations
1. **Audio Compression**: Reduce API costs with audio compression
2. **Batch Processing**: Process multiple screenshots simultaneously
3. **Caching**: Cache analysis results for repeated content
4. **Local Processing**: Implement local speech recognition fallback

## Support & Contribution

### Getting Help
1. Check this documentation for common issues
2. Review console logs for detailed error information
3. Verify API key permissions and quotas
4. Test with minimal examples to isolate issues

### Contributing
1. Follow existing code patterns and TypeScript types
2. Add comprehensive error handling
3. Include unit tests for new functionality
4. Update documentation for any API changes
5. Consider privacy and security implications

### Code Quality
- Use TypeScript for type safety
- Implement proper error boundaries
- Add loading states and user feedback
- Follow accessibility guidelines
- Maintain consistent UI/UX patterns

---

This enhanced Interview Coder application now provides a comprehensive suite of AI-powered tools for technical interview preparation, while maintaining the original application's core functionality and invisibility features.