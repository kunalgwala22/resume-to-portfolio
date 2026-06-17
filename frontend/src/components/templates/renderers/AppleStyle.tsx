import React from 'react';
import { PortfolioData } from '@portfolioverse/shared';
import { ChevronRight, ArrowUpRight, GraduationCap, Award } from 'lucide-react';

export const AppleStyle: React.FC<{ data: PortfolioData }> = ({ data }) => {
  const { user, headline, summary, skills, experiences, educations, projects, certifications, socialLinks, themeColor } = data;

  const formatDate = (d: any) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-[#f5f5f7] text-[#1d1d1f] min-h-screen font-sans antialiased selection:bg-slate-300 w-full">
      {/* Sticky Apple-Style Nav */}
      <nav className="sticky top-0 z-50 bg-[#f5f5f7]/80 backdrop-blur-md border-b border-[#d2d2d7] px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="#" className="font-bold text-[#1d1d1f] text-sm tracking-tight hover:opacity-85">
            {user.fullName || 'Candidate Name'}
          </a>
          <div className="flex items-center gap-6 text-xs font-medium text-[#515154]">
            <a href="#" className="hover:text-[#1d1d1f] transition-colors">Home</a>
            {summary && <a href="#about" className="hover:text-[#1d1d1f] transition-colors">About</a>}
            {experiences && experiences.length > 0 && <a href="#experience" className="hover:text-[#1d1d1f] transition-colors">Work</a>}
            {projects && projects.length > 0 && <a href="#projects" className="hover:text-[#1d1d1f] transition-colors">Projects</a>}
            {skills && skills.length > 0 && <a href="#skills" className="hover:text-[#1d1d1f] transition-colors">Skills</a>}
            {((educations && educations.length > 0) || (certifications && certifications.length > 0)) && <a href="#education" className="hover:text-[#1d1d1f] transition-colors">Education</a>}
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="bg-white py-24 sm:py-32 border-b border-[#d2d2d7]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-[#86868b] font-bold">Introducing</span>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-[#1d1d1f] tracking-tight mt-2 font-display leading-[1.05]">
              {user.fullName || 'Candidate Name'}
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-[#86868b] mt-4 tracking-tight leading-relaxed">
              {headline || 'Professional Headline'}
            </p>
            {user.bio && <p className="text-base text-[#515154] mt-6 max-w-lg leading-relaxed">{user.bio}</p>}
          </div>
          {user.avatarUrl && (
            <img 
              src={user.avatarUrl} 
              alt={user.fullName || ''} 
              className="h-36 w-36 sm:h-44 sm:w-44 rounded-full object-cover border border-[#d2d2d7] shadow-xl flex-shrink-0" 
            />
          )}
        </div>
      </section>

      {/* Summary */}
      {summary && (
        <section id="about" className="py-20 max-w-4xl mx-auto px-6 text-center scroll-mt-20">
          <span className="text-xs uppercase tracking-widest text-[#86868b] font-bold">Design Philosophy</span>
          <p className="text-2xl sm:text-3xl font-medium text-[#1d1d1f] mt-4 tracking-tight leading-relaxed whitespace-pre-wrap">
            "{summary}"
          </p>
        </section>
      )}

      {/* Experience */}
      {experiences && experiences.length > 0 && (
        <section id="experience" className="py-16 max-w-5xl mx-auto px-6 scroll-mt-20">
          <h2 className="text-3xl font-bold text-[#1d1d1f] tracking-tight mb-8">Work Experience.</h2>
          <div className="flex flex-col gap-6">
            {experiences.map((exp, i) => (
              <div key={exp.id || i} className="bg-white p-8 rounded-2xl border border-[#e5e5ea] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-baseline flex-wrap gap-2 mb-2">
                  <h3 className="text-xl font-bold text-[#1d1d1f]">{exp.role}</h3>
                  <span className="text-xs text-[#86868b] font-semibold">{formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}</span>
                </div>
                <h4 className="text-base font-semibold" style={{ color: themeColor }}>{exp.company} {exp.location ? `• ${exp.location}` : ''}</h4>
                {exp.description && <p className="text-[#515154] text-sm mt-3 leading-relaxed whitespace-pre-wrap">{exp.description}</p>}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-none mt-4 text-sm text-[#515154] flex flex-col gap-2 pl-0">
                    {exp.achievements.map((ach, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <ChevronRight size={16} className="text-[#86868b] mt-0.5 flex-shrink-0" />
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

      {/* Projects Grid */}
      {projects && projects.length > 0 && (
        <section id="projects" className="py-16 max-w-5xl mx-auto px-6 scroll-mt-20">
          <h2 className="text-3xl font-bold text-[#1d1d1f] tracking-tight mb-8">Featured Projects.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj, i) => (
              <div key={proj.id || i} className="bg-white rounded-2xl border border-[#e5e5ea] overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div className="p-8">
                  <span className="text-[10px] uppercase tracking-widest text-[#86868b] font-bold">Project</span>
                  <h3 className="text-xl font-bold text-[#1d1d1f] mt-1">{proj.name}</h3>
                  {proj.description && <p className="text-[#515154] text-sm mt-3 leading-relaxed">{proj.description}</p>}
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {proj.techStack.map((tech, idx) => (
                        <span key={idx} className="text-xs bg-[#f5f5f7] text-[#1d1d1f] px-2.5 py-1 rounded-full font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="px-8 py-5 border-t border-[#f5f5f7] flex justify-end gap-4 bg-[#f5f5f7]/30">
                  {proj.liveUrl && (
                    <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold inline-flex items-center gap-0.5 hover:underline" style={{ color: themeColor }}>
                      Visit Website <ArrowUpRight size={12} />
                    </a>
                  )}
                  {proj.repoUrl && (
                    <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f] inline-flex items-center gap-0.5 hover:underline">
                      Github <ArrowUpRight size={12} />
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
        <section id="skills" className="py-16 max-w-5xl mx-auto px-6 scroll-mt-20">
          <h2 className="text-3xl font-bold text-[#1d1d1f] tracking-tight mb-8">Skills.</h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, i) => (
              <span key={skill.id || i} className="bg-white border border-[#e5e5ea] px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:border-[#86868b] transition-colors">
                {skill.name} <span className="text-[#86868b] text-[10px] ml-1 font-bold">{skill.level}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certifications */}
      {((educations && educations.length > 0) || (certifications && certifications.length > 0)) && (
        <section id="education" className="py-16 max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 scroll-mt-20">
          {educations && educations.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6">Education.</h2>
              <div className="flex flex-col gap-6">
                {educations.map((ed, i) => (
                  <div key={ed.id || i} className="bg-white p-6 rounded-2xl border border-[#e5e5ea] flex gap-4">
                    <GraduationCap className="text-[#86868b] flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h3 className="font-bold text-[#1d1d1f] text-base">{ed.degree} {ed.field ? `in ${ed.field}` : ''}</h3>
                      <p className="text-sm text-[#86868b] mt-1 font-medium">{ed.institution}</p>
                      <span className="text-xs text-[#86868b] font-medium block mt-1">{formatDate(ed.startDate)} - {ed.endDate ? formatDate(ed.endDate) : 'Present'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications && certifications.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6">Certifications.</h2>
              <div className="flex flex-col gap-6">
                {certifications.map((c, i) => (
                  <div key={c.id || i} className="bg-white p-6 rounded-2xl border border-[#e5e5ea] flex gap-4">
                    <Award className="text-[#86868b] flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h3 className="font-bold text-[#1d1d1f] text-base">{c.name}</h3>
                      <p className="text-sm text-[#86868b] mt-1 font-medium">{c.issuer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-[#d2d2d7] mt-16 text-center text-sm text-[#86868b]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-6">
          <div className="flex gap-6 flex-wrap justify-center">
            {socialLinks && socialLinks.map((sl, i) => (
              <a key={sl.id || i} href={sl.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#1d1d1f] font-semibold transition-colors">
                {sl.platform}
              </a>
            ))}
          </div>
          <p className="text-xs">© {new Date().getFullYear()} Designed with Apple minimalism guidelines.</p>
        </div>
      </footer>
    </div>
  );
};

export default AppleStyle;
