import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, 
  User, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Code, 
  LogOut,
  Plus,
  Trash2,
  Edit2,
  X,
  Save,
  Check,
  Menu
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { Profile, Education, Experience, Skill, Certificate, Achievement } from '../types';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'profile' | 'education' | 'experience' | 'skills' | 'certificates' | 'achievements'>('profile');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const { data: profile } = await supabase.from('profiles').select('*').single();
    const { data: education } = await supabase.from('education').select('*').order('start_year', { ascending: false });
    const { data: experience } = await supabase.from('experiences').select('*').order('start_date', { ascending: false });
    const { data: skills } = await supabase.from('skills').select('*').order('level', { ascending: false });
    const { data: certificates } = await supabase.from('certificates').select('*').order('issue_date', { ascending: false });
    const { data: achievements } = await supabase.from('achievements').select('*').order('date', { ascending: false });

    setData({
      profile,
      education: education || [],
      experience: experience || [],
      skills: skills || [],
      certificates: certificates || [],
      achievements: achievements || []
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_10px_rgba(0,255,0,0.2)]"></div>
          <div className="font-mono text-brand-primary text-xs tracking-widest">LOADING DATA...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col lg:flex-row text-zinc-100 selection:bg-brand-primary selection:text-black">
      {/* Mobile Header */}
      <header className="lg:hidden glass border-b border-brand-border p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 glass rounded-lg flex items-center justify-center neon-glow border-brand-primary/30">
            <LayoutDashboard className="text-brand-primary w-5 h-5" />
          </div>
          <span className="font-bold text-sm tracking-tight">Admin Panel</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 glass rounded-lg text-zinc-400 hover:text-brand-primary transition-all"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 glass border-r border-brand-border flex flex-col z-50 transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-20
      `}>
        <div className="p-8 border-b border-brand-border hidden lg:block">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 glass rounded-xl flex items-center justify-center neon-glow border-brand-primary/30">
              <LayoutDashboard className="text-brand-primary w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-white block">Admin Panel</span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">System Control</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
          <TabButton active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }} icon={<User size={18} />} label="Profile" />
          <TabButton active={activeTab === 'education'} onClick={() => { setActiveTab('education'); setIsSidebarOpen(false); }} icon={<GraduationCap size={18} />} label="Education" />
          <TabButton active={activeTab === 'experience'} onClick={() => { setActiveTab('experience'); setIsSidebarOpen(false); }} icon={<Briefcase size={18} />} label="Experience" />
          <TabButton active={activeTab === 'skills'} onClick={() => { setActiveTab('skills'); setIsSidebarOpen(false); }} icon={<Code size={18} />} label="Skills" />
          <TabButton active={activeTab === 'certificates'} onClick={() => { setActiveTab('certificates'); setIsSidebarOpen(false); }} icon={<Award size={18} />} label="Certificates" />
          <TabButton active={activeTab === 'achievements'} onClick={() => { setActiveTab('achievements'); setIsSidebarOpen(false); }} icon={<Award size={18} />} label="Achievements" />
        </nav>

        <div className="p-6 border-t border-brand-border">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-mono text-sm uppercase tracking-wider"
          >
            <LogOut size={18} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <header className="mb-8 md:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="text-brand-primary font-mono text-[10px] md:text-xs mb-2 tracking-[0.3em] uppercase">Module: {activeTab}</div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight capitalize">{activeTab}</h1>
            </div>
            {activeTab !== 'profile' && (
              <button 
                onClick={() => setIsEditing('new')}
                className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl hover:bg-brand-primary transition-all font-bold shadow-lg transform hover:-translate-y-1 w-full sm:w-auto"
              >
                <Plus size={20} />
                <span>Add Record</span>
              </button>
            )}
          </header>

          <div className="glass rounded-3xl md:rounded-[2.5rem] overflow-hidden">
            {activeTab === 'profile' && <ProfileForm profile={data?.profile} onUpdate={fetchData} />}
            {activeTab === 'education' && <ListSection items={data?.education} type="education" onUpdate={fetchData} isEditing={isEditing} setIsEditing={setIsEditing} />}
            {activeTab === 'experience' && <ListSection items={data?.experience} type="experiences" onUpdate={fetchData} isEditing={isEditing} setIsEditing={setIsEditing} />}
            {activeTab === 'skills' && <ListSection items={data?.skills} type="skills" onUpdate={fetchData} isEditing={isEditing} setIsEditing={setIsEditing} />}
            {activeTab === 'certificates' && <ListSection items={data?.certificates} type="certificates" onUpdate={fetchData} isEditing={isEditing} setIsEditing={setIsEditing} />}
            {activeTab === 'achievements' && <ListSection items={data?.achievements} type="achievements" onUpdate={fetchData} isEditing={isEditing} setIsEditing={setIsEditing} />}
          </div>
        </div>
      </main>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all font-medium text-sm tracking-wide ${
        active 
          ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30 shadow-[0_0_15px_rgba(0,255,0,0.1)]' 
          : 'text-zinc-500 hover:text-zinc-200 hover:bg-brand-surface'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ProfileForm({ profile, onUpdate }: { profile: Profile | null, onUpdate: () => void }) {
  const { register, handleSubmit, reset } = useForm<Profile>({ defaultValues: profile || {} });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      reset({
        ...profile,
        social_links: profile.social_links || {}
      });
    }
  }, [profile, reset]);

  const onSubmit = async (formData: Profile) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({ ...formData, id: user.id });
    
    if (!error) onUpdate();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-10 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
          <input {...register('full_name')} className="w-full px-5 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white font-mono" />
        </div>
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest ml-1">Photo URL</label>
          <input {...register('photo_url')} className="w-full px-5 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white font-mono" />
        </div>
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest ml-1">Contact Email</label>
          <input {...register('contact_email')} className="w-full px-5 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white font-mono" />
        </div>
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest ml-1">WhatsApp Number</label>
          <input {...register('whatsapp_number')} className="w-full px-5 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white font-mono" />
        </div>
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest ml-1">CV URL (Link)</label>
          <input {...register('cv_url')} className="w-full px-5 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white font-mono" placeholder="https://..." />
        </div>
      </div>
      <div className="space-y-3">
        <label className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest ml-1">Bio</label>
        <textarea {...register('bio')} rows={4} className="w-full px-5 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white font-mono" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest ml-1">GitHub URL</label>
          <input {...register('social_links.github')} className="w-full px-5 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white font-mono" />
        </div>
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest ml-1">LinkedIn URL</label>
          <input {...register('social_links.linkedin')} className="w-full px-5 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white font-mono" />
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full sm:w-auto bg-white text-black px-10 py-4 rounded-xl font-bold hover:bg-brand-primary transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 shadow-lg">
        {loading ? 'SAVING...' : <><Save size={20} /> COMMIT CHANGES</>}
      </button>
    </form>
  );
}

function ListSection({ items, type, onUpdate, isEditing, setIsEditing }: { items: any[], type: string, onUpdate: () => void, isEditing: string | null, setIsEditing: (v: string | null) => void }) {
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    const { error } = await supabase.from(type).delete().eq('id', id);
    if (!error) onUpdate();
  };

  return (
    <div className="divide-y divide-brand-border">
      {isEditing === 'new' && (
        <div className="p-6 md:p-10 bg-brand-surface/30 border-b border-brand-border">
          <ItemForm type={type} onCancel={() => setIsEditing(null)} onUpdate={() => { setIsEditing(null); onUpdate(); }} />
        </div>
      )}
      {items.length === 0 && !isEditing && (
        <div className="p-12 md:p-20 text-center text-zinc-600 font-mono text-xs md:text-sm">
          {'>'} NO RECORDS FOUND IN MODULE: {type}
        </div>
      )}
      {items.map((item) => (
        <div key={item.id} className="p-6 md:p-8 hover:bg-brand-surface/20 transition-all duration-300 group">
          {isEditing === item.id ? (
            <ItemForm type={type} item={item} onCancel={() => setIsEditing(null)} onUpdate={() => { setIsEditing(null); onUpdate(); }} />
          ) : (
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
              <div className="space-y-2 w-full">
                <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-brand-primary transition-colors break-words">{item.title || item.name || item.institution_name || item.company}</h3>
                <p className="text-zinc-500 font-mono text-xs md:text-sm">{item.degree || item.role || item.issuer || item.category || item.awarder}</p>
                <div className="flex flex-wrap gap-3 mt-4">
                  {item.level && <div className="px-3 py-1 glass rounded-lg text-[9px] md:text-[10px] font-bold text-brand-primary uppercase tracking-widest">{item.level}% proficiency</div>}
                  {item.start_year && <div className="px-3 py-1 glass rounded-lg text-[9px] md:text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{item.start_year} - {item.end_year || 'Present'}</div>}
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto justify-end">
                <button onClick={() => setIsEditing(item.id)} className="flex-1 sm:flex-none p-3 glass text-zinc-500 hover:text-brand-primary hover:border-brand-primary/50 rounded-xl transition-all flex justify-center">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(item.id)} className="flex-1 sm:flex-none p-3 glass text-zinc-500 hover:text-red-400 hover:border-red-400/50 rounded-xl transition-all flex justify-center">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ItemForm({ type, item, onCancel, onUpdate }: { type: string, item?: any, onCancel: () => void, onUpdate: () => void }) {
  const { register, handleSubmit } = useForm({ defaultValues: item || {} });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData: any) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from(type)
      .upsert({ ...formData, user_id: user.id, id: item?.id || undefined });
    
    if (error) {
      alert(`Error saving: ${error.message}`);
    } else {
      onUpdate();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {type === 'education' && (
          <>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Institution</label>
              <input {...register('institution_name')} className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Degree</label>
              <input {...register('degree')} className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Major</label>
              <input {...register('major')} className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Start Year</label>
                <input {...register('start_year', { valueAsNumber: true })} type="number" className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">End Year</label>
                <input {...register('end_year', { valueAsNumber: true })} type="number" className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white" />
              </div>
            </div>
          </>
        )}
        {type === 'experiences' && (
          <>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Company</label>
              <input {...register('company')} className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Role</label>
              <input {...register('role')} className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Start Date</label>
              <input {...register('start_date')} type="date" className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">End Date</label>
              <input {...register('end_date')} type="date" className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white" />
            </div>
          </>
        )}
        {type === 'skills' && (
          <>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Skill Name</label>
              <input {...register('name')} className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Category</label>
              <input {...register('category')} className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Level (0-100)</label>
              <input {...register('level', { valueAsNumber: true })} type="number" className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white" />
            </div>
          </>
        )}
        {type === 'certificates' && (
          <>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Title</label>
              <input {...register('title')} className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Issuer</label>
              <input {...register('issuer')} className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Credential URL</label>
              <input {...register('credential_url')} className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Image URL</label>
              <input {...register('image_url')} className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Issue Date</label>
              <input {...register('issue_date')} type="date" className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white" />
            </div>
          </>
        )}
        {type === 'achievements' && (
          <>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Title</label>
              <input {...register('title')} className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Awarder</label>
              <input {...register('awarder')} className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Date</label>
              <input {...register('date')} type="date" className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white" />
            </div>
          </>
        )}
      </div>
      
      {(type === 'education' || type === 'experiences' || type === 'achievements') && (
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Description</label>
          <textarea {...register('description')} rows={3} className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:border-brand-primary transition-all text-white" />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button type="submit" disabled={loading} className="w-full sm:w-auto bg-brand-primary text-black px-8 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,255,0,0.2)]">
          {loading ? 'SAVING...' : <><Check size={18} /> COMMIT</>}
        </button>
        <button type="button" onClick={onCancel} className="w-full sm:w-auto px-8 py-3 glass text-zinc-400 rounded-xl font-bold hover:text-white transition-all flex items-center justify-center gap-2">
          <X size={18} /> ABORT
        </button>
      </div>
    </form>
  );
}
