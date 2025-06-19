import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { 
  Activity, 
  Download, 
  Trash2, 
  Filter,
  Calendar,
  Clock,
  User,
  FileText
} from 'lucide-react';
import { useToast } from '../../contexts/toast';

interface ActivityLog {
  id: string;
  timestamp: Date;
  type: 'screenshot' | 'recording' | 'text_extraction' | 'file_upload' | 'custom_prompt' | 'audio_transcription' | 'system_audio';
  description: string;
  data?: any;
  duration?: number;
  success: boolean;
}

interface ActivityLoggerProps {
  className?: string;
}

export const ActivityLogger: React.FC<ActivityLoggerProps> = ({
  className = ""
}) => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = () => {
    try {
      const savedActivities = localStorage.getItem('activity_logs');
      if (savedActivities) {
        const parsed = JSON.parse(savedActivities);
        // Convert timestamp strings back to Date objects
        const activities = parsed.map((activity: any) => ({
          ...activity,
          timestamp: new Date(activity.timestamp)
        }));
        setActivities(activities);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const saveActivities = (newActivities: ActivityLog[]) => {
    try {
      localStorage.setItem('activity_logs', JSON.stringify(newActivities));
      setActivities(newActivities);
    } catch (error) {
      console.error('Error saving activities:', error);
    }
  };

  const logActivity = (
    type: ActivityLog['type'],
    description: string,
    data?: any,
    duration?: number,
    success: boolean = true
  ) => {
    const newActivity: ActivityLog = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type,
      description,
      data,
      duration,
      success
    };

    const updatedActivities = [newActivity, ...activities].slice(0, 1000); // Keep last 1000 activities
    saveActivities(updatedActivities);
  };

  // Expose logging function globally
  useEffect(() => {
    (window as any).logActivity = logActivity;
    return () => {
      delete (window as any).logActivity;
    };
  }, [activities]);

  const clearActivities = () => {
    const confirmed = confirm('Clear all activity logs?');
    if (confirmed) {
      saveActivities([]);
      showToast('Activities Cleared', 'All activity logs have been cleared', 'success');
    }
  };

  const exportActivities = () => {
    try {
      const exportData = {
        exported_at: new Date().toISOString(),
        total_activities: activities.length,
        activities: activities
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-log-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('Export Complete', 'Activity log exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting activities:', error);
      showToast('Export Failed', 'Failed to export activity log', 'error');
    }
  };

  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'screenshot':
        return '📸';
      case 'recording':
        return '🎥';
      case 'text_extraction':
        return '📝';
      case 'file_upload':
        return '📁';
      case 'custom_prompt':
        return '💬';
      case 'audio_transcription':
        return '🎤';
      case 'system_audio':
        return '🎧';
      default:
        return '⚡';
    }
  };

  const getActivityColor = (type: ActivityLog['type'], success: boolean) => {
    if (!success) return 'text-red-400';
    
    switch (type) {
      case 'screenshot':
        return 'text-blue-400';
      case 'recording':
        return 'text-purple-400';
      case 'text_extraction':
        return 'text-green-400';
      case 'file_upload':
        return 'text-yellow-400';
      case 'custom_prompt':
        return 'text-pink-400';
      case 'audio_transcription':
        return 'text-orange-400';
      case 'system_audio':
        return 'text-cyan-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return '';
    if (duration < 60) return `${duration}s`;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'errors') return !activity.success;
    return activity.type === filter;
  });

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'errors', label: 'Errors Only' },
    { value: 'screenshot', label: 'Screenshots' },
    { value: 'recording', label: 'Recordings' },
    { value: 'text_extraction', label: 'Text Extraction' },
    { value: 'file_upload', label: 'File Uploads' },
    { value: 'custom_prompt', label: 'Custom Prompts' },
    { value: 'audio_transcription', label: 'Audio Transcription' },
    { value: 'system_audio', label: 'System Audio' }
  ];

  return (
    <div className={`bg-black/40 border border-white/10 rounded-lg ${className}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-white">Activity Logger</span>
          <span className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded">
            {activities.length}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {activities.length > 0 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  exportActivities();
                }}
                className="h-6 px-2 text-white/70 hover:text-white"
              >
                <Download className="w-3 h-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  clearActivities();
                }}
                className="h-6 px-2 text-red-400/70 hover:text-red-400"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-white/10 p-4">
          {/* Filter Controls */}
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-4 h-4 text-white/70" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-black/50 border border-white/10 rounded px-2 py-1 text-sm text-white"
            >
              {activityTypes.map(type => (
                <option key={type.value} value={type.value} className="bg-black">
                  {type.label}
                </option>
              ))}
            </select>
            
            <div className="text-xs text-white/60">
              Showing {filteredActivities.length} of {activities.length} activities
            </div>
          </div>

          {/* Activity List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8 text-white/50">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  {filter === 'all' ? 'No activities logged yet' : `No ${filter} activities found`}
                </p>
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    activity.success 
                      ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                      : 'bg-red-500/10 border-red-500/20'
                  }`}
                >
                  <div className="text-lg leading-none mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${getActivityColor(activity.type, activity.success)}`}>
                      {activity.description}
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1 text-xs text-white/60">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.timestamp.toLocaleTimeString()}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {activity.timestamp.toLocaleDateString()}
                      </div>
                      
                      {activity.duration && (
                        <div className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {formatDuration(activity.duration)}
                        </div>
                      )}
                      
                      {!activity.success && (
                        <div className="text-red-400 font-medium">
                          FAILED
                        </div>
                      )}
                    </div>

                    {activity.data && (
                      <div className="mt-2 text-xs text-white/50 bg-black/30 rounded px-2 py-1 max-w-xs truncate">
                        {typeof activity.data === 'string' 
                          ? activity.data 
                          : JSON.stringify(activity.data).substring(0, 100) + '...'
                        }
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary Stats */}
          {activities.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-white">
                    {activities.length}
                  </div>
                  <div className="text-xs text-white/60">Total</div>
                </div>
                
                <div>
                  <div className="text-lg font-bold text-green-400">
                    {activities.filter(a => a.success).length}
                  </div>
                  <div className="text-xs text-white/60">Success</div>
                </div>
                
                <div>
                  <div className="text-lg font-bold text-red-400">
                    {activities.filter(a => !a.success).length}
                  </div>
                  <div className="text-xs text-white/60">Failed</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};