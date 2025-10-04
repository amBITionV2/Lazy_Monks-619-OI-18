"use client";
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

// Define the shape of the context data
interface AuthContextType {
  supabase: SupabaseClient;
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChange fires an event immediately with the initial session
    // and handles all subsequent auth events, ensuring the state is always fresh.
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabase]);

  // Expose the user, session, and login/logout functions
  const value = {
    supabase,
    user,
    session,
    loading,
    signOut: async () => {
        await supabase.auth.signOut();
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

