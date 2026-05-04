import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Bug, Plus, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const TesterDashboard = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const res = await api.get('/bugs');
        setBugs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBugs();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'text-red-600 bg-red-100 dark:bg-red-500/20 dark:text-red-400 border-red-200';
      case 'In Progress': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-500/20 dark:text-yellow-400 border-yellow-200';
      case 'Resolved': return 'text-green-600 bg-green-100 dark:bg-green-500/20 dark:text-green-400 border-green-200';
      case 'Closed': return 'text-gray-600 bg-gray-100 dark:bg-gray-500/20 dark:text-gray-400 border-gray-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-500/20 dark:text-gray-400 border-gray-200';
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500">Tester Dashboard</h1>
          <p className="text-[var(--text-muted)] mt-1">Track the bugs you've reported.</p>
        </div>
        <Link 
          to="/submit"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus size={20} />
          Submit New Bug
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="col-span-1 space-y-4">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-white dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
           >
             <h2 className="font-semibold text-lg mb-4 text-[var(--text)]">Your Stats</h2>
             <div className="space-y-4">
               <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                 <span className="text-[var(--text-muted)]">Total Reported</span>
                 <span className="font-bold text-xl">{bugs.length}</span>
               </div>
               <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                 <span className="text-[var(--text-muted)]">Open</span>
                 <span className="font-bold text-xl text-red-500">{bugs.filter(b => b.status === 'Open').length}</span>
               </div>
               <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                 <span className="text-[var(--text-muted)]">In Progress</span>
                 <span className="font-bold text-xl text-yellow-500">{bugs.filter(b => b.status === 'In Progress').length}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-[var(--text-muted)]">Resolved</span>
                 <span className="font-bold text-xl text-green-500">{bugs.filter(b => b.status === 'Resolved' || b.status === 'Closed').length}</span>
               </div>
             </div>
           </motion.div>
        </div>

        <div className="col-span-1 lg:col-span-3 space-y-4">
          <h2 className="text-xl font-semibold text-[var(--text)]">My Bugs</h2>
          {bugs.length === 0 ? (
             <div className="bg-white dark:bg-gray-800/80 backdrop-blur-md p-10 rounded-2xl border border-gray-100 dark:border-gray-700 text-center flex flex-col items-center justify-center">
               <Bug size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
               <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't reported any bugs yet.</p>
               <Link to="/submit" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">Submit your first bug</Link>
             </div>
          ) : bugs.map((bug, idx) => (
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               key={bug._id}
               className="bg-white dark:bg-gray-800/80 backdrop-blur-md p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group cursor-pointer"
             >
               <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2">
                   <h3 className="font-semibold text-lg text-[var(--text)] group-hover:text-indigo-600 transition-colors">{bug.title}</h3>
                 </div>
                 <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                   <span className="truncate max-w-[300px] block">{bug.description}</span>
                   <span>•</span>
                   <span>Assigned to: {bug.assignedTo ? bug.assignedTo.name : 'Unassigned'}</span>
                 </div>
               </div>
               
               <div className="flex flex-col items-end gap-2 shrink-0">
                 <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(bug.status)}`}>
                   {bug.status}
                 </span>
                 <span className="text-xs text-[var(--text-muted)]">
                   {new Date(bug.createdAt).toLocaleDateString()}
                 </span>
               </div>
             </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TesterDashboard;
