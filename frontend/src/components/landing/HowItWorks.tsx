import React from 'react';
import { Upload, Cpu, Layout, Globe } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Upload Document',
      description: 'Upload your existing resume file in PDF or Word format to our secure cloud folder.',
      icon: Upload,
    },
    {
      num: '02',
      title: 'AI Data Extraction',
      description: 'OpenAI GPT-4o parses your details, sorting skills, experiences, and social tags in real-time.',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Select Premium Style',
      description: 'Pick from 10 dynamic styles, adjust hex themes, and preview changes instantly in the editor.',
      icon: Layout,
    },
    {
      num: '04',
      title: 'Launch & AI Chat',
      description: 'Go live on a public link. Recruiters can view stats and converse with your custom AI chat assistant.',
      icon: Globe,
    },
  ];

  return (
    <section className="py-20 bg-[#0C0C0C]/50 border-t border-border/40 w-full">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-display text-white">How It Works</h2>
          <p className="text-gray-400 mt-3 text-sm leading-relaxed">
            Four simple steps to go from a standard text document to a premium, AI-assisted portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col gap-4 relative">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <step.icon size={20} />
                </div>
                <span className="text-2xl font-black text-gray-800 select-none font-display">{step.num}</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
                <p className="text-gray-400 text-xs mt-2 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
