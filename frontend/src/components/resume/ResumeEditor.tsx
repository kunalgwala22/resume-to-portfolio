import React, { useState, useEffect } from 'react';
import { useResume } from '../../hooks/useResume';
import { Tabs } from '../ui/Tabs';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { Plus, Trash2, Save, Sparkles } from 'lucide-react';

export const ResumeEditor: React.FC<{ resumeId: string }> = ({ resumeId }) => {
  const { resume, isLoadingResume, updateSections, isUpdatingSections } = useResume(resumeId);

  // Tabs Configuration
  const tabsList = [
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Work Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education & Certs' },
    { id: 'socials', label: 'Social Links' }
  ];
  const [activeTab, setActiveTab] = useState('skills');

  // Form states matching database schemas
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);

  // Sync state with query result
  useEffect(() => {
    if (resume) {
      setSkills(resume.skills || []);
      setExperiences(resume.experiences || []);
      setProjects(resume.projects || []);
      setEducations(resume.educations || []);
      setCertifications(resume.certifications || []);
      setSocialLinks(resume.socialLinks || []);
    }
  }, [resume]);

  if (isLoadingResume) {
    return <div className="text-center py-12 text-gray-400">Loading resume details...</div>;
  }

  if (!resume) {
    return <div className="text-center py-12 text-danger">Resume not found.</div>;
  }

  if (resume.parseStatus === 'PENDING' || resume.parseStatus === 'PROCESSING') {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="flex flex-col gap-1 max-w-sm">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Extracting Resume Details</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Please wait while our parser processes your experiences, skills, projects, and education. This dashboard page will automatically update once parsing is complete.
          </p>
        </div>
      </div>
    );
  }

  // --- Skills handlers ---
  const addSkill = () => {
    setSkills([...skills, { name: '', level: 'INTERMEDIATE', category: '' }]);
  };
  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, idx) => idx !== index));
  };
  const updateSkill = (index: number, key: string, val: any) => {
    const next = [...skills];
    next[index][key] = val;
    setSkills(next);
  };

  // --- Experience handlers ---
  const addExperience = () => {
    setExperiences([...experiences, {
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      achievements: []
    }]);
  };
  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, idx) => idx !== index));
  };
  const updateExperience = (index: number, key: string, val: any) => {
    const next = [...experiences];
    next[index][key] = val;
    setExperiences(next);
  };
  const addAchievement = (expIdx: number) => {
    const next = [...experiences];
    next[expIdx].achievements = [...(next[expIdx].achievements || []), ''];
    setExperiences(next);
  };
  const updateAchievement = (expIdx: number, achIdx: number, val: string) => {
    const next = [...experiences];
    next[expIdx].achievements[achIdx] = val;
    setExperiences(next);
  };
  const removeAchievement = (expIdx: number, achIdx: number) => {
    const next = [...experiences];
    next[expIdx].achievements = next[expIdx].achievements.filter((_: any, idx: number) => idx !== achIdx);
    setExperiences(next);
  };

  // --- Projects handlers ---
  const addProject = () => {
    setProjects([...projects, {
      name: '',
      description: '',
      techStack: [],
      liveUrl: '',
      repoUrl: '',
      isFeatured: false
    }]);
  };
  const removeProject = (index: number) => {
    setProjects(projects.filter((_, idx) => idx !== index));
  };
  const updateProject = (index: number, key: string, val: any) => {
    const next = [...projects];
    next[index][key] = val;
    setProjects(next);
  };

  // --- Educations handlers ---
  const addEducation = () => {
    setEducations([...educations, {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      grade: ''
    }]);
  };
  const removeEducation = (index: number) => {
    setEducations(educations.filter((_, idx) => idx !== index));
  };
  const updateEducation = (index: number, key: string, val: any) => {
    const next = [...educations];
    next[index][key] = val;
    setEducations(next);
  };

  // --- Certs handlers ---
  const addCert = () => {
    setCertifications([...certifications, {
      name: '',
      issuer: '',
      issueDate: '',
      credentialId: '',
      credentialUrl: ''
    }]);
  };
  const removeCert = (index: number) => {
    setCertifications(certifications.filter((_, idx) => idx !== index));
  };
  const updateCert = (index: number, key: string, val: any) => {
    const next = [...certifications];
    next[index][key] = val;
    setCertifications(next);
  };

  // --- Social Links handlers ---
  const addSocial = () => {
    setSocialLinks([...socialLinks, { platform: 'github', url: '' }]);
  };
  const removeSocial = (index: number) => {
    setSocialLinks(socialLinks.filter((_, idx) => idx !== index));
  };
  const updateSocial = (index: number, key: string, val: any) => {
    const next = [...socialLinks];
    next[index][key] = val;
    setSocialLinks(next);
  };

  const handleSave = async () => {
    try {
      await updateSections({
        id: resumeId,
        data: {
          skills,
          experiences,
          projects,
          educations,
          certifications,
          socialLinks
        }
      });
      alert('Resume sections saved and synced successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save sections.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tab controls */}
      <div className="bg-surface/20 border border-border/40 rounded-xl p-2">
        <Tabs tabs={tabsList} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Form content viewport */}
      <div className="min-h-[400px]">
        {activeTab === 'skills' && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-bold uppercase">Skills List ({skills.length})</span>
              <Button size="sm" variant="outline" onClick={addSkill} leftIcon={<Plus size={14} />}>Add Skill</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill, idx) => (
                <Card key={idx} className="flex items-center gap-4 bg-surface/30 border-border/40 p-4 relative group">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <Input 
                      placeholder="Skill name (e.g. React)" 
                      value={skill.name} 
                      onChange={(e) => updateSkill(idx, 'name', e.target.value)} 
                    />
                    <Select 
                      options={[
                        { label: 'Beginner', value: 'BEGINNER' },
                        { label: 'Intermediate', value: 'INTERMEDIATE' },
                        { label: 'Advanced', value: 'ADVANCED' },
                        { label: 'Expert', value: 'EXPERT' }
                      ]} 
                      value={skill.level} 
                      onChange={(e) => updateSkill(idx, 'level', e.target.value)} 
                    />
                  </div>
                  <Button variant="ghost" size="sm" className="text-danger hover:bg-danger/10 p-2 min-w-0" onClick={() => removeSkill(idx)}>
                    <Trash2 size={16} />
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-bold uppercase">Experience Blocks ({experiences.length})</span>
              <Button size="sm" variant="outline" onClick={addExperience} leftIcon={<Plus size={14} />}>Add Job</Button>
            </div>

            <div className="flex flex-col gap-6">
              {experiences.map((exp, idx) => (
                <Card key={idx} className="bg-surface/30 border-border/40 p-6 flex flex-col gap-4 relative">
                  <div className="absolute top-4 right-4">
                    <Button variant="ghost" size="sm" className="text-danger hover:bg-danger/10 p-2 min-w-0" onClick={() => removeExperience(idx)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Company Name" value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} />
                    <Input label="Role / Title" value={exp.role} onChange={(e) => updateExperience(idx, 'role', e.target.value)} />
                    <Input label="Location (e.g. Remote)" value={exp.location || ''} onChange={(e) => updateExperience(idx, 'location', e.target.value)} />
                    <div className="grid grid-cols-2 gap-3">
                      <Input 
                        label="Start Date" 
                        type="date" 
                        value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ''} 
                        onChange={(e) => updateExperience(idx, 'startDate', e.target.value)} 
                      />
                      <Input 
                        label="End Date" 
                        type="date" 
                        disabled={exp.isCurrent}
                        value={exp.endDate && !exp.isCurrent ? new Date(exp.endDate).toISOString().split('T')[0] : ''} 
                        onChange={(e) => updateExperience(idx, 'endDate', e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id={`current-${idx}`} 
                      checked={exp.isCurrent} 
                      onChange={(e) => updateExperience(idx, 'isCurrent', e.target.checked)} 
                    />
                    <label htmlFor={`current-${idx}`} className="text-xs text-gray-400 font-semibold cursor-pointer">I currently work here</label>
                  </div>

                  <Textarea label="Job Description" value={exp.description || ''} onChange={(e) => updateExperience(idx, 'description', e.target.value)} />

                  {/* Achievements sub-list */}
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-400">Achievements / Key Metrics</span>
                      <Button size="sm" variant="ghost" onClick={() => addAchievement(idx)} className="text-primary hover:bg-primary/5 py-1 px-2 text-xs" leftIcon={<Plus size={12} />}>
                        Add Point
                      </Button>
                    </div>
                    {exp.achievements?.map((ach: string, achIdx: number) => (
                      <div key={achIdx} className="flex gap-2 items-center">
                        <Input value={ach} className="text-xs py-1.5" placeholder="Metric or major delivery point..." onChange={(e) => updateAchievement(idx, achIdx, e.target.value)} />
                        <Button variant="ghost" size="sm" className="text-danger hover:bg-danger/5 p-2 min-w-0" onClick={() => removeAchievement(idx, achIdx)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-bold uppercase">Projects List ({projects.length})</span>
              <Button size="sm" variant="outline" onClick={addProject} leftIcon={<Plus size={14} />}>Add Project</Button>
            </div>

            <div className="flex flex-col gap-6">
              {projects.map((proj, idx) => (
                <Card key={idx} className="bg-surface/30 border-border/40 p-6 flex flex-col gap-4 relative">
                  <div className="absolute top-4 right-4">
                    <Button variant="ghost" size="sm" className="text-danger hover:bg-danger/10 p-2 min-w-0" onClick={() => removeProject(idx)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Project Name" value={proj.name} onChange={(e) => updateProject(idx, 'name', e.target.value)} />
                    <Input label="Tech Stack (comma separated)" value={proj.techStack?.join(', ') || ''} onChange={(e) => updateProject(idx, 'techStack', e.target.value.split(',').map(s => s.trim()))} />
                    <Input label="Live Demo URL" value={proj.liveUrl || ''} onChange={(e) => updateProject(idx, 'liveUrl', e.target.value)} />
                    <Input label="GitHub URL" value={proj.repoUrl || ''} onChange={(e) => updateProject(idx, 'repoUrl', e.target.value)} />
                  </div>

                  <Textarea label="Project Description" value={proj.description || ''} onChange={(e) => updateProject(idx, 'description', e.target.value)} />

                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id={`featured-${idx}`} 
                      checked={proj.isFeatured} 
                      onChange={(e) => updateProject(idx, 'isFeatured', e.target.checked)} 
                    />
                    <label htmlFor={`featured-${idx}`} className="text-xs text-gray-400 font-semibold cursor-pointer">Feature this project in highlight lists</label>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div className="flex flex-col gap-8 animate-fadeIn">
            {/* Educations */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-bold uppercase">Education Logs ({educations.length})</span>
                <Button size="sm" variant="outline" onClick={addEducation} leftIcon={<Plus size={14} />}>Add Degree</Button>
              </div>

              <div className="flex flex-col gap-4">
                {educations.map((ed, idx) => (
                  <Card key={idx} className="bg-surface/30 border-border/40 p-5 flex flex-col gap-3 relative">
                    <div className="absolute top-4 right-4">
                      <Button variant="ghost" size="sm" className="text-danger hover:bg-danger/10 p-2 min-w-0" onClick={() => removeEducation(idx)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Institution" value={ed.institution} onChange={(e) => updateEducation(idx, 'institution', e.target.value)} />
                      <Input label="Degree Type (e.g. BS)" value={ed.degree} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} />
                      <Input label="Field of Study (e.g. CS)" value={ed.field || ''} onChange={(e) => updateEducation(idx, 'field', e.target.value)} />
                      <Input label="Grade / GPA" value={ed.grade || ''} onChange={(e) => updateEducation(idx, 'grade', e.target.value)} />
                      <div className="grid grid-cols-2 gap-3">
                        <Input 
                          label="Start Date" 
                          type="date" 
                          value={ed.startDate ? new Date(ed.startDate).toISOString().split('T')[0] : ''} 
                          onChange={(e) => updateEducation(idx, 'startDate', e.target.value)} 
                        />
                        <Input 
                          label="End Date" 
                          type="date" 
                          value={ed.endDate ? new Date(ed.endDate).toISOString().split('T')[0] : ''} 
                          onChange={(e) => updateEducation(idx, 'endDate', e.target.value)} 
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="flex flex-col gap-4 border-t border-border/40 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-bold uppercase">Certifications ({certifications.length})</span>
                <Button size="sm" variant="outline" onClick={addCert} leftIcon={<Plus size={14} />}>Add Cert</Button>
              </div>

              <div className="flex flex-col gap-4">
                {certifications.map((c, idx) => (
                  <Card key={idx} className="bg-surface/30 border-border/40 p-5 flex flex-col gap-3 relative">
                    <div className="absolute top-4 right-4">
                      <Button variant="ghost" size="sm" className="text-danger hover:bg-danger/10 p-2 min-w-0" onClick={() => removeCert(idx)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Certification Title" value={c.name} onChange={(e) => updateCert(idx, 'name', e.target.value)} />
                      <Input label="Issuer Organization" value={c.issuer} onChange={(e) => updateCert(idx, 'issuer', e.target.value)} />
                      <Input 
                        label="Issue Date" 
                        type="date" 
                        value={c.issueDate ? new Date(c.issueDate).toISOString().split('T')[0] : ''} 
                        onChange={(e) => updateCert(idx, 'issueDate', e.target.value)} 
                      />
                      <Input label="Credential URL" value={c.credentialUrl || ''} onChange={(e) => updateCert(idx, 'credentialUrl', e.target.value)} />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'socials' && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-bold uppercase">Social Links ({socialLinks.length})</span>
              <Button size="sm" variant="outline" onClick={addSocial} leftIcon={<Plus size={14} />}>Add Link</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialLinks.map((sl, idx) => (
                <Card key={idx} className="flex items-center gap-4 bg-surface/30 border-border/40 p-4 relative">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <Select 
                      options={[
                        { label: 'GitHub', value: 'github' },
                        { label: 'LinkedIn', value: 'linkedin' },
                        { label: 'Twitter', value: 'twitter' },
                        { label: 'Personal Website', value: 'website' },
                        { label: 'Dribbble', value: 'dribbble' },
                        { label: 'Email', value: 'email' }
                      ]} 
                      value={sl.platform} 
                      onChange={(e) => updateSocial(idx, 'platform', e.target.value)} 
                    />
                    <Input 
                      placeholder="https://..." 
                      value={sl.url} 
                      onChange={(e) => updateSocial(idx, 'url', e.target.value)} 
                    />
                  </div>
                  <Button variant="ghost" size="sm" className="text-danger hover:bg-danger/10 p-2 min-w-0" onClick={() => removeSocial(idx)}>
                    <Trash2 size={16} />
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Save Button floating footer style */}
      <div className="border-t border-border/40 pt-6 flex justify-end">
        <Button onClick={handleSave} isLoading={isUpdatingSections} leftIcon={<Save size={16} />}>
          Save Sections & Sync Portfolio
        </Button>
      </div>
    </div>
  );
};

export default ResumeEditor;
