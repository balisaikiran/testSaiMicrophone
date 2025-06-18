import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Headphones, HeadphoneOff as HeadphonesOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '../../contexts/toast';

interface SystemAudioCaptureProps {
  onAudioContext?: (context: string) => void;
  className?: string;
}

export const SystemAudioCapture: React.FC<SystemAudioCaptureProps> = ({
  onAudioContext,
  className = ""
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [lastTranscription, setLastTranscription] = useState('');
  const { showToast } = useToast();

  const startCapture = async () => {
    try {
      const result = await window.electronAPI.startSystemAudioCapture();
      
      if (result.success) {
        setIsCapturing(true);
        showToast(
          'Audio Capture Started', 
          'Listening to system audio for interview context. Ensure you have proper consent.', 
          'success'
        );
      } else {
        showToast(
          'Capture Failed', 
          result.error || 'Failed to start system audio capture', 
          'error'
        );
      }
    } catch (error) {
      console.error('Error starting system audio capture:', error);
      showToast('Capture Error', 'Failed to start audio capture', 'error');
    }
  };

  const stopCapture = async () => {
    try {
      const result = await window.electronAPI.stopSystemAudioCapture();
      
      if (result.success) {
        setIsCapturing(false);
        setAudioLevel(0);
        showToast('Audio Capture Stopped', 'System audio monitoring disabled', 'neutral');
      } else {
        showToast('Stop Failed', result.error || 'Failed to stop capture', 'error');
      }
    } catch (error) {
      console.error('Error stopping system audio capture:', error);
      showToast('Stop Error', 'Failed to stop audio capture', 'error');
    }
  };

  // Simulate audio level updates (in real implementation, this would come from the audio capture)
  useEffect(() => {
    if (!isCapturing) return;

    const interval = setInterval(() => {
      // Simulate varying audio levels
      setAudioLevel(Math.floor(Math.random() * 5));
    }, 500);

    return () => clearInterval(interval);
  }, [isCapturing]);

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Capture Control Button */}
      <Button
        variant={isCapturing ? "destructive" : "default"}
        size="sm"
        onClick={isCapturing ? stopCapture : startCapture}
        className={`flex items-center gap-2 ${
          isCapturing 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        {isCapturing ? (
          <>
            <HeadphonesOff className="w-4 h-4" />
            Stop Listening
          </>
        ) : (
          <>
            <Headphones className="w-4 h-4" />
            Listen to Interview
          </>
        )}
      </Button>

      {/* Status Indicator */}
      {isCapturing && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span className="text-sm text-white/80">Listening</span>
          </div>

          {/* Audio Level Indicator */}
          <div className="flex items-center gap-1">
            <Volume2 className="w-4 h-4 text-white/60" />
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1 h-4 rounded-full transition-colors ${
                  i < audioLevel ? 'bg-purple-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      {isCapturing && (
        <div className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/20">
          ⚠️ Audio monitoring active
        </div>
      )}

      {/* Last Transcription Preview */}
      {lastTranscription && (
        <div className="max-w-xs">
          <div className="text-xs text-white/60 mb-1">Last heard:</div>
          <div className="text-xs text-white/80 bg-black/30 px-2 py-1 rounded truncate">
            {lastTranscription}
          </div>
        </div>
      )}
    </div>
  );
};