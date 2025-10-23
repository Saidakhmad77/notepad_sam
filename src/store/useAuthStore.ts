import { create } from 'zustand';
import { token } from '@/lib/token';

type AuthState = {
  isAuthed: boolean;
  setTokens: (access: string, refresh?: string) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthed: !!token.access,
  setTokens: (a, r) => { token.set(a, r); set({ isAuthed: true }); },
  signOut: () => { token.clear(); set({ isAuthed: false }); },
}));
