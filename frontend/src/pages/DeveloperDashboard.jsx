import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Code, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DeveloperDashboard = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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

  useEffect(() => {
    fetchBugs();
  }, []);

  const handleStatusUpdate = async (bugId, newStatus) => {
    try {
      await api.put(`/bugs/${bugId}`, { status: newStatus });
      fetchBugs();
    } catch (err) {
      console.error(err);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-600 bg-red-100 dark:bg-red-500/20 dark:text-red-400';
      case 'High': return 'text-orange-600 bg-orange-100 dark:bg-orange-500/20 dark:text-orange-400';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-500/20 dark:text-yellow-400';
      default: return 'text-green-600 bg-green-100 dark:bg-green-500/20 dark:text-green-400';
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-500">Developer Dashboard</h1>
        <p className="text-[var(--text-muted)] mt-1">Manage and update bugs assigned to you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="col-span-1 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
              <Code size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold">Welcome, {user.name}</h2>
          </div>
          <p className="text-indigo-100 mb-6">You have {bugs.filter(b => b.status !== 'Resolved' && b.status !== 'Closed').length} active bugs assigned.</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/20 p-4 rounded-xl text-center">
              <p className="text-3xl font-bold">{bugs.filter(b => b.status === 'In Progress').length}</p>
              <p className="text-sm text-indigo-100">In Progress</p>
            </div>
             <div className="bg-black/20 p-4 rounded-xl text-center">
              <p className="text-3xl font-bold">{bugs.filter(b => b.status === 'Resolved').length}</p>
              <p className="text-sm text-indigo-100">Resolved</p>
            </div>
          </div>
        </motion.div>

        <div className="col-span-1 lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-[var(--text)]">Assigned Bugs</h2>
          {bugs.length === 0 ? (
             <div className="bg-white dark:bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl border border-gray-100 dark:border-gray-700 text-center text-gray-500">
               No bugs assigned to you right now. Great job!
             </div>
          ) : bugs.map((bug, idx) => (
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: idx * 0.1 }}
               key={bug._id}
               className="bg-white dark:bg-gray-800/80 backdrop-blur-md p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
             >
               <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2">
                   <h3 className="font-semibold text-lg text-[var(--text)]">{bug.title}</h3>
                   <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getSeverityColor(bug.severity)}`}>
                     {bug.severity}
                   </span>
                 </div>
                 <p className="text-sm text-[var(--text-muted)] line-clamp-2">{bug.description}</p>
               </div>
               
               <div className="flex items-center gap-3 w-full sm:w-auto">
                 <select
                   value={bug.status}
                   onChange={(e) => handleStatusUpdate(bug._id, e.target.value)}
                   className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-[var(--text)] text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                 >
                   <option value="Open">Open</option>
                   <option value="In Progress">In Progress</option>
                   <option value="Resolved">Resolved</option>
                   <option value="Closed">Closed</option>
                 </select>
               </div>
             </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
