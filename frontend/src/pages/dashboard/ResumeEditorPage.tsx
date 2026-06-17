import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResume } from '../../hooks/useResume';
import { ResumeEditor } from '../../components/resume/ResumeEditor';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, FileText, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/Card';

export const ResumeEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { resume, isLoadingResume } = useResume(id);

  if (isLoadingResume) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm animate-pulse">Loading parsed resume sections...</p>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="text-center py-12 text-danger">
        <p>Invalid resume ID specified.</p>
        <Button onClick={() => navigate('/dashboard')} className="mt-4">Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Back button and page title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')} 
            className="p-2 min-w-0"
            title="Back to Dashboard"
          >
            <ChevronLeft size={20} />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              <span>Fine-Tune Extracted Content</span>
            </h1>
            <p className="text-xs text-gray-500 font-semibold truncate max-w-[300px] sm:max-w-md">
              Editing: {resume?.filename || 'Parsed Resume Details'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-secondary bg-secondary/10 px-3 py-1.5 rounded-lg border border-secondary/20 font-semibold">
          <Sparkles size={13} className="animate-pulse" />
          <span>Extracted via GPT-4o</span>
        </div>
      </div>

      <Card className="bg-[#111827]/10 border-border/40 p-6">
        <ResumeEditor resumeId={id} />
      </Card>
    </div>
  );
};

export default ResumeEditorPage;
