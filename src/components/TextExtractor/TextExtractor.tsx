import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  FileText, 
  Upload, 
  Copy, 
  Download,
  Eye,
  EyeOff,
  Wand2
} from 'lucide-react';
import { useToast } from '../../contexts/toast';

interface TextExtractorProps {
  onTextExtracted?: (text: string, source: string) => void;
  className?: string;
}

export const TextExtractor: React.FC<TextExtractorProps> = ({
  onTextExtracted,
  className = ""
}) => {
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [sourceFile, setSourceFile] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const extractTextFromImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const imageData = e.target?.result as string;
          
          // Use the existing screenshot analysis functionality
          const result = await window.electronAPI.analyzeScreenshotForPrompt(
            imageData.split(',')[1], // Remove data URL prefix
            "Extract all text content from this image. Return only the extracted text without any analysis or formatting."
          );

          if (result.success && result.analysis) {
            // Try to extract clean text from the analysis
            let extractedText = result.analysis.context_analysis || '';
            
            // Clean up the text by removing analysis-specific content
            extractedText = extractedText
              .replace(/This image contains|The image shows|I can see/gi, '')
              .replace(/Analysis:|Context:|Text content:/gi, '')
              .trim();

            resolve(extractedText);
          } else {
            reject(new Error(result.error || 'Failed to extract text'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Invalid File', 'Please select an image file', 'error');
      return;
    }

    setIsProcessing(true);
    setSourceFile(file.name);

    try {
      const text = await extractTextFromImage(file);
      setExtractedText(text);
      onTextExtracted?.(text, file.name);
      showToast('Text Extracted', 'Text has been successfully extracted from the image', 'success');
    } catch (error) {
      console.error('Error extracting text:', error);
      showToast('Extraction Failed', 'Failed to extract text from image', 'error');
    } finally {
      setIsProcessing(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const extractFromScreenshot = async () => {
    try {
      setIsProcessing(true);
      
      // Take a screenshot first
      const screenshotResult = await window.electronAPI.triggerScreenshot();
      
      if (!screenshotResult.success) {
        throw new Error(screenshotResult.error || 'Failed to take screenshot');
      }

      // Get the latest screenshot
      const screenshotsResult = await window.electronAPI.getScreenshots();
      if (!screenshotsResult || screenshotsResult.length === 0) {
        throw new Error('No screenshot available');
      }

      const latestScreenshot = screenshotsResult[screenshotsResult.length - 1];
      
      // Extract text from the screenshot
      const result = await window.electronAPI.analyzeScreenshotForPrompt(
        latestScreenshot.preview.split(',')[1],
        "Extract all text content from this screenshot. Return only the extracted text without any analysis or formatting."
      );

      if (result.success && result.analysis) {
        let extractedText = result.analysis.context_analysis || '';
        
        // Clean up the text
        extractedText = extractedText
          .replace(/This image contains|The image shows|I can see/gi, '')
          .replace(/Analysis:|Context:|Text content:/gi, '')
          .trim();

        setExtractedText(extractedText);
        setSourceFile('Screenshot');
        onTextExtracted?.(extractedText, 'Screenshot');
        showToast('Text Extracted', 'Text has been successfully extracted from screenshot', 'success');
      } else {
        throw new Error(result.error || 'Failed to extract text');
      }
    } catch (error) {
      console.error('Error extracting text from screenshot:', error);
      showToast('Extraction Failed', 'Failed to extract text from screenshot', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
      showToast('Copied', 'Text copied to clipboard', 'success');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      showToast('Copy Failed', 'Failed to copy text to clipboard', 'error');
    }
  };

  const downloadAsText = () => {
    try {
      const blob = new Blob([extractedText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `extracted-text-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('Download Started', 'Text file download started', 'success');
    } catch (error) {
      console.error('Error downloading text:', error);
      showToast('Download Failed', 'Failed to download text file', 'error');
    }
  };

  const enhanceText = async () => {
    if (!extractedText.trim()) return;

    setIsProcessing(true);
    try {
      const result = await window.electronAPI.generateCustomResponse(
        `Please clean up and format this extracted text, fixing any OCR errors and improving readability:\n\n${extractedText}`,
        { source: 'text_enhancement' }
      );

      if (result.success && result.response) {
        setExtractedText(result.response);
        onTextExtracted?.(result.response, `${sourceFile} (Enhanced)`);
        showToast('Text Enhanced', 'Text has been cleaned up and formatted', 'success');
      } else {
        throw new Error(result.error || 'Failed to enhance text');
      }
    } catch (error) {
      console.error('Error enhancing text:', error);
      showToast('Enhancement Failed', 'Failed to enhance text', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`bg-black/40 border border-white/10 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-white/70" />
          <h3 className="text-lg font-medium text-white">Text Extractor</h3>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="text-white/70 hover:text-white"
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>

      {/* Upload Controls */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <label className="cursor-pointer">
          <Button
            variant="outline"
            size="sm"
            disabled={isProcessing}
            className="w-full border-white/10 hover:bg-white/5 text-white"
            asChild
          >
            <span>
              <Upload className="w-4 h-4 mr-2" />
              {isProcessing ? 'Processing...' : 'Upload Image'}
            </span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        <Button
          variant="outline"
          size="sm"
          onClick={extractFromScreenshot}
          disabled={isProcessing}
          className="border-white/10 hover:bg-white/5 text-white"
        >
          <FileText className="w-4 h-4 mr-2" />
          From Screenshot
        </Button>
      </div>

      {/* Extracted Text Display */}
      {showPreview && extractedText && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/70">
              Extracted from: {sourceFile}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={enhanceText}
                disabled={isProcessing}
                className="text-white/70 hover:text-white"
              >
                <Wand2 className="w-4 h-4 mr-1" />
                Enhance
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="text-white/70 hover:text-white"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadAsText}
                className="text-white/70 hover:text-white"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 rounded-lg p-4 max-h-64 overflow-y-auto">
            <pre className="text-sm text-white/90 whitespace-pre-wrap font-mono">
              {extractedText}
            </pre>
          </div>

          <div className="text-xs text-white/50">
            {extractedText.length} characters • {extractedText.split(/\s+/).length} words
          </div>
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
            <span className="text-sm text-white/80">
              Extracting text...
            </span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!extractedText && !isProcessing && (
        <div className="text-center py-8 text-white/50">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Upload an image or take a screenshot to extract text</p>
        </div>
      )}
    </div>
  );
};