import React, { useState, useEffect, useRef } from 'react';
import { PortfolioData } from '@portfolioverse/shared';
import { 
  Calendar, 
  GraduationCap, 
  Award, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Mail, 
  Globe, 
  MapPin, 
  ArrowRight,
  Send,
  Heart
} from 'lucide-react';

// Scroll reveal component for hand-drawn cards to animate as they enter the viewport
const RevealCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 cubic-bezier(0.175, 0.885, 0.32, 1.275) transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const Corridor: React.FC<{ data: PortfolioData }> = ({ data }) => {
  const { 
    user = { fullName: 'Candidate Name', avatarUrl: '', bio: '' }, 
    headline = '', 
    summary = '', 
    skills = [], 
    experiences = [], 
    educations = [], 
    projects = [], 
    certifications = [], 
    socialLinks = [], 
    themeColor = '#b83b28' 
  } = data || {};

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('entrance');
  const [guestbookName, setGuestbookName] = useState('');
  const [guestbookEmail, setGuestbookEmail] = useState('');
  const [guestbookMsg, setGuestbookMsg] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track global scroll progress and active section in view
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      setScrollProgress(progress);

      // Section tracking for active states
      const sections = ['entrance', 'about', 'skills', 'projects', 'archive', 'contact'];
      const scrollPos = window.scrollY + window.innerHeight * 0.35; // offset check

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Format date helper
  const formatDate = (dateInput: any) => {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Deterministic wobbly line drawing (doesn't flicker on scroll or re-render)
  const drawWobblyLine = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    seed: number,
    jitter = 2
  ) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);

    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    const segments = Math.max(3, Math.round(len / 45));

    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      let px = x1 + dx * t;
      let py = y1 + dy * t;

      const nx = -dy / len;
      const ny = dx / len;

      // Deterministic wobble curves
      const wobble = Math.sin(t * Math.PI * 3.1 + seed * 19.7) * 
                     Math.cos(t * Math.PI * 4.9 - seed * 7.3) * jitter;

      px += nx * wobble;
      py += ny * wobble;

      ctx.lineTo(px, py);
    }
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  // 3D Corridor Background Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Vanishing point coordinates
      const cx = width / 2;
      const cy = height * 0.45;
      const sMin = 0.15; // back wall portal scale

      const wBack = width * sMin;
      const hBack = height * sMin;

      // Back portal rectangle
      const x1 = cx - wBack / 2;
      const y1 = cy - hBack / 2;
      const x2 = cx + wBack / 2;
      const y2 = cy - hBack / 2;
      const x3 = cx + wBack / 2;
      const y3 = cy + hBack / 2;
      const x4 = cx - wBack / 2;
      const y4 = cy + hBack / 2;

      ctx.strokeStyle = '#262524'; // dark ink stroke
      ctx.lineWidth = 2.2;

      // Draw portal
      drawWobblyLine(ctx, x1, y1, x2, y2, 1);
      drawWobblyLine(ctx, x2, y2, x3, y3, 2);
      drawWobblyLine(ctx, x3, y3, x4, y4, 3);
      drawWobblyLine(ctx, x4, y4, x1, y1, 4);

      // Draw perspective hallway boundary corner lines
      drawWobblyLine(ctx, x1, y1, 0, 0, 5);
      drawWobblyLine(ctx, x2, y2, width, 0, 6);
      drawWobblyLine(ctx, x3, y3, width, height, 7);
      drawWobblyLine(ctx, x4, y4, 0, height, 8);

      // Floor plank lines running towards viewer
      const floorPoints = 6;
      for (let i = 1; i < floorPoints; i++) {
        const t = i / floorPoints;
        const fxStart = x4 + (x3 - x4) * t;
        const fxEnd = width * (t - 0.5) * 1.8 + cx;
        drawWobblyLine(ctx, fxStart, y4, fxEnd, height, 20 + i, 1.2);
      }

      // Draw corridor frames/rings that zoom forward based on scrollProgress
      const numRings = 5;
      for (let k = 0; k < numRings; k++) {
        // depth loops cleanly as scrollProgress changes
        const z = ((k / numRings - scrollProgress) % 1 + 1) % 1;
        
        if (z < 0.02) continue;

        const scale = sMin + (1.25 - sMin) * Math.pow(1 - z, 3);
        if (scale > 1.3) continue;

        const rw = width * scale;
        const rh = height * scale;

        const rx1 = cx - rw / 2;
        const ry1 = cy - rh / 2;
        const rx2 = cx + rw / 2;
        const ry2 = cy - rh / 2;
        const rx3 = cx + rw / 2;
        const ry3 = cy + rh / 2;
        const rx4 = cx - rw / 2;
        const ry4 = cy + rh / 2;

        const seedOffset = k * 4;
        ctx.strokeStyle = `rgba(38, 37, 36, ${Math.max(0.05, (1 - z) * 0.9)})`;
        ctx.lineWidth = 1.2 + (1 - z) * 1.5;

        drawWobblyLine(ctx, rx1, ry1, rx2, ry2, 10 + seedOffset, 1.5);
        drawWobblyLine(ctx, rx2, ry2, rx3, ry3, 11 + seedOffset, 1.5);
        drawWobblyLine(ctx, rx3, ry3, rx4, ry4, 12 + seedOffset, 1.5);
        drawWobblyLine(ctx, rx4, ry4, rx1, ry1, 13 + seedOffset, 1.5);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollProgress]);

  // HUD Navigation map definitions
  const HUD_SECTIONS = [
    { label: 'Entrance', id: 'entrance', roomName: 'Entrance' },
    { label: 'Room 01', id: 'about', roomName: 'The Studio' },
    { label: 'Room 02', id: 'skills', roomName: 'The Workshop' },
    { label: 'Room 03', id: 'projects', roomName: 'The Gallery' },
    { label: 'Room 04', id: 'archive', roomName: 'The Archive' },
    { label: 'Room 05', id: 'contact', roomName: 'The Guestbook' }
  ];

  const handleHUDClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Submit contact guestbook
  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestbookName || !guestbookEmail || !guestbookMsg) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      setGuestbookMsg('');
    }, 1200);
  };

  // Skill dots rating helper
  const renderSkillRating = (level: string) => {
    const max = 5;
    let filled = 3;
    const l = level.toLowerCase();
    if (l.includes('expert') || l.includes('lead') || l.includes('advanced')) filled = 5;
    else if (l.includes('intermediate') || l.includes('proficient')) filled = 4;
    else if (l.includes('beginner') || l.includes('novice')) filled = 2;

    return (
      <span className="inline-flex gap-1.5 ml-2 text-md text-[#262524] font-bold">
        {Array.from({ length: max }).map((_, i) => (
          <span key={i} className="inline-block transition-transform duration-300 hover:scale-125">
            {i < filled ? '●' : '○'}
          </span>
        ))}
      </span>
    );
  };

  return (
    <div className="relative w-full bg-[#FAF6EE] text-[#1e1e1e] overflow-x-hidden selection:bg-[#f3dfc4] select-none min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Gochi+Hand&display=swap');
        
        .sketch-paper {
          background-color: #faf6ee;
          background-image: 
            linear-gradient(rgba(38, 37, 36, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(38, 37, 36, 0.04) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        
        .handwritten {
          font-family: 'Gochi Hand', cursive;
        }
        
        .sketch-font {
          font-family: 'Architects Daughter', cursive;
        }
        
        .wobbly-card {
          border: 3.5px solid #262524;
          border-radius: 255px 25px 225px 20px/20px 225px 30px 255px;
          box-shadow: 6px 6px 0px #262524;
          background-color: #ffffff;
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .wobbly-card:hover {
          transform: translateY(-2px);
          box-shadow: 8px 8px 0px #262524;
        }
        
        .wobbly-tape {
          background: rgba(244, 235, 213, 0.85);
          border-left: 1px dashed rgba(38, 37, 36, 0.15);
          border-right: 1px dashed rgba(38, 37, 36, 0.15);
          box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.04);
          transform: rotate(-2.5deg);
        }
        
        .polaroid-frame {
          border: 3.5px solid #262524;
          background-color: #ffffff;
          box-shadow: 7px 7px 0px #262524;
          padding: 14px 14px 38px 14px;
          border-radius: 3px;
        }

        .sketched-picture-frame {
          border: 7px double #262524;
          outline: 3.5px solid #262524;
          outline-offset: -12px;
          padding: 24px;
          background-color: #ffffff;
          box-shadow: 8px 8px 0px rgba(38, 37, 36, 0.9);
          border-radius: 4px;
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .sketched-picture-frame:hover {
          transform: scale(1.01) rotate(0.5deg);
          box-shadow: 10px 10px 0px rgba(38, 37, 36, 0.95);
        }
        
        .wobbly-input {
          border: none;
          border-bottom: 3.5px dashed #262524;
          background: transparent;
          font-family: 'Gochi Hand', cursive;
          font-size: 1.25rem;
          padding: 4px 6px;
        }
        .wobbly-input:focus {
          outline: none;
          border-bottom: 3.5px solid #262524;
        }
        
        .sketch-btn {
          border: 3.5px solid #262524;
          border-radius: 120px 20px 100px 15px/15px 95px 20px 110px;
          box-shadow: 4px 4px 0px #262524;
          background: #ffffff;
          font-family: 'Gochi Hand', cursive;
          transition: all 0.15s ease-in-out;
        }
        .sketch-btn:hover {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px #262524;
          background: #faf6ee;
        }
        .sketch-btn:active {
          transform: translate(4px, 4px);
          box-shadow: 0px 0px 0px #262524;
        }

        .scrolling-prompt {
          animation: bounceWobbly 2.5s ease-in-out infinite;
        }

        @keyframes bounceWobbly {
          0%, 100% { transform: translateY(0) rotate(1deg); }
          50% { transform: translateY(6px) rotate(-1deg); }
        }
      `}</style>

      {/* Grid Paper Texture Overlay (Fixed Background) */}
      <div className="fixed inset-0 w-full h-full sketch-paper pointer-events-none z-0" />

      {/* Fixed 3D Corridor Canvas Backdrop (Fixed Background) */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-10" />

      {/* SCROLLABLE HTML CONTENT FOREGROUND */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-6 pb-24 space-y-36 select-text pt-4">

        {/* =================================================== */}
        {/* ROOM 00: ENTRANCE GREETING                          */}
        {/* =================================================== */}
        <section 
          id="entrance" 
          className="min-h-[90vh] flex flex-col items-center justify-center text-center pt-12"
        >
          <span className="handwritten text-xl text-[#b83b28] mb-2 font-bold block animate-pulse">
            * welcome to the corridor – please wipe your feet
          </span>

          <h1 className="handwritten text-6xl md:text-8xl font-extrabold text-[#262524] drop-shadow-sm tracking-tight leading-none">
            {user.fullName || 'Candidate Name'}
          </h1>

          <p className="sketch-font text-2xl md:text-3xl font-semibold mt-4" style={{ color: themeColor }}>
            {headline || 'Professional Developer'}
          </p>

          <RevealCard className="w-full max-w-lg mt-8 relative">
            <div className="wobbly-card p-7 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-5.5 wobbly-tape" />
              <p className="sketch-font text-sm md:text-base leading-relaxed text-[#403e3c]">
                {user.bio || 'Welcome to my interactive hand-drawn space. Scroll down to walk through my 3D digital workspace corridor and explore projects, experience archives, and guestbook.'}
              </p>
            </div>
          </RevealCard>

          {skills.length > 0 && (
            <div className="mt-10 max-w-2xl flex flex-wrap justify-center gap-2">
              <span className="handwritten text-lg font-bold text-gray-500 mr-2 mt-1">tools in the bag:</span>
              {skills.slice(0, 8).map((sk, idx) => (
                <span 
                  key={sk.id || idx}
                  className="handwritten text-md font-extrabold border-2 border-[#262524] bg-white px-3 py-1 rounded-full"
                  style={{
                    transform: `rotate(${(idx % 3) - 1.5}deg)`,
                    boxShadow: '2.5px 2.5px 0px #262524'
                  }}
                >
                  {sk.name}
                </span>
              ))}
            </div>
          )}

          <div className="scrolling-prompt mt-16 flex flex-col items-center">
            <span className="handwritten text-xl font-bold text-[#403e3c]">the gallery is this way</span>
            <span className="text-3xl mt-1">↓</span>
          </div>
        </section>


        {/* =================================================== */}
        {/* ROOM 01: THE STUDIO (ABOUT & POLAROID)              */}
        {/* =================================================== */}
        <section id="about" className="scroll-mt-24">
          <RevealCard className="flex flex-col md:flex-row items-center gap-10">
            {/* Polaroid image */}
            <div className="flex-shrink-0 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-6 wobbly-tape z-10" />
              <div className="polaroid-frame flex flex-col items-center w-56 transform -rotate-2">
                {user.avatarUrl ? (
                  <img 
                    src={user.avatarUrl} 
                    alt={user.fullName || 'User Avatar'} 
                    className="w-48 h-48 object-cover border border-[#262524]/20 grayscale hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <div className="w-48 h-48 bg-[#faf6ee] border-2 border-dashed border-[#262524]/30 flex flex-col items-center justify-center p-4 text-center">
                    <span className="handwritten text-lg text-gray-400">sketched photo of developer</span>
                  </div>
                )}
                <span className="handwritten text-lg font-bold text-[#403e3c] mt-4 tracking-tight rotate-1">
                  me.png (in the studio)
                </span>
              </div>
            </div>

            {/* About Card */}
            <div className="flex-grow w-full">
              <div className="wobbly-card p-8 relative">
                <div className="absolute -top-6 left-6 border-2 border-b-0 border-[#262524] bg-white px-4 py-0.5 rounded-t-lg handwritten text-sm font-bold">
                  room 01
                </div>
                <h2 className="handwritten text-4xl font-extrabold text-[#262524] mb-4">The Studio</h2>
                <p className="sketch-font text-sm leading-relaxed text-[#403e3c] whitespace-pre-wrap">
                  {summary || "Hi, I'm glad you made it. I specialize in designing and engineering premium, creative, and accessible applications. I love sketching digital concepts, combining clean code with rich interactions to make websites feel organic, playful, and alive."}
                </p>

                {socialLinks.length > 0 && (
                  <div className="mt-6 pt-5 border-t-2 border-dashed border-[#262524]/25 flex flex-wrap gap-3">
                    {socialLinks.map((sl, idx) => (
                      <a 
                        key={sl.id || idx}
                        href={sl.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sketch-btn px-4 py-1.5 text-md font-extrabold flex items-center gap-1.5"
                      >
                        {sl.platform.toLowerCase() === 'github' && <Github size={14} />}
                        {sl.platform.toLowerCase() === 'linkedin' && <Linkedin size={14} />}
                        {sl.platform.toLowerCase() === 'email' && <Mail size={14} />}
                        {!['github', 'linkedin', 'email'].includes(sl.platform.toLowerCase()) && <Globe size={14} />}
                        <span>{sl.platform}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </RevealCard>
        </section>


        {/* =================================================== */}
        {/* ROOM 02: THE WORKSHOP (SKILLS)                     */}
        {/* =================================================== */}
        <section id="skills" className="scroll-mt-24">
          <RevealCard>
            <div className="wobbly-card p-8 relative bg-white">
              <div className="absolute -top-6 right-6 border-2 border-b-0 border-[#262524] bg-white px-4 py-0.5 rounded-t-lg handwritten text-sm font-bold">
                room 02
              </div>
              <h2 className="handwritten text-4xl font-extrabold text-[#262524] mb-1">The Workshop</h2>
              <p className="sketch-font text-xs text-[#b83b28] mb-6 font-bold">
                * hand-drawn rating indicator grid: solid dots (●) represent proficiency
              </p>

              {skills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                  {skills.map((sk, idx) => (
                    <div 
                      key={sk.id || idx} 
                      className="flex items-center justify-between border-b border-dashed border-[#262524]/15 pb-2"
                    >
                      <span className="sketch-font text-sm font-bold text-[#262524]">{sk.name}</span>
                      <div className="flex items-center">
                        {renderSkillRating(sk.level)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center handwritten text-lg text-gray-400">
                  No tools listed inside the workshop currently.
                </div>
              )}

              <div className="absolute -bottom-8 -right-4 w-40 p-2 bg-[#fdf6e2] border-2 border-[#262524] shadow-sm transform rotate-2 text-center handwritten text-xs font-bold leading-tight">
                * constantly reading docs and learning!
              </div>
            </div>
          </RevealCard>
        </section>


        {/* =================================================== */}
        {/* ROOM 03: THE GALLERY (PROJECTS)                     */}
        {/* =================================================== */}
        <section id="projects" className="scroll-mt-24 space-y-12">
          <div className="flex justify-between items-baseline mb-4">
            <h2 className="handwritten text-4xl font-extrabold text-[#262524]">The Gallery</h2>
            <span className="handwritten text-md text-[#b83b28] font-bold">[ room 03 ]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects && projects.length > 0 ? (
              projects.map((proj, idx) => (
                <RevealCard key={proj.id || idx} className="relative">
                  {/* Sketched hanging wire */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-16 h-12 pointer-events-none">
                    <svg className="w-full h-full text-[#262524]" viewBox="0 0 64 48" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M32 0 L10 44 M32 0 L54 44" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="32" cy="2" r="2.5" fill="currentColor" />
                    </svg>
                  </div>

                  {/* Picture frame container */}
                  <div className="sketched-picture-frame p-6 flex flex-col justify-between h-[320px]">
                    <div>
                      <span className="handwritten text-xs text-[#b83b28] font-bold uppercase tracking-wider block mb-1">
                        Exhibit {idx + 1}
                      </span>
                      <h3 className="handwritten text-3xl font-extrabold text-[#262524] mb-2 leading-tight">
                        {proj.name}
                      </h3>
                      <p className="sketch-font text-xs leading-relaxed text-[#403e3c] mt-2 line-clamp-4 overflow-hidden">
                        {proj.description || 'A beautiful sketched project application showing portfolio details, dynamic database linkages, and responsive components.'}
                      </p>

                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {proj.techStack.slice(0, 4).map((tech, i) => (
                            <span 
                              key={i} 
                              className="handwritten text-xs font-bold border border-[#262524] px-2 py-0.5 rounded rotate-[1deg] bg-[#FAF9F5]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4 mt-5 pt-3 border-t border-dashed border-[#262524]/20">
                      {proj.liveUrl && (
                        <a 
                          href={proj.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="sketch-btn px-4 py-1.5 text-md font-extrabold flex items-center gap-1.5"
                          style={{ color: themeColor }}
                        >
                          <span>Live Demo</span>
                          <ExternalLink size={14} />
                        </a>
                      )}
                      {proj.repoUrl && (
                        <a 
                          href={proj.repoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="sketch-btn px-4 py-1.5 text-md font-extrabold text-gray-500 hover:text-[#262524] flex items-center gap-1.5"
                        >
                          <span>Repository</span>
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Handwritten placard caption */}
                  <div className="absolute -bottom-6 left-6 border border-[#262524] bg-white shadow-sm px-2.5 py-0.5 text-[11px] handwritten font-bold text-gray-400 rotate-[-1deg]">
                    {proj.name.toLowerCase().replace(/\s+/g, '_')}.js, ink on canvas
                  </div>
                </RevealCard>
              ))
            ) : (
              <div className="col-span-2 text-center py-10 wobbly-card p-6 handwritten text-xl text-gray-400">
                The gallery hangs empty for now.
              </div>
            )}
          </div>
        </section>


        {/* =================================================== */}
        {/* ROOM 04: THE ARCHIVE (EXPERIENCES & EDUCATION)     */}
        {/* =================================================== */}
        <section id="archive" className="scroll-mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left page - Experience */}
          <RevealCard>
            <div className="wobbly-card p-8 relative bg-white h-full">
              <div className="absolute -top-6 left-6 border-2 border-b-0 border-[#262524] bg-white px-4 py-0.5 rounded-t-lg handwritten text-sm font-bold">
                room 04 (left page)
              </div>
              <h2 className="handwritten text-4xl font-extrabold text-[#262524] mb-5">Work Archives</h2>

              {experiences && experiences.length > 0 ? (
                <div className="flex flex-col gap-6 max-h-[380px] overflow-y-auto pr-2">
                  {experiences.map((exp, idx) => (
                    <div key={exp.id || idx} className="flex flex-col gap-1 border-b border-dashed border-[#262524]/10 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="handwritten text-xl font-bold text-[#262524] leading-tight">{exp.role}</h3>
                        <span className="handwritten text-sm text-[#b83b28] font-bold flex-shrink-0">
                          {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <h4 className="sketch-font text-xs font-semibold text-gray-500">
                        {exp.company} {exp.location ? `• ${exp.location}` : ''}
                      </h4>
                      {exp.description && (
                        <p className="sketch-font text-[11px] leading-relaxed text-[#403e3c] mt-1.5">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center handwritten text-lg text-gray-400">
                  The logs in this archive are currently blank.
                </div>
              )}
            </div>
          </RevealCard>

          {/* Right page - Education */}
          <RevealCard>
            <div className="wobbly-card p-8 relative bg-white h-full">
              <div className="absolute -top-6 right-6 border-2 border-b-0 border-[#262524] bg-white px-4 py-0.5 rounded-t-lg handwritten text-sm font-bold">
                room 04 (right page)
              </div>
              <h2 className="handwritten text-4xl font-extrabold text-[#262524] mb-5">Studies & Certs</h2>

              <div className="flex flex-col gap-6 max-h-[380px] overflow-y-auto pr-2">
                {educations && educations.length > 0 ? (
                  educations.map((ed, idx) => (
                    <div key={ed.id || idx} className="flex gap-2 border-b border-dashed border-[#262524]/10 pb-4 last:border-0 last:pb-0">
                      <GraduationCap className="text-[#b83b28] flex-shrink-0 mt-1" size={18} />
                      <div>
                        <h3 className="handwritten text-lg font-bold text-[#262524] leading-tight">
                          {ed.degree} {ed.field ? `in ${ed.field}` : ''}
                        </h3>
                        <p className="sketch-font text-xs text-gray-500 mt-1">
                          {ed.institution} • {ed.startDate ? new Date(ed.startDate).getFullYear() : ''} - {ed.endDate ? new Date(ed.endDate).getFullYear() : 'Present'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center handwritten text-md text-gray-400">No education logs.</div>
                )}

                {certifications && certifications.length > 0 && (
                  <div className="mt-4 pt-4 border-t-2 border-dashed border-[#262524]/10">
                    <h4 className="handwritten text-xl font-bold text-[#262524] mb-3">Certifications</h4>
                    <div className="flex flex-col gap-2.5">
                      {certifications.map((cert, idx) => (
                        <div key={cert.id || idx} className="flex items-center gap-2 text-xs">
                          <Award className="text-[#b83b28] flex-shrink-0" size={15} />
                          <span className="sketch-font font-bold text-gray-700">{cert.name}</span>
                          {cert.issuer && <span className="text-gray-400">({cert.issuer})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </RevealCard>
        </section>


        {/* =================================================== */}
        {/* ROOM 05: THE GUESTBOOK (CONTACT FORM)               */}
        {/* =================================================== */}
        <section id="contact" className="scroll-mt-24 max-w-xl mx-auto w-full">
          <RevealCard>
            <div className="wobbly-card p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-5.5 wobbly-tape" />
              
              <div className="text-center mb-6">
                <span className="handwritten text-[#b83b28] text-sm font-bold uppercase tracking-wider block">
                  Final Room 05
                </span>
                <h2 className="handwritten text-4xl font-extrabold text-[#262524] mt-0.5">The Guestbook</h2>
                <p className="sketch-font text-xs text-gray-500 mt-1">
                  Leave a signature/message to contact the author
                </p>
              </div>

              {formSubmitted ? (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="text-4xl text-[#b83b28] animate-bounce">✍️</div>
                  <h3 className="handwritten text-2xl font-bold text-[#262524] mt-4">Signature Recorded!</h3>
                  <p className="sketch-font text-sm text-[#403e3c] mt-2 max-w-sm">
                    Thank you for signing my guestbook. Your message has traveled down the corridor and reached my inbox!
                  </p>
                  <button 
                    onClick={() => setFormSubmitted(false)}
                    className="sketch-btn px-6 py-1.5 text-md font-bold mt-6"
                  >
                    Sign Again
                  </button>
                </div>
              ) : (
                <form onSubmit={handleGuestbookSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-0.5">
                    <label className="handwritten text-lg font-bold text-[#262524]">Your Name</label>
                    <input 
                      type="text" 
                      value={guestbookName}
                      onChange={(e) => setGuestbookName(e.target.value)}
                      placeholder="e.g. John Doe"
                      required
                      className="wobbly-input w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <label className="handwritten text-lg font-bold text-[#262524]">Your Email</label>
                    <input 
                      type="email" 
                      value={guestbookEmail}
                      onChange={(e) => setGuestbookEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      required
                      className="wobbly-input w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <label className="handwritten text-lg font-bold text-[#262524]">Leave a note...</label>
                    <textarea 
                      value={guestbookMsg}
                      onChange={(e) => setGuestbookMsg(e.target.value)}
                      placeholder="Write your message here..."
                      rows={3}
                      required
                      className="wobbly-input w-full resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="sketch-btn py-2 text-xl font-bold mt-3 flex items-center justify-center gap-2 w-full disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Signing...' : 'Sign Guestbook'}</span>
                    <Send size={15} />
                  </button>
                </form>
              )}

              <div className="text-center mt-6 pt-4 border-t border-dashed border-[#262524]/10 handwritten text-xs text-gray-400 flex items-center justify-center gap-1 select-none">
                <span>Hand-drawn with love</span>
                <Heart size={10} className="text-[#b83b28] fill-[#b83b28]" />
                <span>in 2026.</span>
              </div>
            </div>
          </RevealCard>
        </section>

      </div>

      {/* =================================================== */}
      {/* FLOATING HUD MINIMAP (FLOATING NAVIGATION)          */}
      {/* =================================================== */}
      <div 
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 bg-white/70 backdrop-blur-sm border-2 border-[#262524] rounded-xl p-4 shadow-sm w-36 pointer-events-auto transform transition-all hover:scale-105 hidden md:block"
        style={{
          boxShadow: '3px 3px 0px #262524',
          borderRadius: '16px 4px 14px 4px/4px 14px 4px 16px'
        }}
      >
        <span className="handwritten text-xs font-bold text-gray-400 block text-center border-b border-dashed border-[#262524]/10 pb-1 mb-3">
          corridor map
        </span>
        
        <div className="relative flex flex-col gap-4 ml-1">
          <div className="absolute left-2.5 top-2 bottom-2 w-0 border-l-2 border-dashed border-[#262524]/20" />

          {/* Map Room pointer */}
          <div 
            className="absolute left-0 w-5 h-5 text-lg font-bold select-none transition-all duration-200"
            style={{
              transform: `translateY(${scrollProgress * (HUD_SECTIONS.length - 1) * 32}px)`,
              top: '2px',
              left: '-2px'
            }}
          >
            ☞
          </div>

          {/* Map Rooms list */}
          {HUD_SECTIONS.map((sec, idx) => {
            const isActive = activeSection === sec.id;

            return (
              <button 
                key={idx}
                onClick={() => handleHUDClick(sec.id)}
                className="flex items-center gap-2 group text-left cursor-pointer"
              >
                <div 
                  className={`w-4 h-4 rounded-full border-2 border-[#262524] bg-white z-10 transition-colors ${
                    isActive ? 'bg-[#b83b28]' : 'group-hover:bg-[#f3dfc4]'
                  }`}
                />
                <div className="flex flex-col leading-none">
                  <span className={`handwritten text-xs font-bold ${isActive ? 'text-[#b83b28] scale-105' : 'text-gray-500'}`}>
                    {sec.label}
                  </span>
                  <span className="handwritten text-[9px] text-gray-400 font-bold group-hover:block hidden transition-all">
                    {sec.roomName}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
    </div>
  );
};

export default Corridor;
