import React from 'react';
import { useTemplates } from '../../hooks/useTemplates';
import { usePortfolio } from '../../hooks/usePortfolio';
import { useAuthStore } from '../../stores/auth.store';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TEMPLATES } from '../../../../packages/shared/src/constants/templates';
import { Check, Info, Palette, Sparkles, Star, Eye } from 'lucide-react';

export const TemplatesPage: React.FC = () => {
  const { templates: apiTemplates, isLoadingTemplates } = useTemplates();
  const { settings, updateSettings, isUpdatingSettings } = usePortfolio();
  const { user } = useAuthStore();

  // Combine or fallback to standard templates list to ensure 100% reliability
  const templatesList = apiTemplates.length > 0 ? apiTemplates : TEMPLATES;

  const handleSelectTemplate = async (templateId: string, defaultColor: string) => {
    try {
      await updateSettings({
        templateId,
        themeColor: defaultColor // Optionally update theme color to match default
      });
      alert('Portfolio template updated successfully!');
    } catch (err) {
      console.error('Failed to update template', err);
      alert('Failed to update portfolio template.');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5 border-b border-border/40 pb-4">
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Palette size={18} className="text-primary" />
          <span>Portfolio Templates Gallery</span>
        </h1>
        <p className="text-xs text-gray-500">
          Select from our 10 handcrafted responsive layout systems. Switching layouts preserves all parsed data.
        </p>
      </div>

      {isLoadingTemplates && apiTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm animate-pulse">Loading templates gallery...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templatesList.map((tmpl) => {
            const isActive = settings?.templateId === tmpl.id;
            const primaryColor = tmpl.themeColors && tmpl.themeColors[0] ? tmpl.themeColors[0] : '#7C3AED';

            return (
              <Card 
                key={tmpl.id} 
                className={`bg-surface/20 flex flex-col justify-between border-2 overflow-hidden transition-all duration-300 group ${
                  isActive 
                    ? 'border-primary shadow-[0_0_15px_rgba(124,58,237,0.15)] bg-primary/5' 
                    : 'border-border/40 hover:border-border/80'
                }`}
              >
                {/* Visual Header / Mockup representation */}
                <div className="h-44 relative bg-surface overflow-hidden flex items-center justify-center border-b border-border/30">
                  {/* Subtle decorative background matching theme */}
                  <div 
                    className="absolute inset-0 opacity-10 filter blur-xl transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: primaryColor }}
                  />
                  
                  {/* Dynamic Visual placeholder */}
                  <div className="z-10 flex flex-col items-center gap-2 text-center p-4">
                    <span 
                      className="text-lg font-black tracking-wider uppercase font-display select-none transition-all duration-300 group-hover:scale-105"
                      style={{ color: primaryColor }}
                    >
                      {tmpl.name}
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      {tmpl.tags?.slice(0, 3).map((tag: string, idx: number) => (
                        <span key={idx} className="text-[9px] bg-dark/60 border border-border/50 text-gray-400 px-1.5 py-0.5 rounded font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {tmpl.isPremium && (
                    <div className="absolute top-3 right-3 bg-secondary text-white border border-secondary/50 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-md">
                      <Star size={10} className="fill-white" />
                      <span>PRO</span>
                    </div>
                  )}

                  {isActive && (
                    <div className="absolute top-3 left-3 bg-primary text-white border border-primary/50 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-md">
                      <Check size={10} />
                      <span>Active</span>
                    </div>
                  )}
                </div>

                {/* Card Info Details */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors duration-200">
                        {tmpl.name}
                      </h3>
                      <span className="text-[10px] text-gray-500 font-bold uppercase font-mono">{tmpl.category}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium">
                      {tmpl.description}
                    </p>
                  </div>

                  {/* Highlights and Palette */}
                  <div className="flex flex-col gap-3">
                    {/* Features checklist */}
                    <div className="flex flex-col gap-1.5 bg-dark/25 p-2.5 rounded-lg border border-border/30">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Features Included</span>
                      {tmpl.features?.slice(0, 2).map((feat: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[10px] text-gray-300 font-medium">
                          <Check size={10} className="text-emerald-400 flex-shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Color Swatch list */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Default Palettes:</span>
                      <div className="flex items-center gap-1.5">
                        {tmpl.themeColors?.map((color: string, idx: number) => (
                          <div 
                            key={idx} 
                            className="h-3 w-3 rounded-full border border-border/60" 
                            style={{ backgroundColor: color }} 
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="mt-2 border-t border-border/20 pt-3 flex gap-2">
                    <Button 
                      onClick={() => {
                        const previewUsername = user?.username || 'johndoe';
                        window.open(`/portfolio/${previewUsername}?templateId=${tmpl.id}`, '_blank');
                      }}
                      variant="outline"
                      size="sm"
                      className="text-xs flex-1 flex items-center justify-center gap-1.5"
                    >
                      <Eye size={12} />
                      <span>Live Preview</span>
                    </Button>
                    <Button 
                      onClick={() => handleSelectTemplate(tmpl.id, primaryColor)}
                      disabled={isActive || isUpdatingSettings}
                      variant={isActive ? 'outline' : 'primary'}
                      size="sm"
                      className="text-xs flex-1 flex items-center justify-center gap-1.5"
                    >
                      {isActive ? (
                        <>
                          <Check size={12} />
                          <span>Active</span>
                        </>
                      ) : (
                        <span>Select</span>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
