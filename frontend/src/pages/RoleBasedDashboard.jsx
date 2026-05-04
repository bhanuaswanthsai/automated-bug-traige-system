import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import DeveloperDashboard from './DeveloperDashboard';
import TesterDashboard from './TesterDashboard';

const RoleBasedDashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Developer':
      return <DeveloperDashboard />;
    case 'Tester':
      return <TesterDashboard />;
    default:
      return <div>Unauthorized Role</div>;
  }
};

export default RoleBasedDashboard;
