import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, Clock, Calendar, AlertCircle, 
  ChevronRight, Search, Target, ListChecks, Filter
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const TaskManagementPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('farmliv_salesman'));
      // Placeholder: assuming tasks are linked to salesman in a tasks table
      const res = await API.get(`/salesman/${user.id}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error("Directive Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      await API.put(`/tasks/${id}/status`, { status: 'completed' });
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t));
      toast({ title: "Task Objective Secured" });
    } catch (err) {
       toast({ variant: "destructive", title: "Protocol Refusal" });
    }
  };

  return (
    <PortalLayout role="salesman">
      <div className="max-w-md mx-auto p-4 md:p-8 space-y-6 pb-24 font-sans text-slate-900">
        <header className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 italic uppercase">Directives</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">{tasks.filter(t => t.status !== 'completed').length} Pending Objectives</p>
          </div>
          <div className="w-12 h-12 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center">
             <ListChecks size={24} />
          </div>
        </header>

        <section className="space-y-4">
           {tasks.map(task => (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-6 rounded-[2.5rem] border flex items-center justify-between group transition-all ${task.status === 'completed' ? 'bg-slate-50 border-slate-50' : 'bg-white border-slate-100 shadow-sm'}`}
              >
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={task.status === 'completed'}
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${task.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300 hover:bg-emerald-50 hover:text-emerald-500'}`}
                    >
                       <CheckCircle2 size={20} />
                    </button>
                    <div className="flex flex-col">
                       <span className={`text-xs font-black uppercase tracking-tight ${task.status === 'completed' ? 'line-through text-slate-300' : 'text-slate-900'}`}>{task.title}</span>
                       <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          <Calendar size={10}/> {new Date(task.due_date).toLocaleDateString()}
                       </div>
                    </div>
                 </div>
                 {task.priority === 'high' && task.status !== 'completed' && (
                    <div className="w-2 h-2 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50" />
                 )}
              </motion.div>
           ))}
           {tasks.length === 0 && (
              <div className="py-20 text-center opacity-30">
                 <Target size={40} className="mx-auto mb-4" />
                 <p className="text-[10px] font-black uppercase tracking-[0.2em]">Zero Command Directives</p>
              </div>
           )}
        </section>
      </div>
    </PortalLayout>
  );
};

export default TaskManagementPage;
