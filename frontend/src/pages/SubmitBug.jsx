import React, { useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Bug, Sparkles, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SubmitBug = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stepsToReproduce: '',
    module: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/bugs', formData);
      setAiResult({
        severity: res.data.severity,
        priority: res.data.priority,
        category: res.data.category,
        confidenceScore: res.data.confidenceScore,
        assignedTo: res.data.assignedTo?.name || 'Unassigned'
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit bug');
    } finally {
      setLoading(false);
    }
  };

  if (success && aiResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto mt-10 bg-[var(--surface)] p-8 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm text-center"
      >
        <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text)] mb-2">Bug Submitted Successfully!</h2>
        <p className="text-[var(--text-muted)] mb-8">Our AI has analyzed and triaged your report.</p>

        <div className="bg-[var(--background)] p-6 rounded-xl border border-gray-200 dark:border-slate-700 text-left mb-8">
          <div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400 font-semibold">
            <Sparkles size={20} />
            <span>AI Triage Results</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[var(--text-muted)]">Severity</p>
              <p className="font-semibold text-[var(--text)]">{aiResult.severity}</p>
            </div>
            <div>
              <p className="text-[var(--text-muted)]">Priority</p>
              <p className="font-semibold text-[var(--text)]">{aiResult.priority}</p>
            </div>
            <div>
              <p className="text-[var(--text-muted)]">Category</p>
              <p className="font-semibold text-[var(--text)]">{aiResult.category}</p>
            </div>
            <div>
              <p className="text-[var(--text-muted)]">Assigned To</p>
              <p className="font-semibold text-[var(--text)]">{aiResult.assignedTo}</p>
            </div>
            <div className="col-span-2 mt-2">
              <p className="text-[var(--text-muted)] mb-1">AI Confidence Score</p>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${aiResult.confidenceScore}%` }}></div>
              </div>
              <p className="text-xs text-right mt-1 text-[var(--text-muted)]">{aiResult.confidenceScore}%</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Go to Dashboard
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Report a Bug</h1>
        <p className="text-[var(--text-muted)]">Our AI will automatically categorize and prioritize it.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--surface)] p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">Bug Title</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 bg-[var(--background)] border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-[var(--text)]"
              placeholder="e.g., App crashes when clicking checkout button"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">Description</label>
            <textarea
              required
              rows="4"
              className="w-full px-4 py-2 bg-[var(--background)] border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-[var(--text)] resize-none"
              placeholder="Provide a detailed description of what happened..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">Steps to Reproduce</label>
            <textarea
              rows="3"
              className="w-full px-4 py-2 bg-[var(--background)] border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-[var(--text)] resize-none"
              placeholder="1. Go to...&#10;2. Click on...&#10;3. Observe..."
              value={formData.stepsToReproduce}
              onChange={(e) => setFormData({...formData, stepsToReproduce: e.target.value})}
            ></textarea>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors disabled:opacity-70"
            >
              {loading ? (
                <>Processing with AI...</>
              ) : (
                <>
                  <Bug size={20} />
                  Submit with AI Triage
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SubmitBug;
