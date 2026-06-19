import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../hooks/usePortfolio';
import { aiApi } from '../../api/ai.api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { 
  Settings, 
  Sparkles, 
  Save, 
  Globe, 
  Search, 
  Sliders, 
  Layout, 
  Loader2
} from 'lucide-react';

export const PortfolioSettings: React.FC = () => {
  const { settings, updateSettings, isUpdatingSettings, isLoadingSettings } = usePortfolio();

  // Form states
  const [title, setTitle] = useState('');
  const [headline, setHeadline] = useState('');
  const [summary, setSummary] = useState('');
  const [themeColor, setThemeColor] = useState('#7C3AED');
  const [customDomain, setCustomDomain] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  // Sync settings when fetched
  useEffect(() => {
    if (settings) {
      setTitle(settings.title || '');
      setHeadline(settings.headline || '');
      setSummary(settings.summary || '');
      setThemeColor(settings.themeColor || '#7C3AED');
      setCustomDomain(settings.customDomain || '');
      setSeoTitle(settings.seoTitle || '');
      setSeoDescription(settings.seoDescription || '');
    }
  }, [settings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({
        title,
        headline: headline || null,
        summary: summary || null,
        themeColor,
        customDomain: customDomain || '',
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
      });
      alert('Portfolio settings saved and updated live!');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update settings. Check fields validation.');
    }
  };

  const handleAIGenerateBio = async () => {
    setIsGeneratingBio(true);
    try {
      const generatedBio = await aiApi.generateBio();
      setSummary(generatedBio);
    } catch (err) {
      console.error('Failed to generate bio using AI', err);
      alert('AI Bio generation failed. Make sure your active resume has completed parsing.');
    } finally {
      setIsGeneratingBio(false);
    }
  };

  if (isLoadingSettings) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm animate-pulse">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col gap-1.5 border-b border-border/40 pb-4">
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Settings size={18} className="text-primary" />
          <span>Portfolio Configuration</span>
        </h1>
        <p className="text-xs text-gray-500">
          Configure headers, SEO optimization metadata, color themes, and custom domain integrations.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Main Info Columns */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Header info */}
            <Card className="bg-surface/20 border-border/40 p-6 flex flex-col gap-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-border/20 pb-2">
                <Layout size={14} className="text-primary" />
                <span>Page Layout Content</span>
              </h2>

              <div className="flex flex-col gap-4">
                <Input 
                  label="Portfolio Title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. John Doe | Full Stack Engineer"
                  required
                />
                
                <Input 
                  label="Headline / Tagline" 
                  value={headline} 
                  onChange={(e) => setHeadline(e.target.value)} 
                  placeholder="e.g. Building distributed systems & cloud platforms"
                />

                <div className="flex flex-col gap-1.5 relative">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-gray-400 font-semibold">Professional Summary / Bio</label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleAIGenerateBio}
                      disabled={isGeneratingBio}
                      className="text-primary hover:bg-primary/5 p-1 h-7 text-[10px] flex items-center gap-1 font-bold"
                    >
                      {isGeneratingBio ? (
                        <>
                          <Loader2 size={10} className="animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={10} />
                          <span>AI Bio Sync</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea 
                    value={summary} 
                    onChange={(e) => setSummary(e.target.value)} 
                    placeholder="Provide a detailed professional bio or sync from parsed resume experiences using AI."
                    rows={6}
                  />
                </div>
              </div>
            </Card>

            {/* SEO Optimization */}
            <Card className="bg-surface/20 border-border/40 p-6 flex flex-col gap-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-border/20 pb-2">
                <Search size={14} className="text-secondary" />
                <span>SEO & Discovery Tags</span>
              </h2>

              <div className="flex flex-col gap-4">
                <Input 
                  label="Search Engine Title (SEO Title)" 
                  value={seoTitle} 
                  onChange={(e) => setSeoTitle(e.target.value)} 
                  placeholder="e.g. John Doe - Senior Cloud Engineer Portfoliio"
                />
                
                <Textarea 
                  label="Search Engine Description" 
                  value={seoDescription} 
                  onChange={(e) => setSeoDescription(e.target.value)} 
                  placeholder="Provide a short description (1-2 sentences) optimized for Google search snippets."
                  rows={3}
                />
              </div>
            </Card>
          </div>

          {/* Right sidebar style cards */}
          <div className="flex flex-col gap-6">
            {/* Custom Domain */}
            <Card className="bg-surface/20 border-border/40 p-5 flex flex-col gap-3">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Globe size={13} className="text-emerald-400" />
                <span>Domain Options</span>
              </h2>
              <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                Map your custom top-level domain to your portfolioverse page. Point your CNAME record to our server IP.
              </p>
              <Input 
                value={customDomain} 
                onChange={(e) => setCustomDomain(e.target.value)} 
                placeholder="portfolio.yourname.com"
                className="text-xs"
              />
            </Card>

            {/* Design Tuning */}
            <Card className="bg-surface/20 border-border/40 p-5 flex flex-col gap-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" />
                <span>Theme Colors</span>
              </h2>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    id="theme-color-input" 
                    value={themeColor} 
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="h-10 w-10 border border-border rounded cursor-pointer bg-dark"
                  />
                  <div className="flex-1">
                    <Input 
                      value={themeColor} 
                      onChange={(e) => setThemeColor(e.target.value)} 
                      className="text-xs font-mono uppercase"
                      placeholder="#7C3AED"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  {['#7C3AED', '#06B6D4', '#10B981', '#EF4444', '#F59E0B', '#EC4899', '#3B82F6', '#5E6AD2'].map((color) => (
                    <button 
                      key={color} 
                      type="button" 
                      className={`h-6 w-6 rounded-full border transition-all duration-150 ${themeColor === color ? 'border-white scale-110 shadow-sm' : 'border-border/60 hover:scale-105'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setThemeColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Save Buttons */}
            <Button 
              type="submit" 
              isLoading={isUpdatingSettings} 
              leftIcon={<Save size={16} />}
              fullWidth
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PortfolioSettings;
