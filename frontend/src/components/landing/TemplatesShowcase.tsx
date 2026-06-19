import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { TEMPLATES } from '../../../../packages/shared/src/constants/templates';
import { Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

export const TemplatesShowcase: React.FC = () => {
  // Show first 3 templates for preview on the landing page
  const showcaseTemplates = TEMPLATES.slice(0, 3);

  return (
    <section className="py-20 max-w-6xl mx-auto px-6 w-full">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl font-bold font-display text-white">Choose from 10 Premium Templates</h2>
        <p className="text-gray-400 mt-3 text-sm leading-relaxed">
          Switch layouts instantly with a single click. Every template is fully responsive, accessible, and fast-loading.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {showcaseTemplates.map((tmpl) => (
          <Card key={tmpl.id} className="flex flex-col gap-4 bg-surface/30 border-border/40 p-5 overflow-hidden justify-between">
            <div className="flex flex-col gap-3">
              {/* Mock Preview container */}
              <div className="h-44 bg-dark rounded-lg border border-border/40 flex items-center justify-center relative group overflow-hidden">
                <span className="text-[#06b6d4] font-mono text-[10px]">&lt; {tmpl.name} Preview /&gt;</span>
                <div className="absolute inset-0 bg-[#000000]/65 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Link to="/register">
                    <Button size="sm" variant="secondary" className="flex items-center gap-1">
                      <Eye size={12} /> Live Preview
                    </Button>
                  </Link>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white">{tmpl.name}</h3>
                  {tmpl.isPremium ? (
                    <Badge variant="warning">Premium</Badge>
                  ) : (
                    <Badge variant="outline">Free</Badge>
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-2 leading-relaxed">{tmpl.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mt-3">
              {tmpl.tags.map((tag, i) => (
                <span key={i} className="text-[9px] bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-12">
        <Link to="/register">
          <Button variant="outline" size="md">
            View All 10 Templates
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default TemplatesShowcase;
