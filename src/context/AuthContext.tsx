import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, AuditLog } from '../types';
import {
  DEMO_ADMIN,
  INITIAL_REGISTERED_USERS,
  getStoredData,
  setStoredData,
  INITIAL_AUDIT_LOGS,
} from '../integrations/supabase/mockDb';
import { getSupabase } from '../integrations/supabase/client';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  registeredUsers: UserProfile[];
  login: (email: string, password?: string, intendedRole?: UserRole) => Promise<{ success: boolean; error?: string }>;
  register: (userData: Partial<UserProfile>, password?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, entityType: string, entityId?: string, details?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    return getStoredData<UserProfile | null>('current_user', null);
  });

  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    return getStoredData<UserProfile[]>('registered_users', INITIAL_REGISTERED_USERS);
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    return getStoredData<AuditLog[]>('audit_logs', INITIAL_AUDIT_LOGS);
  });

  useEffect(() => {
    setStoredData('current_user', user);
  }, [user]);

  useEffect(() => {
    setStoredData('registered_users', registeredUsers);
    // Also keep admin_managed_users in sync
    setStoredData('admin_managed_users', registeredUsers);
  }, [registeredUsers]);

  useEffect(() => {
    setStoredData('audit_logs', auditLogs);
  }, [auditLogs]);

  const addAuditLog = (action: string, entityType: string, entityId?: string, details?: string) => {
    const newLog: AuditLog = {
      id: 'aud_' + Date.now(),
      userEmail: user?.email || 'system@nexora.edu',
      action,
      entityType,
      entityId,
      details: details || '',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const login = async (
    email: string,
    password?: string,
    intendedRole?: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password?.trim() || '';

    // 1. ADMIN LOGIN - Only ajayshewale211@gmail.com with password ajay123
    if (cleanEmail === 'ajayshewale211@gmail.com' || intendedRole === 'admin') {
      if (cleanEmail !== 'ajayshewale211@gmail.com' || cleanPassword !== 'ajay123') {
        return {
          success: false,
          error: 'Invalid Administrator credentials. Only authorized admin (ajayshewale211@gmail.com) can log in.',
        };
      }

      setUser(DEMO_ADMIN);
      addAuditLog('ADMIN_LOGIN', 'Auth', DEMO_ADMIN.id, `Administrator ${DEMO_ADMIN.fullName} signed in.`);
      return { success: true };
    }

    // 2. REAL SUPABASE AUTH FALLBACK (if connected)
    const supabase = getSupabase();
    if (supabase && cleanPassword) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });
        if (!error && data.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileData) {
            if (!profileData.is_approved) {
              return {
                success: false,
                error: 'Your registration request is pending Administrator approval. Please wait for admin (ajayshewale211@gmail.com) to approve your account.',
              };
            }

            const loggedUser: UserProfile = {
              id: profileData.id,
              email: profileData.email,
              fullName: profileData.full_name,
              role: profileData.role,
              department: profileData.department,
              enrollmentNo: profileData.enrollment_no,
              phone: profileData.phone,
              semester: profileData.semester,
              academicYear: profileData.academic_year,
              avatarUrl: profileData.avatar_url,
              isApproved: profileData.is_approved,
              status: profileData.is_approved ? 'Active' : 'Pending Approval',
              createdAt: profileData.created_at,
            };
            setUser(loggedUser);
            addAuditLog('USER_LOGIN', 'Auth', loggedUser.id, `Logged in via Supabase Auth (${loggedUser.role})`);
            return { success: true };
          }
        }
      } catch (err) {
        console.warn('Supabase signin check, falling back to local registry:', err);
      }
    }

    // 3. STUDENT & FACULTY LOCAL AUTHENTICATION GATE
    const currentRegistry = getStoredData<UserProfile[]>('registered_users', registeredUsers);
    const foundUser = currentRegistry.find(
      (u) => u.email.toLowerCase() === cleanEmail && (!intendedRole || u.role === intendedRole)
    );

    if (!foundUser) {
      return {
        success: false,
        error: `No ${intendedRole ? intendedRole : 'user'} account found for "${cleanEmail}". Please register first to submit an access request to the Administrator.`,
      };
    }

    if (foundUser.password && foundUser.password !== cleanPassword) {
      return {
        success: false,
        error: 'Incorrect password. Please verify your credentials.',
      };
    }

    // STRICT APPROVAL ENFORCEMENT: Student or teacher can ONLY log in if admin approved them
    if (!foundUser.isApproved || foundUser.status === 'Pending Approval') {
      return {
        success: false,
        error: 'Your registration is pending Administrator approval. Admin (ajayshewale211@gmail.com) must review and approve your account before you can log in.',
      };
    }

    if (foundUser.status === 'Suspended') {
      return {
        success: false,
        error: 'Your account has been suspended by the Administrator (ajayshewale211@gmail.com).',
      };
    }

    // Approved user enters portal
    setUser(foundUser);
    addAuditLog('USER_LOGIN', 'Auth', foundUser.id, `Approved user signed in as ${foundUser.role}: ${foundUser.fullName}`);
    return { success: true };
  };

  const register = async (
    userData: Partial<UserProfile>,
    password?: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = userData.email?.trim().toLowerCase() || '';

    if (!cleanEmail) {
      return { success: false, message: 'Valid institutional email address is required.' };
    }

    // Prohibit registering admin role directly
    const targetRole: UserRole = userData.role === 'admin' ? 'student' : (userData.role || 'student');

    // Check if account already exists
    const currentRegistry = getStoredData<UserProfile[]>('registered_users', registeredUsers);
    const existing = currentRegistry.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      if (existing.isApproved) {
        return {
          success: false,
          message: 'An approved account with this email already exists. Please proceed to Sign In.',
        };
      }
      return {
        success: false,
        message: 'Your registration request is already submitted and awaiting Administrator approval. Please wait for admin (ajayshewale211@gmail.com) to approve it.',
      };
    }

    // Create new applicant in 'Pending Approval' state (NOT auto-logged in)
    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      email: cleanEmail,
      fullName: userData.fullName || 'New Applicant',
      role: targetRole,
      department: userData.department || 'General Studies',
      enrollmentNo: userData.enrollmentNo || (targetRole === 'student' ? `NX-2026-${Math.floor(1000 + Math.random() * 9000)}` : undefined),
      phone: userData.phone || '',
      semester: userData.semester || 1,
      academicYear: '2026-2027',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
      isApproved: false, // Must be approved by admin ajayshewale211@gmail.com
      status: 'Pending Approval',
      password: password || 'pass123',
      createdAt: new Date().toISOString(),
    };

    const updated = [...currentRegistry, newUser];
    setRegisteredUsers(updated);
    setStoredData('registered_users', updated);
    setStoredData('admin_managed_users', updated);

    // Push notification for Admin
    const notifications = getStoredData<any[]>('notifications', []);
    const newNotice = {
      id: 'notif_' + Date.now(),
      title: `New ${newUser.role.toUpperCase()} Registration Request`,
      message: `${newUser.fullName} (${newUser.email}) requested access to ${newUser.department}. Needs administrator approval.`,
      timestamp: 'Just now',
      type: 'warning',
      isRead: false,
    };
    setStoredData('notifications', [newNotice, ...notifications]);

    addAuditLog(
      'REGISTRATION_REQUEST',
      'Profile',
      newUser.id,
      `New ${newUser.role} registration request from ${newUser.fullName} (${cleanEmail}) queued for Administrator (ajayshewale211@gmail.com) approval.`
    );

    // Do NOT call setUser(newUser) - user remains unauthenticated until approved!
    return {
      success: true,
      message: `Registration request submitted successfully! Your application has been sent to Administrator Ajay Shewale (ajayshewale211@gmail.com). You will be able to log in as soon as the administrator approves your request.`,
    };
  };

  const approveUser = (userId: string) => {
    const currentRegistry = getStoredData<UserProfile[]>('registered_users', registeredUsers);
    const updated = currentRegistry.map((u) => {
      if (u.id === userId) {
        addAuditLog('ADMIN_APPROVE_USER', 'Profile', u.id, `Administrator approved registration for ${u.fullName} (${u.email})`);
        return { ...u, isApproved: true, status: 'Active' as const };
      }
      return u;
    });
    setRegisteredUsers(updated);
    setStoredData('registered_users', updated);
    setStoredData('admin_managed_users', updated);
  };

  const rejectUser = (userId: string) => {
    const currentRegistry = getStoredData<UserProfile[]>('registered_users', registeredUsers);
    const target = currentRegistry.find((u) => u.id === userId);
    const updated = currentRegistry.filter((u) => u.id !== userId);
    setRegisteredUsers(updated);
    setStoredData('registered_users', updated);
    setStoredData('admin_managed_users', updated);
    addAuditLog('ADMIN_REJECT_USER', 'Profile', userId, `Administrator rejected registration for ${target?.fullName || userId}`);
  };

  const logout = () => {
    if (user) {
      addAuditLog('USER_LOGOUT', 'Auth', user.id, `User logged out: ${user.email}`);
    }
    const supabase = getSupabase();
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    const currentRegistry = getStoredData<UserProfile[]>('registered_users', registeredUsers);
    const updatedRegistry = currentRegistry.map((u) => (u.id === user.id ? updated : u));
    setRegisteredUsers(updatedRegistry);
    addAuditLog('PROFILE_UPDATE', 'Profile', user.id, `Updated profile contact details`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: Boolean(user),
        registeredUsers,
        login,
        register,
        logout,
        approveUser,
        rejectUser,
        updateProfile,
        auditLogs,
        addAuditLog,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
