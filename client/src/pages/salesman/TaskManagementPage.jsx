import React, { useState, useEffect, useCallback } from 'react';
import API from '@/utils/axios';

import { m as motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Clock, Calendar, AlertCircle, 
  ChevronRight, Search, Target, ListChecks, Filter,
  Activity, ArrowUpRight, Zap, Trophy, ShieldCheck,
  MoreVertical, Flag
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const TaskManagementPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    try {
      const userStr = localStorage.getItem('farmliv_salesman');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const res = await API.get(`salesman/${user.id}/tasks`);
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Directive Sync Failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCompleteTask = async (id) => {
    try {
      await API.put(`tasks/${id}/status`, { status: 'completed' });
      setTasks(prev => (Array.isArray(prev) ? prev : []).map(t => t.id === id ? { ...t, status: 'completed' } : t));
      toast({ title: "Objective Secured", description: "Protocol goal achieved and synchronized." });
    } catch (err) {
       toast({ variant: "destructive", title: "Protocol Refusal" });
    }
  };

  const getPriorityConfig = (priority) => {
    const p = priority?.toLowerCase();
    if (p === 'high') return { color: 'text-rose-500', bg: 'bg-rose-50', icon: AlertCircle };
    if (p === 'medium') return { color: 'text-amber-500', bg: 'bg-amber-50', icon: Zap };
    return { color: 'text-blue-500', bg: 'bg-blue-50', icon: Flag };
  };

  const data = Array.isArray(tasks) ? tasks : [];
  const pendingTasks = data.filter(t => t && t.status !== 'completed');
  const completedTasks = data.filter(t => t && t.status === 'completed');
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <>
      <div className="flex flex-col gap-8">
        
        {/* HEADER & STRATEGY PULSE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Strategy Console</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Field Directives</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Success Yield</span>
                   <span className="text-base font-black italic text-slate-900">{completionRate}%</span>
                </div>
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-400">
                   <Trophy size={18} />
                </div>
             </div>
             <button className="bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2">
                <Filter size={16} /> Matrix Filter
             </button>
          </div>
        </div>

        {/* ANALYTICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Critical Nodes</span>
                 <h3 className="text-3xl font-black italic tracking-tighter text-rose-500">{tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length}</h3>
              </div>
              <Activity size={40} className="absolute bottom-4 right-4 text-rose-50 opacity-50 group-hover:scale-110 transition-transform" />
           </div>
           <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Syncs</span>
                 <h3 className="text-3xl font-black italic tracking-tighter text-slate-900">{pendingTasks.length}</h3>
              </div>
              <Clock size={40} className="absolute bottom-4 right-4 text-slate-50 opacity-50 group-hover:scale-110 transition-transform" />
           </div>
           <div className="bg-white p-8 rounded-[3rem] border border-emerald-50 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col">
                 <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Secured Goals</span>
                 <h3 className="text-3xl font-black italic tracking-tighter text-emerald-600">{completedTasks.length}</h3>
              </div>
              <ShieldCheck size={40} className="absolute bottom-4 right-4 text-emerald-50 opacity-50 group-hover:scale-110 transition-transform" />
           </div>
        </div>

        {/* DIRECTIVES LIST */}
        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden">
           <div className="p-10 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">Command Directive Stream</h3>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Status: Operational</span>
           </div>

           <div className="flex flex-col min-h-[400px]">
              <AnimatePresence mode="popLayout">
                 {tasks.map((task) => {
                    const cfg = getPriorityConfig(task.priority);
                    const PriorityIcon = cfg.icon;
                    return (
                       <motion.div 
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={task.id}
                          className={`p-8 border-b border-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors group ${task.status === 'completed' ? 'opacity-50' : ''}`}
                       >
                          <div className="flex items-center gap-6 flex-1">
                             <button 
                                onClick={() => handleCompleteTask(task.id)}
                                disabled={task.status === 'completed'}
                                className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all shadow-lg active:scale-95 ${task.status === 'completed' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 border border-transparent hover:border-emerald-100'}`}
                             >
                                <CheckCircle2 size={24} />
                             </button>
                             <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                   <span className={`text-base font-black uppercase tracking-tight italic ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900 group-hover:text-emerald-600 transition-colors'}`}>
                                      {task.title}
                                   </span>
                                   {task.status !== 'completed' && (
                                      <div className={`px-2 py-0.5 rounded-lg border ${cfg.bg} ${cfg.color} border-transparent text-[8px] font-black uppercase tracking-widest flex items-center gap-1`}>
                                         <PriorityIcon size={10} /> {task.priority}
                                      </div>
                                   )}
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                   <div className="flex items-center gap-1.5"><Calendar size={12}/> Due {new Date(task.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</div>
                                   <div className="flex items-center gap-1.5"><Clock size={12}/> T-Minus 24h</div>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-4 w-full md:w-auto">
                             <div className="h-10 px-6 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:bg-white transition-all">
                                {task.status === 'completed' ? 'Secured' : 'In-Progress'}
                             </div>
                             <button className="p-3 text-slate-300 hover:text-slate-600 transition-colors">
                                <MoreVertical size={20} />
                             </button>
                          </div>
                       </motion.div>
                    );
                 })}
              </AnimatePresence>

              {tasks.length === 0 && !loading && (
                 <div className="flex-1 flex flex-col items-center justify-center py-32 text-center px-10">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                       <Target size={40} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Null Task Vector</h3>
                    <p className="max-w-xs text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">Zero command directives active in current sector synchronization.</p>
                 </div>
              )}

              {loading && (
                 <div className="flex-1 flex items-center justify-center py-32">
                    <div className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full bg-slate-900 animate-bounce [animation-delay:-0.3s]" />
                       <div className="w-2.5 h-2.5 rounded-full bg-slate-900 animate-bounce [animation-delay:-0.15s]" />
                       <div className="w-2.5 h-2.5 rounded-full bg-slate-900 animate-bounce" />
                    </div>
                 </div>
              )}
           </div>
        </div>

      </div>
    </>
  );
};

export default TaskManagementPage;

