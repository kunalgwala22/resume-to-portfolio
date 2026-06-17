import React from 'react';
import { PortfolioData } from '@portfolioverse/shared';
import { Calendar, ArrowUpRight, GraduationCap, Award, ExternalLink } from 'lucide-react';

export const LinearStyle: React.FC<{ data: PortfolioData }> = ({ data }) => {
  const { user, headline, summary, skills, experiences, educations, projects, certifications, socialLinks, themeColor } = data;

  const formatDate = (d: any) => {
    if (!d) return '';
    const date = new Date(d);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#000000] text-[#8a8f98] min-h-screen font-mono text-xs w-full selection:bg-[#333333] border border-[#1f1f1f]">
      {/* Linear Style Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-sm border-b border-[#1f1f1f] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="#" className="font-bold text-white text-[11px] uppercase tracking-widest hover:opacity-85">
            {user.fullName || 'Candidate Profile'}
          </a>
          <div className="flex items-center gap-5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
            <a href="#" className="hover:text-white transition-colors">Home</a>
            {summary && <a href="#about" className="hover:text-white transition-colors">Overview</a>}
            {experiences && experiences.length > 0 && <a href="#experience" className="hover:text-white transition-colors">Career</a>}
            {projects && projects.length > 0 && <a href="#projects" className="hover:text-white transition-colors">Projects</a>}
            {skills && skills.length > 0 && <a href="#skills" className="hover:text-white transition-colors">Skills</a>}
            {((educations && educations.length > 0) || (certifications && certifications.length > 0)) && <a href="#education" className="hover:text-white transition-colors">Education</a>}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24 flex flex-col gap-16">
        
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-[#1f1f1f]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: themeColor }}></span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Workspace online</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{user.fullName || 'Candidate Profile'}</h1>
            <p className="text-[#c9d1d9] text-sm font-semibold">{headline || 'Engineering Specialist'}</p>
          </div>
          {user.avatarUrl && (
            <img 
              src={user.avatarUrl} 
              alt={user.fullName || ''} 
              className="h-16 w-16 rounded-md object-cover border border-[#1f1f1f] filter grayscale hover:grayscale-0 transition-all" 
            />
          )}
        </header>

        {/* Bio summary */}
        {summary && (
          <section id="about" className="flex flex-col gap-3 scroll-mt-20">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">// Overview</span>
            <p className="text-[#c9d1d9] leading-relaxed text-sm whitespace-pre-wrap">{summary}</p>
          </section>
        )}

        {/* Experiences */}
        {experiences && experiences.length > 0 && (
          <section id="experience" className="flex flex-col gap-6 scroll-mt-20">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">// Career Milestones</span>
            <div className="flex flex-col divide-y divide-[#1f1f1f] border border-[#1f1f1f] rounded-lg overflow-hidden bg-[#0a0a0a]">
              {experiences.map((exp, i) => (
                <div key={exp.id || i} className="p-5 flex flex-col gap-2 hover:bg-[#111111]/30 transition-colors">
                  <div className="flex justify-between items-baseline flex-wrap gap-2">
                    <span className="text-white font-bold text-sm">{exp.role}</span>
                    <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                      <Calendar size={10} />
                      {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="text-xs font-semibold" style={{ color: themeColor }}>{exp.company} {exp.location ? `[${exp.location}]` : ''}</div>
                  {exp.description && <p className="text-gray-400 leading-relaxed mt-1 text-[11px] whitespace-pre-wrap">{exp.description}</p>}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc pl-4 mt-1 flex flex-col gap-1 text-gray-400 text-[11px]">
                      {exp.achievements.map((ach, idx) => <li key={idx}>{ach}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section id="projects" className="flex flex-col gap-6 scroll-mt-20">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">// Active Projects</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj, i) => (
                <div key={proj.id || i} className="border border-[#1f1f1f] bg-[#0a0a0a] rounded-lg p-5 flex flex-col justify-between hover:border-gray-700 transition-colors">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-bold text-xs">{proj.name}</h3>
                      {proj.isFeatured && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full border border-primary/20 text-primary bg-primary/5">
                          Featured
                        </span>
                      )}
                    </div>
                    {proj.description && <p className="text-gray-450 text-[11px] mt-1 leading-normal">{proj.description}</p>}
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {proj.techStack.map((tech, idx) => (
                          <span key={idx} className="text-[9px] bg-black text-white px-2 py-0.5 rounded border border-[#1f1f1f]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 mt-5 text-[10px]">
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="font-semibold inline-flex items-center gap-0.5 hover:underline" style={{ color: themeColor }}>
                        Live Demo <ArrowUpRight size={10} />
                      </a>
                    )}
                    {proj.repoUrl && (
                      <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white font-semibold inline-flex items-center gap-0.5 hover:underline">
                        Source <ArrowUpRight size={10} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section id="skills" className="flex flex-col gap-4 scroll-mt-20">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">// Skill Matrix</span>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={skill.id || i} className="bg-[#0a0a0a] border border-[#1f1f1f] text-gray-300 px-3 py-1 rounded text-[11px] font-semibold hover:border-gray-500 cursor-default">
                  {skill.name} <span className="text-gray-600 font-bold ml-1">{skill.level}</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education & Credentials */}
        {((educations && educations.length > 0) || (certifications && certifications.length > 0)) && (
          <section id="education" className="grid grid-cols-1 md:grid-cols-2 gap-10 scroll-mt-20">
            {educations && educations.length > 0 && (
              <div className="flex flex-col gap-4">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">// Education Logs</span>
                <div className="flex flex-col gap-4">
                  {educations.map((ed, i) => (
                    <div key={ed.id || i} className="flex gap-3 bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-lg">
                      <GraduationCap className="text-gray-600 mt-0.5 flex-shrink-0" size={16} />
                      <div>
                        <h3 className="font-bold text-white">{ed.degree} {ed.field ? `[${ed.field}]` : ''}</h3>
                        <p className="text-gray-500 mt-0.5 font-medium">{ed.institution}</p>
                        <span className="text-gray-600 text-[10px] block mt-1">{formatDate(ed.startDate)} - {ed.endDate ? formatDate(ed.endDate) : 'Present'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certifications && certifications.length > 0 && (
              <div className="flex flex-col gap-4">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">// Certifications</span>
                <div className="flex flex-col gap-4">
                  {certifications.map((c, i) => (
                    <div key={c.id || i} className="flex gap-3 bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-lg">
                      <Award className="text-gray-600 mt-0.5 flex-shrink-0" size={16} />
                      <div>
                        <h3 className="font-bold text-white">{c.name}</h3>
                        <p className="text-gray-500 mt-0.5 font-medium">{c.issuer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Footer */}
        <footer className="pt-8 border-t border-[#1f1f1f] flex justify-between items-center flex-wrap gap-4 text-gray-600 text-[10px]">
          <span>© {new Date().getFullYear()} Linear workspace clone.</span>
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

export default LinearStyle;
