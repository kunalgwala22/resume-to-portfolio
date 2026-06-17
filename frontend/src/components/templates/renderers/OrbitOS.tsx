import React, { useState, useEffect, useRef } from 'react';
import { PortfolioData } from '@portfolioverse/shared';
import { 
  Calendar, 
  GraduationCap, 
  Award, 
  Compass, 
  Star, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Mail, 
  Globe, 
  MapPin, 
  ChevronRight 
} from 'lucide-react';

// Starfield Background component using vanilla HTML5 Canvas for performance and zero external dependencies
const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars: { x: number; y: number; size: number; speed: number; phase: number }[] = [];
    const numStars = 100;
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.05 + 0.01,
        phase: Math.random() * Math.PI
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let animationId: number;
    const render = () => {
      ctx.fillStyle = '#030310';
      ctx.fillRect(0, 0, width, height);

      // Draw faint background nebula glow
      const grad = ctx.createRadialGradient(width/2, height/2, 10, width/2, height/2, Math.max(width, height));
      grad.addColorStop(0, 'rgba(10, 10, 30, 0.4)');
      grad.addColorStop(0.5, 'rgba(5, 5, 20, 0.2)');
      grad.addColorStop(1, 'rgba(2, 2, 8, 0.5)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw stars with pulsing twinkle
      stars.forEach(star => {
        const twinkle = Math.sin(Date.now() * 0.001 * star.speed * 80 + star.phase) * 0.45 + 0.55;
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.8})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
        ctx.fill();

        // Slow float up
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

// 3D Spatial Identity Core using WebGL-inspired canvas wireframe projection
const SpatialCore: React.FC<{ color: string; scale?: number }> = ({ color, scale = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = 380);
    let height = (canvas.height = 380);

    // Generate sphere points
    const points: { x: number; y: number; z: number }[] = [];
    const numPoints = 85;
    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(-1 + (2 * i) / numPoints);
      const theta = Math.sqrt(numPoints * Math.PI) * phi;
      points.push({
        x: Math.cos(theta) * Math.sin(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(phi)
      });
    }

    // Handle mouse move to rotate
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseRef.current.targetX = x * 0.003;
      mouseRef.current.targetY = y * 0.003;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let angleX = 0.005;
    let angleY = 0.008;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Damp mouse rotation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const currentAngleX = angleX + mouseRef.current.y;
      const currentAngleY = angleY + mouseRef.current.x;

      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);
      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);

      // Rotate and project points
      const rotatedPoints = points.map(p => {
        // Y rotation
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;
        // X rotation
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        return { x: x1, y: y2, z: z2 };
      });

      const radius = 120 * scale;
      const projPoints = rotatedPoints.map(p => {
        const distance = 2.4;
        const factor = radius / (distance - p.z);
        return {
          x: width / 2 + p.x * factor,
          y: height / 2 + p.y * factor,
          z: p.z
        };
      });

      // Draw wireframe grid lines
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projPoints.length; i++) {
        for (let j = i + 1; j < projPoints.length; j++) {
          const dx = rotatedPoints[i].x - rotatedPoints[j].x;
          const dy = rotatedPoints[i].y - rotatedPoints[j].y;
          const dz = rotatedPoints[i].z - rotatedPoints[j].z;
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          
          // Connect points that are close
          if (dist < 0.45) {
            ctx.beginPath();
            ctx.moveTo(projPoints[i].x, projPoints[i].y);
            ctx.lineTo(projPoints[j].x, projPoints[j].y);
            
            // Fade lines in background
            const alpha = Math.min(1, Math.max(0.05, (rotatedPoints[i].z + rotatedPoints[j].z + 2.0) / 4.0));
            ctx.strokeStyle = color.replace('1)', `${alpha * 0.35})`);
            ctx.stroke();
          }
        }
      }

      // Draw projected nodes
      projPoints.forEach((p, idx) => {
        const size = Math.max(0.5, (rotatedPoints[idx].z + 1.2) * 1.6) * scale;
        const alpha = Math.min(1, Math.max(0.1, (rotatedPoints[idx].z + 1.2) / 2.2));
        ctx.fillStyle = color.replace('1)', `${alpha * 0.95})`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, 2 * Math.PI);
        ctx.fill();
      });

      // Slow idle spin
      angleX += 0.0003;
      angleY += 0.0005;

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [color, scale]);

  return <canvas ref={canvasRef} className="max-w-full max-h-full pointer-events-none drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]" />;
};

// Define 6 beautiful spatial theme presets
const THEME_PRESETS = [
  { id: 'cyan', name: 'Spatial Blue', value: 'rgba(6, 182, 212, 1)', glow: 'rgba(6, 182, 212, 0.4)', textClass: 'text-cyan-400', borderClass: 'border-cyan-500/20', bgGlowClass: 'bg-cyan-500/10' },
  { id: 'purple', name: 'Nebula Violet', value: 'rgba(168, 85, 247, 1)', glow: 'rgba(168, 85, 247, 0.4)', textClass: 'text-purple-400', borderClass: 'border-purple-500/20', bgGlowClass: 'bg-purple-500/10' },
  { id: 'emerald', name: 'Aurora Green', value: 'rgba(16, 185, 129, 1)', glow: 'rgba(16, 185, 129, 0.4)', textClass: 'text-emerald-400', borderClass: 'border-emerald-500/20', bgGlowClass: 'bg-emerald-500/10' },
  { id: 'amber', name: 'Solar Gold', value: 'rgba(245, 158, 11, 1)', glow: 'rgba(245, 158, 11, 0.4)', textClass: 'text-amber-400', borderClass: 'border-amber-500/20', bgGlowClass: 'bg-amber-500/10' },
  { id: 'rose', name: 'Supernova Pink', value: 'rgba(244, 63, 94, 1)', glow: 'rgba(244, 63, 94, 0.4)', textClass: 'text-rose-400', borderClass: 'border-rose-500/20', bgGlowClass: 'bg-rose-500/10' },
  { id: 'white', name: 'Cosmic Silver', value: 'rgba(243, 244, 246, 1)', glow: 'rgba(243, 244, 246, 0.4)', textClass: 'text-gray-200', borderClass: 'border-gray-500/20', bgGlowClass: 'bg-gray-500/10' }
];

export const OrbitOS: React.FC<{ data: PortfolioData }> = ({ data }) => {
  const { user, headline, summary, skills, experiences, educations, projects, certifications, socialLinks, themeColor } = data;
  const [activeModule, setActiveModule] = useState('hub');
  
  // Find matching default preset or default to first
  const initialPreset = THEME_PRESETS.find(p => p.value.includes(themeColor)) || THEME_PRESETS[0];
  const [activeTheme, setActiveTheme] = useState(initialPreset);

  const formatDate = (d: any) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  // Nav Modules definition
  const modulesList = [
    { id: 'hub', label: 'Hub' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' }
  ];

  // Helper to get platform icon
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github': return <Github size={13} />;
      case 'linkedin': return <Linkedin size={13} />;
      case 'email':
      case 'mail': return <Mail size={13} />;
      default: return <Globe size={13} />;
    }
  };

  return (
    <div className="bg-[#030310] text-[#b4b4d8] min-h-screen relative overflow-hidden font-sans w-full flex flex-col justify-between selection:bg-white/10 select-none">
      {/* 1. Animated Backdrop */}
      <Starfield />

      {/* 2. Live Theme Presets Controller (Top Right Corner) */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-2 bg-black/40 border border-white/10 rounded-full px-3.5 py-1.5 backdrop-blur-lg shadow-xl">
        <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Presets:</span>
        <div className="flex gap-1.5">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setActiveTheme(preset)}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                activeTheme.id === preset.id ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'
              }`}
              style={{
                backgroundColor: preset.value,
                boxShadow: activeTheme.id === preset.id ? `0 0 10px ${preset.value}` : 'none'
              }}
              title={preset.name}
            />
          ))}
        </div>
      </div>

      {/* 3. Main Workspace Container */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-20 flex flex-col items-center justify-center relative z-10">
        
        {/* === A. SPATIAL HUB HOME VIEW === */}
        {activeModule === 'hub' && (
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto animate-fadeIn relative">
            
            {/* 3D mesh surrounding Avatar */}
            <div className="relative w-72 h-72 flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <SpatialCore color={activeTheme.value} scale={1.25} />
              </div>
              
              {user.avatarUrl && (
                <div className="relative w-36 h-36 rounded-full overflow-hidden border border-white/10 p-1 bg-black/25 backdrop-blur-sm shadow-2xl">
                  <img 
                    src={user.avatarUrl} 
                    alt={user.fullName || ''} 
                    className="w-full h-full rounded-full object-cover filter brightness-105 saturate-110" 
                  />
                </div>
              )}
            </div>

            {/* Candidate Identity details */}
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight font-display mb-1.5 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {user.fullName || 'Candidate Profile'}
            </h1>
            <p className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: activeTheme.value }}>
              {headline || 'Stellar Engineer'}
            </p>
            {user.bio && (
              <p className="text-[#8e8ea8] text-sm leading-relaxed max-w-lg mb-6 whitespace-pre-wrap px-4">
                {user.bio}
              </p>
            )}

            {/* Social pills (holographic styles matching the screenshot) */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {socialLinks && socialLinks.map((sl, i) => (
                <a 
                  key={sl.id || i} 
                  href={sl.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-lg backdrop-blur-md"
                >
                  {getSocialIcon(sl.platform)}
                  <span className="capitalize">{sl.platform}</span>
                </a>
              ))}
              <a 
                href={`mailto:${user.username}@example.com`} 
                className="flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-lg backdrop-blur-md"
              >
                <Mail size={13} />
                <span>Email</span>
              </a>
            </div>

            {/* Location tag */}
            {user.bio ? (
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-8">
                <MapPin size={12} style={{ color: activeTheme.value }} />
                <span>San Francisco, CA</span>
              </div>
            ) : null}

            {/* Floating Navigation cue */}
            <div className="text-[10px] tracking-widest uppercase font-bold text-gray-500 flex items-center gap-1.5 animate-pulse">
              <span>Select a module to explore</span>
              <ChevronRight size={12} />
            </div>
          </div>
        )}

        {/* === B. ACTIVE MODULE DOCKS (VISION-PRO FLOATING WINDOWS) === */}
        {activeModule !== 'hub' && (
          <div className="w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-12 animate-slideUp">
            
            {/* Floating active glassmorphism card */}
            <div className="flex-1 w-full max-w-2xl bg-black/40 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all duration-300">
              
              {/* Outer decorative line showing dynamic theme color */}
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ backgroundColor: activeTheme.value }} />
              
              {/* Window Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Compass size={14} className="animate-spin" style={{ color: activeTheme.value, animationDuration: '10s' }} />
                  <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400">
                    System // {activeModule}
                  </span>
                </div>
                <button 
                  onClick={() => setActiveModule('hub')} 
                  className="text-[10px] uppercase font-bold text-gray-500 hover:text-white transition-colors"
                >
                  [ Close Module ]
                </button>
              </div>

              {/* Module Content Viewport */}
              <div className="max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
                
                {/* 1. About section */}
                {activeModule === 'about' && (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">// Model Synapse Summary</span>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Design & Core Philosophy.</h2>
                    </div>
                    {summary ? (
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{summary}</p>
                    ) : (
                      <p className="text-gray-500 italic text-sm">No summary log files uploaded in active resume model.</p>
                    )}
                  </div>
                )}

                {/* 2. Experience section */}
                {activeModule === 'experience' && (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    <div className="flex flex-col gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">// Professional Chronicles Log</span>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Work Experience.</h2>
                    </div>
                    {experiences && experiences.length > 0 ? (
                      <div className="flex flex-col gap-6">
                        {experiences.map((exp, i) => (
                          <div key={exp.id || i} className="border-l border-white/10 pl-4 py-1.5 flex flex-col gap-1.5 hover:border-white/30 transition-colors">
                            <div className="flex justify-between items-baseline flex-wrap gap-2">
                              <h3 className="text-white font-bold text-base">{exp.role}</h3>
                              <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                                <Calendar size={10} />
                                {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold" style={{ color: activeTheme.value }}>{exp.company} {exp.location ? `• ${exp.location}` : ''}</h4>
                            {exp.description && <p className="text-[#8e8ea8] text-xs mt-2 leading-relaxed whitespace-pre-wrap">{exp.description}</p>}
                            {exp.achievements && exp.achievements.length > 0 && (
                              <ul className="list-disc pl-4 mt-2 text-xs text-[#8e8ea8] flex flex-col gap-1">
                                {exp.achievements.map((ach, idx) => <li key={idx}>{ach}</li>)}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm">No professional log entries found.</p>
                    )}
                  </div>
                )}

                {/* 3. Projects section */}
                {activeModule === 'projects' && (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    <div className="flex flex-col gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">// Active Stellar Modules</span>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Featured Projects.</h2>
                    </div>
                    {projects && projects.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects.map((proj, i) => (
                          <div key={proj.id || i} className="bg-white/5 border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all duration-300">
                            <div>
                              <h3 className="text-white font-bold text-sm flex items-center justify-between">
                                <span>{proj.name}</span>
                                {proj.isFeatured && <Star size={12} style={{ color: activeTheme.value, fill: activeTheme.value }} />}
                              </h3>
                              {proj.description && <p className="text-[#8e8ea8] text-xs mt-2 leading-relaxed">{proj.description}</p>}
                              {proj.techStack && proj.techStack.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-4">
                                  {proj.techStack.map((tech, idx) => (
                                    <span key={idx} className="text-[9px] bg-black/40 text-gray-300 px-2 py-0.5 rounded border border-white/5">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-4 mt-5 text-[10px] font-bold">
                              {proj.liveUrl && (
                                <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-0.5" style={{ color: activeTheme.value }}>
                                  Telemetry Link <ExternalLink size={10} />
                                </a>
                              )}
                              {proj.repoUrl && (
                                <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white hover:underline flex items-center gap-0.5">
                                  Repository <ExternalLink size={10} />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm">No project modules configured.</p>
                    )}
                  </div>
                )}

                {/* 4. Skills section */}
                {activeModule === 'skills' && (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    <div className="flex flex-col gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">// Cognition Constellation</span>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Core Competencies.</h2>
                    </div>
                    {skills && skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2.5">
                        {skills.map((skill, i) => (
                          <span key={skill.id || i} className="bg-white/5 border border-white/5 px-4 py-2 rounded-xl text-xs font-semibold hover:border-white/20 transition-all flex items-center gap-1.5 cursor-default">
                            <span>{skill.name}</span>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeTheme.value }} />
                            <span className="text-[9px] text-gray-500 font-bold uppercase">{skill.level}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm">No skills mapped.</p>
                    )}
                  </div>
                )}

                {/* 5. Education & Certs section */}
                {activeModule === 'education' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                    {educations && educations.length > 0 && (
                      <div className="flex flex-col gap-4">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">// Academic Logs</span>
                        <div className="flex flex-col gap-4">
                          {educations.map((ed, i) => (
                            <div key={ed.id || i} className="flex gap-3 bg-white/5 border border-white/5 p-4 rounded-2xl">
                              <GraduationCap className="text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                              <div>
                                <h3 className="font-bold text-white text-xs leading-normal">{ed.degree} {ed.field ? `in ${ed.field}` : ''}</h3>
                                <p className="text-gray-500 mt-0.5 text-[11px] font-semibold">{ed.institution}</p>
                                <span className="text-[9px] text-gray-600 block mt-1">{formatDate(ed.startDate)} - {ed.endDate ? formatDate(ed.endDate) : 'Present'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {certifications && certifications.length > 0 && (
                      <div className="flex flex-col gap-4">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">// System Credentials</span>
                        <div className="flex flex-col gap-4">
                          {certifications.map((c, i) => (
                            <div key={c.id || i} className="flex gap-3 bg-white/5 border border-white/5 p-4 rounded-2xl">
                              <Award className="text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                              <div>
                                <h3 className="font-bold text-white text-xs leading-normal">{c.name}</h3>
                                <p className="text-gray-500 mt-0.5 text-[11px] font-semibold">{c.issuer}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Orbiting Identity Core floats next to active module window */}
            <div className="w-56 h-56 md:w-72 md:h-72 flex items-center justify-center flex-shrink-0 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <SpatialCore color={activeTheme.value} scale={1.05} />
              </div>
              
              {user.avatarUrl && (
                <div className="relative w-28 h-28 rounded-full overflow-hidden border border-white/10 p-0.5 bg-black/20 backdrop-blur-sm shadow-xl">
                  <img 
                    src={user.avatarUrl} 
                    alt={user.fullName || ''} 
                    className="w-full h-full rounded-full object-cover filter brightness-105 saturate-110" 
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Spatial Navigation bar (Vision-Pro Inspired Tabs) */}
      <nav className="relative z-30 max-w-2xl mx-auto w-full px-6 pb-8">
        <div className="border border-white/10 bg-[#050515]/90 rounded-full py-2.5 px-3.5 flex justify-between items-center backdrop-blur-lg shadow-2xl relative overflow-x-auto gap-2">
          {modulesList.map((mod) => {
            const isActive = activeModule === mod.id;
            
            // Check if section actually contains data to avoid showing empty links
            if (mod.id === 'experience' && (!experiences || experiences.length === 0)) return null;
            if (mod.id === 'projects' && (!projects || projects.length === 0)) return null;
            if (mod.id === 'skills' && (!skills || skills.length === 0)) return null;
            if (mod.id === 'education' && (!educations || educations.length === 0) && (!certifications || certifications.length === 0)) return null;
            if (mod.id === 'about' && !summary) return null;

            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`text-xs font-semibold px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap flex items-center gap-1.5 ${
                  isActive 
                    ? 'text-white shadow-lg border border-white/10' 
                    : 'text-gray-400 hover:text-white'
                }`}
                style={isActive ? { 
                  backgroundColor: activeTheme.glow,
                  boxShadow: `0 0 15px ${activeTheme.glow}`
                } : {}}
              >
                {mod.id === 'hub' && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeTheme.value }} />}
                <span>{mod.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default OrbitOS;
