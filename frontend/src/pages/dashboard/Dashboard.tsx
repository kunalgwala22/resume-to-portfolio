import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useResume } from '../../hooks/useResume';
import { usePortfolio } from '../../hooks/usePortfolio';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  FileText, 
  ExternalLink, 
  Upload, 
  Check, 
  Trash2, 
  Edit3, 
  Copy, 
  Globe, 
  Layers,
  LayoutDashboard
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { resumes, isLoadingResumes, deleteResume, activateResume, isActivating, isDeleting } = useResume();
  const { settings, togglePublish, isTogglingPublish } = usePortfolio();

  const activeResume = resumes.find(r => r.isActive);

  const copyPortfolioUrl = () => {
    if (!user?.username) return;
    const url = `${window.location.origin}/portfolio/${user.username}`;
    navigator.clipboard.writeText(url);
    alert('Portfolio link copied to clipboard!');
  };

  const handleTogglePublish = async () => {
    if (!settings) return;
    try {
      await togglePublish(!settings.isPublished);
    } catch (err) {
      console.error('Failed to toggle publish status', err);
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (confirm('Are you sure you want to delete this resume? This will delete all parsed portfolio data associated with it.')) {
      try {
        await deleteResume(id);
      } catch (err) {
        console.error('Failed to delete resume', err);
      }
    }
  };

  const handleActivateResume = async (id: string) => {
    try {
      await activateResume(id);
    } catch (err) {
      console.error('Failed to activate resume', err);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-secondary/15 to-transparent border border-primary/20 p-6 sm:p-8 rounded-2xl">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.fullName || user?.username}!
          </h1>
          <p className="text-gray-400 text-sm">
            Manage your parsed resumes, configure templates, and see your digital twin portfolio stats.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/resumes/upload">
            <Button className="flex items-center gap-2">
              <Upload size={16} />
              <span>Upload Resume</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid Quick Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Portfolio Status Card */}
        <Card className="bg-surface/30 border-border/40 p-5 flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Portfolio Status</span>
              {settings?.isPublished ? (
                <Badge variant="success">Published</Badge>
              ) : (
                <Badge variant="warning">Draft</Badge>
              )}
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-400">
                Your portfolio is currently {settings?.isPublished ? 'visible' : 'hidden'} to the public.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleTogglePublish} 
              disabled={isTogglingPublish}
              className="flex-1 text-xs"
            >
              {settings?.isPublished ? 'Unpublish' : 'Publish Portfolio'}
            </Button>
            {user?.username && (
              <a 
                href={`/portfolio/${user.username}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center p-2 rounded-lg bg-surface border border-border/60 hover:bg-surface/80"
                title="View Live Portfolio"
              >
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </Card>

        {/* Public Share Card */}
        <Card className="bg-surface/30 border-border/40 p-5 flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-primary" />
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Share Portfolio</span>
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-400 bg-surface/50 border border-border/40 rounded p-2 font-mono break-all select-all">
                {user?.username ? `${window.location.origin}/portfolio/${user.username}` : 'No username set'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={copyPortfolioUrl} 
              className="w-full flex items-center justify-center gap-1.5 text-xs"
              disabled={!user?.username}
            >
              <Copy size={13} />
              <span>Copy Link</span>
            </Button>
          </div>
        </Card>

        {/* Selected Design Card */}
        <Card className="bg-surface/30 border-border/40 p-5 flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-secondary" />
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active Design Layout</span>
            </div>
            <div className="mt-3">
              <h4 className="text-lg font-bold text-white">
                {settings?.templateId ? settings.templateId.replace(/([A-Z])/g, ' $1').trim() : 'Clean Starter'}
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Customize your layout, color scheme, and typography settings.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Link to="/dashboard/templates" className="w-full">
              <Button size="sm" variant="outline" className="w-full text-xs">
                Switch Template
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Resumes List Section */}
      <Card className="bg-surface/20 border-border/40 p-6 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              <span>Parsed Resume Collections</span>
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Activate one resume at a time to render your portfolio with its content.
            </p>
          </div>
          <Link to="/dashboard/resumes/upload">
            <Button size="sm" variant="outline" className="flex items-center gap-1.5 text-xs">
              <Upload size={14} />
              <span>Upload New</span>
            </Button>
          </Link>
        </div>

        {isLoadingResumes ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-400 animate-pulse">Loading resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="py-12 border-2 border-dashed border-border/40 rounded-xl flex flex-col items-center justify-center text-center p-6 bg-surface/10">
            <FileText size={40} className="text-gray-600 mb-3" />
            <h3 className="text-base font-semibold text-white">No parsed resumes found</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
              Upload your resume in PDF or Word format to extract sections and configure your portfolios.
            </p>
            <Link to="/dashboard/resumes/upload" className="mt-4">
              <Button size="sm" className="flex items-center gap-2 text-xs">
                <Upload size={14} />
                <span>Upload First Resume</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border/40 text-gray-400 text-xs uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">Upload Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-gray-300">
                {resumes.map((resume) => (
                  <tr key={resume.id} className="hover:bg-surface/20 transition-all duration-150">
                    <td className="py-3.5 px-4 font-semibold text-white max-w-[200px] truncate">
                      {resume.filename}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-400">
                      {new Date(resume.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      {resume.isActive ? (
                        <Badge variant="success" className="flex items-center gap-1 w-fit">
                          <Check size={11} />
                          <span>Active Portfolio</span>
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!resume.isActive && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-xs py-1 px-2.5 h-8 font-semibold text-primary hover:text-white"
                            onClick={() => handleActivateResume(resume.id)}
                            disabled={isActivating}
                          >
                            Activate
                          </Button>
                        )}
                        <Link to={`/dashboard/resumes/edit/${resume.id}`}>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="p-2 min-w-0 h-8 hover:border-primary"
                            title="Edit Sections"
                          >
                            <Edit3 size={14} />
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="p-2 min-w-0 h-8 text-red-500 hover:bg-red-500/10"
                          onClick={() => handleDeleteResume(resume.id)}
                          disabled={isDeleting}
                          title="Delete Resume"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
