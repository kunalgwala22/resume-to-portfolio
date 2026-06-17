import React from 'react';
import { PortfolioData } from '@portfolioverse/shared';
import { Calendar, GraduationCap, Award, Cpu, Star, ExternalLink } from 'lucide-react';

export const AIDigitalTwin: React.FC<{ data: PortfolioData }> = ({ data }) => {
  const { user, headline, summary, skills, experiences, educations, projects, certifications, socialLinks, themeColor } = data;

  const formatDate = (d: any) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit' });
  };

  return (
    <div className="bg-[#020205] text-[#8e9bb8] min-h-screen relative overflow-hidden font-mono text-xs w-full">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c16_1px,transparent_1px),linear-gradient(to_bottom,#0c0c16_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* HUD Navigation Menu */}
      <nav className="sticky top-0 z-50 bg-[#020205]/95 border-b border-indigo-500/20 py-3.5 px-6 backdrop-blur-md shadow-lg shadow-indigo-950/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-[10px] uppercase font-bold tracking-widest">
          <a href="#about" className="text-white hover:text-indigo-400 transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-none animate-pulse" style={{ backgroundColor: themeColor }}></span>
            SYS_IDENTITY
          </a>
          <div className="flex items-center gap-6 text-gray-400 font-mono">
            <a href="#about" className="hover:text-white transition-colors">&gt; About</a>
            {experiences && experiences.length > 0 && <a href="#experience" className="hover:text-white transition-colors">&gt; Chronology</a>}
            {projects && projects.length > 0 && <a href="#projects" className="hover:text-white transition-colors">&gt; Modules</a>}
            {skills && skills.length > 0 && <a href="#skills" className="hover:text-white transition-colors">&gt; Cognition</a>}
            {((educations && educations.length > 0) || (certifications && certifications.length > 0)) && (
              <a href="#education" className="hover:text-white transition-colors">&gt; Academic</a>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto flex flex-col gap-10 relative z-10 py-16 px-6">
        
        {/* HUD Header */}
        <header id="about" className="scroll-mt-24 border border-indigo-500/20 bg-[#020205]/90 p-6 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.05)]">
          <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3 mb-6">
            <div className="flex items-center gap-2">
              <Cpu size={14} className="animate-pulse" style={{ color: themeColor }} />
              <span className="text-[9px] uppercase tracking-widest text-indigo-400 font-bold">Neural Digital Twin Online</span>
            </div>
            <span className="text-[8px] text-gray-500">SYS_ACC_100%</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            {user.avatarUrl && (
              <img 
                src={user.avatarUrl} 
                alt={user.fullName || ''} 
                className="h-24 w-24 rounded-none object-cover border filter hue-rotate-15 saturate-100" 
                style={{ borderColor: themeColor }}
              />
            )}
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-2xl font-black text-white uppercase tracking-wider">{user.fullName || 'AI Twin'}</h1>
              <p className="text-xs font-bold mt-1.5 uppercase" style={{ color: themeColor }}>
                &gt; twin_identity_status: {headline || 'Core Model'}
              </p>
              {user.bio && <p className="text-gray-400 text-[10px] mt-3 max-w-lg leading-normal">{user.bio}</p>}
            </div>
          </div>
        </header>

        {/* Core summary */}
        {summary && (
          <section className="border border-indigo-500/20 bg-[#020205]/95 p-6 rounded-lg">
            <span className="text-[9px] text-indigo-400 uppercase tracking-widest font-bold mb-3 block">// MODEL_SYNAPSE_SUMMARY</span>
            <p className="text-white leading-relaxed text-xs whitespace-pre-wrap">{summary}</p>
          </section>
        )}

        {/* Experience log */}
        {experiences && experiences.length > 0 && (
          <section id="experience" className="scroll-mt-24 flex flex-col gap-4">
            <span className="text-[9px] text-indigo-400 uppercase tracking-widest font-bold pl-1">// EMPLOYMENT_CHRONOLOGY_LOGS</span>
            <div className="flex flex-col gap-4">
              {experiences.map((exp, i) => (
                <div key={exp.id || i} className="border border-indigo-500/20 bg-[#020205]/95 p-6 rounded-lg hover:border-indigo-400/40 transition-colors">
                  <div className="flex justify-between items-baseline flex-wrap gap-2 border-b border-indigo-500/10 pb-2 mb-3">
                    <h3 className="text-white font-bold text-xs uppercase">{exp.role}</h3>
                    <span className="text-[9px] text-gray-500 font-semibold flex items-center gap-1">
                      <Calendar size={10} />
                      {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <h4 className="text-[11px] font-bold uppercase" style={{ color: themeColor }}>{exp.company} {exp.location ? `[${exp.location}]` : ''}</h4>
                  {exp.description && <p className="text-gray-400 text-xs mt-3 leading-relaxed whitespace-pre-wrap">{exp.description}</p>}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-none mt-3 flex flex-col gap-1.5 text-gray-450 pl-0">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                          <span className="text-indigo-400 font-bold">-</span>
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

        {/* Projects HUD cards */}
        {projects && projects.length > 0 && (
          <section id="projects" className="scroll-mt-24 flex flex-col gap-4">
            <span className="text-[9px] text-indigo-400 uppercase tracking-widest font-bold pl-1">// FEATURED_SYSTEM_MODULES</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj, i) => (
                <div key={proj.id || i} className="border border-indigo-500/20 bg-[#020205]/95 p-5 rounded-lg flex flex-col justify-between hover:border-indigo-400/40 transition-colors">
                  <div>
                    <h3 className="text-white font-bold text-xs uppercase flex items-center justify-between">
                      <span>{proj.name}</span>
                      {proj.isFeatured && <Star size={10} className="fill-indigo-400 text-indigo-400" />}
                    </h3>
                    {proj.description && <p className="text-gray-450 text-[10px] mt-2 leading-normal">{proj.description}</p>}
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-4">
                        {proj.techStack.map((tech, idx) => (
                          <span key={idx} className="text-[8px] bg-black text-[#8e9bb8] px-2 py-0.5 rounded border border-indigo-500/10">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 mt-5 text-[9px] font-bold">
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-0.5" style={{ color: themeColor }}>
                        LOAD_LIVE_DEMO <ExternalLink size={10} />
                      </a>
                    )}
                    {proj.repoUrl && (
                      <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white hover:underline flex items-center gap-0.5">
                        CLONE_REPO_CODE <ExternalLink size={10} />
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
          <section id="skills" className="scroll-mt-24 border border-indigo-500/20 bg-[#020205]/90 p-6 rounded-lg">
            <span className="text-[9px] text-indigo-400 uppercase tracking-widest font-bold mb-4 block">// PROTOCOL_COGNITION_SKILLS</span>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={skill.id || i} className="bg-black border border-indigo-500/10 text-gray-300 px-3 py-1.5 rounded hover:border-indigo-400 transition-colors cursor-default">
                  {skill.name} :: <span className="text-indigo-400 font-bold text-[8px]">{skill.level}</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education & Credentials */}
        {((educations && educations.length > 0) || (certifications && certifications.length > 0)) && (
          <section id="education" className="scroll-mt-24 grid grid-cols-1 md:grid-cols-2 gap-6">
            {educations && educations.length > 0 && (
              <div className="border border-indigo-500/20 bg-[#020205]/90 p-6 rounded-lg">
                <span className="text-[9px] text-indigo-400 uppercase tracking-widest font-bold mb-4 block">// ACADEMIC_LOGS</span>
                <div className="flex flex-col gap-4">
                  {educations.map((ed, i) => (
                    <div key={ed.id || i} className="flex gap-3 text-[10px]">
                      <GraduationCap className="text-[#8e9bb8] flex-shrink-0 mt-0.5" size={16} />
                      <div>
                        <h3 className="font-bold text-white uppercase">{ed.degree} {ed.field ? `[${ed.field}]` : ''}</h3>
                        <p className="text-gray-400 mt-0.5">{ed.institution}</p>
                        <span className="text-[9px] text-gray-500 block mt-0.5">{formatDate(ed.startDate)} — {ed.endDate ? formatDate(ed.endDate) : 'Present'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certifications && certifications.length > 0 && (
              <div className="border border-indigo-500/20 bg-[#020205]/90 p-6 rounded-lg">
                <span className="text-[9px] text-indigo-400 uppercase tracking-widest font-bold mb-4 block">// SYSTEM_CERTIFICATIONS</span>
                <div className="flex flex-col gap-4">
                  {certifications.map((c, i) => (
                    <div key={c.id || i} className="flex gap-3 text-[10px]">
                      <Award className="text-[#8e9bb8] flex-shrink-0 mt-0.5" size={16} />
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
        <footer className="border border-indigo-500/20 bg-[#020205]/95 px-6 py-4 rounded-lg flex justify-between items-center flex-wrap gap-4 text-gray-650 text-[9px] font-bold">
          <span>AI_DIGITAL_TWIN // CONNECTION_SECURE</span>
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

export default AIDigitalTwin;
