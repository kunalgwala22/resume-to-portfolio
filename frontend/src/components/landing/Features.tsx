import React from 'react';
import { Card } from '../ui/Card';
import { Upload, Cpu, Palette, MessageSquare, BarChart3, Globe } from 'lucide-react';

export const Features: React.FC = () => {
  const items = [
    {
      title: 'Zero-Code Upload',
      description: 'Drag & drop your PDF/DOCX resume. File content is processed instantly and securely in the cloud.',
      icon: Upload,
    },
    {
      title: 'OpenAI GPT-4o Parser',
      description: 'Extract skills, employment logs, educations, and social links in structured JSON format with zero inferences.',
      icon: Cpu,
    },
    {
      title: '10 Premium Templates',
      description: 'Switch between 10 pixel-perfect responsive layouts instantly, from clean light starter pages to cyberpunk consoles.',
      icon: Palette,
    },
    {
      title: 'Recruiter Chat Widget',
      description: 'An AI assistant embedded on your public page answers recruiter queries based strictly on your resume context.',
      icon: MessageSquare,
    },
    {
      title: 'Views & Device Analytics',
      description: 'Track aggregate views count, country demographics, devices, and browser metrics using interactive charts.',
      icon: BarChart3,
    },
    {
      title: 'Public Share Link',
      description: 'Share your dynamic portfolio via /portfolio/:username or connect your custom domains instantly.',
      icon: Globe,
    },
  ];

  return (
    <section className="py-20 bg-[#0C0C0C]/50 border-y border-border/40 w-full">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-display text-white">Full-Featured Portfolio Suite</h2>
          <p className="text-gray-400 mt-3 text-sm leading-relaxed">
            Everything you need to showcase your professional credentials, automate recruiter communications, and monitor engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((feat, idx) => (
            <Card key={idx} hoverable className="flex flex-col gap-4 bg-[#111827]/30 border-border/40">
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                <feat.icon size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{feat.title}</h3>
                <p className="text-gray-400 text-xs mt-2 leading-relaxed">{feat.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
