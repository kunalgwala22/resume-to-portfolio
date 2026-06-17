import React, { useState } from 'react';
import { PortfolioData } from '@portfolioverse/shared';
import { Terminal, FolderGit2, BookOpen, FileCode, User, Globe, ChevronRight } from 'lucide-react';

export const ModernDeveloper: React.FC<{ data: PortfolioData }> = ({ data }) => {
  const { user, headline, summary, skills, experiences, educations, projects, certifications, socialLinks, themeColor } = data;
  const [activeTab, setActiveTab] = useState('profile.json');

  const tabs = [
    { id: 'profile.json', name: 'profile.json', icon: User },
    { id: 'experience.json', name: 'experience.json', icon: FileCode },
    { id: 'projects.ts', name: 'projects.ts', icon: FolderGit2 },
    { id: 'skills.md', name: 'skills.md', icon: Terminal },
    { id: 'education.json', name: 'education.json', icon: BookOpen }
  ];

  const formatDate = (dateStr: any) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-[#0d1117] text-[#c9d1d9] min-h-screen font-mono flex flex-col md:flex-row w-full border border-[#30363d]/50">
      {/* Code Editor Sidebar */}
      <aside className="w-full md:w-64 bg-[#161b22] border-b md:border-b-0 md:border-r border-[#30363d] flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
          </div>
          <span className="text-xs text-gray-500 font-semibold font-sans">PORTFOLIO.WORKSPACE</span>
        </div>

        {/* File tree */}
        <div className="flex-1 py-4">
          <div className="px-4 text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Files</div>
          <div className="flex flex-col">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-4 py-2 text-xs font-semibold w-full text-left transition-all ${
                    isActive
                      ? 'bg-[#21262d] text-white border-l-2'
                      : 'text-gray-400 hover:bg-[#161b22]/70 hover:text-gray-200'
                  }`}
                  style={isActive ? { borderLeftColor: themeColor } : {}}
                >
                  <tab.icon size={14} style={{ color: isActive ? themeColor : '#8b949e' }} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Profile details */}
        <div className="p-4 border-t border-[#30363d] bg-[#0d1117]/50 flex items-center gap-3">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.fullName || ''} className="w-9 h-9 rounded-full object-cover border border-[#30363d]" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center font-bold text-xs">{user.username.slice(0, 2).toUpperCase()}</div>
          )}
          <div className="flex flex-col truncate">
            <span className="text-xs font-bold text-white truncate">{user.fullName || 'Candidate'}</span>
            <span className="text-[10px] text-gray-500 truncate">@{user.username}</span>
          </div>
        </div>
      </aside>

      {/* Editor Body */}
      <main className="flex-1 flex flex-col bg-[#0d1117] min-w-0">
        {/* Open tab headers */}
        <div className="bg-[#161b22] border-b border-[#30363d] flex overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-r border-[#30363d] transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0d1117] text-white border-t-2'
                    : 'bg-[#161b22]/50 text-gray-400 hover:text-gray-200'
                }`}
                style={isActive ? { borderTopColor: themeColor } : {}}
              >
                <tab.icon size={12} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Editor Content pane */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-100px)] text-sm leading-relaxed">
          {activeTab === 'profile.json' && (
            <div className="flex flex-col gap-6">
              <div>
                <span className="text-[#ff7b72]">const</span> <span className="text-[#d2a8ff]">developer</span> = {'{'}
                <div className="pl-6 flex flex-col gap-1">
                  <div><span className="text-[#79c0ff]">"fullName"</span>: <span className="text-[#a5d6ff]">"{user.fullName || 'John Doe'}"</span>,</div>
                  <div><span className="text-[#79c0ff]">"headline"</span>: <span className="text-[#a5d6ff]">"{headline || 'Software Engineer'}"</span>,</div>
                  <div><span className="text-[#79c0ff]">"username"</span>: <span className="text-[#a5d6ff]">"{user.username}"</span>,</div>
                  <div><span className="text-[#79c0ff]">"bio"</span>: <span className="text-[#a5d6ff]">"{user.bio || ''}"</span></div>
                </div>
                {'};'}
              </div>
              
              {summary && (
                <div className="border-t border-[#30363d]/50 pt-6">
                  <h2 className="text-[#ff7b72] font-bold mb-2">// Summary</h2>
                  <p className="text-[#8b949e] whitespace-pre-wrap">{summary}</p>
                </div>
              )}

              {socialLinks && socialLinks.length > 0 && (
                <div className="border-t border-[#30363d]/50 pt-6">
                  <h2 className="text-[#ff7b72] font-bold mb-3">// Social Connections</h2>
                  <div className="flex flex-col gap-2">
                    {socialLinks.map((sl, i) => (
                      <a key={i} href={sl.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#79c0ff] hover:underline text-xs">
                        <Globe size={14} />
                        <span>{sl.platform}</span>
                        <ChevronRight size={12} className="text-gray-600" />
                        <span className="text-gray-500 text-[10px]">{sl.url}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'experience.json' && (
            <div className="flex flex-col gap-8">
              <span className="text-[#8b949e]">// List of professional employment engagements</span>
              <div className="flex flex-col gap-6">
                {experiences && experiences.length > 0 ? (
                  experiences.map((exp, i) => (
                    <div key={exp.id || i} className="border-l-2 border-[#30363d] pl-4 py-1 flex flex-col gap-1.5">
                      <div className="flex justify-between items-baseline flex-wrap">
                        <h3 className="text-white font-bold text-base">{exp.role}</h3>
                        <span className="text-xs text-gray-500 font-semibold">{formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-[#79c0ff]">{exp.company} {exp.location ? `• ${exp.location}` : ''}</h4>
                      {exp.description && <p className="text-gray-400 text-xs mt-1 whitespace-pre-wrap">{exp.description}</p>}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="list-disc pl-4 text-xs text-gray-400 mt-1 flex flex-col gap-1">
                          {exp.achievements.map((ach, idx) => <li key={idx}>{ach}</li>)}
                        </ul>
                      )}
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500 italic">No experiences added yet.</span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'projects.ts' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {projects && projects.length > 0 ? (
                projects.map((proj, i) => (
                  <div key={proj.id || i} className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 flex flex-col justify-between hover:border-gray-500 transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-bold text-base">{proj.name}</h3>
                        {proj.isFeatured && (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${themeColor}20`, color: themeColor }}>
                            Featured
                          </span>
                        )}
                      </div>
                      {proj.description && <p className="text-gray-400 text-xs mt-1 mb-3">{proj.description}</p>}
                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {proj.techStack.map((tech, idx) => (
                            <span key={idx} className="text-[9px] bg-[#0d1117] text-[#58a6ff] px-2 py-0.5 rounded border border-[#30363d]">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 mt-4 text-xs">
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold" style={{ color: themeColor }}>
                          Live Demo
                        </a>
                      )}
                      {proj.repoUrl && (
                        <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:underline font-semibold">
                          View Code
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-gray-500 italic col-span-2">No projects added yet.</span>
              )}
            </div>
          )}

          {activeTab === 'skills.md' && (
            <div className="flex flex-col gap-6">
              <h1 className="text-white font-extrabold text-lg pb-2 border-b border-[#30363d]"># Core Competencies & Skills</h1>
              {skills && skills.length > 0 ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2.5">
                    {skills.map((skill, i) => (
                      <div key={skill.id || i} className="bg-[#161b22] border border-[#30363d] px-3.5 py-1.5 rounded-md flex items-center gap-2">
                        <span className="text-white font-semibold text-xs">{skill.name}</span>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: themeColor }}></span>
                        <span className="text-gray-500 text-[10px] font-bold">{skill.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <span className="text-gray-500 italic">No skills listed.</span>
              )}
            </div>
          )}

          {activeTab === 'education.json' && (
            <div className="flex flex-col gap-8">
              {educations && educations.length > 0 && (
                <div className="flex flex-col gap-6">
                  <h2 className="text-[#ff7b72] font-bold">// Academic History</h2>
                  {educations.map((ed, i) => (
                    <div key={ed.id || i} className="border-l-2 border-[#30363d] pl-4 flex flex-col gap-1">
                      <h3 className="text-white font-bold">{ed.degree} {ed.field ? `in ${ed.field}` : ''}</h3>
                      <h4 className="text-xs text-gray-400 font-semibold">{ed.institution}</h4>
                      <span className="text-[10px] text-gray-500">{formatDate(ed.startDate)} - {ed.endDate ? formatDate(ed.endDate) : 'Present'} {ed.grade ? `• Grade: ${ed.grade}` : ''}</span>
                    </div>
                  ))}
                </div>
              )}

              {certifications && certifications.length > 0 && (
                <div className="border-t border-[#30363d]/50 pt-6 flex flex-col gap-4">
                  <h2 className="text-[#ff7b72] font-bold">// Certifications</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {certifications.map((c, i) => (
                      <div key={c.id || i} className="bg-[#161b22] p-4 rounded border border-[#30363d] flex flex-col gap-1">
                        <h3 className="text-white text-xs font-bold">{c.name}</h3>
                        <p className="text-[10px] text-gray-400">{c.issuer} {c.issueDate ? `(${new Date(c.issueDate).getFullYear()})` : ''}</p>
                        {c.credentialUrl && (
                          <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] text-[10px] hover:underline mt-1">
                            Verify Credential
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ModernDeveloper;
