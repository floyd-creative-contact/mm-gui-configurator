import { create } from 'zustand';
import { MobConfig, MetaskillConfig } from '../types/mob';
import { exportMobsToYAML } from '../lib/yaml/yamlGenerator';
import { importYAMLToMobs } from '../lib/yaml/yamlParser';

interface ProjectState {
  // Project metadata
  projectName: string;
  setProjectName: (name: string) => void;

  // Mob data
  mobs: Map<string, MobConfig>;
  activeMobId: string | null;

  // Metaskill data
  metaskills: Map<string, MetaskillConfig>;
  activeMetaskillId: string | null;

  // Mob actions
  addMob: (mob: MobConfig) => void;
  updateMob: (id: string, updates: Partial<MobConfig>) => void;
  deleteMob: (id: string) => void;
  setActiveMob: (id: string | null) => void;
  getActiveMob: () => MobConfig | null;

  // Metaskill actions
  addMetaskill: (metaskill: MetaskillConfig) => void;
  updateMetaskill: (id: string, updates: Partial<MetaskillConfig>) => void;
  deleteMetaskill: (id: string) => void;
  setActiveMetaskill: (id: string | null) => void;
  getActiveMetaskill: () => MetaskillConfig | null;
  getMetaskillUsageCount: (id: string) => number;

  // Import/Export
  importYAML: (yaml: string) => void;
  exportYAML: () => string;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projectName: 'Untitled Project',
  setProjectName: (name: string) => set({ projectName: name }),

  mobs: new Map<string, MobConfig>(),
  activeMobId: null,

  metaskills: new Map<string, MetaskillConfig>(),
  activeMetaskillId: null,

  // Mob actions
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

  // Metaskill actions
  addMetaskill: (metaskill: MetaskillConfig) => set((state) => {
    const newMetaskills = new Map(state.metaskills);
    newMetaskills.set(metaskill.internalName, metaskill);
    return {
      metaskills: newMetaskills,
      activeMetaskillId: metaskill.internalName // Auto-select newly added metaskill
    };
  }),

  updateMetaskill: (id: string, updates: Partial<MetaskillConfig>) => set((state) => {
    const newMetaskills = new Map(state.metaskills);
    const existing = newMetaskills.get(id);
    if (existing) {
      newMetaskills.set(id, { ...existing, ...updates });
    }
    return { metaskills: newMetaskills };
  }),

  deleteMetaskill: (id: string) => set((state) => {
    const newMetaskills = new Map(state.metaskills);
    newMetaskills.delete(id);
    return {
      metaskills: newMetaskills,
      activeMetaskillId: state.activeMetaskillId === id ? null : state.activeMetaskillId
    };
  }),

  setActiveMetaskill: (id: string | null) => set({ activeMetaskillId: id }),

  getActiveMetaskill: () => {
    const state = get();
    if (!state.activeMetaskillId) return null;
    return state.metaskills.get(state.activeMetaskillId) || null;
  },

  getMetaskillUsageCount: (id: string) => {
    const state = get();
    let count = 0;

    // Count usage in mobs
    state.mobs.forEach((mob) => {
      mob.skills?.forEach((skill) => {
        if (skill.mechanic === 'skill' && skill.parameters?.s === id) {
          count++;
        }
      });
    });

    // Count usage in other metaskills
    state.metaskills.forEach((metaskill) => {
      metaskill.skills.forEach((skill) => {
        if (skill.mechanic === 'skill' && skill.parameters?.s === id) {
          count++;
        }
      });
    });

    return count;
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
