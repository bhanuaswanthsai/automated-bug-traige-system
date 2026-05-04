import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import RoleBasedDashboard from './pages/RoleBasedDashboard';
import SubmitBug from './pages/SubmitBug';
import Kanban from './pages/Kanban';
import Analytics from './pages/Analytics';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes Wrapper */}
          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<RoleBasedDashboard />} />
            
            <Route 
              path="submit" 
              element={
                <ProtectedRoute allowedRoles={['Tester', 'Admin']}>
                  <SubmitBug />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="kanban" 
              element={
                <ProtectedRoute allowedRoles={['Developer', 'Admin']}>
                  <Kanban />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="analytics" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
