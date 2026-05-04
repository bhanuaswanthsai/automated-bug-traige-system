import React, { useContext, useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Bug, Columns, BarChart2, LogOut, Menu, X, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const getNavItems = () => {
    const items = [
      { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> }
    ];

    if (user.role === 'Admin' || user.role === 'Tester') {
      items.push({ name: 'Submit Bug', path: '/submit', icon: <Bug size={20} /> });
    }
    
    if (user.role === 'Admin' || user.role === 'Developer') {
      items.push({ name: 'Kanban', path: '/kanban', icon: <Columns size={20} /> });
    }
    
    if (user.role === 'Admin') {
      items.push({ name: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} /> });
    }
    
    return items;
  };

  const navItems = getNavItems();
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)] transition-colors duration-300">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-[var(--surface)] shadow-lg transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl text-[var(--text)] tracking-tight">
            <Bug className="text-primary" />
            <span>BugTracker AI</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[var(--text-muted)]">
            <X size={24} />
          </button>
        </div>

        <div className="px-4 py-6">
          <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-4">Menu</p>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  location.pathname === item.path
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 font-medium'
                    : 'text-[var(--text-muted)] hover:bg-[var(--background)] hover:text-[var(--text)]'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-slate-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold uppercase">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text)]">{user.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[var(--text-muted)] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between bg-[var(--surface)] px-4 shadow-sm z-10">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[var(--text-muted)]">
            <Menu size={24} />
          </button>
          
          <div className="ml-auto flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-[var(--text-muted)] hover:bg-[var(--background)] transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
