
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider, theme } from 'antd';
import { useSelector } from 'react-redux';
import { store } from './app/store';
import { makeServer } from './mirage/server';
import type { RootState } from './app/store';

// Components
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SessionsPage from './pages/SessionsPage';
import SessionDetails from './pages/hod/SessionDetails';
import FeedbackPage from './pages/FeedbackPage';
import CoursesPage from './pages/CoursesPage';
import LecturersPage from './pages/LecturersPage';
import QuestionnairesPage from './pages/QuestionnairesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SystemConfigPage from './pages/SystemConfigPage';
import StudentsPage from './pages/StudentsPage';

// Dean pages
import DeanDashboard from './features/dean/DeanDashboard';
import DeanSystemConfigPage from './features/dean/SystemConfigPage';
import DeanProfilePage from './features/dean/DeanProfilePage';
import UserRegistrationPage from './features/dean/UserRegistrationPage';

// Start Mirage server in development
if (import.meta.env.DEV) {
  makeServer();
}

const AppContent: React.FC = () => {
  const { isAuthenticated, theme: appTheme, user } = useSelector((state: RootState) => state.auth);

  return (
    <ConfigProvider
      theme={{
        algorithm: appTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1E40AF',
          colorInfo: '#14B8A6',
          borderRadius: 8,
        },
      }}
    >
      <div className={appTheme === 'dark' ? 'dark' : ''}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<UserRegistrationPage />} />
            <Route path="/feedback/:sessionId" element={<FeedbackPage />} />
            
            {isAuthenticated ? (
              <Route path="/" element={<AppLayout><Navigate to="/dashboard" replace /></AppLayout>} />
            ) : (
              <Route path="/" element={<Navigate to="/login" replace />} />
            )}
            
            {isAuthenticated && (
              <>
                {/* Dean-specific routes */}
                {user?.role === 'dean' ? (
                  <>
                    <Route path="/dashboard" element={<AppLayout><DeanDashboard /></AppLayout>} />
                    <Route path="/system-config" element={<AppLayout><DeanSystemConfigPage /></AppLayout>} />
                    <Route path="/profile" element={<AppLayout><DeanProfilePage /></AppLayout>} />
                  </>
                ) : (
                  <>
                    {/* HOD and other role routes */}
                    <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
                    <Route path="/system-config" element={<AppLayout><SystemConfigPage /></AppLayout>} />
                  </>
                )}
                
                {/* Common routes for all authenticated users */}
                <Route path="/sessions" element={<AppLayout><SessionsPage /></AppLayout>} />
                <Route path="/sessions/:sessionId" element={<AppLayout><SessionDetails /></AppLayout>} />
                <Route path="/courses" element={<AppLayout><CoursesPage /></AppLayout>} />
                <Route path="/lecturers" element={<AppLayout><LecturersPage /></AppLayout>} />
                <Route path="/students" element={<AppLayout><StudentsPage /></AppLayout>} />
                <Route path="/questionnaires" element={<AppLayout><QuestionnairesPage /></AppLayout>} />
                <Route path="/analytics" element={<AppLayout><AnalyticsPage /></AppLayout>} />
              </>
            )}
            
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ConfigProvider>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
