import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square, Play, Pause } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '../../contexts/toast';

interface AudioRecorderProps {
  onTranscriptionComplete?: (text: string) => void;
  onAudioData?: (audioData: string) => void;
  className?: string;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onTranscriptionComplete,
  onAudioData,
  className = ""
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const { showToast } = useToast();
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      const result = await window.electronAPI.startAudioRecording();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to start recording');
      }

      showToast('Recording Started', 'Speak clearly into your microphone', 'success');
    } catch (error) {
      console.error('Error starting recording:', error);
      showToast('Recording Error', 'Failed to start audio recording. Please check microphone permissions.', 'error');
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setIsProcessing(true);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      const result = await window.electronAPI.stopAudioRecording();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to stop recording');
      }

      if (result.audioData) {
        onAudioData?.(result.audioData);
        
        // Process audio to text
        const transcriptionResult = await window.electronAPI.processAudioToText(result.audioData);
        
        if (transcriptionResult.success && transcriptionResult.text) {
          onTranscriptionComplete?.(transcriptionResult.text);
          showToast('Transcription Complete', 'Your speech has been converted to text', 'success');
        } else {
          showToast('Transcription Failed', transcriptionResult.error || 'Failed to convert speech to text', 'error');
        }
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      showToast('Recording Error', 'Failed to process audio recording', 'error');
    } finally {
      setIsProcessing(false);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Recording Button */}
      <Button
        variant={isRecording ? "destructive" : "default"}
        size="sm"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        className={`flex items-center gap-2 ${
          isRecording 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : isRecording ? (
          <>
            <Square className="w-4 h-4" />
            Stop
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            Record
          </>
        )}
      </Button>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm text-white/80">REC</span>
          </div>
          <span className="text-sm text-white/80 font-mono">
            {formatTime(recordingTime)}
          </span>
        </div>
      )}

      {/* Audio Level Indicator */}
      {isRecording && (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-1 h-4 rounded-full transition-colors ${
                i < audioLevel ? 'bg-green-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};