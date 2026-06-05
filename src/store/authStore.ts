import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  avatar: string;
  full_name?: string;
  title?: string;
  bio?: string;
  location?: string;
  phone?: string;
  dob?: string;
  website?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
}

interface AuthStore {
  session: Session | null;
  profile: Profile | null;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  profile: null,
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
}));
