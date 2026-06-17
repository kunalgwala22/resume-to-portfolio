import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative py-20 sm:py-28 text-center max-w-5xl mx-auto px-6 flex flex-col items-center gap-6 animate-fadeIn">
      {/* Sparkle badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
        <Sparkles size={12} />
        <span>AI-powered Portfolio Builder</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-display leading-[1.1] max-w-3xl">
        Generate Your Premium Portfolio in <span className="bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent">60 Seconds</span>
      </h1>

      {/* Subtitle */}
      <p className="text-gray-400 text-lg sm:text-xl max-w-2xl font-normal leading-relaxed mt-2">
        Upload your resume (PDF/DOCX) and let our AI compile structured data, auto-fill details, and launch a stunning personal website with an integrated recruiter chatbot.
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
        <Link to="/register">
          <Button size="lg" className="flex items-center gap-2" rightIcon={<ArrowRight size={16} />}>
            Create My Portfolio
          </Button>
        </Link>
        <Link to="/login">
          <Button variant="outline" size="lg">
            Try Demo Sandbox
          </Button>
        </Link>
      </div>

      {/* Badges footer */}
      <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 mt-12 text-sm text-gray-400 font-semibold border-t border-border/40 pt-10 w-full">
        <span className="flex items-center gap-1.5"><Zap size={16} className="text-[#F59E0B]" /> AI-Powered Text Parser</span>
        <span className="flex items-center gap-1.5"><Sparkles size={16} className="text-[#06B6D4]" /> 10 Premium Layouts</span>
        <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-[#10B981]" /> Per-user Data Isolation</span>
      </div>
    </section>
  );
};

export default Hero;
