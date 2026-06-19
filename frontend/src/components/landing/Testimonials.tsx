import React from 'react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const list = [
    {
      name: 'Sarah Jenkins',
      role: 'Frontend Architect',
      quote: 'Built my site in under a minute. The modern developer layout matches my code editor theme perfectly and got me 3 interviews next week!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
    },
    {
      name: 'Marcus Vance',
      role: 'Principal Recruiter',
      quote: 'The integrated AI Recruiter Assistant is a game-changer. I asked direct questions about their tech stack achievements and saved hours scheduling calls.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    },
    {
      name: 'Elena Rostova',
      role: 'Product Designer',
      quote: 'Normally, generators make generic layouts. PortfolioVerse premium styles (like Apple & Glassmorphism) are pixel-perfect and look high-end.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop',
    },
  ];

  return (
    <section className="py-20 max-w-6xl mx-auto px-6 w-full">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl font-bold font-display text-white">Loved by Candidates & Recruiters</h2>
        <p className="text-gray-400 mt-3 text-sm leading-relaxed">
          See how job seekers are launching sites in seconds and recruiters are saving time screening profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {list.map((item, idx) => (
          <Card key={idx} className="bg-surface/30 border-border/40 p-6 flex flex-col justify-between gap-6 relative">
            <Quote size={24} className="text-primary/20 absolute top-6 right-6" />
            <p className="text-gray-300 text-xs leading-relaxed italic">"{item.quote}"</p>
            <div className="flex items-center gap-3 mt-4">
              <Avatar src={item.avatar} alt={item.name} size="sm" />
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white truncate">{item.name}</span>
                <span className="text-[10px] text-gray-500 truncate">{item.role}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
