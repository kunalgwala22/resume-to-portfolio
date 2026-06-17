import React from 'react';
import { PortfolioData } from '@portfolioverse/shared';
import { Terminal, Calendar, Award, GraduationCap, ChevronRight, ExternalLink } from 'lucide-react';

export const Cyberpunk: React.FC<{ data: PortfolioData }> = ({ data }) => {
  const { user, headline, summary, skills, experiences, educations, projects, certifications, socialLinks, themeColor } = data;

  const formatDate = (d: any) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }).toUpperCase();
  };

  return (
    <div className="bg-[#0b0c10] text-[#45f3ff] min-h-screen font-mono text-xs w-full relative selection:bg-[#ff007f]/30 border-t-4" style={{ borderTopColor: themeColor }}>
      {/* Cyberpunk Neon Nav */}
      <nav className="sticky top-0 z-50 bg-[#0b0c10]/95 backdrop-blur-sm border-b border-[#1f2330] px-6 py-4 shadow-[0_0_15px_rgba(69,243,255,0.15)] select-none">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="#" className="font-black text-white text-xs uppercase tracking-widest hover:text-[#45f3ff] transition-colors">
            {user.fullName || 'User Profile'}::SYS
          </a>
          <div className="flex items-center gap-4 text-[10px] font-bold text-[#45f3ff] tracking-wider uppercase">
            <a href="#" className="hover:text-white hover:shadow-[0_0_10px_#45f3ff] transition-all py-1 px-2 border border-transparent hover:border-[#45f3ff]/30">Home</a>
            {summary && <a href="#about" className="hover:text-white hover:shadow-[0_0_10px_#45f3ff] transition-all py-1 px-2 border border-transparent hover:border-[#45f3ff]/30">Directive</a>}
            {experiences && experiences.length > 0 && <a href="#experience" className="hover:text-white hover:shadow-[0_0_10px_#45f3ff] transition-all py-1 px-2 border border-transparent hover:border-[#45f3ff]/30">Chronology</a>}
            {projects && projects.length > 0 && <a href="#projects" className="hover:text-white hover:shadow-[0_0_10px_#45f3ff] transition-all py-1 px-2 border border-transparent hover:border-[#45f3ff]/30">Modules</a>}
            {skills && skills.length > 0 && <a href="#skills" className="hover:text-white hover:shadow-[0_0_10px_#45f3ff] transition-all py-1 px-2 border border-transparent hover:border-[#45f3ff]/30">Capabilities</a>}
            {((educations && educations.length > 0) || (certifications && certifications.length > 0)) && <a href="#education" className="hover:text-white hover:shadow-[0_0_10px_#45f3ff] transition-all py-1 px-2 border border-transparent hover:border-[#45f3ff]/30">Accreditation</a>}
          </div>
        </div>
      </nav>

      {/* Background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2330_1px,transparent_1px),linear-gradient(to_bottom,#1f2330_1px,transparent_1px)] bg-[size:32px_32px] opacity-10 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto flex flex-col gap-12 py-16 px-6 relative z-10">
        
        {/* Terminal Header */}
        <header className="border border-[#1f2330] bg-[#0b0c10]/90 p-6 shadow-[0_0_15px_rgba(31,35,48,0.3)]">
          <div className="flex items-center justify-between border-b border-[#1f2330] pb-3 mb-6">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-[#ff007f]" />
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">SYSTEM_INITIALIZED // NODE_ONLINE</span>
            </div>
            <span className="text-[9px] text-[#ff007f] font-bold">VER_4.92</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            {user.avatarUrl && (
              <img 
                src={user.avatarUrl} 
                alt={user.fullName || ''} 
                className="h-24 w-24 rounded-none object-cover border-2 filter saturate-50 contrast-125" 
                style={{ borderColor: themeColor }}
              />
            )}
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center justify-center md:justify-start gap-2">
                <span>{user.fullName || 'User Profile'}</span>
                <span className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: themeColor }}></span>
              </h1>
              <p className="text-sm font-bold uppercase mt-2 tracking-wide" style={{ color: themeColor }}>
                &gt; {headline || 'Cyber Agent'}
              </p>
              {user.bio && <p className="text-gray-400 text-[11px] mt-3 max-w-lg leading-normal">{user.bio}</p>}
            </div>
          </div>
        </header>

        {/* Summary bio description */}
        {summary && (
          <section id="about" className="border border-[#1f2330] bg-[#0b0c10]/90 p-6 scroll-mt-20">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3 block">// CORE_DIRECTIVE.TXT</span>
            <p className="text-white leading-relaxed text-xs whitespace-pre-wrap">{summary}</p>
          </section>
        )}

        {/* Experience log */}
        {experiences && experiences.length > 0 && (
          <section id="experience" className="flex flex-col gap-4 scroll-mt-20">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold pl-1">// CHRONOLOGY_LOGS</span>
            <div className="flex flex-col gap-4">
              {experiences.map((exp, i) => (
                <div key={exp.id || i} className="border border-[#1f2330] bg-[#0b0c10]/95 p-6 hover:border-[#ff007f]/40 transition-colors">
                  <div className="flex justify-between items-baseline flex-wrap gap-2 border-b border-[#1f2330] pb-2 mb-3">
                    <h3 className="text-white font-bold text-sm uppercase">{exp.role}</h3>
                    <span className="text-[9px] text-[#ff007f] font-bold flex items-center gap-1">
                      <Calendar size={10} />
                      {formatDate(exp.startDate)} — {exp.isCurrent ? 'ACTIVE' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold uppercase" style={{ color: themeColor }}>{exp.company} {exp.location ? `[${exp.location.toUpperCase()}]` : ''}</h4>
                  {exp.description && <p className="text-gray-400 text-xs mt-3 leading-relaxed whitespace-pre-wrap">{exp.description}</p>}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-none mt-3 flex flex-col gap-1.5 text-gray-400 pl-0">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                          <ChevronRight size={12} className="text-[#ff007f] mt-0.5 flex-shrink-0" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects grid */}
        {projects && projects.length > 0 && (
          <section id="projects" className="flex flex-col gap-4 scroll-mt-20">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold pl-1">// EXECUTABLE_MODULES</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj, i) => (
                <div key={proj.id || i} className="border border-[#1f2330] bg-[#0b0c10]/95 p-5 flex flex-col justify-between hover:border-[#45f3ff]/40 transition-colors">
                  <div>
                    <h3 className="text-white font-bold text-xs uppercase flex items-center justify-between">
                      <span>{proj.name}</span>
                      {proj.isFeatured && <span className="text-[8px] bg-[#ff007f]/15 border border-[#ff007f]/30 text-[#ff007f] px-2 py-0.5 rounded">Featured</span>}
                    </h3>
                    {proj.description && <p className="text-gray-450 text-[11px] mt-2 leading-normal">{proj.description}</p>}
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-4">
                        {proj.techStack.map((tech, idx) => (
                          <span key={idx} className="text-[8px] bg-black text-[#45f3ff] px-2 py-0.5 border border-[#1f2330]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 mt-5 text-[9px] font-bold">
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-0.5" style={{ color: themeColor }}>
                        LOAD_DEMO.EXE <ExternalLink size={10} />
                      </a>
                    )}
                    {proj.repoUrl && (
                      <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white hover:underline flex items-center gap-0.5">
                        SRC_CODE.SH <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills matrix */}
        {skills && skills.length > 0 && (
          <section id="skills" className="border border-[#1f2330] bg-[#0b0c10]/90 p-6 scroll-mt-20">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4 block">// PROTOCOL_CAPABILITIES</span>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={skill.id || i} className="bg-black border border-[#1f2330] text-gray-300 px-3 py-1.5 rounded hover:border-[#45f3ff] transition-colors cursor-default">
                  {skill.name} :: <span className="text-[#ff007f] font-bold text-[9px]">{skill.level}</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education & Certs */}
        {((educations && educations.length > 0) || (certifications && certifications.length > 0)) && (
          <section id="education" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-20">
            {educations && educations.length > 0 && (
              <div className="border border-[#1f2330] bg-[#0b0c10]/90 p-6">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4 block">// EDUCATIONAL_RECORDS</span>
                <div className="flex flex-col gap-4">
                  {educations.map((ed, i) => (
                    <div key={ed.id || i} className="flex gap-3 text-[11px]">
                      <GraduationCap className="text-[#ff007f] flex-shrink-0 mt-0.5" size={16} />
                      <div>
                        <h3 className="font-bold text-white uppercase">{ed.degree} {ed.field ? `[${ed.field}]` : ''}</h3>
                        <p className="text-gray-400 mt-0.5">{ed.institution}</p>
                        <span className="text-[9px] text-gray-500 block mt-0.5">{formatDate(ed.startDate)} — {ed.endDate ? formatDate(ed.endDate) : 'PRESENT'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certifications && certifications.length > 0 && (
              <div className="border border-[#1f2330] bg-[#0b0c10]/90 p-6">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4 block">// SYSTEM_ACCREDITATIONS</span>
                <div className="flex flex-col gap-4">
                  {certifications.map((c, i) => (
                    <div key={c.id || i} className="flex gap-3 text-[11px]">
                      <Award className="text-[#ff007f] flex-shrink-0 mt-0.5" size={16} />
                      <div>
                        <h3 className="font-bold text-white uppercase">{c.name}</h3>
                        <p className="text-gray-400 mt-0.5">{c.issuer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Footer */}
        <footer className="border border-[#1f2330] bg-[#0b0c10]/95 px-6 py-4 flex justify-between items-center flex-wrap gap-4 text-gray-600 text-[9px] font-bold">
          <span>PORTFOLIO_SYSTEM // SECURE_CONGESTION</span>
          <div className="flex gap-4">
            {socialLinks && socialLinks.map((sl, i) => (
              <a key={sl.id || i} href={sl.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                {sl.platform.toUpperCase()}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Cyberpunk;
