import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Folder, 
  File, 
  Download, 
  Upload, 
  Trash2, 
  Search,
  FolderPlus,
  FileText,
  Image,
  Video,
  Archive
} from 'lucide-react';
import { useToast } from '../../contexts/toast';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  mimeType?: string;
  createdAt: Date;
  modifiedAt: Date;
  data?: string; // Base64 data for files
  children?: FileItem[]; // For folders
}

interface FileManagerProps {
  onFileSelect?: (file: FileItem) => void;
  onFileUpload?: (files: FileItem[]) => void;
  className?: string;
}

export const FileManager: React.FC<FileManagerProps> = ({
  onFileSelect,
  onFileUpload,
  className = ""
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      // Load files from localStorage or electron store
      const savedFiles = localStorage.getItem('fileManager_files');
      if (savedFiles) {
        setFiles(JSON.parse(savedFiles));
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const saveFiles = (newFiles: FileItem[]) => {
    try {
      localStorage.setItem('fileManager_files', JSON.stringify(newFiles));
      setFiles(newFiles);
    } catch (error) {
      console.error('Error saving files:', error);
      showToast('Save Error', 'Failed to save files', 'error');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    setIsUploading(true);
    const newFiles: FileItem[] = [];

    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        const reader = new FileReader();
        
        await new Promise<void>((resolve) => {
          reader.onload = (e) => {
            const result = e.target?.result as string;
            const fileItem: FileItem = {
              id: `file_${Date.now()}_${i}`,
              name: file.name,
              type: 'file',
              size: file.size,
              mimeType: file.type,
              createdAt: new Date(),
              modifiedAt: new Date(),
              data: result.split(',')[1] // Remove data URL prefix
            };
            newFiles.push(fileItem);
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }

      const updatedFiles = [...files, ...newFiles];
      saveFiles(updatedFiles);
      onFileUpload?.(newFiles);
      
      showToast('Upload Complete', `${newFiles.length} file(s) uploaded successfully`, 'success');
    } catch (error) {
      console.error('Error uploading files:', error);
      showToast('Upload Error', 'Failed to upload files', 'error');
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const createFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;

    const newFolder: FileItem = {
      id: `folder_${Date.now()}`,
      name: folderName,
      type: 'folder',
      createdAt: new Date(),
      modifiedAt: new Date(),
      children: []
    };

    const updatedFiles = [...files, newFolder];
    saveFiles(updatedFiles);
    showToast('Folder Created', `Folder "${folderName}" created successfully`, 'success');
  };

  const deleteSelected = () => {
    if (selectedFiles.size === 0) return;

    const confirmed = confirm(`Delete ${selectedFiles.size} selected item(s)?`);
    if (!confirmed) return;

    const updatedFiles = files.filter(file => !selectedFiles.has(file.id));
    saveFiles(updatedFiles);
    setSelectedFiles(new Set());
    showToast('Items Deleted', `${selectedFiles.size} item(s) deleted`, 'success');
  };

  const downloadFile = (file: FileItem) => {
    if (file.type === 'folder' || !file.data) return;

    try {
      const blob = new Blob([atob(file.data)], { type: file.mimeType || 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('Download Started', `Downloading ${file.name}`, 'success');
    } catch (error) {
      console.error('Error downloading file:', error);
      showToast('Download Error', 'Failed to download file', 'error');
    }
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <Folder className="w-4 h-4 text-blue-400" />;
    }

    const mimeType = file.mimeType || '';
    if (mimeType.startsWith('image/')) {
      return <Image className="w-4 h-4 text-green-400" />;
    } else if (mimeType.startsWith('video/')) {
      return <Video className="w-4 h-4 text-purple-400" />;
    } else if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) {
      return <Archive className="w-4 h-4 text-orange-400" />;
    } else {
      return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFileSelection = (fileId: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId);
    } else {
      newSelection.add(fileId);
    }
    setSelectedFiles(newSelection);
  };

  return (
    <div className={`bg-black/40 border border-white/10 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">File Manager</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={createFolder}
            className="border-white/10 hover:bg-white/5 text-white"
          >
            <FolderPlus className="w-4 h-4 mr-1" />
            New Folder
          </Button>
          
          <label className="cursor-pointer">
            <Button
              variant="outline"
              size="sm"
              disabled={isUploading}
              className="border-white/10 hover:bg-white/5 text-white"
              asChild
            >
              <span>
                <Upload className="w-4 h-4 mr-1" />
                {isUploading ? 'Uploading...' : 'Upload'}
              </span>
            </Button>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept="*/*"
            />
          </label>

          {selectedFiles.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteSelected}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete ({selectedFiles.size})
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
        <Input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-black/50 border-white/10 text-white"
        />
      </div>

      {/* File List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredFiles.length === 0 ? (
          <div className="text-center py-8 text-white/50">
            {searchTerm ? 'No files match your search' : 'No files uploaded yet'}
          </div>
        ) : (
          filteredFiles.map((file) => (
            <div
              key={file.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                selectedFiles.has(file.id)
                  ? 'bg-blue-500/20 border-blue-500/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
              onClick={() => toggleFileSelection(file.id)}
            >
              <input
                type="checkbox"
                checked={selectedFiles.has(file.id)}
                onChange={() => toggleFileSelection(file.id)}
                className="rounded"
              />
              
              {getFileIcon(file)}
              
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {file.name}
                </div>
                <div className="text-xs text-white/60">
                  {file.type === 'file' && file.size && formatFileSize(file.size)}
                  {file.type === 'file' && file.size && ' • '}
                  {file.modifiedAt.toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {file.type === 'file' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadFile(file);
                    }}
                    className="h-8 w-8 p-0 hover:bg-white/10"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileSelect?.(file);
                  }}
                  className="h-8 w-8 p-0 hover:bg-white/10"
                >
                  <File className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Status */}
      {files.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/60">
          {files.length} item(s) • {selectedFiles.size} selected
        </div>
      )}
    </div>
  );
};