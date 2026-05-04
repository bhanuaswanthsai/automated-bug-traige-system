import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Bug, AlertCircle, Clock, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
      case 'High': return 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400';
      default: return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
    }
  };

  const getPriorityColor = (priority) => {
    return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
  };

  const stats = [
    { label: 'Total Bugs', value: bugs.length, icon: <Bug size={20} className="text-indigo-600" />, bg: 'bg-indigo-100 dark:bg-indigo-900/50' },
    { label: 'Open', value: bugs.filter(b => b.status === 'Open').length, icon: <AlertCircle size={20} className="text-red-600" />, bg: 'bg-red-100 dark:bg-red-900/50' },
    { label: 'In Progress', value: bugs.filter(b => b.status === 'In Progress').length, icon: <Clock size={20} className="text-yellow-600" />, bg: 'bg-yellow-100 dark:bg-yellow-900/50' },
    { label: 'Resolved', value: bugs.filter(b => b.status === 'Resolved' || b.status === 'Closed').length, icon: <CheckCircle size={20} className="text-green-600" />, bg: 'bg-green-100 dark:bg-green-900/50' },
  ];

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Dashboard</h1>
        <p className="text-[var(--text-muted)]">Overview of all tracked bugs</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx}
            className="bg-[var(--surface)] p-6 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[var(--text-muted)] text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-[var(--text)]">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bugs Table */}
      <div className="bg-[var(--surface)] rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-[var(--text)]">Recent Bugs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--background)] text-[var(--text-muted)]">
              <tr>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Severity</th>
                <th className="px-6 py-3 font-medium">Priority</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Assignee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-[var(--text)]">
              {bugs.map((bug) => (
                <tr key={bug._id} className="hover:bg-[var(--background)] transition-colors">
                  <td className="px-6 py-4 font-medium">{bug.title}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200 dark:border-slate-700 bg-[var(--background)]">
                      {bug.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(bug.severity)}`}>
                      {bug.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(bug.priority)}`}>
                      {bug.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">{bug.category}</td>
                  <td className="px-6 py-4 text-[var(--text-muted)]">
                    {bug.assignedTo ? bug.assignedTo.name : 'Unassigned'}
                  </td>
                </tr>
              ))}
              {bugs.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-[var(--text-muted)]">
                    No bugs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
