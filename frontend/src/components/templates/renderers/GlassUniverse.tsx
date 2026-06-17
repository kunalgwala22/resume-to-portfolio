import React from 'react';
import { PortfolioData } from '@portfolioverse/shared';
import { Calendar, GraduationCap, Award, ExternalLink } from 'lucide-react';

export const GlassUniverse: React.FC<{ data: PortfolioData }> = ({ data }) => {
  const { user, headline, summary, skills, experiences, educations, projects, certifications, socialLinks, themeColor } = data;

  const formatDate = (d: any) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-[#030712] text-[#e5e7eb] min-h-screen relative overflow-hidden font-sans w-full">
      {/* Glassmorphic Nav Bar */}
      <nav className="sticky top-0 z-50 bg-[#030712]/75 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="#" className="font-extrabold text-white text-sm tracking-wider uppercase hover:opacity-85">
            {user.fullName || 'Candidate Profile'}
          </a>
          <div className="flex items-center gap-5 text-xs font-bold text-gray-300 tracking-wider">
            <a href="#" className="hover:text-white transition-colors">Home</a>
            {summary && <a href="#about" className="hover:text-white transition-colors">About</a>}
            {experiences && experiences.length > 0 && <a href="#experience" className="hover:text-white transition-colors">Experience</a>}
            {projects && projects.length > 0 && <a href="#projects" className="hover:text-white transition-colors">Projects</a>}
            {skills && skills.length > 0 && <a href="#skills" className="hover:text-white transition-colors">Skills</a>}
            {((educations && educations.length > 0) || (certifications && certifications.length > 0)) && <a href="#education" className="hover:text-white transition-colors">Education</a>}
          </div>
        </div>
      </nav>

      {/* Blurred background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-4xl mx-auto flex flex-col gap-12 py-16 px-6 relative z-10">
        
        {/* Header Glass Card */}
        <header className="glass-panel p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
          {user.avatarUrl && (
            <img 
              src={user.avatarUrl} 
              alt={user.fullName || ''} 
              className="h-28 w-28 md:h-32 md:w-32 rounded-2xl object-cover border border-white/10 shadow-2xl flex-shrink-0" 
            />
          )}
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight font-display">{user.fullName || 'Candidate Profile'}</h1>
            <p className="text-lg md:text-xl font-bold mt-2" style={{ color: themeColor }}>{headline || 'Professional Headline'}</p>
            {user.bio && <p className="text-[#9ca3af] text-sm mt-3 max-w-lg leading-relaxed">{user.bio}</p>}
          </div>
        </header>

        {/* Summary Card */}
        {summary && (
          <section id="about" className="glass-panel p-8 shadow-2xl flex flex-col gap-3 scroll-mt-20">
            <span className="text-xs uppercase tracking-widest text-[#9ca3af] font-bold">About Me</span>
            <p className="text-base leading-relaxed text-gray-250 font-normal whitespace-pre-wrap">{summary}</p>
          </section>
        )}

        {/* Experience Timeline */}
        {experiences && experiences.length > 0 && (
          <section id="experience" className="glass-panel p-8 shadow-2xl flex flex-col gap-6 scroll-mt-20">
            <span className="text-xs uppercase tracking-widest text-[#9ca3af] font-bold">Employment Timeline</span>
            <div className="flex flex-col gap-8">
              {experiences.map((exp, i) => (
                <div key={exp.id || i} className="flex flex-col md:flex-row gap-2 md:gap-6 border-b border-white/5 pb-6 last:border-b-0 last:pb-0">
                  <div className="md:w-1/4 flex-shrink-0">
                    <span className="text-xs text-[#9ca3af] font-semibold flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                    </span>
                    <h4 className="text-xs font-bold mt-1" style={{ color: themeColor }}>{exp.company}</h4>
                    {exp.location && <span className="text-[10px] text-gray-500 block">{exp.location}</span>}
                  </div>
                  <div className="md:w-3/4 flex flex-col gap-1.5">
                    <h3 className="text-lg font-bold text-white leading-tight">{exp.role}</h3>
                    {exp.description && <p className="text-gray-300 text-sm mt-1 whitespace-pre-wrap">{exp.description}</p>}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="list-disc pl-4 text-xs text-gray-300 mt-2 flex flex-col gap-1">
                        {exp.achievements.map((ach, idx) => <li key={idx}>{ach}</li>)}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Cards Grid */}
        {projects && projects.length > 0 && (
          <section id="projects" className="flex flex-col gap-6 scroll-mt-20">
            <span className="text-xs uppercase tracking-widest text-[#9ca3af] font-bold px-1">Featured Projects</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj, i) => (
                <div key={proj.id || i} className="glass-panel p-6 shadow-2xl flex flex-col justify-between hover:border-white/20 transition-all duration-300">
                  <div>
                    <h3 className="text-lg font-bold text-white">{proj.name}</h3>
                    {proj.description && <p className="text-gray-300 text-xs mt-2 leading-relaxed">{proj.description}</p>}
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {proj.techStack.map((tech, idx) => (
                          <span key={idx} className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 mt-5 text-xs font-semibold">
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-0.5" style={{ color: themeColor }}>
                        Live Demo <ExternalLink size={10} />
                      </a>
                    )}
                    {proj.repoUrl && (
                      <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:underline flex items-center gap-0.5">
                        GitHub <ExternalLink size={10} />
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
          <section id="skills" className="glass-panel p-8 shadow-2xl flex flex-col gap-4 scroll-mt-20">
            <span className="text-xs uppercase tracking-widest text-[#9ca3af] font-bold">Skills Matrix</span>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={skill.id || i} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-white/10 transition-colors">
                  {skill.name} <span className="text-[10px] text-gray-500 font-bold ml-1">{skill.level}</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education & Credentials */}
        {((educations && educations.length > 0) || (certifications && certifications.length > 0)) && (
          <section id="education" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-20">
            {educations && educations.length > 0 && (
              <div className="glass-panel p-6 shadow-2xl flex flex-col gap-4">
                <span className="text-xs uppercase tracking-widest text-[#9ca3af] font-bold">Education</span>
                <div className="flex flex-col gap-4">
                  {educations.map((ed, i) => (
                    <div key={ed.id || i} className="flex gap-3 text-xs">
                      <GraduationCap className="text-[#9ca3af] flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <h3 className="font-bold text-white">{ed.degree} {ed.field ? `in ${ed.field}` : ''}</h3>
                        <p className="text-gray-400 mt-0.5">{ed.institution}</p>
                        <span className="text-[10px] text-gray-500 block mt-0.5">{formatDate(ed.startDate)} - {ed.endDate ? formatDate(ed.endDate) : 'Present'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certifications && certifications.length > 0 && (
              <div className="glass-panel p-6 shadow-2xl flex flex-col gap-4">
                <span className="text-xs uppercase tracking-widest text-[#9ca3af] font-bold">Certifications</span>
                <div className="flex flex-col gap-4">
                  {certifications.map((c, i) => (
                    <div key={c.id || i} className="flex gap-3 text-xs">
                      <Award className="text-[#9ca3af] flex-shrink-0 mt-0.5" size={18} />
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
        <footer className="glass-panel px-8 py-5 shadow-2xl flex justify-between items-center flex-wrap gap-4 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} Glassmorphic space.</span>
          <div className="flex gap-4">
            {socialLinks && socialLinks.map((sl, i) => (
              <a key={sl.id || i} href={sl.url} target="_blank" rel="noopener noreferrer" className="hover:text-white font-semibold transition-colors">
                {sl.platform}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GlassUniverse;
