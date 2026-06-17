import React from 'react';
import { PortfolioData } from '@portfolioverse/shared';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  GraduationCap, 
  Award, 
  ExternalLink, 
  User, 
  Briefcase, 
  Folder, 
  Wrench, 
  Mail, 
  Github, 
  Linkedin, 
  MapPin, 
  Globe 
} from 'lucide-react';

export const CleanStarter: React.FC<{ data: PortfolioData }> = ({ data }) => {
  const { 
    user = { fullName: 'Candidate Name', avatarUrl: '', bio: '', username: '' }, 
    headline = '', 
    summary = '', 
    skills = [], 
    experiences = [], 
    educations = [], 
    projects = [], 
    certifications = [], 
    socialLinks = [], 
    themeColor = '#7C3AED' // bright purple
  } = data || {};

  const formatDate = (dateInput: any) => {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const firstName = user.fullName ? user.fullName.split(' ')[0] : 'Portfolio';

  // Find email from socialLinks, or fallback to username-based mock email
  const emailLink = socialLinks.find(sl => sl.platform.toLowerCase() === 'email')?.url || 
                    socialLinks.find(sl => sl.platform.toLowerCase() === 'mail')?.url;
  const emailVal = emailLink ? emailLink.replace('mailto:', '') : `${user.username}@example.com`;

  // Find location from experiences, or fallback to a default
  const locationVal = experiences.find(exp => exp.location)?.location || 'San Francisco, CA';

  return (
    <div 
      className="text-slate-800 min-h-screen font-sans selection:bg-slate-200 w-full pb-28"
      style={{
        background: `radial-gradient(circle at top, ${themeColor}08 0%, rgba(255, 255, 255, 0) 65%), #FFFFFF`
      }}
    >
      
      {/* Sticky Navigation Menu */}
      <motion.nav 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="#" className="font-extrabold text-slate-900 text-xl tracking-tight hover:opacity-85 transition-opacity">
            {firstName}
          </a>
          <div className="flex items-center gap-6 text-sm font-semibold text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">About</a>
            {experiences && experiences.length > 0 && <a href="#experience" className="hover:text-slate-900 transition-colors">Experience</a>}
            {skills && skills.length > 0 && <a href="#skills" className="hover:text-slate-900 transition-colors">Skills</a>}
            {projects && projects.length > 0 && <a href="#projects" className="hover:text-slate-900 transition-colors">Projects</a>}
            {((educations && educations.length > 0) || (certifications && certifications.length > 0)) && <a href="#education" className="hover:text-slate-900 transition-colors">Education</a>}
          </div>
        </div>
      </motion.nav>

      {/* Main Content Layout Container */}
      <div className="max-w-5xl mx-auto px-8 pt-16 md:pt-24 space-y-24">
        
        {/* Centered Hero Header */}
        <header className="flex flex-col items-center text-center">
          
          {/* Profile Image with subtle background glow ring */}
          {user.avatarUrl && (
            <motion.div 
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative mb-6"
            >
              {/* Radial gradient background aura blur */}
              <div 
                className="absolute inset-0 blur-2xl rounded-full scale-150 z-0 opacity-70" 
                style={{
                  background: `radial-gradient(circle, ${themeColor}40 0%, transparent 70%)`
                }}
              />
              <img 
                src={user.avatarUrl} 
                alt={user.fullName || 'User Avatar'} 
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg relative z-10" 
              />
            </motion.div>
          )}

          {/* Name & Headline */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-none">
              {user.fullName || 'Your Name'}
            </h1>
            <p className="text-lg md:text-xl font-bold mt-4 uppercase tracking-wider" style={{ color: themeColor }}>
              {headline || 'Professional Headline'}
            </p>
          </motion.div>

          {/* Bio Description */}
          {user.bio && (
            <motion.p 
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="text-[#475569] mt-5 max-w-2xl text-center text-sm md:text-base leading-relaxed"
            >
              {user.bio}
            </motion.p>
          )}

          {/* Capsule outlined contact buttons */}
          <motion.div 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mt-8 max-w-2xl"
          >
            {emailVal && (
              <a 
                href={`mailto:${emailVal}`} 
                className="border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600 px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
              >
                <Mail size={13} className="text-slate-400" />
                <span>{emailVal}</span>
              </a>
            )}

            {socialLinks && socialLinks.filter(sl => sl.platform.toLowerCase() !== 'email' && sl.platform.toLowerCase() !== 'mail').map((sl, idx) => (
              <a 
                key={sl.id || idx}
                href={sl.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600 px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
              >
                {sl.platform.toLowerCase() === 'github' && <Github size={13} className="text-slate-400" />}
                {sl.platform.toLowerCase() === 'linkedin' && <Linkedin size={13} className="text-slate-400" />}
                {!['github', 'linkedin'].includes(sl.platform.toLowerCase()) && <Globe size={13} className="text-slate-400" />}
                <span className="capitalize">{sl.platform}</span>
              </a>
            ))}

            {locationVal && (
              <span className="border border-slate-200/80 bg-slate-50/50 text-slate-500 px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-2 shadow-sm">
                <MapPin size={13} className="text-slate-400" />
                <span>{locationVal}</span>
              </span>
            )}
          </motion.div>
        </header>

        {/* Summary / About Me */}
        {summary && (
          <motion.section 
            id="about" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="scroll-mt-24 pt-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span 
                className="p-2 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${themeColor}0F`, color: themeColor }}
              >
                <User size={18} />
              </span>
              <h2 className="text-2xl font-bold text-[#0F172A]">About Me</h2>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-[#475569] whitespace-pre-wrap max-w-4xl">
              {summary}
            </p>
          </motion.section>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <motion.section 
            id="experience" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="scroll-mt-24 pt-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <span 
                className="p-2 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${themeColor}0F`, color: themeColor }}
              >
                <Briefcase size={18} />
              </span>
              <h2 className="text-2xl font-bold text-[#0F172A]">Professional Experience</h2>
            </div>

            <div className="flex flex-col gap-10">
              {experiences.map((exp, idx) => (
                <div key={exp.id || idx} className="flex flex-col gap-2 max-w-4xl">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-lg font-bold text-[#0F172A]">{exp.role}</h3>
                    <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                      <Calendar size={12} className="text-slate-400" />
                      {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-500">
                    {exp.company} {exp.location ? `• ${exp.location}` : ''}
                  </h4>
                  {exp.description && (
                    <p className="text-[#475569] text-sm mt-1 leading-relaxed whitespace-pre-wrap">
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc pl-4 mt-2 text-sm text-[#475569] flex flex-col gap-2">
                      {exp.achievements.map((ach, i) => (
                        <li key={i}>{ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <motion.section 
            id="skills" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="scroll-mt-24 pt-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span 
                className="p-2 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${themeColor}0F`, color: themeColor }}
              >
                <Wrench size={18} />
              </span>
              <h2 className="text-2xl font-bold text-[#0F172A]">Skills & Tech Stack</h2>
            </div>
            
            <div className="flex flex-wrap gap-2.5 max-w-4xl">
              {skills.map((skill, idx) => (
                <span 
                  key={skill.id || idx} 
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200/60 text-slate-700 text-xs font-semibold shadow-sm flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }} />
                  <span>{skill.name}</span>
                  <span className="text-[9px] text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded font-extrabold uppercase">
                    {skill.level}
                  </span>
                </span>
              ))}
            </div>
          </motion.section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <motion.section 
            id="projects" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="scroll-mt-24 pt-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <span 
                className="p-2 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${themeColor}0F`, color: themeColor }}
              >
                <Folder size={18} />
              </span>
              <h2 className="text-2xl font-bold text-[#0F172A]">Projects Showcase</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
              {projects.map((proj, idx) => (
                <div 
                  key={proj.id || idx} 
                  className="border border-slate-200/50 bg-white rounded-2xl p-6 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{proj.name}</h3>
                    {proj.description && (
                      <p className="text-slate-500 text-xs mt-2.5 leading-relaxed">
                        {proj.description}
                      </p>
                    )}
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {proj.techStack.map((tech, i) => (
                          <span 
                            key={i} 
                            className="text-[9px] bg-slate-50 border border-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 mt-5 pt-3.5 border-t border-slate-50">
                    {proj.liveUrl && (
                      <a 
                        href={proj.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs font-bold inline-flex items-center gap-1 hover:opacity-80 transition-opacity" 
                        style={{ color: themeColor }}
                      >
                        <span>Live Demo</span> 
                        <ExternalLink size={12} />
                      </a>
                    )}
                    {proj.repoUrl && (
                      <a 
                        href={proj.repoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs font-bold text-slate-400 hover:text-slate-700 inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Code</span> 
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Education & Certs */}
        {((educations && educations.length > 0) || (certifications && certifications.length > 0)) && (
          <motion.section 
            id="education" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="scroll-mt-24 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-4xl"
          >
            {educations && educations.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span 
                    className="p-2 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${themeColor}0F`, color: themeColor }}
                  >
                    <GraduationCap size={18} />
                  </span>
                  <h2 className="text-2xl font-bold text-[#0F172A]">Education</h2>
                </div>

                <div className="flex flex-col gap-6">
                  {educations.map((ed, idx) => (
                    <div key={ed.id || idx} className="text-sm flex gap-3">
                      <div>
                        <h3 className="font-bold text-slate-800 leading-snug">{ed.degree} {ed.field ? `in ${ed.field}` : ''}</h3>
                        <p className="text-slate-400 text-xs mt-1.5">
                          {ed.institution} • {ed.startDate ? new Date(ed.startDate).getFullYear() : ''} - {ed.endDate ? new Date(ed.endDate).getFullYear() : 'Present'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {certifications && certifications.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span 
                    className="p-2 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${themeColor}0F`, color: themeColor }}
                  >
                    <Award size={18} />
                  </span>
                  <h2 className="text-2xl font-bold text-[#0F172A]">Certifications</h2>
                </div>

                <div className="flex flex-col gap-6">
                  {certifications.map((c, idx) => (
                    <div key={c.id || idx} className="text-sm flex gap-3">
                      <div>
                        <h3 className="font-bold text-slate-800 leading-snug">{c.name}</h3>
                        <p className="text-slate-400 text-xs mt-1.5">{c.issuer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* Footer */}
        <footer className="pt-16 flex flex-col items-center gap-3 text-xs text-slate-400 border-t border-slate-100 select-none">
          <p>© {new Date().getFullYear()} {user.fullName}. All rights reserved.</p>
        </footer>

      </div>
    </div>
  );
};

export default CleanStarter;
