import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Camera, Upload, Mic, Send, X } from 'lucide-react';
import { useToast } from '../../contexts/toast';
import { AudioRecorder } from '../AudioRecorder/AudioRecorder';

interface CustomPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (prompt: string, screenshots: string[], audioText?: string) => void;
}

export const CustomPromptDialog: React.FC<CustomPromptDialogProps> = ({
  open,
  onOpenChange,
  onSubmit
}) => {
  const [prompt, setPrompt] = useState('');
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [audioText, setAudioText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTakeScreenshot = async () => {
    try {
      setIsProcessing(true);
      const result = await window.electronAPI.triggerScreenshot();
      
      if (result.success) {
        // Get the latest screenshot
        const screenshotsResult = await window.electronAPI.getScreenshots();
        if (screenshotsResult && screenshotsResult.length > 0) {
          const latestScreenshot = screenshotsResult[screenshotsResult.length - 1];
          setScreenshots(prev => [...prev, latestScreenshot.preview]);
          showToast('Screenshot Captured', 'Screenshot added to your prompt', 'success');
        }
      } else {
        showToast('Screenshot Failed', result.error || 'Failed to capture screenshot', 'error');
      }
    } catch (error) {
      console.error('Error taking screenshot:', error);
      showToast('Screenshot Error', 'Failed to capture screenshot', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setScreenshots(prev => [...prev, result]);
          showToast('Image Added', 'Image uploaded successfully', 'success');
        };
        reader.readAsDataURL(file);
      } else {
        showToast('Invalid File', 'Please upload image files only', 'error');
      }
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveScreenshot = (index: number) => {
    setScreenshots(prev => prev.filter((_, i) => i !== index));
  };

  const handleAudioTranscription = (text: string) => {
    setAudioText(text);
    setPrompt(prev => prev + (prev ? ' ' : '') + text);
    setShowAudioRecorder(false);
    showToast('Audio Added', 'Speech converted to text and added to prompt', 'success');
  };

  const handleSubmit = async () => {
    if (!prompt.trim() && screenshots.length === 0) {
      showToast('Empty Prompt', 'Please enter a prompt or add screenshots', 'error');
      return;
    }

    try {
      setIsProcessing(true);
      
      // If we have screenshots, analyze them first
      if (screenshots.length > 0) {
        const analysisResult = await window.electronAPI.analyzeScreenshotForPrompt(
          screenshots[0].split(',')[1], // Remove data URL prefix
          prompt
        );

        if (analysisResult.success) {
          // Use the enhanced prompt from analysis
          const enhancedPrompt = analysisResult.analysis?.suggested_prompt || prompt;
          onSubmit?.(enhancedPrompt, screenshots, audioText);
        } else {
          onSubmit?.(prompt, screenshots, audioText);
        }
      } else {
        onSubmit?.(prompt, screenshots, audioText);
      }

      // Reset form
      setPrompt('');
      setScreenshots([]);
      setAudioText('');
      setShowAudioRecorder(false);
      onOpenChange(false);
      
      showToast('Prompt Submitted', 'Your custom prompt is being processed', 'success');
    } catch (error) {
      console.error('Error submitting prompt:', error);
      showToast('Submission Error', 'Failed to submit prompt', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-black border border-white/10 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Custom Prompt with Context</DialogTitle>
          <DialogDescription className="text-white/70">
            Create a custom prompt with screenshots and audio input for personalized assistance.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Text Prompt Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Your Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you need help with..."
              className="w-full h-24 px-3 py-2 bg-black/50 border border-white/10 rounded-md text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTakeScreenshot}
              disabled={isProcessing}
              className="border-white/10 hover:bg-white/5 text-white"
            >
              <Camera className="w-4 h-4 mr-2" />
              Take Screenshot
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="border-white/10 hover:bg-white/5 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAudioRecorder(!showAudioRecorder)}
              disabled={isProcessing}
              className="border-white/10 hover:bg-white/5 text-white"
            >
              <Mic className="w-4 h-4 mr-2" />
              Voice Input
            </Button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Audio Recorder */}
          {showAudioRecorder && (
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-white">Voice Input</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAudioRecorder(false)}
                  className="text-white/70 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <AudioRecorder
                onTranscriptionComplete={handleAudioTranscription}
                className="justify-start"
              />
            </div>
          )}

          {/* Screenshots Preview */}
          {screenshots.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Screenshots ({screenshots.length})
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {screenshots.map((screenshot, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md border border-white/10"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveScreenshot(index)}
                      className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audio Text Preview */}
          {audioText && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Audio Transcription</label>
              <div className="p-3 bg-white/5 rounded-md border border-white/10">
                <p className="text-sm text-white/80">{audioText}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/10 hover:bg-white/5 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isProcessing || (!prompt.trim() && screenshots.length === 0)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Prompt
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};