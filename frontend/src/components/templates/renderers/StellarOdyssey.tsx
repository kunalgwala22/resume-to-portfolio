import React from 'react';
import { PortfolioData } from '@portfolioverse/shared';
import { Calendar, GraduationCap, Award, ExternalLink } from 'lucide-react';

export const StellarOdyssey: React.FC<{ data: PortfolioData }> = ({ data }) => {
  const { user, headline, summary, skills, experiences, educations, projects, certifications, socialLinks, themeColor } = data;

  const formatDate = (d: any) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-[#0b0c1b] text-[#b3b9d1] min-h-screen relative overflow-hidden font-sans w-full">
      {/* Galaxy backdrop shapes */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Sleek Golden Stellar Odyssey Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0b0c1b]/85 backdrop-blur-md border-b border-[#d4af37]/20 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="#about" className="font-extrabold text-white text-xs tracking-widest uppercase hover:text-[#d4af37] transition-colors">
            {user.fullName || 'Odyssey'}
          </a>
          <div className="flex items-center gap-6 text-[10px] font-bold tracking-widest uppercase text-gray-400">
            <a href="#about" className="hover:text-white transition-colors">Scope</a>
            {experiences && experiences.length > 0 && <a href="#experience" className="hover:text-white transition-colors">Chronicles</a>}
            {projects && projects.length > 0 && <a href="#projects" className="hover:text-white transition-colors">Celestial</a>}
            {skills && skills.length > 0 && <a href="#skills" className="hover:text-white transition-colors">Knowledge</a>}
            {((educations && educations.length > 0) || (certifications && certifications.length > 0)) && (
              <a href="#education" className="hover:text-white transition-colors">Log</a>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto flex flex-col gap-12 relative z-10 py-16 px-6">
        
        {/* Header */}
        <header id="about" className="scroll-mt-24 border-b border-[#d4af37]/30 pb-10 flex flex-col md:flex-row items-center gap-8">
          {user.avatarUrl && (
            <img 
              src={user.avatarUrl} 
              alt={user.fullName || ''} 
              className="h-28 w-28 md:h-32 md:w-32 rounded-full object-cover border-2 border-[#d4af37] shadow-xl flex-shrink-0" 
            />
          )}
          <div className="text-center md:text-left flex-grow">
            <span className="text-[9px] uppercase tracking-widest text-[#d4af37] font-bold">The Odyssey of</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display mt-1">{user.fullName || 'User Profile'}</h1>
            <p className="text-lg font-bold mt-2" style={{ color: themeColor }}>{headline || 'Creative Specialist'}</p>
            {user.bio && <p className="text-gray-400 text-xs mt-3 max-w-lg leading-relaxed">{user.bio}</p>}
          </div>
        </header>

        {/* Summary */}
        {summary && (
          <section className="flex flex-col gap-3">
            <span className="text-[9px] uppercase tracking-widest text-[#d4af37] font-bold">Philosophical Scope</span>
            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{summary}</p>
          </section>
        )}

        {/* Experience log */}
        {experiences && experiences.length > 0 && (
          <section id="experience" className="scroll-mt-24 flex flex-col gap-6">
            <span className="text-[9px] uppercase tracking-widest text-[#d4af37] font-bold">Chronicles & Experience</span>
            <div className="flex flex-col gap-6">
              {experiences.map((exp, i) => (
                <div key={exp.id || i} className="border-l border-[#d4af37]/30 pl-4 py-1 flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline flex-wrap gap-2">
                    <h3 className="text-white font-bold text-base">{exp.role}</h3>
                    <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                      <Calendar size={10} />
                      {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-[#d4af37]">{exp.company} {exp.location ? `• ${exp.location}` : ''}</h4>
                  {exp.description && <p className="text-gray-450 text-xs mt-2 whitespace-pre-wrap">{exp.description}</p>}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc pl-4 mt-2 text-xs text-gray-450 flex flex-col gap-1">
                      {exp.achievements.map((ach, idx) => <li key={idx}>{ach}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Cards */}
        {projects && projects.length > 0 && (
          <section id="projects" className="scroll-mt-24 flex flex-col gap-6">
            <span className="text-[9px] uppercase tracking-widest text-[#d4af37] font-bold">Celestial Projects</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj, i) => (
                <div key={proj.id || i} className="bg-[#0b0c1b]/50 border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:border-[#d4af37]/50 transition-colors shadow-lg">
                  <div>
                    <h3 className="text-white font-bold text-sm flex items-center justify-between">
                      <span>{proj.name}</span>
                      {proj.isFeatured && <span className="text-[8px] bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] px-2 py-0.5 rounded">Featured</span>}
                    </h3>
                    {proj.description && <p className="text-gray-400 text-xs mt-2 leading-relaxed">{proj.description}</p>}
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-4">
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
                      <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-0.5" style={{ color: themeColor }}>
                        Live Link <ExternalLink size={10} />
                      </a>
                    )}
                    {proj.repoUrl && (
                      <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white hover:underline flex items-center gap-0.5">
                        Code <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Tag grid */}
        {skills && skills.length > 0 && (
          <section id="skills" className="scroll-mt-24 flex flex-col gap-4">
            <span className="text-[9px] uppercase tracking-widest text-[#d4af37] font-bold">Knowledge Core</span>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={skill.id || i} className="bg-[#0b0c1b]/50 border border-white/5 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-semibold hover:border-[#d4af37]/50 transition-colors">
                  {skill.name} <span className="text-[#d4af37] text-[9px] font-bold ml-1">{skill.level}</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education & Credentials */}
        {((educations && educations.length > 0) || (certifications && certifications.length > 0)) && (
          <section id="education" className="scroll-mt-24 grid grid-cols-1 md:grid-cols-2 gap-6">
            {educations && educations.length > 0 && (
              <div className="flex flex-col gap-4">
                <span className="text-[9px] uppercase tracking-widest text-[#d4af37] font-bold">Academic</span>
                <div className="flex flex-col gap-4">
                  {educations.map((ed, i) => (
                    <div key={ed.id || i} className="flex gap-3 text-xs bg-[#0b0c1b]/50 border border-white/5 p-4 rounded-xl">
                      <GraduationCap className="text-[#d4af37] flex-shrink-0 mt-0.5" size={16} />
                      <div>
                        <h3 className="font-bold text-white">{ed.degree} {ed.field ? `in ${ed.field}` : ''}</h3>
                        <p className="text-gray-400 mt-0.5">{ed.institution}</p>
                        <span className="text-[9px] text-gray-500 block mt-0.5">{formatDate(ed.startDate)} - {ed.endDate ? formatDate(ed.endDate) : 'Present'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certifications && certifications.length > 0 && (
              <div className="flex flex-col gap-4">
                <span className="text-[9px] uppercase tracking-widest text-[#d4af37] font-bold">Certifications</span>
                <div className="flex flex-col gap-4">
                  {certifications.map((c, i) => (
                    <div key={c.id || i} className="flex gap-3 text-xs bg-[#0b0c1b]/50 border border-white/5 p-4 rounded-xl">
                      <Award className="text-[#d4af37] flex-shrink-0 mt-0.5" size={16} />
                      <div>
                        <h3 className="font-bold text-white">{c.name}</h3>
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
        <footer className="border-t border-[#d4af37]/30 pt-8 flex justify-between items-center flex-wrap gap-4 text-[9px] text-gray-500 font-bold">
          <span>STELLAR ENGINE v1.0</span>
          <div className="flex gap-4">
            {socialLinks && socialLinks.map((sl, i) => (
              <a key={sl.id || i} href={sl.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                {sl.platform}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default StellarOdyssey;
