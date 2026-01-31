"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, DollarSign, BookOpen, Search, AlertCircle, Loader2, 
  ArrowRight, MessageSquare, X, Send, User, Bot, Lock, CheckCircle,
  Sun, Moon, GraduationCap, Star, TrendingUp, Globe, ChevronRight,
  Shield, Target, Sparkles, LogIn, Mail, Key, FileText, Calendar, 
  CheckSquare, AlertTriangle, PenTool, Copy, Check, ChevronDown, Briefcase, Award,
  Clock, MoreHorizontal, Layout, Zap, ArrowUpRight, Globe2, Languages, Download, 
  RefreshCw, CreditCard 
} from 'lucide-react';

// --- CONFIGURATION ---
const API_BASE_URL = "https://dream-uni-backend.onrender.com";

// --- TYPES ---
interface University {
  id: number;
  name: string;
  country: string;
  tuition_fees_usd: number;
  image_url: string;
  type?: string;
  tags?: string[];
  ranking_global?: number;
  acceptance_rate_percent?: number;
  matchCategory?: 'Dream' | 'Target' | 'Safe';
}

interface TestScore {
  name: string;
  score: string;
}

interface UserProfile {
  name: string;
  email: string;
  city: string;
  currency: string;
  budget: number;
  gpa: number;
  targetDegree: string;
  targetCourse: string; 
  targetCountry: string;
  languages: string[];
  tests: TestScore[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Task {
    id: string;
    label: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    deadline: string;
    aiAction?: string; 
}

// --- LOGIC ENGINE ---
const generateCountryAnalysis = (profile: UserProfile) => {
    let countries = [
        { name: "Canada", match: 60, reason: "Immigration friendly & moderate tuition.", type: "Medium Match" },
        { name: "Germany", match: 65, reason: "Low tuition fees, high technical standards.", type: "Medium Match" },
        { name: "USA", match: 55, reason: "Top tier education but high cost.", type: "Medium Match" },
        { name: "UK", match: 60, reason: "1-year Masters is time efficient.", type: "Medium Match" },
        { name: "Australia", match: 65, reason: "High quality of life & post-study work.", type: "Medium Match" },
        { name: "India", match: 50, reason: "Home advantage & low cost.", type: "Low Match" },
        { name: "Ireland", match: 60, reason: "Growing tech hub in Europe.", type: "Medium Match" }
    ];

    countries = countries.map(c => {
        if (c.name === profile.targetCountry) {
            return { ...c, match: 95, type: "High Match", reason: `Your primary preference: ${c.name}` };
        }
        return c;
    });

    if (profile.budget < 15000) {
        countries = countries.map(c => {
            if (c.name === "India") return { ...c, match: 98, type: "High Match", reason: "Best financial fit." };
            if (c.name === "Germany") return { ...c, match: 90, type: "High Match", reason: "Tuition free options." };
            return c;
        });
    }

    return countries.sort((a, b) => b.match - a.match).slice(0, 4);
};

// --- VIEW COMPONENTS ---

// 1. LANDING PAGE
const LandingView = ({ onStart }: any) => (
  <div className="flex flex-col items-center justify-center min-h-[90vh] text-center px-4 relative overflow-hidden bg-[#050505] text-white">
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-violet-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px]" />
    </div>

    <div className="border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium tracking-wide mb-8 text-violet-300">
        ✨ AI-First Admission Strategy
    </div>
    
    <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter leading-[1.1]">
        Dream <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">University.</span><br/>
        <span className="text-white/40">Made Possible.</span>
    </h1>
    
    <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
        Your personal AI counsellor. From profile analysis to SOP drafting, we guide you to your acceptance letter.
    </p>
    
    <button onClick={onStart} className="group relative px-10 py-4 bg-white text-black rounded-full font-bold text-lg shadow-[0_0_50px_-12px_rgba(255,255,255,0.5)] transition-all hover:scale-105 active:scale-95">
        Start Your Journey <ArrowRight className="ml-2 w-5 h-5 inline-block transition-transform group-hover:translate-x-1" />
    </button>

    <div className="mt-24 pt-8 border-t border-white/5 w-full max-w-4xl flex justify-between items-center text-neutral-500 text-sm font-medium uppercase tracking-widest">
        <span>Harvard</span>
        <span>Stanford</span>
        <span>IIT Bombay</span>
        <span>Oxford</span>
        <span>Toronto</span>
    </div>
  </div>
);

// 2. AUTH VIEW
const AuthView = ({ onLogin }: any) => {
    const [name, setName] = useState("");
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (/^[a-zA-Z\s]*$/.test(val)) setName(val);
    };

    return (
    <div className="flex items-center justify-center min-h-[90vh] bg-[#050505] px-4 w-full">
      <div className="w-full max-w-md p-8 rounded-3xl border border-white/10 bg-[#0a0a0a] flex flex-col items-center text-center">
        <div className="mb-8">
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10"><LogIn className="text-white h-6 w-6" /></div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome</h2>
          <p className="text-neutral-500 text-sm">Enter your details to sync your progress.</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onLogin(name || 'Student', 'user@example.com'); }} className="space-y-5 w-full">
            <div className="text-left"><label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1 mb-2 block">Full Name</label><input required type="text" value={name} onChange={handleNameChange} placeholder="Rahul Sharma" className="w-full p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all" /></div>
            <div className="text-left"><label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1 mb-2 block">Email</label><input required type="email" placeholder="student@example.com" className="w-full p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all" /></div>
            <button type="submit" className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-900/20">Continue</button>
        </form>
      </div>
    </div>
    );
};

// 3. ONBOARDING VIEW
const OnboardingView = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<UserProfile>({ 
      name: '', email: '', city: '', currency: 'USD', budget: 30000, 
      gpa: 0, targetDegree: 'Masters', targetCourse: '', targetCountry: 'USA', tests: [], languages: []
  });
  
  const [newTest, setNewTest] = useState({ name: 'IELTS', score: '' });
  const [budgetInput, setBudgetInput] = useState('30,000'); 

  const addTest = () => { if (newTest.score) { setData({ ...data, tests: [...data.tests, newTest] }); setNewTest({ ...newTest, score: '' }); } };
  
  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (!/[a-zA-Z]/.test(val)) { setNewTest({...newTest, score: val}); }
  };

  const toggleLang = (lang: string) => { 
      if (data.languages.includes(lang)) setData({...data, languages: data.languages.filter(l => l !== lang)});
      else setData({...data, languages: [...data.languages, lang]});
  };

  const handleNext = () => { 
      const numericBudget = parseInt(budgetInput.replace(/,/g, '')) || 0;
      const updatedData = { ...data, budget: numericBudget };
      if (step < 4) { setData(updatedData); setStep(step + 1); } 
      else { onSubmit(updatedData); }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-[#050505] px-4">
      <div className="w-full max-w-2xl p-10 rounded-3xl border border-white/10 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1 bg-violet-600 transition-all duration-500" style={{ width: `${(step/4)*100}%` }} />
        
        <div className="flex justify-between items-center mb-12">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className={`text-xs font-bold tracking-widest uppercase ${step >= i ? 'text-violet-400' : 'text-neutral-700'}`}>
                    0{i} {i === 1 ? 'Academics' : i === 2 ? 'Budget' : i === 3 ? 'Language' : 'Target'}
                </div>
            ))}
        </div>

        <div className="min-h-[350px]">
            {/* STEP 1: ACADEMICS */}
            {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                    <div><h2 className="text-4xl font-bold text-white mb-2">Academic Profile</h2><p className="text-neutral-500">Your scorecard for admission.</p></div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2"><label className="text-xs font-bold text-neutral-500 uppercase">Target Degree</label><select className="w-full text-lg bg-transparent border-b border-neutral-800 py-2 outline-none text-white focus:border-violet-500" value={data.targetDegree} onChange={e => setData({...data, targetDegree: e.target.value})}><option className="bg-neutral-900">Masters (MS/MA)</option><option className="bg-neutral-900">Bachelors (BS/BA)</option><option className="bg-neutral-900">MBA</option></select></div>
                        <div className="space-y-2"><label className="text-xs font-bold text-neutral-500 uppercase">CGPA / Percentage</label><input type="number" step="0.1" autoFocus className="w-full text-2xl font-bold bg-transparent border-b border-neutral-800 py-2 outline-none text-white focus:border-violet-500 transition-colors" placeholder="8.5" value={data.gpa || ''} onChange={e => setData({...data, gpa: Number(e.target.value)})} /></div>
                    </div>
                    <div className="space-y-2"><label className="text-xs font-bold text-neutral-500 uppercase">Target Course</label><input type="text" className="w-full text-xl bg-transparent border-b border-neutral-800 py-2 outline-none text-white focus:border-violet-500 placeholder:text-neutral-800" placeholder="e.g. Computer Science, Business Analytics" value={data.targetCourse} onChange={e => setData({...data, targetCourse: e.target.value})} /></div>
                    <div><label className="text-xs font-bold text-neutral-500 uppercase mb-3 block">Entrance Exams</label><div className="flex gap-3 mb-3"><select className="p-3 rounded-lg border border-neutral-800 bg-neutral-900 text-white outline-none w-1/3" value={newTest.name} onChange={e => setNewTest({...newTest, name: e.target.value})}><option>JEE Mains</option><option>JEE Advanced</option><option>CUET</option><option>NEET</option><option>GATE</option><option>CAT</option><option>SAT</option><option>IELTS</option><option>TOEFL</option><option>GRE</option></select><input type="text" placeholder="Score/Rank" className="flex-1 p-3 rounded-lg border border-neutral-800 bg-neutral-900 text-white outline-none" value={newTest.score} onChange={handleScoreChange} /><button onClick={addTest} className="px-4 bg-violet-600 rounded-lg text-white hover:bg-violet-500"><Check className="w-5 h-5"/></button></div><div className="flex flex-wrap gap-2">{data.tests.map((t, i) => (<span key={i} className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs border border-violet-500/20">{t.name}: {t.score}</span>))}</div></div>
                </div>
            )}

            {/* STEP 2: BUDGET */}
            {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                    <div><h2 className="text-4xl font-bold text-white mb-2">Budget Planning</h2><p className="text-neutral-500">Define your annual financial comfort zone.</p></div>
                    <div className="flex flex-col gap-4">
                        <label className="text-xs font-bold text-neutral-500 uppercase">Annual Budget Limit</label>
                        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden p-3">
                            <div className="relative">
                                <select className="bg-transparent text-white font-bold text-lg px-4 py-2 outline-none cursor-pointer appearance-none pr-8 hover:text-violet-400 transition-colors" value={data.currency} onChange={e => setData({...data, currency: e.target.value})}>
                                    <option className="bg-neutral-900" value="USD">USD</option><option className="bg-neutral-900" value="INR">INR</option><option className="bg-neutral-900" value="EUR">EUR</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                            <div className="h-8 w-[1px] bg-neutral-800 mx-2"></div>
                            <input type="text" autoFocus className="flex-1 bg-transparent border-none outline-none text-white text-3xl font-bold px-4 placeholder:text-neutral-700" placeholder="30,000" value={budgetInput} onChange={e => setBudgetInput(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500 bg-violet-500/10 p-3 rounded-lg border border-violet-500/20"><AlertCircle className="w-4 h-4 text-violet-500"/> <span>AI will prioritize universities within this budget.</span></div>
                </div>
            )}

            {/* STEP 3: LANGUAGES */}
            {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                    <div><h2 className="text-4xl font-bold text-white mb-2">Languages</h2><p className="text-neutral-500">Select languages you speak or want to learn.</p></div>
                    <div className="grid grid-cols-2 gap-4">{['English', 'German', 'French', 'Spanish', 'Hindi', 'Mandarin'].map(lang => (<button key={lang} onClick={() => toggleLang(lang)} className={`p-4 rounded-xl border text-left flex justify-between items-center transition-all ${data.languages.includes(lang) ? 'bg-violet-600 border-violet-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}><span className="font-semibold">{lang}</span>{data.languages.includes(lang) && <CheckCircle className="w-5 h-5 text-white" />}</button>))}</div>
                </div>
            )}

            {/* STEP 4: TARGET */}
            {step === 4 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                    <div><h2 className="text-4xl font-bold text-white mb-2">Destination</h2><p className="text-neutral-500">Select your primary target country.</p></div>
                    <div className="grid grid-cols-2 gap-4">{['USA', 'UK', 'Canada', 'Germany', 'Australia', 'Ireland', 'India', 'New Zealand'].map(c => (<button key={c} onClick={() => setData({...data, targetCountry: c})} className={`p-6 rounded-2xl border text-left text-lg font-medium transition-all flex items-center justify-between group ${data.targetCountry === c ? 'border-violet-500 bg-violet-500/10 text-white' : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:border-neutral-600 hover:text-white'}`}>{c}{data.targetCountry === c && <CheckCircle className="w-5 h-5 text-violet-500" />}</button>))}</div>
                </div>
            )}
        </div>
        <div className="flex justify-end pt-10"><button onClick={handleNext} disabled={(step===1 && !data.gpa)} className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center">{step === 4 ? 'Generate Strategy' : 'Next Step'} <ArrowRight className="w-4 h-4 ml-2"/></button></div>
      </div>
    </div>
  );
};

// 4. ANALYSIS VIEW
const AnalysisView = ({ profile, onContinue }: { profile: UserProfile, onContinue: () => void }) => {
    const countries = generateCountryAnalysis(profile);
    const [loading, setLoading] = useState(true);
    useEffect(() => { const timer = setTimeout(() => setLoading(false), 2000); return () => clearTimeout(timer); }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[90vh] bg-[#050505]"><Loader2 className="w-12 h-12 text-violet-500 animate-spin mb-6" /><h2 className="text-2xl font-bold text-white animate-pulse">Running Neural Analysis...</h2><p className="text-neutral-500 mt-2 font-mono text-sm">Checking {profile.gpa} GPA against 240+ Datapoints</p></div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white py-16 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-end mb-12"><div className="space-y-1"><h1 className="text-4xl font-bold">Strategic Assessment</h1><p className="text-neutral-500">AI-generated evaluation of your profile.</p></div><button onClick={onContinue} className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors flex items-center">Proceed to Shortlist <ArrowRight className="ml-2 w-4 h-4"/></button></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">{countries.map((c, i) => (<div key={c.name} className={`p-6 rounded-2xl border flex items-center gap-6 transition-all ${i===0 ? 'bg-violet-900/10 border-violet-500/30' : 'bg-[#0a0a0a] border-white/5'}`}><div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${i===0 ? 'bg-violet-500 text-white' : 'bg-neutral-800 text-neutral-400'}`}>{c.name.slice(0,2)}</div><div className="flex-1"> <div className="flex items-center gap-3 mb-1"><h3 className="text-xl font-bold">{c.name}</h3><span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold ${c.match > 80 ? 'text-green-400 bg-green-900/20' : c.match > 50 ? 'text-amber-400 bg-amber-900/20' : 'text-red-400 bg-red-900/20'}`}>{c.type}</span></div><p className="text-sm text-neutral-400">{c.reason}</p></div><div className="text-right"><div className="text-2xl font-bold">{c.match}%</div><div className="text-xs text-neutral-500 uppercase">Match</div></div></div>))}</div>
                    <div className="space-y-4"><div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5"><h4 className="font-bold text-neutral-200 mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-violet-500"/> Recommendation</h4><p className="text-sm text-neutral-400 leading-relaxed">Based on your {profile.budget} budget and {profile.gpa} GPA, we highly recommend focusing on <b>{countries[0].name}</b> for the best ROI. <b>{countries[2].name}</b> appears risky due to high competition.</p></div><div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5"><h4 className="font-bold text-neutral-200 mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500"/> Action Items</h4><ul className="space-y-3 text-sm text-neutral-400">{(!profile.tests.length) && <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"/><span>Take IELTS/TOEFL immediately.</span></li>}<li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"/><span>Prepare financial documents.</span></li></ul></div></div>
                </div>
            </div>
        </div>
    );
};

// 5. APPLICATION VIEW
const KanbanBoard = ({ tasks, onToggleTask, onGenerateSOP, onCompleteSOP }: any) => {
    const columns = [
        { id: 'TODO', title: 'To Do' },
        { id: 'IN_PROGRESS', title: 'In Progress' },
        { id: 'DONE', title: 'Completed' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map(col => {
                const colTasks = tasks.filter((t: Task) => t.status === col.id);
                return (
                    <div key={col.id} className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4 px-2"><h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">{col.title}</h3><span className="text-xs text-neutral-600 bg-neutral-900 px-2 py-1 rounded">{colTasks.length}</span></div>
                        <div className="flex-1 space-y-3 p-1">
                            {colTasks.map((task: Task) => (
                                <div key={task.id} className={`p-4 rounded-xl bg-[#0F0F0F] border transition-all group ${task.status === 'DONE' ? 'border-green-500/30 bg-green-900/10' : 'border-white/5 hover:border-white/10'}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                                            {task.status !== 'TODO' && <button onClick={() => onToggleTask(task.id, 'TODO')} className="p-1 hover:bg-neutral-800 rounded text-neutral-400"><ChevronRight className="w-3 h-3 rotate-180"/></button>}
                                            {task.status !== 'DONE' && <button onClick={() => onToggleTask(task.id, task.status === 'TODO' ? 'IN_PROGRESS' : 'DONE')} className="p-1 hover:bg-neutral-800 rounded text-neutral-400"><ChevronRight className="w-3 h-3"/></button>}
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        {task.status === 'DONE' ? (
                                            <div className="mt-0.5 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20"><Check className="w-3.5 h-3.5 text-white stroke-[3]" /></div>
                                        ) : (
                                            <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-neutral-700 shrink-0" />
                                        )}
                                        <h4 className={`font-medium text-sm text-neutral-200 mb-2 ${task.status === 'DONE' ? 'line-through text-neutral-500' : ''}`}>{task.label}</h4>
                                    </div>
                                    <div className="pl-8 mt-2 space-y-2">
                                        {task.aiAction === 'SOP' && task.status !== 'DONE' && (
                                            <button onClick={onGenerateSOP} className="w-full py-2 bg-violet-900/20 hover:bg-violet-900/30 text-violet-400 text-xs font-bold rounded-lg border border-violet-500/20 flex items-center justify-center gap-2 transition-colors"><Sparkles className="w-3 h-3" /> Draft with AI</button>
                                        )}
                                        {task.id === '4' && task.status !== 'DONE' && (
                                            <button onClick={() => onToggleTask(task.id, 'DONE')} className="w-full py-2 bg-emerald-900/20 hover:bg-emerald-900/30 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20 flex items-center justify-center gap-2 transition-colors"><CreditCard className="w-3 h-3" /> Mark Paid</button>
                                        )}
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center text-xs text-neutral-600 pl-8"><span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {task.deadline}</span></div>
                                </div>
                            ))}
                            {colTasks.length === 0 && <div className="h-32 rounded-xl border border-dashed border-neutral-800 flex items-center justify-center text-xs text-neutral-700">No tasks</div>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// --- UNIVERSITY DETAILS MODAL ---
const UniversityDetailsModal = ({ university, isOpen, onClose }: { university: University | null, isOpen: boolean, onClose: () => void }) => {
    if (!isOpen || !university) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]">
                <div className="relative h-40 shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10"/>
                    <img src={university.image_url} className="w-full h-full object-cover"/>
                    <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white z-20 hover:bg-black/70"><X className="w-5 h-5"/></button>
                    <div className="absolute bottom-4 left-6 z-20"><h2 className="text-3xl font-bold text-white">{university.name}</h2><p className="text-neutral-400 flex items-center gap-2"><MapPin className="w-4 h-4"/> {university.country}</p></div>
                </div>
                <div className="p-6 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800"><p className="text-xs text-neutral-500 uppercase font-bold">Global Rank</p><p className="text-2xl font-bold text-white">#{university.ranking_global || 'N/A'}</p></div>
                        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800"><p className="text-xs text-neutral-500 uppercase font-bold">Acceptance Rate</p><p className="text-2xl font-bold text-white">{university.acceptance_rate_percent || '?'}%</p></div>
                        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800"><p className="text-xs text-neutral-500 uppercase font-bold">Tuition</p><p className="text-2xl font-bold text-emerald-400">${university.tuition_fees_usd.toLocaleString()}</p></div>
                        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800"><p className="text-xs text-neutral-500 uppercase font-bold">Fit Analysis</p><p className="text-xl font-bold text-violet-400">{university.matchCategory || 'Good Match'}</p></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-2">Why this university?</h3>
                        <p className="text-sm text-neutral-400 leading-relaxed">Based on your profile, {university.name} offers strong programs in your target field. The location in {university.country} aligns with your preferences, and while the tuition is ${university.tuition_fees_usd}, it offers high ROI potential.</p>
                    </div>
                </div>
                <div className="p-4 border-t border-white/5 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-neutral-200">Close</button>
                </div>
            </div>
        </div>
    );
};

// --- SUCCESS VIEW (THE END GAME) ---
const SuccessView = ({ universityName }: { universityName: string }) => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-[#050505]/50 to-[#050505]"></div></div>
        <div className="z-10 animate-in zoom-in duration-700">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_60px_-10px_rgba(34,197,94,0.6)] animate-bounce">
                <Check className="w-12 h-12 text-black stroke-[3]" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter">Congratulations!</h1>
            <p className="text-xl text-neutral-400 mb-8 max-w-xl mx-auto">Your application journey for <span className="text-violet-400 font-bold">{universityName}</span> is complete.</p>
            <div className="flex gap-4 justify-center">
                <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-all flex items-center gap-2"><Download className="w-4 h-4"/> Download Report</button>
                <button onClick={() => window.location.reload()} className="px-8 py-3 bg-neutral-900 text-white font-bold rounded-full border border-neutral-800 hover:bg-neutral-800 transition-all">Start New Application</button>
            </div>
        </div>
    </div>
);

// --- CHAT WIDGET ---
const ChatWidget = ({ userProfile }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (userProfile && messages.length === 0) setMessages([{ role: 'assistant', content: `Hello ${userProfile.name}. I am your dedicated counsellor from Dream University. How may I assist you today?` }]); }, [userProfile]);
  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return; setInputValue(""); setMessages(prev => [...prev, { role: 'user', content: text }]); setIsTyping(true);
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: `Profile: ${userProfile?.budget} budget, ${userProfile?.gpa} GPA. Query: ${text}` }) });
      const data = await response.json(); setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) { setMessages(prev => [...prev, { role: 'assistant', content: "System Offline." }]); } finally { setIsTyping(false); }
  };

  if (!userProfile) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5">
          <div className="bg-[#0f0f0f] p-4 flex justify-between items-center border-b border-white/5">
             <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/><span className="font-bold text-white text-sm">Dream University AI</span></div>
             <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (<div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-violet-600 text-white' : 'bg-[#1a1a1a] text-neutral-300 border border-white/5'}`}>{msg.content}</div></div>))}
            {isTyping && <div className="text-neutral-600 text-xs ml-4">Typing...</div>} <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar"><button onClick={() => handleSendMessage("Draft email to professor")} className="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1a1a1a] text-neutral-400 hover:text-white border border-white/5 transition-colors">Draft Email</button><button onClick={() => handleSendMessage("Visa requirements")} className="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1a1a1a] text-neutral-400 hover:text-white border border-white/5 transition-colors">Visa Help</button></div>
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }} className="p-4 bg-[#0f0f0f]">
            <div className="flex gap-2"><input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Type a message..." className="flex-1 bg-[#050505] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-violet-500 outline-none" /><button type="submit" className="bg-violet-600 text-white p-2.5 rounded-lg"><Send className="w-4 h-4" /></button></div>
          </form>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 p-4 rounded-full bg-violet-600 text-white shadow-2xl hover:scale-110 transition-all z-50 hover:bg-violet-500">{isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}</button>
    </>
  );
};

// --- MAIN APP SHELL ---
export default function App() {
  const [view, setView] = useState<'LANDING' | 'AUTH' | 'ONBOARDING' | 'ANALYSIS' | 'DASHBOARD' | 'APPLICATION'>('LANDING');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [lockedIds, setLockedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
      { id: '1', label: 'Draft Statement of Purpose', status: 'TODO', deadline: 'Oct 15', aiAction: 'SOP' },
      { id: '2', label: 'Finalize University Selection', status: 'IN_PROGRESS', deadline: 'Oct 20' }, 
      { id: '3', label: 'Order Transcripts', status: 'DONE', deadline: 'Sep 30' },
      { id: '4', label: 'Pay Application Fee', status: 'TODO', deadline: 'Nov 01' }
  ]);
  const [sopModalOpen, setSopModalOpen] = useState(false);
  const [selectedUniDetails, setSelectedUniDetails] = useState<University | null>(null);
  const [generatedSOP, setGeneratedSOP] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Logic
  const categorize = (uni: University, gpa: number) => {
      if (uni.ranking_global && uni.ranking_global <= 50) return gpa >= 3.8 ? 'Target' : 'Dream';
      if (uni.ranking_global && uni.ranking_global <= 100) return gpa >= 3.0 ? 'Target' : 'Dream';
      return 'Safe';
  };

  const fetchUniversities = async () => {
      setLoading(true);
      try { 
          const res = await fetch(`${API_BASE_URL}/universities`); 
          if (!res.ok) throw new Error("API Response not OK");
          const json = await res.json(); 
          let data = json.data || json;

          const hasIndia = data.some((u: University) => u.country === "India");
          if (!hasIndia) {
            data = [
                ...data,
                { id: 101, name: "Indian Institute of Technology (IIT) Bombay", country: "India", tuition_fees_usd: 3000, image_url: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80", type: "Public", ranking_global: 149, matchCategory: "Dream" },
                { id: 102, name: "Indian Institute of Science (IISc)", country: "India", tuition_fees_usd: 2000, image_url: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?auto=format&fit=crop&q=80", type: "Public", ranking_global: 155, matchCategory: "Dream" },
                { id: 103, name: "University of Delhi", country: "India", tuition_fees_usd: 500, image_url: "https://images.unsplash.com/photo-1592280771800-bcf9a1a4788c?auto=format&fit=crop&q=80", type: "Public", ranking_global: 500, matchCategory: "Safe" }
            ];
          }
          setUniversities(data); 
      } 
      catch (e) { 
          console.error("Backend Fetch Failed, using Fallback Data:", e); 
          setUniversities([
            { id: 1, name: "Stanford University", country: "USA", tuition_fees_usd: 62000, image_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80", type: "Private", ranking_global: 3 },
            { id: 101, name: "IIT Bombay", country: "India", tuition_fees_usd: 3000, image_url: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80", type: "Public", ranking_global: 149 },
            { id: 2, name: "University of Oxford", country: "UK", tuition_fees_usd: 35000, image_url: "https://images.unsplash.com/photo-1592280771800-bcf9a1a4788c?auto=format&fit=crop&q=80", type: "Public", ranking_global: 5 }
          ]); 
      } 
      finally { setLoading(false); }
  };

  const handleLogin = (name: string, email: string) => { setUserProfile({ name, email, city: '', currency: 'USD', budget: 0, gpa: 0, targetDegree: '', targetCourse: '', targetCountry: '', languages: [], tests: [] }); setView('ONBOARDING'); };
  const handleOnboarding = (data: any) => { if (userProfile) { setUserProfile({ ...userProfile, ...data }); fetchUniversities(); setView('ANALYSIS'); } };
  
  const handleLock = (id: number) => {
      setLockedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
      if (!lockedIds.includes(id)) {
          setTasks(prev => prev.map(t => t.id === '2' ? { ...t, status: 'DONE' } : t));
      }
  };

  const handleTaskStatus = (id: string, status: Task['status']) => setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));

  // AI ACTIONS
  const generateSOP = async () => {
        setIsGenerating(true); setSopModalOpen(true); setGeneratedSOP(""); // Clear previous
        try {
            const prompt = `Act as an expert SOP Writer. Write a 200-word Statement of Purpose for ${userProfile?.name}. \n\nProfile:\n- GPA: ${userProfile?.gpa}\n- Target: ${userProfile?.targetDegree} in ${userProfile?.targetCountry}\n- Course: ${userProfile?.targetCourse}\n- Languages: ${userProfile?.languages.join(", ")}`;
            
            // Add Timeout to fail fast and show mock if backend is slow
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

            const response = await fetch(`${API_BASE_URL}/chat`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ message: prompt }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error("Backend Error");
            const data = await response.json();
            setGeneratedSOP(data.response);
        } catch (error) { 
            console.warn("AI Generation Failed, using Fallback:", error);
            // FALLBACK SOP FOR DEMO
            const mockSOP = `STATEMENT OF PURPOSE\n\nTo the Admissions Committee,\n\nI am writing to express my strong interest in the ${userProfile?.targetDegree} program in ${userProfile?.targetCourse} at your esteemed university. With a GPA of ${userProfile?.gpa} and a deep passion for the field, I believe I am an ideal candidate for this program.\n\nMy academic journey has been defined by a curiosity to learn and a drive to excel. Having developed proficiency in ${userProfile?.languages.join(", ") || "multiple languages"}, I appreciate the value of diverse perspectives in problem-solving. My goal is to gain specialized knowledge and practical skills that will allow me to make meaningful contributions to the industry.\n\nI am particularly drawn to your university's reputation for excellence and its commitment to fostering innovation. I am eager to engage with your distinguished faculty and collaborate with fellow students from around the world.\n\nThank you for considering my application.\n\nSincerely,\n${userProfile?.name}`;
            
            setTimeout(() => {
                setGeneratedSOP(mockSOP);
            }, 1000);
        } finally { 
            setIsGenerating(false); 
        }
  };

  const acceptSOP = () => {
      const sopTask = tasks.find(t => t.aiAction === 'SOP');
      if (sopTask) {
          handleTaskStatus(sopTask.id, 'DONE');
      }
      setSopModalOpen(false);
  };

  const handleCopy = () => {
      navigator.clipboard.writeText(generatedSOP);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
  };

  const lockedList = universities.filter(u => lockedIds.includes(u.id));
  const progress = Math.round((tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100);
  const allTasksDone = tasks.every(t => t.status === 'DONE');

  if (allTasksDone && view === 'APPLICATION') {
      return <SuccessView universityName={lockedList[0]?.name || "Dream University"} />
  }

  return (
    <div className="min-h-screen font-sans bg-[#050505] text-neutral-200">
        <nav className="sticky top-0 z-50 h-16 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md flex items-center justify-between px-6">
            <div className="flex items-center gap-2 font-bold text-lg cursor-pointer" onClick={() => setView('LANDING')}>
                <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-black">D</div>
                <span className="text-white tracking-tight">Dream University</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
                {userProfile && (
                    <>
                        <span className={`cursor-pointer hover:text-white transition-colors ${view === 'DASHBOARD' ? 'text-white' : ''}`} onClick={() => setView('DASHBOARD')}>Discovery</span>
                        <span className={`cursor-pointer hover:text-white transition-colors ${view === 'APPLICATION' ? 'text-white' : ''}`} onClick={() => lockedIds.length > 0 && setView('APPLICATION')}>Roadmap</span>
                    </>
                )}
            </div>
        </nav>

        {view === 'LANDING' && <LandingView onStart={() => setView('AUTH')} />}
        {view === 'AUTH' && <AuthView onLogin={handleLogin} />}
        {view === 'ONBOARDING' && <OnboardingView onSubmit={handleOnboarding} />}
        {view === 'ANALYSIS' && userProfile && <AnalysisView profile={userProfile} onContinue={() => setView('DASHBOARD')} />}
        
        {(view === 'DASHBOARD' || view === 'APPLICATION') && userProfile && (
            <main className="container mx-auto px-4 py-8 animate-in fade-in">
                {view === 'DASHBOARD' && (
                    <>
                        <div className="mb-8 flex justify-between items-end">
                            <div><h1 className="text-3xl font-bold text-white mb-2">University Discovery</h1><p className="text-neutral-500">Curated based on your {userProfile.currency} {userProfile.budget.toLocaleString()} budget.</p></div>
                            {lockedIds.length > 0 && <button onClick={() => setView('APPLICATION')} className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors flex items-center gap-2">Go to Roadmap <ArrowRight className="w-4 h-4"/></button>}
                        </div>
                        {loading ? <div className="text-center py-20 text-neutral-500">Loading Database...</div> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {universities.filter(u => userProfile.targetCountry === 'Any' || u.country === userProfile.targetCountry || true).map(uni => {
                                    const category = categorize(uni, userProfile.gpa);
                                    const isLocked = lockedIds.includes(uni.id);
                                    return (
                                        <div key={uni.id} className={`group relative flex flex-col bg-[#0a0a0a] border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${isLocked ? 'border-violet-500 ring-1 ring-violet-500' : 'border-white/10 hover:border-white/20'}`}>
                                            <div className="relative h-48 w-full overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10"/>
                                                <img src={uni.image_url || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80"} className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-80" />
                                                <div className="absolute top-3 left-3 z-20">
                                                    <span className={`backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${category === 'Dream' ? 'bg-purple-500/20 border-purple-500/30 text-purple-200' : category === 'Target' ? 'bg-blue-500/20 border-blue-500/30 text-blue-200' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200'}`}>{category}</span>
                                                </div>
                                                <div className="absolute top-3 right-3 z-20">
                                                    {isLocked && <span className="bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center shadow-lg"><Lock className="w-3 h-3 mr-1"/> Locked</span>}
                                                </div>
                                            </div>
                                            <div className="p-5 flex-1 flex flex-col">
                                                <h3 className="text-xl font-bold text-white mb-1">{uni.name}</h3>
                                                <div className="flex items-center text-sm text-neutral-500 mb-6 gap-3"><span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {uni.country}</span><span className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-emerald-500"/> {uni.tuition_fees_usd.toLocaleString()}</span></div>
                                                <div className="grid grid-cols-2 gap-2 mt-auto">
                                                    <button onClick={() => handleLock(uni.id)} className={`py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${isLocked ? 'bg-violet-600 text-white' : 'bg-neutral-900 text-neutral-400 hover:bg-white hover:text-black'}`}>{isLocked ? 'Selected' : 'Shortlist'}</button>
                                                    <button onClick={() => setSelectedUniDetails(uni)} className="py-3 rounded-xl font-bold text-xs uppercase tracking-widest bg-neutral-900 border border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all">Details</button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {view === 'APPLICATION' && (
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="md:col-span-2">
                                <h1 className="text-3xl font-bold text-white mb-2">Application Roadmap</h1>
                                <p className="text-neutral-500">Manage tasks for <span className="text-white">{lockedList[0]?.name}</span></p>
                            </div>
                            <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                                <div><p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Progress</p><p className="text-2xl font-bold text-white">{progress}%</p></div>
                                <div className="w-32 h-2 bg-neutral-800 rounded-full overflow-hidden"><div className="h-full bg-violet-500 transition-all duration-500" style={{ width: `${progress}%` }}/></div>
                            </div>
                        </div>
                        <KanbanBoard tasks={tasks} onToggleTask={handleTaskStatus} onGenerateSOP={generateSOP} />
                    </div>
                )}
            </main>
        )}

        <ChatWidget userProfile={userProfile} />
        <UniversityDetailsModal university={selectedUniDetails} isOpen={!!selectedUniDetails} onClose={() => setSelectedUniDetails(null)} />
        
        {/* SOP Modal - Fixed Copy & Download */}
        {sopModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="w-full max-w-2xl rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl p-8 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-violet-500" /> AI Draft</h3><button onClick={() => setSopModalOpen(false)} className="text-neutral-500 hover:text-white"><X className="w-5 h-5" /></button></div>
                    <div className={`p-6 rounded-xl bg-[#050505] border border-white/5 max-h-[50vh] overflow-y-auto mb-6 text-sm leading-relaxed text-neutral-300 font-mono whitespace-pre-line ${isGenerating ? 'animate-pulse' : ''}`}>
                        {isGenerating ? (<div className="flex flex-col items-center py-12"><Loader2 className="w-8 h-8 text-violet-500 animate-spin mb-4" /><p className="text-neutral-500">Thinking...</p></div>) : generatedSOP}
                    </div>
                    {!isGenerating && (
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                                <button onClick={generateSOP} className="px-4 py-2 rounded-lg text-xs font-bold bg-white/5 text-neutral-400 border border-white/10 hover:bg-white/10 flex items-center gap-2"><RefreshCw className="w-3 h-3"/> Retry</button>
                                <button onClick={handleCopy} className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${isCopied ? 'bg-green-900/20 text-green-400 border-green-500/30' : 'bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10'}`}>{isCopied ? <Check className="w-3 h-3"/> : <Copy className="w-3 h-3"/>} {isCopied ? 'Copied' : 'Copy'}</button>
                            </div>
                            <button onClick={acceptSOP} className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-violet-900/20"><CheckCircle className="w-4 h-4" /> Accept & Mark Done</button>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
}