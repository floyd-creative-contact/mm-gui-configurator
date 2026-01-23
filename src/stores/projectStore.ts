import { create } from 'zustand';
import { MobConfig, MetaskillConfig } from '../types/mob';
import { exportMobsToYAML } from '../lib/yaml/yamlGenerator';
import { importYAMLToMobs } from '../lib/yaml/yamlParser';
import { validateMob, validateMetaskill, validateProject, ValidationResult } from '../lib/validation/validator';

interface HistoryState {
  mobs: Map<string, MobConfig>;
  metaskills: Map<string, MetaskillConfig>;
}

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

  // History for undo/redo
  past: HistoryState[];
  future: HistoryState[];

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

  // Validation
  validateMob: (id: string) => ValidationResult;
  validateMetaskill: (id: string) => ValidationResult;
  validateAll: () => { mobs: Map<string, ValidationResult>; metaskills: Map<string, ValidationResult>; canExport: boolean };

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const MAX_HISTORY = 50;

// Helper to clone Maps deeply
function cloneMaps(mobs: Map<string, MobConfig>, metaskills: Map<string, MetaskillConfig>): HistoryState {
  return {
    mobs: new Map(Array.from(mobs.entries()).map(([k, v]) => [k, { ...v }])),
    metaskills: new Map(Array.from(metaskills.entries()).map(([k, v]) => [k, { ...v }])),
  };
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projectName: 'Untitled Project',
  setProjectName: (name: string) => set({ projectName: name }),

  mobs: new Map<string, MobConfig>(),
  activeMobId: null,

  metaskills: new Map<string, MetaskillConfig>(),
  activeMetaskillId: null,

  past: [],
  future: [],

  // Mob actions
  addMob: (mob: MobConfig) => set((state) => {
    // Save current state to history
    const past = [...state.past, cloneMaps(state.mobs, state.metaskills)].slice(-MAX_HISTORY);

    const newMobs = new Map(state.mobs);
    newMobs.set(mob.internalName, mob);
    return {
      mobs: newMobs,
      activeMobId: mob.internalName, // Auto-select newly added mob
      past,
      future: [], // Clear future when new action is performed
    };
  }),

  updateMob: (id: string, updates: Partial<MobConfig>) => set((state) => {
    const newMobs = new Map(state.mobs);
    const existingMob = newMobs.get(id);
    if (!existingMob) return state;

    // Save current state to history
    const past = [...state.past, cloneMaps(state.mobs, state.metaskills)].slice(-MAX_HISTORY);

    newMobs.set(id, { ...existingMob, ...updates });
    return {
      mobs: newMobs,
      past,
      future: [], // Clear future when new action is performed
    };
  }),

  deleteMob: (id: string) => set((state) => {
    // Save current state to history
    const past = [...state.past, cloneMaps(state.mobs, state.metaskills)].slice(-MAX_HISTORY);

    const newMobs = new Map(state.mobs);
    newMobs.delete(id);
    return {
      mobs: newMobs,
      activeMobId: state.activeMobId === id ? null : state.activeMobId,
      past,
      future: [], // Clear future when new action is performed
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
    // Save current state to history
    const past = [...state.past, cloneMaps(state.mobs, state.metaskills)].slice(-MAX_HISTORY);

    const newMetaskills = new Map(state.metaskills);
    newMetaskills.set(metaskill.internalName, metaskill);
    return {
      metaskills: newMetaskills,
      activeMetaskillId: metaskill.internalName, // Auto-select newly added metaskill
      past,
      future: [], // Clear future when new action is performed
    };
  }),

  updateMetaskill: (id: string, updates: Partial<MetaskillConfig>) => set((state) => {
    const newMetaskills = new Map(state.metaskills);
    const existing = newMetaskills.get(id);
    if (!existing) return state;

    // Save current state to history
    const past = [...state.past, cloneMaps(state.mobs, state.metaskills)].slice(-MAX_HISTORY);

    newMetaskills.set(id, { ...existing, ...updates });
    return {
      metaskills: newMetaskills,
      past,
      future: [], // Clear future when new action is performed
    };
  }),

  deleteMetaskill: (id: string) => set((state) => {
    // Save current state to history
    const past = [...state.past, cloneMaps(state.mobs, state.metaskills)].slice(-MAX_HISTORY);

    const newMetaskills = new Map(state.metaskills);
    newMetaskills.delete(id);
    return {
      metaskills: newMetaskills,
      activeMetaskillId: state.activeMetaskillId === id ? null : state.activeMetaskillId,
      past,
      future: [], // Clear future when new action is performed
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

  // Validation implementations
  validateMob: (id: string) => {
    const state = get();
    const mob = state.mobs.get(id);
    if (!mob) {
      return { valid: false, issues: [], errors: [], warnings: [], info: [] };
    }
    return validateMob(mob, state.mobs, state.metaskills);
  },

  validateMetaskill: (id: string) => {
    const state = get();
    const metaskill = state.metaskills.get(id);
    if (!metaskill) {
      return { valid: false, issues: [], errors: [], warnings: [], info: [] };
    }
    return validateMetaskill(metaskill, state.metaskills);
  },

  validateAll: () => {
    const state = get();
    return validateProject(state.mobs, state.metaskills);
  },

  // Undo/Redo implementations
  undo: () => set((state) => {
    if (state.past.length === 0) return state;

    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);

    // Save current state to future
    const current = cloneMaps(state.mobs, state.metaskills);
    const newFuture = [current, ...state.future].slice(0, MAX_HISTORY);

    return {
      mobs: previous.mobs,
      metaskills: previous.metaskills,
      past: newPast,
      future: newFuture,
    };
  }),

  redo: () => set((state) => {
    if (state.future.length === 0) return state;

    const next = state.future[0];
    const newFuture = state.future.slice(1);

    // Save current state to past
    const current = cloneMaps(state.mobs, state.metaskills);
    const newPast = [...state.past, current].slice(-MAX_HISTORY);

    return {
      mobs: next.mobs,
      metaskills: next.metaskills,
      past: newPast,
      future: newFuture,
    };
  }),

  canUndo: () => {
    const state = get();
    return state.past.length > 0;
  },

  canRedo: () => {
    const state = get();
    return state.future.length > 0;
  },
}));
