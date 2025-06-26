import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  loading: boolean;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, loading, error }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        onFileUpload(file);
      }
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  }, [onFileUpload]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-400 bg-blue-500/10 backdrop-blur-sm'
            : 'border-slate-600 hover:border-slate-500 bg-slate-800/50 backdrop-blur-sm'
        } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={loading}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${dragActive ? 'bg-blue-500/20' : 'bg-slate-700/50'} transition-colors`}>
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            ) : (
              <Upload className={`h-8 w-8 ${dragActive ? 'text-blue-400' : 'text-slate-400'}`} />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">
              {loading ? 'Processing SARIF file...' : 'Upload SARIF Report'}
            </h3>
            <p className="text-slate-300">
              Drag and drop your Semgrep SARIF JSON file here, or click to browse
            </p>
            <p className="text-sm text-slate-400">
              Supports .json files from Semgrep and other SARIF-compatible tools
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <FileText className="h-4 w-4" />
            <span>JSON files only</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-start space-x-3 backdrop-blur-sm">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-red-300">Upload Error</h4>
            <p className="text-sm text-red-400 mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};