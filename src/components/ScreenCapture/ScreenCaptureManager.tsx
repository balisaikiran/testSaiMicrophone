import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Camera, Video, Square, Play, Pause, Download, Settings } from 'lucide-react';
import { useToast } from '../../contexts/toast';

interface ScreenCaptureManagerProps {
  onCaptureComplete?: (data: { type: 'screenshot' | 'recording'; data: string; duration?: number }) => void;
  className?: string;
}

export const ScreenCaptureManager: React.FC<ScreenCaptureManagerProps> = ({
  onCaptureComplete,
  className = ""
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { showToast } = useToast();
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startScreenCapture = async () => {
    try {
      const displayMediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: 'screen',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      setStream(displayMediaStream);

      const recorder = new MediaRecorder(displayMediaStream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });

      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          onCaptureComplete?.({
            type: 'recording',
            data: base64Data.split(',')[1],
            duration: recordingTime
          });
        };
        reader.readAsDataURL(blob);
        
        setRecordedChunks([]);
        setRecordingTime(0);
        setIsRecording(false);
        setIsPaused(false);
      };

      setMediaRecorder(recorder);
      setRecordedChunks(chunks);
      
      recorder.start(1000); // Collect data every second
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      showToast('Recording Started', 'Screen recording has begun', 'success');

      // Handle stream end (user stops sharing)
      displayMediaStream.getVideoTracks()[0].addEventListener('ended', () => {
        stopRecording();
      });

    } catch (error) {
      console.error('Error starting screen capture:', error);
      showToast('Capture Error', 'Failed to start screen recording. Please check permissions.', 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    showToast('Recording Stopped', 'Screen recording has been saved', 'success');
  };

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      showToast('Recording Paused', 'Screen recording is paused', 'neutral');
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      showToast('Recording Resumed', 'Screen recording has resumed', 'success');
    }
  };

  const takeScreenshot = async () => {
    try {
      // Use the existing screenshot functionality from electron
      const result = await window.electronAPI.triggerScreenshot();
      
      if (result.success) {
        // Get the latest screenshot
        const screenshotsResult = await window.electronAPI.getScreenshots();
        if (screenshotsResult && screenshotsResult.length > 0) {
          const latestScreenshot = screenshotsResult[screenshotsResult.length - 1];
          onCaptureComplete?.({
            type: 'screenshot',
            data: latestScreenshot.preview.split(',')[1]
          });
          showToast('Screenshot Captured', 'Screenshot saved successfully', 'success');
        }
      } else {
        showToast('Screenshot Failed', result.error || 'Failed to capture screenshot', 'error');
      }
    } catch (error) {
      console.error('Error taking screenshot:', error);
      showToast('Screenshot Error', 'Failed to capture screenshot', 'error');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Screenshot Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={takeScreenshot}
        className="border-white/10 hover:bg-white/5 text-white"
      >
        <Camera className="w-4 h-4 mr-2" />
        Screenshot
      </Button>

      {/* Screen Recording Controls */}
      {!isRecording ? (
        <Button
          variant="default"
          size="sm"
          onClick={startScreenCapture}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Video className="w-4 h-4 mr-2" />
          Start Recording
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          {!isPaused ? (
            <Button
              variant="outline"
              size="sm"
              onClick={pauseRecording}
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={resumeRecording}
              className="border-green-500 text-green-500 hover:bg-green-500/10"
            >
              <Play className="w-4 h-4 mr-2" />
              Resume
            </Button>
          )}
          
          <Button
            variant="destructive"
            size="sm"
            onClick={stopRecording}
          >
            <Square className="w-4 h-4 mr-2" />
            Stop
          </Button>
        </div>
      )}

      {/* Recording Status */}
      {isRecording && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} />
            <span className="text-sm text-white/80">
              {isPaused ? 'PAUSED' : 'REC'}
            </span>
          </div>
          <span className="text-sm text-white/80 font-mono">
            {formatTime(recordingTime)}
          </span>
        </div>
      )}

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};