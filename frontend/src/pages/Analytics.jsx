import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/bugs/analytics');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const COLORS = ['#4f46e5', '#ef4444', '#f59e0b', '#10b981', '#6366f1'];

  if (loading) return <div className="text-center mt-10">Loading analytics...</div>;
  if (!data) return null;

  const severityData = data.bugsBySeverity.map(item => ({ name: item._id, value: item.count }));
  const categoryData = data.bugsByCategory.map(item => ({ name: item._id, value: item.count }));
  const statusData = data.bugsByStatus.map(item => ({ name: item._id, value: item.count }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Analytics Dashboard</h1>
        <p className="text-[var(--text-muted)]">Visual insights into your bug tracking data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Severity Chart */}
        <div className="bg-[var(--surface)] p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <h3 className="font-semibold text-[var(--text)] mb-6">Bugs by Severity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--text-muted)', color: 'var(--text)' }}
                  itemStyle={{ color: 'var(--text)' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Chart */}
        <div className="bg-[var(--surface)] p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <h3 className="font-semibold text-[var(--text)] mb-6">Bugs by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--text-muted)" opacity={0.2} />
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip 
                  cursor={{ fill: 'var(--text-muted)', opacity: 0.1 }}
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--text-muted)', color: 'var(--text)' }}
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Chart */}
        <div className="bg-[var(--surface)] p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-[var(--text)] mb-6">Bugs by Category</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--text-muted)" opacity={0.2} />
                <XAxis type="number" stroke="var(--text-muted)" />
                <YAxis dataKey="name" type="category" width={100} stroke="var(--text-muted)" />
                <Tooltip 
                  cursor={{ fill: 'var(--text-muted)', opacity: 0.1 }}
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--text-muted)', color: 'var(--text)' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
