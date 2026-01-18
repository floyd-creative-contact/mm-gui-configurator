import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useProjectStore } from '../../../stores/projectStore';
import { MetaskillConfig, ConditionEntry } from '../../../types/mob';

interface MetaskillConditionsTabProps {
  metaskill: MetaskillConfig;
}

type ConditionType = 'conditions' | 'targetConditions' | 'triggerConditions';

const CONDITION_TYPES: { id: ConditionType; label: string; description: string }[] = [
  {
    id: 'conditions',
    label: 'Conditions',
    description: 'Checked against the caster (the mob/entity using this metaskill)'
  },
  {
    id: 'targetConditions',
    label: 'Target Conditions',
    description: 'Checked against the target entity (filters which targets are affected)'
  },
  {
    id: 'triggerConditions',
    label: 'Trigger Conditions',
    description: 'Checked against the trigger entity (what caused the skill to activate)'
  }
];

const ACTION_OPTIONS = ['true', 'false', 'required', 'cancel'];

export function MetaskillConditionsTab({ metaskill }: MetaskillConditionsTabProps) {
  const updateMetaskill = useProjectStore((state) => state.updateMetaskill);
  const [newConditions, setNewConditions] = useState<Record<ConditionType, string>>({
    conditions: '',
    targetConditions: '',
    triggerConditions: ''
  });

  const handleAddCondition = (type: ConditionType) => {
    const conditionText = newConditions[type].trim();
    if (!conditionText) return;

    const current = metaskill[type] || [];
    const newCondition: ConditionEntry = {
      condition: conditionText,
      action: 'true'
    };

    updateMetaskill(metaskill.internalName, {
      [type]: [...current, newCondition]
    });

    setNewConditions(prev => ({ ...prev, [type]: '' }));
  };

  const handleDeleteCondition = (type: ConditionType, index: number) => {
    const current = metaskill[type] || [];
    const updated = current.filter((_, i) => i !== index);
    updateMetaskill(metaskill.internalName, { [type]: updated });
  };

  const handleUpdateCondition = (type: ConditionType, index: number, updates: Partial<ConditionEntry>) => {
    const current = metaskill[type] || [];
    const updated = [...current];
    updated[index] = { ...updated[index], ...updates };
    updateMetaskill(metaskill.internalName, { [type]: updated });
  };

  const renderConditionSection = (type: ConditionType, label: string, description: string) => {
    const conditions = metaskill[type] || [];

    return (
      <div key={type} className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{label}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>

        {/* Add Condition */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newConditions[type]}
            onChange={(e) => setNewConditions(prev => ({ ...prev, [type]: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCondition(type)}
            placeholder="e.g., health{h=>50} or incombat"
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary text-sm"
          />
          <button
            onClick={() => handleAddCondition(type)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {/* Conditions List */}
        {conditions.length === 0 ? (
          <div className="text-center py-8 bg-gray-800 border border-gray-700 rounded text-gray-500 text-sm">
            No {label.toLowerCase()} configured
          </div>
        ) : (
          <div className="space-y-2">
            {conditions.map((condition, index) => (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 rounded p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm text-gray-300 break-all mb-2">
                      {condition.condition}
                      {condition.value && ` ${condition.value}`}
                    </div>

                    {/* Action Selector */}
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-400">Action:</label>
                      <select
                        value={condition.action || 'true'}
                        onChange={(e) => handleUpdateCondition(type, index, { action: e.target.value })}
                        className="px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
                      >
                        {ACTION_OPTIONS.map(action => (
                          <option key={action} value={action}>{action}</option>
                        ))}
                        <option value="power">power (custom value)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteCondition(type, index)}
                    className="p-2 text-gray-400 hover:text-error transition-colors flex-shrink-0"
                    title="Delete condition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-8">
        {CONDITION_TYPES.map(({ id, label, description }) =>
          renderConditionSection(id, label, description)
        )}

        {/* Help */}
        <div className="p-4 bg-gray-800 border border-gray-700 rounded">
          <h4 className="text-sm font-semibold mb-2">About Conditions</h4>
          <div className="text-xs text-gray-400 space-y-2">
            <p><strong className="text-gray-300">Conditions</strong> check the caster (entity using the skill)</p>
            <p><strong className="text-gray-300">Target Conditions</strong> filter which targets are affected</p>
            <p><strong className="text-gray-300">Trigger Conditions</strong> check what triggered the skill</p>

            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="font-semibold text-gray-300 mb-1">Common Conditions:</p>
              <p><code>health{'{'}h&gt;50{'}'}</code> - Health above 50</p>
              <p><code>distance{'{'}d&lt;10{'}'}</code> - Distance less than 10 blocks</p>
              <p><code>incombat</code> - In combat</p>
              <p><code>day</code> - During daytime</p>
              <p><code>holding{'{'}m=DIAMOND_SWORD{'}'}</code> - Holding specific item</p>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="font-semibold text-gray-300 mb-1">Condition Actions:</p>
              <p><code>true</code> (default) - Condition must be true</p>
              <p><code>false</code> - Condition must be false</p>
              <p><code>required</code> - Skill fails if false</p>
              <p><code>cancel</code> - Cancel entire skill tree</p>
              <p><code>power X</code> - Modify power multiplier</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
