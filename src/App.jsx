import { useState } from 'react';
import { useTheme } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProfileModal from './components/ProfileModal';
import CelebrationOverlay from './components/CelebrationOverlay';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const [page, setPage]       = useState('projects');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function renderPage() {
    switch (page) {
      case 'projects': return <ProjectsPage />;
      case 'tasks':    return <TasksPage />;
      case 'settings': return <SettingsPage />;
      default:         return <ProjectsPage />;
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        setPage={setPage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="main-content">
        <Header 
          page={page} 
          setSidebarOpen={setSidebarOpen} 
        />

        <main className="page-container">
          {renderPage()}
        </main>
      </div>

      {/* Overlays */}
      <CelebrationOverlay />
      <ProfileModal />
    </div>
  );
}
