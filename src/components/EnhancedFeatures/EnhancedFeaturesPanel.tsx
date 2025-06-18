import React, { useState } from 'react';
import { Button } from '../ui/button';
import { 
  MessageSquare, 
  Mic, 
  Headphones, 
  Camera,
  ChevronDown,
  ChevronUp,
  Settings
} from 'lucide-react';
import { CustomPromptDialog } from '../CustomPrompt/CustomPromptDialog';
import { SystemAudioCapture } from '../SystemAudio/SystemAudioCapture';
import { AudioRecorder } from '../AudioRecorder/AudioRecorder';
import { useToast } from '../../contexts/toast';

interface EnhancedFeaturesPanelProps {
  className?: string;
  onCustomResponse?: (response: string) => void;
}

export const EnhancedFeaturesPanel: React.FC<EnhancedFeaturesPanelProps> = ({
  className = "",
  onCustomResponse
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [showQuickAudio, setShowQuickAudio] = useState(false);
  const { showToast } = useToast();

  const handleCustomPromptSubmit = async (
    prompt: string, 
    screenshots: string[], 
    audioText?: string
  ) => {
    try {
      // Process the custom prompt with context
      const context = {
        screenshots_count: screenshots.length,
        has_audio: !!audioText,
        audio_text: audioText
      };

      const result = await window.electronAPI.generateCustomResponse(prompt, context);
      
      if (result.success && result.response) {
        onCustomResponse?.(result.response);
        showToast('Response Generated', 'Custom response ready', 'success');
      } else {
        showToast('Generation Failed', result.error || 'Failed to generate response', 'error');
      }
    } catch (error) {
      console.error('Error processing custom prompt:', error);
      showToast('Processing Error', 'Failed to process custom prompt', 'error');
    }
  };

  const handleQuickAudioTranscription = (text: string) => {
    // Use the transcribed text as a quick prompt
    handleCustomPromptSubmit(text, []);
    setShowQuickAudio(false);
  };

  const handleSystemAudioContext = (context: string) => {
    // Process system audio context for interview insights
    const prompt = `Based on this interview audio context: "${context}", provide relevant coding interview guidance.`;
    handleCustomPromptSubmit(prompt, []);
  };

  return (
    <div className={`bg-black/40 border border-white/10 rounded-lg ${className}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-white/70" />
          <span className="text-sm font-medium text-white">Enhanced Features</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-white/70" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/70" />
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-3 pt-0 space-y-4">
          {/* Feature Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomPrompt(true)}
              className="border-white/10 hover:bg-white/5 text-white text-xs"
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              Custom Prompt
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQuickAudio(!showQuickAudio)}
              className="border-white/10 hover:bg-white/5 text-white text-xs"
            >
              <Mic className="w-3 h-3 mr-1" />
              Quick Voice
            </Button>
          </div>

          {/* Quick Audio Recorder */}
          {showQuickAudio && (
            <div className="p-3 bg-white/5 rounded border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-white">Quick Voice Input</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQuickAudio(false)}
                  className="text-white/70 hover:text-white h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
              <AudioRecorder
                onTranscriptionComplete={handleQuickAudioTranscription}
                className="justify-start"
              />
            </div>
          )}

          {/* System Audio Capture */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-white/80">Interview Audio Monitoring</div>
            <SystemAudioCapture
              onAudioContext={handleSystemAudioContext}
              className="justify-start"
            />
            <div className="text-xs text-white/50">
              ⚠️ Ensure you have proper consent before monitoring interview audio
            </div>
          </div>

          {/* Feature Descriptions */}
          <div className="space-y-2 text-xs text-white/60">
            <div className="flex items-start gap-2">
              <MessageSquare className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-white/80">Custom Prompt</div>
                <div>Create detailed prompts with screenshots and voice input</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Mic className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-white/80">Voice Input</div>
                <div>Speak your questions and get instant responses</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Headphones className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-white/80">Audio Monitoring</div>
                <div>Listen to interview context for better assistance</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Prompt Dialog */}
      <CustomPromptDialog
        open={showCustomPrompt}
        onOpenChange={setShowCustomPrompt}
        onSubmit={handleCustomPromptSubmit}
      />
    </div>
  );
};