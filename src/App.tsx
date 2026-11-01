import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BackgroundParticles } from './components/common/BackgroundParticles';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LoginScreen } from './components/auth/LoginScreen';
import { SupabaseConfigModal } from './components/common/SupabaseConfigModal';
import { DeploymentGuideModal } from './components/common/DeploymentGuideModal';
import { NotificationCenter } from './components/common/NotificationCenter';
import { HeroSection } from './components/public/HeroSection';
import { DepartmentsSection } from './components/public/DepartmentsSection';
import { CoursesSection } from './components/public/CoursesSection';
import { FacilitiesSection } from './components/public/FacilitiesSection';
import { PlacementsSection } from './components/public/PlacementsSection';
import { NoticesSection } from './components/public/NoticesSection';
import { ContactSection } from './components/public/ContactSection';
import { StudentDashboard } from './components/student/StudentDashboard';
import { FacultyDashboard } from './components/faculty/FacultyDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_FACILITIES,
  INITIAL_NOTICES,
  INITIAL_NOTIFICATIONS,
  getStoredData,
  setStoredData
} from './integrations/supabase/mockDb';
import { AppNotification, Department, CampusFacility, Notice } from './types';
import { LogIn, ArrowLeft, Shield } from 'lucide-react';

function MainApp() {
  const { user, role, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'portal' | 'home'>('portal');
  const [guestPublicMode, setGuestPublicMode] = useState(false);

  // Modals
  const [supabaseConfigOpen, setSupabaseConfigOpen] = useState(false);
  const [deployGuideOpen, setDeployGuideOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Stored state for public & shared feeds
  const [departments, setDepartments] = useState<Department[]>(() =>
    getStoredData('admin_departments', INITIAL_DEPARTMENTS)
  );

  React.useEffect(() => {
    const syncDepts = () => {
      setDepartments(getStoredData('admin_departments', INITIAL_DEPARTMENTS));
    };
    window.addEventListener('storage', syncDepts);
    window.addEventListener('nexora_departments_updated', syncDepts);
    return () => {
      window.removeEventListener('storage', syncDepts);
      window.removeEventListener('nexora_departments_updated', syncDepts);
    };
  }, []);
  const [facilities] = useState<CampusFacility[]>(() =>
    getStoredData('facilities', INITIAL_FACILITIES)
  );
  const [notices] = useState<Notice[]>(() =>
    getStoredData('notices', INITIAL_NOTICES)
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    getStoredData('notifications', INITIAL_NOTIFICATIONS)
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    setStoredData('notifications', updated);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    setStoredData('notifications', []);
  };

  // 1. STRICT AUTH GATE: If user is NOT logged in and has not chosen to browse the public brochure
  if (!user && !guestPublicMode) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#080B14] text-slate-900 dark:text-[#F5F7FF] relative flex flex-col font-sans transition-colors duration-200">
        <BackgroundParticles />
        <LoginScreen onBrowsePublicSite={() => setGuestPublicMode(true)} />

        {/* Global Configuration Modals available from footer/shortcut */}
        <SupabaseConfigModal
          isOpen={supabaseConfigOpen}
          onClose={() => setSupabaseConfigOpen(false)}
          onOpenDeployGuide={() => {
            setSupabaseConfigOpen(false);
            setDeployGuideOpen(true);
          }}
        />
        <DeploymentGuideModal
          isOpen={deployGuideOpen}
          onClose={() => setDeployGuideOpen(false)}
        />
      </div>
    );
  }

  // 2. GUEST BROWSING MODE (Browsing public website while logged out)
  if (!user && guestPublicMode) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#080B14] text-slate-900 dark:text-[#F5F7FF] relative flex flex-col font-sans selection:bg-[#36D9FF]/20 selection:text-[#36D9FF] transition-colors duration-200">
        <BackgroundParticles />

        {/* Sticky Login Required Top Banner */}
        <div className="sticky top-0 z-50 bg-white/95 dark:bg-[#101629]/95 border-b border-slate-200 dark:border-[#36D9FF]/25 backdrop-blur-md px-4 py-2.5 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-[#9BA6BC] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0284C7] dark:text-[#36D9FF]" />
              <span>Public Campus Brochure Mode · Portal access requires authentication</span>
            </span>
            <button
              onClick={() => setGuestPublicMode(false)}
              className="px-3.5 py-1.5 text-xs font-bold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg transition-all flex items-center gap-1.5 shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In to Portal</span>
            </button>
          </div>
        </div>

        <main className="flex-1 relative z-10">
          <HeroSection
            onApplyNow={() => setGuestPublicMode(false)}
            onExploreCourses={() => {
              const el = document.getElementById('courses');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onEnterPortal={() => setGuestPublicMode(false)}
          />
          <DepartmentsSection departments={departments} />
          <CoursesSection />
          <FacilitiesSection facilities={facilities} />
          <PlacementsSection />
          <NoticesSection notices={notices} />
          <ContactSection />
          <Footer
            onOpenDeployGuide={() => setDeployGuideOpen(true)}
            onOpenSupabaseConfig={() => setSupabaseConfigOpen(true)}
          />
        </main>
      </div>
    );
  }

  // 3. AUTHENTICATED USER EXPERIENCE (Student, Faculty, or Administrator)
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080B14] text-slate-900 dark:text-[#F5F7FF] relative flex flex-col font-sans selection:bg-[#36D9FF]/20 selection:text-[#36D9FF] transition-colors duration-200">
      {/* Background Animated Neon Particles Canvas */}
      <BackgroundParticles />

      {/* Persistent Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenAuth={() => {}}
        onOpenSupabaseConfig={() => setSupabaseConfigOpen(true)}
        onOpenDeploymentGuide={() => setDeployGuideOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
        unreadCount={unreadCount}
      />

      {/* Main View Port */}
      <main className="flex-1 relative z-10">
        {currentView === 'home' ? (
          <div>
            <HeroSection
              onApplyNow={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreCourses={() => {
                const el = document.getElementById('courses');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onEnterPortal={() => setCurrentView('portal')}
            />
            <DepartmentsSection departments={departments} />
            <CoursesSection />
            <FacilitiesSection facilities={facilities} />
            <PlacementsSection />
            <NoticesSection notices={notices} />
            <ContactSection />
            <Footer
              onOpenDeployGuide={() => setDeployGuideOpen(true)}
              onOpenSupabaseConfig={() => setSupabaseConfigOpen(true)}
            />
          </div>
        ) : (
          <div className="relative">
            {/* Authenticated Dashboard according to User's verified Role */}
            {role === 'student' && <StudentDashboard />}
            {role === 'faculty' && <FacultyDashboard />}
            {role === 'admin' && <AdminDashboard />}
          </div>
        )}
      </main>

      {/* Modals */}
      <SupabaseConfigModal
        isOpen={supabaseConfigOpen}
        onClose={() => setSupabaseConfigOpen(false)}
        onOpenDeployGuide={() => {
          setSupabaseConfigOpen(false);
          setDeployGuideOpen(true);
        }}
      />

      <DeploymentGuideModal
        isOpen={deployGuideOpen}
        onClose={() => setDeployGuideOpen(false)}
      />

      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onClear={handleClearNotifications}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
