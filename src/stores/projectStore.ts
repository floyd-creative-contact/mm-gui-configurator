import { create } from 'zustand';
import { MobConfig } from '../types/mob';
import { exportMobsToYAML } from '../lib/yaml/yamlGenerator';
import { importYAMLToMobs } from '../lib/yaml/yamlParser';

interface ProjectState {
  // Project metadata
  projectName: string;
  setProjectName: (name: string) => void;

  // Mob data
  mobs: Map<string, MobConfig>;
  activeMobId: string | null;

  // Actions
  addMob: (mob: MobConfig) => void;
  updateMob: (id: string, updates: Partial<MobConfig>) => void;
  deleteMob: (id: string) => void;
  setActiveMob: (id: string | null) => void;
  getActiveMob: () => MobConfig | null;

  // Import/Export (will implement later)
  importYAML: (yaml: string) => void;
  exportYAML: () => string;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projectName: 'Untitled Project',
  setProjectName: (name: string) => set({ projectName: name }),

  mobs: new Map<string, MobConfig>(),
  activeMobId: null,

  addMob: (mob: MobConfig) => set((state) => {
    const newMobs = new Map(state.mobs);
    newMobs.set(mob.internalName, mob);
    return {
      mobs: newMobs,
      activeMobId: mob.internalName // Auto-select newly added mob
    };
  }),

  updateMob: (id: string, updates: Partial<MobConfig>) => set((state) => {
    const newMobs = new Map(state.mobs);
    const existingMob = newMobs.get(id);
    if (existingMob) {
      newMobs.set(id, { ...existingMob, ...updates });
    }
    return { mobs: newMobs };
  }),

  deleteMob: (id: string) => set((state) => {
    const newMobs = new Map(state.mobs);
    newMobs.delete(id);
    return {
      mobs: newMobs,
      activeMobId: state.activeMobId === id ? null : state.activeMobId
    };
  }),

  setActiveMob: (id: string | null) => set({ activeMobId: id }),

  getActiveMob: () => {
    const state = get();
    if (!state.activeMobId) return null;
    return state.mobs.get(state.activeMobId) || null;
  },

  // Import/Export implementations
  importYAML: (yaml: string) => {
    try {
      const importedMobs = importYAMLToMobs(yaml);
      set({
        mobs: importedMobs,
        activeMobId: importedMobs.size > 0 ? Array.from(importedMobs.keys())[0] : null
      });
    } catch (error) {
      console.error('Failed to import YAML:', error);
      alert(`Failed to import YAML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  exportYAML: () => {
    const state = get();
    return exportMobsToYAML(state.mobs);
  },
}));
