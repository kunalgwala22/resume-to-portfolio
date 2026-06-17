import React, { useState } from 'react';
import { useResume } from '../../hooks/useResume';
import { Button } from '../ui/Button';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/cn';

export const ResumeUpload: React.FC<{ onSuccess?: (resume: any) => void }> = ({ onSuccess }) => {
  const { uploadResume, isUploading } = useResume();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFile = (selectedFile: File) => {
    setError(null);
    setSuccess(false);
    
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(selectedFile.type) && extension !== 'pdf' && extension !== 'docx' && extension !== 'doc') {
      setError('Only PDF, DOC, or DOCX formats are allowed.');
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isUploading) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onSubmit = async () => {
    if (!file) return;
    try {
      const data = await uploadResume(file);
      setSuccess(true);
      setFile(null);
      if (onSuccess && data?.resume) {
        onSuccess(data.resume);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload and parse resume.');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">
      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center gap-4 bg-[#111827]/20 border-border/80 hover:border-primary/50 hover:bg-primary/5",
          isUploading && "pointer-events-none opacity-50 border-gray-600 bg-transparent",
          file && "border-primary/40 bg-primary/5"
        )}
        onClick={() => document.getElementById('resume-file-input')?.click()}
      >
        <input
          id="resume-file-input"
          type="file"
          accept=".pdf,.docx,.doc"
          onChange={onFileChange}
          className="hidden"
          disabled={isUploading}
        />

        <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <Upload size={24} />
        </div>

        {file ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-bold text-white flex items-center gap-1.5"><FileText size={16} className="text-primary" /> {file.name}</span>
            <span className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-sm font-bold text-white">Drag & drop your resume here</span>
            <span className="text-xs text-gray-500">Supports PDF, DOCX, and DOC (Max 10MB)</span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 flex items-start gap-2.5 text-xs text-danger font-semibold">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-3 flex items-start gap-2.5 text-xs text-success font-semibold">
          <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
          <span>Resume uploaded and processing queue triggered successfully!</span>
        </div>
      )}

      {file && (
        <Button onClick={(e) => { e.stopPropagation(); onSubmit(); }} isLoading={isUploading} fullWidth>
          Upload and Parse Resume
        </Button>
      )}
    </div>
  );
};

export default ResumeUpload;
