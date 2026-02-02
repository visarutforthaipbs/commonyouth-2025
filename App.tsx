
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './services/authContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import Community from './pages/Community';
import Activities from './pages/Activities';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Partners from './pages/Partners';
import GroupDetail from './pages/GroupDetail';
import DesignSystem from './pages/DesignSystem';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-brand-bud">กำลังโหลด...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="map" element={<MapPage />} />
            <Route path="community" element={<Community />} />
            <Route path="activities" element={<Activities />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="groups/:id" element={<GroupDetail />} />
            <Route path="group/:id" element={<Navigate to="/groups/:id" replace />} />
            <Route path="partners" element={<Partners />} />
            <Route path="design-system" element={<DesignSystem />} />
            <Route path="login" element={<Login />} />
            <Route 
              path="dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </HashRouter>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;