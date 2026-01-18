import { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useProjectStore } from '../../../stores/projectStore';
import { MobConfig } from '../../../types/mob';

interface DropsTabProps {
  mob: MobConfig;
}

export function DropsTab({ mob }: DropsTabProps) {
  const updateMob = useProjectStore((state) => state.updateMob);
  const [newDrop, setNewDrop] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const drops = mob.drops || [];

  const handleAddDrop = () => {
    if (!newDrop.trim()) return;
    const newDrops = [...drops, newDrop.trim()];
    updateMob(mob.internalName, { drops: newDrops });
    setNewDrop('');
  };

  const handleDeleteDrop = (index: number) => {
    const newDrops = drops.filter((_, i) => i !== index);
    updateMob(mob.internalName, { drops: newDrops });
  };

  const handleEditDrop = (index: number) => {
    setEditingIndex(index);
    setEditingValue(drops[index]);
  };

  const handleSaveDrop = (index: number) => {
    const newDrops = [...drops];
    newDrops[index] = editingValue;
    updateMob(mob.internalName, { drops: newDrops });
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  // Quick add templates
  const quickAddTemplates = [
    { label: 'Simple Item', value: 'DIAMOND 1-3 1.0' },
    { label: 'Rare Drop', value: 'EMERALD 1 0.25' },
    { label: 'Custom Item', value: 'CustomItem 1 1.0' },
  ];

  const handleQuickAdd = (template: string) => {
    const newDrops = [...drops, template];
    updateMob(mob.internalName, { drops: newDrops });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Mob Drops</h3>
          <p className="text-sm text-gray-400">
            Configure items that this mob drops when killed.
          </p>
        </div>

        {/* Add Drop */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newDrop}
              onChange={(e) => setNewDrop(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddDrop()}
              placeholder="e.g., DIAMOND 1-3 0.5 or CustomItem 1 1.0"
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleAddDrop}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              <Plus size={16} />
              Add Drop
            </button>
          </div>

          {/* Quick Add Templates */}
          <div className="flex gap-2">
            <span className="text-sm text-gray-400 my-auto">Quick Add:</span>
            {quickAddTemplates.map((template, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAdd(template.value)}
                className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>

        {/* Drops List */}
        {drops.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 border border-gray-700 rounded text-gray-500">
            <p>No drops configured for this mob.</p>
            <p className="text-sm mt-2">Click "Add Drop" to configure loot.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {drops.map((drop, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded p-3"
              >
                {editingIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveDrop(index);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      className="flex-1 px-3 py-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary font-mono text-sm"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveDrop(index)}
                      className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 font-mono text-sm">{drop}</span>
                    <button
                      onClick={() => handleEditDrop(index)}
                      className="p-2 text-gray-400 hover:text-primary transition-colors"
                      title="Edit drop"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteDrop(index)}
                      className="p-2 text-gray-400 hover:text-error transition-colors"
                      title="Delete drop"
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
        <div className="p-4 bg-gray-800 border border-gray-700 rounded">
          <h4 className="text-sm font-semibold mb-2">Drop Format</h4>
          <div className="text-xs text-gray-400 space-y-2">
            <p>Basic format: <code className="text-gray-300">ITEM_NAME AMOUNT CHANCE</code></p>

            <div className="space-y-1 mt-2">
              <p className="font-semibold text-gray-300">Examples:</p>
              <p><code className="text-gray-300">DIAMOND 1 1.0</code> - Always drops 1 diamond</p>
              <p><code className="text-gray-300">EMERALD 1-3 0.5</code> - 50% chance to drop 1-3 emeralds</p>
              <p><code className="text-gray-300">GOLD_INGOT 5-10 0.25</code> - 25% chance to drop 5-10 gold ingots</p>
              <p><code className="text-gray-300">CustomSword 1 1.0</code> - Always drops custom item named "CustomSword"</p>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="font-semibold text-gray-300 mb-1">Advanced Options:</p>
              <p>You can also reference MythicMobs drop tables or use conditions:</p>
              <p><code className="text-gray-300">table:RareDrops 1 1.0</code> - Reference a drop table</p>
              <p><code className="text-gray-300">exp:100-500</code> - Drop experience points</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
