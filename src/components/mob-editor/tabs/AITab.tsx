import { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useProjectStore } from '../../../stores/projectStore';
import { MobConfig } from '../../../types/mob';

interface AITabProps {
  mob: MobConfig;
}

export function AITab({ mob }: AITabProps) {
  const updateMob = useProjectStore((state) => state.updateMob);
  const [newGoal, setNewGoal] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [editingGoalIndex, setEditingGoalIndex] = useState<number | null>(null);
  const [editingTargetIndex, setEditingTargetIndex] = useState<number | null>(null);
  const [editingGoalValue, setEditingGoalValue] = useState('');
  const [editingTargetValue, setEditingTargetValue] = useState('');

  const goals = mob.aiGoalSelectors || [];
  const targets = mob.aiTargetSelectors || [];

  // Goal Selectors
  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    const newGoals = [...goals, newGoal.trim()];
    updateMob(mob.internalName, { aiGoalSelectors: newGoals });
    setNewGoal('');
  };

  const handleDeleteGoal = (index: number) => {
    const newGoals = goals.filter((_, i) => i !== index);
    updateMob(mob.internalName, { aiGoalSelectors: newGoals });
  };

  const handleEditGoal = (index: number) => {
    setEditingGoalIndex(index);
    setEditingGoalValue(goals[index]);
  };

  const handleSaveGoal = (index: number) => {
    const newGoals = [...goals];
    newGoals[index] = editingGoalValue;
    updateMob(mob.internalName, { aiGoalSelectors: newGoals });
    setEditingGoalIndex(null);
    setEditingGoalValue('');
  };

  // Target Selectors
  const handleAddTarget = () => {
    if (!newTarget.trim()) return;
    const newTargets = [...targets, newTarget.trim()];
    updateMob(mob.internalName, { aiTargetSelectors: newTargets });
    setNewTarget('');
  };

  const handleDeleteTarget = (index: number) => {
    const newTargets = targets.filter((_, i) => i !== index);
    updateMob(mob.internalName, { aiTargetSelectors: newTargets });
  };

  const handleEditTarget = (index: number) => {
    setEditingTargetIndex(index);
    setEditingTargetValue(targets[index]);
  };

  const handleSaveTarget = (index: number) => {
    const newTargets = [...targets];
    newTargets[index] = editingTargetValue;
    updateMob(mob.internalName, { aiTargetSelectors: newTargets });
    setEditingTargetIndex(null);
    setEditingTargetValue('');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-8">
        {/* AI Goal Selectors */}
        <div>
          <h3 className="text-lg font-semibold mb-4">AI Goal Selectors</h3>
          <p className="text-sm text-gray-400 mb-4">
            Define custom AI goals for this mob. Goals control the mob's behavior and actions.
          </p>

          {/* Add Goal */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
              placeholder="e.g., 0 clear or 1 float"
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleAddGoal}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          {/* Goals List */}
          {goals.length === 0 ? (
            <div className="text-center py-8 bg-gray-800 border border-gray-700 rounded text-gray-500">
              No AI goals configured. Default Minecraft AI will be used.
            </div>
          ) : (
            <div className="space-y-2">
              {goals.map((goal, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded p-3"
                >
                  {editingGoalIndex === index ? (
                    <>
                      <input
                        type="text"
                        value={editingGoalValue}
                        onChange={(e) => setEditingGoalValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveGoal(index);
                          if (e.key === 'Escape') setEditingGoalIndex(null);
                        }}
                        className="flex-1 px-3 py-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveGoal(index)}
                        className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingGoalIndex(null)}
                        className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 font-mono text-sm">{goal}</span>
                      <button
                        onClick={() => handleEditGoal(index)}
                        className="p-2 text-gray-400 hover:text-primary transition-colors"
                        title="Edit goal"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(index)}
                        className="p-2 text-gray-400 hover:text-error transition-colors"
                        title="Delete goal"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Help */}
          <div className="mt-4 p-3 bg-gray-800 border border-gray-700 rounded text-xs text-gray-400">
            <p className="font-semibold mb-1">Common AI Goals:</p>
            <p><code>0 clear</code> - Clear all default AI</p>
            <p><code>1 float</code> - Make mob float in water</p>
            <p><code>2 opendoor</code> - Open doors</p>
            <p><code>3 meleeattack</code> - Melee attack behavior</p>
          </div>
        </div>

        {/* AI Target Selectors */}
        <div>
          <h3 className="text-lg font-semibold mb-4">AI Target Selectors</h3>
          <p className="text-sm text-gray-400 mb-4">
            Define custom targeting behavior for this mob. Target selectors control what the mob attacks.
          </p>

          {/* Add Target */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTarget()}
              placeholder="e.g., 0 clear or 1 players"
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleAddTarget}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          {/* Targets List */}
          {targets.length === 0 ? (
            <div className="text-center py-8 bg-gray-800 border border-gray-700 rounded text-gray-500">
              No AI targets configured. Default Minecraft targeting will be used.
            </div>
          ) : (
            <div className="space-y-2">
              {targets.map((target, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded p-3"
                >
                  {editingTargetIndex === index ? (
                    <>
                      <input
                        type="text"
                        value={editingTargetValue}
                        onChange={(e) => setEditingTargetValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveTarget(index);
                          if (e.key === 'Escape') setEditingTargetIndex(null);
                        }}
                        className="flex-1 px-3 py-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveTarget(index)}
                        className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTargetIndex(null)}
                        className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 font-mono text-sm">{target}</span>
                      <button
                        onClick={() => handleEditTarget(index)}
                        className="p-2 text-gray-400 hover:text-primary transition-colors"
                        title="Edit target"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTarget(index)}
                        className="p-2 text-gray-400 hover:text-error transition-colors"
                        title="Delete target"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Help */}
          <div className="mt-4 p-3 bg-gray-800 border border-gray-700 rounded text-xs text-gray-400">
            <p className="font-semibold mb-1">Common AI Targets:</p>
            <p><code>0 clear</code> - Clear all default targeting</p>
            <p><code>1 players</code> - Target players</p>
            <p><code>2 attacker</code> - Target whoever attacked this mob</p>
            <p><code>3 hurtby</code> - Target entities that hurt this mob</p>
          </div>
        </div>
      </div>
    </div>
  );
}
