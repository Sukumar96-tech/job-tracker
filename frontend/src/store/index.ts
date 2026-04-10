import { create } from 'zustand';
import { Application } from '../types';

interface AuthStore {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

interface AppStore {
  applications: Application[];
  setApplications: (apps: Application[]) => void;
  addApplication: (app: Application) => void;
  updateApplication: (app: Application) => void;
  removeApplication: (id: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem('token'),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null });
  },
}));

export const useAppStore = create<AppStore>((set) => ({
  applications: [],
  setApplications: (applications) => set({ applications }),
  addApplication: (application) =>
    set((state) => ({
      applications: [application, ...state.applications],
    })),
  updateApplication: (application) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app._id === application._id ? application : app
      ),
    })),
  removeApplication: (id) =>
    set((state) => ({
      applications: state.applications.filter((app) => app._id !== id),
    })),
}));
