import React, { useState } from 'react';
import { Sparkles, User, Database, Menu, X, Bell, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  currentView: 'home' | 'portal';
  onNavigate: (view: 'home' | 'portal') => void;
  onOpenAuth: () => void;
  onOpenSupabaseConfig: () => void;
  onOpenDeploymentGuide: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenSupabaseConfig,
  onOpenDeploymentGuide,
  onOpenNotifications,
  unreadCount,
}) => {
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#080B14]/85 backdrop-blur-md border-b border-slate-200 dark:border-[#36D9FF]/15 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 text-left group whitespace-nowrap shrink-0 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#36D9FF]/20 via-[#B46AFF]/20 to-[#36D9FF]/40 border border-[#36D9FF]/40 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(54,217,255,0.3)] transition-transform duration-200 group-hover:scale-105">
            <Sparkles className="w-4 h-4 text-[#36D9FF]" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-[#F5F7FF] flex items-center gap-1.5">
              NEXORA
              <span className="text-[10px] font-mono tracking-widest text-[#36D9FF] uppercase font-semibold">
                PORTAL
              </span>
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (single line, no pills) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-[#9BA6BC]">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors hover:text-[#36D9FF] whitespace-nowrap shrink-0 ${
              currentView === 'home' ? 'text-[#36D9FF] font-semibold' : ''
            }`}
          >
            Home
          </button>
          <a
            href="#departments"
            onClick={() => {
              if (currentView !== 'home') onNavigate('home');
            }}
            className="transition-colors hover:text-[#36D9FF] whitespace-nowrap shrink-0"
          >
            Departments
          </a>
          <a
            href="#courses"
            onClick={() => {
              if (currentView !== 'home') onNavigate('home');
            }}
            className="transition-colors hover:text-[#36D9FF] whitespace-nowrap shrink-0"
          >
            Courses
          </a>
          <a
            href="#facilities"
            onClick={() => {
              if (currentView !== 'home') onNavigate('home');
            }}
            className="transition-colors hover:text-[#36D9FF] whitespace-nowrap shrink-0"
          >
            Campus Life
          </a>
          <a
            href="#notices"
            onClick={() => {
              if (currentView !== 'home') onNavigate('home');
            }}
            className="transition-colors hover:text-[#36D9FF] whitespace-nowrap shrink-0"
          >
            Notices
          </a>
          <button
            onClick={onOpenDeploymentGuide}
            className="transition-colors hover:text-[#B46AFF] text-xs font-mono text-[#B46AFF]/90 whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Deploy Guide</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Light / Dark Mode Switcher */}
          <ThemeToggle />

          {/* Quick Database / Supabase Config Trigger */}
          <button
            onClick={onOpenSupabaseConfig}
            title="Supabase Database Settings"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-slate-600 dark:text-[#9BA6BC] hover:text-[#36D9FF] bg-slate-100 dark:bg-[#101629]/80 border border-slate-200 dark:border-slate-800 hover:border-[#36D9FF]/40 rounded-xl transition-all"
          >
            <Database className="w-3.5 h-3.5 text-[#36D9FF]" />
            <span className="hidden lg:inline">Supabase</span>
          </button>

          {/* Notifications Button */}
          {user && (
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-600 dark:text-[#9BA6BC] hover:text-slate-900 dark:hover:text-[#F5F7FF] rounded-xl hover:bg-slate-100 dark:hover:bg-[#101629] transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#36D9FF] ring-2 ring-white dark:ring-[#080B14]" />
              )}
            </button>
          )}

          {/* Authenticated User Status & Logout */}
          {user ? (
            <div className="flex items-center gap-2.5">
              {/* User Profile Badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-[#101629] border border-slate-200 dark:border-slate-800 rounded-xl">
                <div className="w-6 h-6 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-semibold text-slate-900 dark:text-white leading-tight truncate max-w-[110px]">
                    {user.fullName}
                  </span>
                  <span className="block text-[10px] font-mono text-[#36D9FF] capitalize">
                    {role}
                  </span>
                </div>
              </div>

              {/* View Toggle */}
              <button
                onClick={() => onNavigate(currentView === 'home' ? 'portal' : 'home')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors whitespace-nowrap shrink-0 border border-slate-200 dark:border-slate-700"
              >
                {currentView === 'home' ? 'My Dashboard' : 'Public Site'}
              </button>

              {/* Secure Sign Out Button */}
              <button
                onClick={logout}
                title="Sign Out of Portal"
                className="p-2 text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-white bg-rose-50 dark:bg-transparent hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-medium border border-rose-200 dark:border-transparent"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-bold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg transition-all shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)] whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Portal Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#9BA6BC] hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#080B14]/95 border-b border-[#36D9FF]/20 px-4 py-4 space-y-3">
          <div className="flex flex-col gap-2 text-sm text-[#9BA6BC]">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-[#36D9FF]"
            >
              Home
            </button>
            <a
              href="#departments"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#36D9FF]"
            >
              Departments
            </a>
            <a
              href="#courses"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#36D9FF]"
            >
              Courses
            </a>
            <a
              href="#facilities"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#36D9FF]"
            >
              Campus Facilities
            </a>
            <a
              href="#notices"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#36D9FF]"
            >
              Notices
            </a>
            <button
              onClick={() => {
                onOpenDeploymentGuide();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 text-[#B46AFF]"
            >
              Free Deployment Guide
            </button>
            <button
              onClick={() => {
                onOpenSupabaseConfig();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 text-[#36D9FF]"
            >
              Supabase Configuration
            </button>
          </div>

          {user ? (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-white font-semibold block">{user.fullName}</span>
                <span className="text-[#36D9FF] font-mono capitalize">{role}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 bg-rose-500/20 text-rose-300 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-[#36D9FF] text-[#080B14] font-bold rounded-lg text-xs text-center"
              >
                Sign In to Portal
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
