import React, { useState } from 'react';
import { Button } from '../ui/button';
import { 
  Settings, 
  ChevronDown, 
  ChevronUp,
  Camera,
  Video,
  FileText,
  FolderOpen,
  Mic,
  Headphones,
  MessageSquare,
  Zap
} from 'lucide-react';
import { ScreenCaptureManager } from '../ScreenCapture/ScreenCaptureManager';
import { FileManager } from '../FileManager/FileManager';
import { TextExtractor } from '../TextExtractor/TextExtractor';
import { CustomPromptDialog } from '../CustomPrompt/CustomPromptDialog';
import { SystemAudioCapture } from '../SystemAudio/SystemAudioCapture';
import { AudioRecorder } from '../AudioRecorder/AudioRecorder';
import { useToast } from '../../contexts/toast';

interface AdvancedFeaturesPanelProps {
  className?: string;
  onFeatureUsed?: (feature: string, data: any) => void;
}

export const AdvancedFeaturesPanel: React.FC<AdvancedFeaturesPanelProps> = ({
  className = "",
  onFeatureUsed
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'capture' | 'files' | 'text' | 'audio' | 'custom'>('capture');
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const { showToast } = useToast();

  const handleCaptureComplete = (data: { type: 'screenshot' | 'recording'; data: string; duration?: number }) => {
    onFeatureUsed?.('screen_capture', data);
    showToast(
      'Capture Complete', 
      `${data.type === 'screenshot' ? 'Screenshot' : 'Recording'} saved successfully`, 
      'success'
    );
  };

  const handleFileUpload = (files: any[]) => {
    onFeatureUsed?.('file_upload', { files });
    showToast('Files Uploaded', `${files.length} file(s) uploaded successfully`, 'success');
  };

  const handleTextExtracted = (text: string, source: string) => {
    onFeatureUsed?.('text_extraction', { text, source });
    showToast('Text Extracted', `Text extracted from ${source}`, 'success');
  };

  const handleCustomPromptSubmit = async (prompt: string, screenshots: string[], audioText?: string) => {
    try {
      const context = {
        screenshots_count: screenshots.length,
        has_audio: !!audioText,
        audio_text: audioText
      };

      const result = await window.electronAPI.generateCustomResponse(prompt, context);
      
      if (result.success && result.response) {
        onFeatureUsed?.('custom_prompt', { prompt, response: result.response, context });
        showToast('Response Generated', 'Custom response ready', 'success');
      } else {
        showToast('Generation Failed', result.error || 'Failed to generate response', 'error');
      }
    } catch (error) {
      console.error('Error processing custom prompt:', error);
      showToast('Processing Error', 'Failed to process custom prompt', 'error');
    }
  };

  const handleAudioTranscription = (text: string) => {
    onFeatureUsed?.('audio_transcription', { text });
    showToast('Audio Transcribed', 'Speech converted to text successfully', 'success');
  };

  const handleSystemAudioContext = (context: string) => {
    onFeatureUsed?.('system_audio', { context });
    showToast('Audio Context', 'System audio context captured', 'success');
  };

  const tabs = [
    { id: 'capture', label: 'Capture', icon: Camera },
    { id: 'files', label: 'Files', icon: FolderOpen },
    { id: 'text', label: 'Text', icon: FileText },
    { id: 'audio', label: 'Audio', icon: Mic },
    { id: 'custom', label: 'Custom', icon: MessageSquare }
  ] as const;

  return (
    <div className={`bg-black/40 border border-white/10 rounded-lg ${className}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-white">Advanced Features</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-white/70" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/70" />
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-white/10">
          {/* Tab Navigation */}
          <div className="flex border-b border-white/10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 text-xs transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white/10 text-white border-b-2 border-blue-400'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'capture' && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white mb-3">Screen Capture</h4>
                <ScreenCaptureManager
                  onCaptureComplete={handleCaptureComplete}
                  className="w-full"
                />
                <div className="text-xs text-white/60">
                  Capture screenshots or record your screen for analysis and documentation.
                </div>
              </div>
            )}

            {activeTab === 'files' && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white mb-3">File Management</h4>
                <FileManager
                  onFileUpload={handleFileUpload}
                  onFileSelect={(file) => onFeatureUsed?.('file_select', file)}
                  className="w-full"
                />
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white mb-3">Text Extraction</h4>
                <TextExtractor
                  onTextExtracted={handleTextExtracted}
                  className="w-full"
                />
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white mb-3">Audio Features</h4>
                
                {/* Voice Recording */}
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Mic className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-white">Voice Recording</span>
                  </div>
                  <AudioRecorder
                    onTranscriptionComplete={handleAudioTranscription}
                    className="justify-start"
                  />
                  <div className="text-xs text-white/60 mt-2">
                    Record your voice and convert speech to text automatically.
                  </div>
                </div>

                {/* System Audio */}
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Headphones className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-white">System Audio</span>
                  </div>
                  <SystemAudioCapture
                    onAudioContext={handleSystemAudioContext}
                    className="justify-start"
                  />
                  <div className="text-xs text-white/60 mt-2">
                    Monitor system audio for interview context and assistance.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'custom' && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white mb-3">Custom Prompts</h4>
                
                <Button
                  onClick={() => setShowCustomPrompt(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Create Custom Prompt
                </Button>

                <div className="text-xs text-white/60">
                  Create detailed prompts with screenshots, voice input, and custom context for personalized AI assistance.
                </div>

                {/* Feature List */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-white/80">Available Features:</div>
                  <ul className="text-xs text-white/60 space-y-1">
                    <li>• Multi-screenshot analysis</li>
                    <li>• Voice input integration</li>
                    <li>• Context-aware responses</li>
                    <li>• Custom prompt enhancement</li>
                  </ul>
                </div>
              </div>
            )}
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