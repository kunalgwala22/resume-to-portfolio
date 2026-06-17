import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, FileText, Settings, Sparkles } from 'lucide-react';
import { ResumeUpload as UploadComponent } from '../../components/resume/ResumeUpload';

export const ResumeUploadPage: React.FC = () => {
  const navigate = useNavigate();

  const handleUploadSuccess = (resume: any) => {
    // Navigate directly to the editor page of the uploaded resume
    if (resume?.id) {
      navigate(`/dashboard/resumes/edit/${resume.id}`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Header with back navigation */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)} 
          className="p-2 min-w-0"
        >
          <ChevronLeft size={18} />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-xl font-extrabold text-white">Upload Resume</h1>
          <p className="text-xs text-gray-500">Extract sections automatically using OpenAI GPT-4o parser.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Core upload block */}
        <Card className="bg-[#111827]/30 border-border/40 p-6 flex flex-col gap-6">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-base font-bold text-white mb-2">Resume-to-Portfolio Generator</h2>
            <p className="text-xs text-gray-400">
              Our AI parses your professional experiences, certifications, projects, education, and skills. It then generates a structured dashboard content model that powers all templates.
            </p>
          </div>

          <UploadComponent onSuccess={handleUploadSuccess} />
        </Card>

        {/* Feature Explanations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface/20 border border-border/30 rounded-xl p-4 flex flex-col gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Sparkles size={16} />
            </div>
            <h3 className="text-xs font-bold text-white">AI-Powered Parsing</h3>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Extracts entities, matches tech stacks, and formats dates accurately into structured records.
            </p>
          </div>

          <div className="bg-surface/20 border border-border/30 rounded-xl p-4 flex flex-col gap-2">
            <div className="h-8 w-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
              <FileText size={16} />
            </div>
            <h3 className="text-xs font-bold text-white">Interactive Editor</h3>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Fine-tune, add, or delete any extracted data, including custom links, tags, and profiles.
            </p>
          </div>

          <div className="bg-surface/20 border border-border/30 rounded-xl p-4 flex flex-col gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Settings size={16} />
            </div>
            <h3 className="text-xs font-bold text-white">Template Sync</h3>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Updates you make instantly sync to all 10 responsive layouts without re-uploading files.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadPage;
