import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePortfolio } from '../../hooks/usePortfolio';
import { useAuthStore } from '../../stores/auth.store';
import { analyticsApi } from '../../api/analytics.api';
import { RecruiterChat } from '../../components/ai/RecruiterChat';
import { Button } from '../../components/ui/Button';
import { 
  CleanStarter,
  ModernDeveloper,
  AppleStyle,
  LinearStyle,
  SaasDashboard,
  GlassUniverse,
  Cyberpunk,
  OrbitOS,
  StellarOdyssey,
  AIDigitalTwin,
  Corridor
} from '../../components/templates/renderers';
import { AlertTriangle, Home, EyeOff } from 'lucide-react';

const TEMPLATE_MAP: Record<string, React.FC<{ data: any }>> = {
  'tmpl-clean-starter': CleanStarter,
  'tmpl-modern-developer': ModernDeveloper,
  'tmpl-apple-style': AppleStyle,
  'tmpl-linear-style': LinearStyle,
  'tmpl-saas-dashboard': SaasDashboard,
  'tmpl-glass-universe': GlassUniverse,
  'tmpl-cyberpunk': Cyberpunk,
  'tmpl-orbit-os': OrbitOS,
  'tmpl-stellar-odyssey': StellarOdyssey,
  'tmpl-ai-digital-twin': AIDigitalTwin,
  'tmpl-ink-corridor': Corridor,
  // Slugs support
  'clean-starter': CleanStarter,
  'modern-developer': ModernDeveloper,
  'apple-style': AppleStyle,
  'linear-style': LinearStyle,
  'saas-dashboard': SaasDashboard,
  'glass-universe': GlassUniverse,
  'cyberpunk': Cyberpunk,
  'orbit-os': OrbitOS,
  'stellar-odyssey': StellarOdyssey,
  'ai-digital-twin': AIDigitalTwin,
  'ink-corridor': Corridor
};

export const PublicPortfolioPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { publicPortfolio, isLoadingPublic, publicError } = usePortfolio(username);
  const { user: loggedInUser } = useAuthStore();
  const trackedRef = useRef(false);

  // Track page hit exactly once when details load successfully
  useEffect(() => {
    if (username && publicPortfolio && !trackedRef.current) {
      trackedRef.current = true;
      analyticsApi.trackView(username).catch((err) => {
        console.error('Failed to log analytics view hit', err);
      });
    }
  }, [username, publicPortfolio]);

  if (isLoadingPublic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm animate-pulse">Retrieving candidate digital twin...</p>
        </div>
      </div>
    );
  }

  // Handle case where username doesn't exist or errors out
  if (publicError || !publicPortfolio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-white p-6 text-center">
        <div className="max-w-md flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center text-danger">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-2xl font-extrabold font-display text-white">Portfolio Not Found</h1>
          <p className="text-sm text-gray-400">
            The requested candidate profile does not exist or has been deleted.
          </p>
          <Link to="/" className="mt-2">
            <Button size="sm" className="flex items-center gap-2">
              <Home size={14} />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Handle publish settings (allow owner to preview draft portfolios)
  const isOwner = loggedInUser?.username === username;
  if (!publicPortfolio.isPublished && !isOwner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-white p-6 text-center">
        <div className="max-w-md flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-warning/10 border border-warning/20 flex items-center justify-center text-warning">
            <EyeOff size={32} />
          </div>
          <h1 className="text-2xl font-extrabold font-display text-white">Portfolio Private</h1>
          <p className="text-sm text-gray-400">
            This candidate portfolio is currently saved as a draft and is private.
          </p>
          <Link to="/" className="mt-2">
            <Button size="sm" className="flex items-center gap-2">
              <Home size={14} />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Resolve template renderer based on active portfolio settings templateId (support preview overrides)
  const queryParams = new URLSearchParams(window.location.search);
  const previewTemplateId = queryParams.get('templateId') || queryParams.get('template');
  const templateId = previewTemplateId || publicPortfolio.templateId;
  const ActiveTemplate = TEMPLATE_MAP[templateId] || CleanStarter;

  const isLightTemplate = ['tmpl-clean-starter', 'clean-starter', 'tmpl-ink-corridor', 'ink-corridor'].includes(templateId);
  const wrapperBg = isLightTemplate 
    ? (templateId.includes('corridor') ? 'bg-[#FAF6EE]' : 'bg-[#FFFFFF]') 
    : 'bg-[#0A0A0A]';

  return (
    <div className={`min-h-screen relative flex flex-col ${wrapperBg} text-white`}>
      {/* Informative top bar if viewing as draft owner */}
      {!publicPortfolio.isPublished && isOwner && (
        <div className="bg-warning text-dark font-bold text-center py-2 px-4 text-xs flex items-center justify-center gap-2 sticky top-0 z-50">
          <EyeOff size={14} />
          <span>Viewing Private Draft Portfolio (Only visible to you)</span>
          <Link to="/dashboard" className="underline hover:opacity-85 text-xs ml-2">Open Dashboard settings to publish</Link>
        </div>
      )}

      {/* Main rendered template content */}
      <div className="flex-1 w-full flex">
        <ActiveTemplate data={publicPortfolio} />
      </div>

      {/* Floating Recruiter AI assistant */}
      {username && (
        <RecruiterChat username={username} />
      )}
    </div>
  );
};

export default PublicPortfolioPage;
