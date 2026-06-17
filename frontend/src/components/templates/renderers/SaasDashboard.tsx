import React from 'react';
import { PortfolioData } from '@portfolioverse/shared';
import { Briefcase, Folder, User, FileSpreadsheet, ArrowUpRight, GraduationCap, Award } from 'lucide-react';

export const SaasDashboard: React.FC<{ data: PortfolioData }> = ({ data }) => {
  const { user, headline, summary, skills, experiences, educations, projects, certifications, socialLinks, themeColor } = data;

  const formatDate = (d: any) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-[#f8fafc] text-[#334155] min-h-screen font-sans antialiased selection:bg-indigo-150 w-full">
      {/* Top dashboard control bar */}
      <header className="bg-white border-b border-[#e2e8f0] px-6 py-4 sticky top-0 z-10 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.fullName || ''} className="w-10 h-10 rounded-lg object-cover border border-[#cbd5e1]" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-indigo-550 flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: themeColor }}>
              {user.username.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800">{user.fullName || 'Candidate Profile'}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">System Operational</span>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
          <a href="#" className="hover:text-slate-800 transition-colors">Dashboard</a>
          {summary && <a href="#about" className="hover:text-slate-800 transition-colors">About</a>}
          {experiences && experiences.length > 0 && <a href="#experience" className="hover:text-slate-800 transition-colors">Experience</a>}
          {projects && projects.length > 0 && <a href="#projects" className="hover:text-slate-800 transition-colors">Projects</a>}
          {skills && skills.length > 0 && <a href="#skills" className="hover:text-slate-800 transition-colors">Skills</a>}
          {((educations && educations.length > 0) || (certifications && certifications.length > 0)) && <a href="#education" className="hover:text-slate-800 transition-colors">Education</a>}
        </div>
        
        <div className="flex gap-4 text-xs font-semibold text-slate-500">
          {socialLinks && socialLinks.map((sl, i) => (
            <a key={sl.id || i} href={sl.url} target="_blank" rel="noopener noreferrer" className="hover:text-slate-800 transition-colors flex items-center gap-1 bg-[#f1f5f9] px-2.5 py-1.5 rounded-lg border border-[#e2e8f0]">
              <span>{sl.platform}</span> <ArrowUpRight size={10} />
            </a>
          ))}
        </div>
      </header>

      {/* Main Grid View */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stats & Profile */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* User profile card */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <User size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Profile Overview</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800 leading-tight">{user.fullName}</h1>
              <p className="text-xs font-semibold mt-1" style={{ color: themeColor }}>{headline}</p>
            </div>
            {user.bio && <p className="text-slate-500 text-xs leading-relaxed border-t border-[#f1f5f9] pt-4">{user.bio}</p>}
          </div>

          {/* Quick Metrics stats */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <FileSpreadsheet size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Metrics</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#f1f5f9] text-center">
                <span className="text-2xl font-bold text-slate-800">{experiences?.length || 0}</span>
                <span className="text-[10px] text-slate-400 block font-bold uppercase mt-1">Jobs Held</span>
              </div>
              <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#f1f5f9] text-center">
                <span className="text-2xl font-bold text-slate-800">{projects?.length || 0}</span>
                <span className="text-[10px] text-slate-400 block font-bold uppercase mt-1">Projects</span>
              </div>
            </div>
          </div>

          {/* Skill card widget */}
          {skills && skills.length > 0 && (
            <div id="skills" className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col gap-4 scroll-mt-24">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Core Competencies</span>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, i) => (
                  <span key={skill.id || i} className="text-xs bg-[#f1f5f9] border border-[#e2e8f0] text-slate-600 px-2.5 py-1 rounded-lg font-medium">
                    {skill.name} <span className="text-[10px] text-slate-400 font-bold ml-1">{skill.level[0]}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Columns: Main content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Summary about card */}
          {summary && (
            <div id="about" className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col gap-3 scroll-mt-24">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Executive Summary</span>
              <p className="text-sm text-slate-650 leading-relaxed whitespace-pre-wrap">{summary}</p>
            </div>
          )}

          {/* Experience list */}
          {experiences && experiences.length > 0 && (
            <div id="experience" className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col gap-4 scroll-mt-24">
              <div className="flex items-center gap-2 text-slate-400 border-b border-[#f1f5f9] pb-3">
                <Briefcase size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Employment History</span>
              </div>
              <div className="flex flex-col gap-6">
                {experiences.map((exp, i) => (
                  <div key={exp.id || i} className="flex gap-4">
                    <div className="w-1 h-auto rounded-full flex-shrink-0" style={{ backgroundColor: themeColor }}></div>
                    <div className="flex-grow flex flex-col gap-1">
                      <div className="flex justify-between items-baseline flex-wrap gap-1">
                        <h3 className="text-slate-800 font-bold text-base">{exp.role}</h3>
                        <span className="text-xs text-slate-400 font-semibold">{formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-500">{exp.company} {exp.location ? `| ${exp.location}` : ''}</h4>
                      {exp.description && <p className="text-slate-600 text-xs mt-2 whitespace-pre-wrap">{exp.description}</p>}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="list-disc pl-4 text-xs text-slate-600 mt-2 flex flex-col gap-1">
                          {exp.achievements.map((ach, idx) => <li key={idx}>{ach}</li>)}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects grid */}
          {projects && projects.length > 0 && (
            <div id="projects" className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col gap-4 scroll-mt-24">
              <div className="flex items-center gap-2 text-slate-400 border-b border-[#f1f5f9] pb-3">
                <Folder size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Project Portfolio</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((proj, i) => (
                  <div key={proj.id || i} className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 transition-colors">
                    <div>
                      <h3 className="text-slate-800 font-bold text-sm">{proj.name}</h3>
                      {proj.description && <p className="text-slate-500 text-[11px] mt-1 leading-normal">{proj.description}</p>}
                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {proj.techStack.map((tech, idx) => (
                            <span key={idx} className="text-[9px] bg-white text-slate-500 px-2 py-0.5 rounded border border-[#cbd5e1]">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-4 mt-4 text-[11px] font-bold">
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-0.5" style={{ color: themeColor }}>
                          Live link <ArrowUpRight size={10} />
                        </a>
                      )}
                      {proj.repoUrl && (
                        <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-800 hover:underline flex items-center gap-0.5">
                          Source code <ArrowUpRight size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education & Certs */}
          {((educations && educations.length > 0) || (certifications && certifications.length > 0)) && (
            <div id="education" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-24">
              {educations && educations.length > 0 && (
                <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col gap-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Background</span>
                  <div className="flex flex-col gap-4">
                    {educations.map((ed, i) => (
                      <div key={ed.id || i} className="flex gap-3 text-xs">
                        <GraduationCap className="text-slate-400 flex-shrink-0 mt-0.5" size={16} />
                        <div>
                          <h3 className="font-bold text-slate-850">{ed.degree} {ed.field ? `in ${ed.field}` : ''}</h3>
                          <p className="text-slate-400 font-medium">{ed.institution}</p>
                          <span className="text-[10px] text-slate-400">{formatDate(ed.startDate)} - {ed.endDate ? formatDate(ed.endDate) : 'Present'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {certifications && certifications.length > 0 && (
                <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col gap-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certifications</span>
                  <div className="flex flex-col gap-4">
                    {certifications.map((c, i) => (
                      <div key={c.id || i} className="flex gap-3 text-xs">
                        <Award className="text-slate-400 flex-shrink-0 mt-0.5" size={16} />
                        <div>
                          <h3 className="font-bold text-slate-850">{c.name}</h3>
                          <p className="text-slate-400 font-medium">{c.issuer}</p>
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
    </div>
  );
};

export default SaasDashboard;
