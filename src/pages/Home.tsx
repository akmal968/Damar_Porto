import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  ExternalLink, 
  Award, 
  Briefcase, 
  GraduationCap, 
  Code,
  ChevronRight,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import type { Profile, Education, Experience, Skill, Certificate, Achievement } from '../types';

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    async function fetchData() {
      const [
        { data: profileData },
        { data: eduData },
        { data: expData },
        { data: skillData },
        { data: certData },
        { data: achData }
      ] = await Promise.all([
        supabase.from('profiles').select('*').single(),
        supabase.from('education').select('*').order('start_year', { ascending: false }),
        supabase.from('experiences').select('*').order('start_date', { ascending: false }),
        supabase.from('skills').select('*').order('level', { ascending: false }),
        supabase.from('certificates').select('*').order('issue_date', { ascending: false }),
        supabase.from('achievements').select('*').order('date', { ascending: false })
      ]);

      if (profileData) setProfile(profileData);
      if (eduData) setEducation(eduData);
      if (expData) setExperience(expData);
      if (skillData) setSkills(skillData);
      if (certData) setCertificates(certData);
      if (achData) setAchievements(achData);
      setLoading(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!profile?.bio) return;
    
    let i = 0;
    const fullText = profile.bio;
    const timer = setInterval(() => {
      setDisplayText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 15);
    
    return () => clearInterval(timer);
  }, [profile?.bio]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(0,255,0,0.3)]"></div>
          <div className="font-mono text-brand-primary animate-pulse tracking-widest uppercase text-xs">Initializing System...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
        <div className="text-center glass p-12 rounded-3xl max-w-md">
          <h1 className="text-2xl font-bold text-white mb-2">404: Profile Not Found</h1>
          <p className="text-zinc-500 font-mono text-sm">The requested user profile does not exist in the database.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-zinc-100 font-sans selection:bg-brand-primary selection:text-black">
      {/* Hero Section */}
      <header className="relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-primary/5 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-brand-primary/20 rounded-full blur-2xl group-hover:bg-brand-primary/30 transition-all duration-500" />
              <div className="w-48 h-48 md:w-72 md:h-72 rounded-full overflow-hidden border-2 border-brand-primary/50 relative z-10 neon-glow">
                <img 
                  src={profile.photo_url || 'https://picsum.photos/seed/avatar/400/400'} 
                  alt={profile.full_name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 glass p-4 rounded-2xl z-20 hidden md:block">
                <Code size={24} className="text-brand-primary" />
              </div>
            </motion.div>

            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-primary/30 bg-brand-primary/5 text-brand-primary text-xs font-mono mb-6"
              >
                <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(0,255,0,0.8)]" />
                AVAILABLE FOR HIRE
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl md:text-8xl font-bold tracking-tighter mb-6 text-gradient"
              >
                {profile.full_name}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-base md:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto md:mx-0 mb-10 font-mono min-h-[4rem] md:min-h-[4rem]"
              >
                <span className="text-brand-primary mr-2">{'>'}</span>
                {displayText}
                <span className="inline-block w-2 h-5 bg-brand-primary ml-1 animate-pulse" />
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap justify-center md:justify-start gap-4"
              >
                {profile.contact_email && (
                  <a href={`mailto:${profile.contact_email}`} className="flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-brand-primary transition-all duration-300 transform hover:-translate-y-1">
                    <Mail size={18} />
                    <span>Contact Me</span>
                  </a>
                )}
                {profile.cv_url && (
                  <a href={profile.cv_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-8 py-4 glass text-white font-bold rounded-xl hover:border-brand-primary transition-all duration-300 transform hover:-translate-y-1">
                    <FileText size={18} className="text-brand-primary" />
                    <span>Resume.pdf</span>
                  </a>
                )}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex justify-center md:justify-start gap-8 mt-12 text-zinc-500"
              >
                {profile.social_links?.github && <a href={profile.social_links.github} target="_blank" rel="noreferrer" className="hover:text-brand-primary transition-colors"><Github size={22} /></a>}
                {profile.social_links?.linkedin && <a href={profile.social_links.linkedin} target="_blank" rel="noreferrer" className="hover:text-brand-primary transition-colors"><Linkedin size={22} /></a>}
                {profile.social_links?.twitter && <a href={profile.social_links.twitter} target="_blank" rel="noreferrer" className="hover:text-brand-primary transition-colors"><Twitter size={22} /></a>}
                {profile.social_links?.instagram && <a href={profile.social_links.instagram} target="_blank" rel="noreferrer" className="hover:text-brand-primary transition-colors"><Instagram size={22} /></a>}
                {profile.whatsapp_number && <a href={`https://wa.me/${profile.whatsapp_number}`} target="_blank" rel="noreferrer" className="hover:text-brand-primary transition-colors"><Phone size={22} /></a>}
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-32 space-y-48">
        {/* Skills Section */}
        <section id="skills" className="scroll-mt-32">
          <div className="flex flex-col items-center text-center mb-20">
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center mb-6">
              <Code className="text-brand-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Tech Stack</h2>
            <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Tools & Technologies I use to build</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <motion.div 
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass p-8 rounded-3xl group hover:border-brand-primary/50 transition-all duration-500"
              >
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-xs text-brand-primary font-mono mb-2 uppercase tracking-widest">{skill.category}</p>
                    <h3 className="text-xl font-bold">{skill.name}</h3>
                  </div>
                  <span className="text-2xl font-bold text-zinc-700 group-hover:text-brand-primary transition-colors">{skill.level}%</span>
                </div>
                <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    viewport={{ once: true }}
                    className="h-full bg-gradient-to-r from-brand-primary to-emerald-400 shadow-[0_0_10px_rgba(0,255,0,0.5)]"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
                <Briefcase size={20} className="text-brand-primary" />
              </div>
              <h2 className="text-4xl font-bold tracking-tight">Experience</h2>
            </div>
          </div>

          <div className="space-y-12 relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-brand-primary/50 via-brand-border to-transparent hidden md:block" />
            
            {experience.map((exp, index) => (
              <motion.div 
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative md:pl-20"
              >
                <div className="absolute left-[12px] top-2 w-4 h-4 rounded-full bg-brand-bg border-2 border-brand-primary z-10 hidden md:block" />
                <div className="glass p-8 md:p-10 rounded-[2rem] hover:bg-brand-surface/80 transition-all duration-500 group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                      <h3 className="text-2xl font-bold group-hover:text-brand-primary transition-colors">{exp.role}</h3>
                      <p className="text-zinc-400 font-mono text-sm mt-1">{exp.company}</p>
                    </div>
                    <div className="px-4 py-2 glass rounded-full text-xs font-mono text-zinc-400 whitespace-nowrap">
                      {new Date(exp.start_date).getFullYear()} — {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present'}
                    </div>
                  </div>
                  <p className="text-zinc-500 leading-relaxed text-lg">{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-20">
            <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
              <GraduationCap size={20} className="text-brand-primary" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight">Education</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {education.map((edu, index) => (
              <motion.div 
                key={edu.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass p-10 rounded-[2.5rem] relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <GraduationCap size={80} />
                </div>
                <div className="text-xs font-mono text-brand-primary mb-6 tracking-[0.2em] uppercase">
                  {edu.start_year} — {edu.end_year || 'Present'}
                </div>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{edu.degree}</h3>
                  <p className="text-zinc-400 font-medium">{edu.major}</p>
                  <p className="text-zinc-600 text-sm mt-4 font-mono">{edu.institution_name}</p>
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed border-t border-brand-border pt-6">{edu.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Certificates & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32">
          <section>
            <div className="flex items-center gap-4 mb-16">
              <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
                <Award size={20} className="text-brand-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Certificates</h2>
            </div>
            <div className="space-y-6">
              {certificates.map((cert, index) => (
                <motion.a 
                  key={cert.id} 
                  href={cert.credential_url} 
                  target="_blank" 
                  rel="noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group flex items-center gap-6 p-6 glass rounded-2xl hover:border-brand-primary/50 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0 border border-brand-border">
                    <img src={cert.image_url || 'https://picsum.photos/seed/cert/100/100'} alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate group-hover:text-brand-primary transition-colors">{cert.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1 font-mono">{cert.issuer}</p>
                  </div>
                  <ChevronRight size={18} className="text-zinc-700 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                </motion.a>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-16">
              <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
                <Award size={20} className="text-brand-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Achievements</h2>
            </div>
            <div className="space-y-10">
              {achievements.map((ach, index) => (
                <motion.div 
                  key={ach.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative pl-10 border-l-2 border-brand-border hover:border-brand-primary transition-colors duration-500"
                >
                  <div className="absolute left-[-9px] top-0 w-4 h-4 bg-brand-bg border-2 border-brand-border rounded-full group-hover:border-brand-primary" />
                  <div className="text-xs font-mono text-brand-primary mb-3 tracking-widest uppercase">
                    {new Date(ach.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{ach.title}</h3>
                  <p className="text-xs text-zinc-500 font-mono mb-4 uppercase tracking-wider">{ach.awarder}</p>
                  <p className="text-zinc-500 text-sm leading-relaxed">{ach.description}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-brand-border py-20 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <div className="font-mono font-bold text-brand-primary tracking-tighter text-2xl mb-8">
            {profile.full_name}
            <span className="animate-pulse">_</span>
          </div>
          <p className="text-zinc-500 text-sm font-mono">
            Built with React, Supabase & Neon Energy.
          </p>
          <p className="text-zinc-700 text-xs mt-4">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
