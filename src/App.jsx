import React, { useState, useEffect } from 'react';
import './App.css';
import LoadingPage from './components/LoadingPage';
import Login from './components/Login';
import RoleModal from './components/RoleModal';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import MainApp from './components/MainApp';
import Toast from './components/Toast';
import { AppProvider } from './context/AppContext';

function App() {
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    // Check if user was logged in
    const savedUser = localStorage.getItem('collabcode-user');
    const savedRole = localStorage.getItem('collabcode-role');
    
    if (savedUser && savedRole) {
      setUser(JSON.parse(savedUser));
      setRole(savedRole);
      setCurrentScreen(savedRole === 'teacher' ? 'teacher-dashboard' : 'student-dashboard');
    } else {
      // Loading to login transition
      const timer = setTimeout(() => {
        setCurrentScreen('login');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('collabcode-user', JSON.stringify(userData));
    setCurrentScreen('role');
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    localStorage.setItem('collabcode-role', selectedRole);
    setCurrentScreen(selectedRole === 'teacher' ? 'teacher-dashboard' : 'student-dashboard');
    showToast(`Welcome, ${selectedRole}!`);
  };

  const handleJoinRoom = (room) => {
    setCurrentScreen('main-app');
  };

  const handleBackToRole = () => {
    setCurrentScreen('role');
  };

  const handleLogout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('collabcode-user');
    localStorage.removeItem('collabcode-role');
    setCurrentScreen('login');
    showToast('Logged out successfully');
  };

  return (
    <AppProvider>
      <div className="app">
        {currentScreen === 'loading' && <LoadingPage />}
        
        {currentScreen === 'login' && (
          <Login onLogin={handleLogin} showToast={showToast} />
        )}
        
        {currentScreen === 'role' && (
          <RoleModal 
            onSelectRole={handleRoleSelect} 
            showToast={showToast}
          />
        )}
        
        {currentScreen === 'teacher-dashboard' && (
          <TeacherDashboard 
            user={user}
            onJoinRoom={handleJoinRoom}
            onBack={handleBackToRole}
            onLogout={handleLogout}
            showToast={showToast}
          />
        )}
        
        {currentScreen === 'student-dashboard' && (
          <StudentDashboard 
            user={user}
            onJoinRoom={handleJoinRoom}
            onBack={handleBackToRole}
            onLogout={handleLogout}
            showToast={showToast}
          />
        )}
        
        {currentScreen === 'main-app' && (
          <MainApp 
            user={user}
            role={role}
            onLogout={handleLogout}
            showToast={showToast}
          />
        )}
        
        <Toast show={toast.show} message={toast.message} type={toast.type} />
      </div>
    </AppProvider>
  );
}

export default App;