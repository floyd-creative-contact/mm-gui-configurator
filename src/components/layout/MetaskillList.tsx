import { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { MetaskillConfig } from '../../types/mob';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

export function MetaskillList() {
  const { metaskills, activeMetaskillId, addMetaskill, setActiveMetaskill, deleteMetaskill, getMetaskillUsageCount } = useProjectStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newMetaskillName, setNewMetaskillName] = useState('');

  const metaskillList = Array.from(metaskills.values());

  const handleCreateMetaskill = () => {
    if (!newMetaskillName.trim()) return;

    const internalName = newMetaskillName.trim().replace(/\s+/g, '_');

    // Check if metaskill already exists
    if (metaskills.has(internalName)) {
      alert('A metaskill with this name already exists!');
      return;
    }

    const newMetaskill: MetaskillConfig = {
      internalName,
      skills: [],
    };

    addMetaskill(newMetaskill);
    setNewMetaskillName('');
    setIsCreating(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const usageCount = getMetaskillUsageCount(id);
    if (usageCount > 0) {
      if (!confirm(`This metaskill is used ${usageCount} time(s). Delete anyway?`)) {
        return;
      }
    } else {
      if (!confirm(`Delete metaskill "${id}"?`)) {
        return;
      }
    }

    deleteMetaskill(id);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold mb-3">Metaskills</h2>
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full px-3 py-2 bg-primary hover:bg-blue-700 rounded transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Plus size={16} strokeWidth={2} />
            New Metaskill
          </button>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={newMetaskillName}
              onChange={(e) => setNewMetaskillName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateMetaskill();
                if (e.key === 'Escape') {
                  setIsCreating(false);
                  setNewMetaskillName('');
                }
              }}
              placeholder="Metaskill name..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateMetaskill}
                className="flex-1 px-3 py-1 bg-success hover:bg-green-700 rounded transition-colors text-sm"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewMetaskillName('');
                }}
                className="flex-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {metaskillList.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No metaskills yet. Create one to get started!
          </div>
        ) : (
          <ul className="divide-y divide-gray-700">
            {metaskillList.map((metaskill) => {
              const usageCount = getMetaskillUsageCount(metaskill.internalName);
              const isUnused = usageCount === 0;

              return (
                <li
                  key={metaskill.internalName}
                  onClick={() => setActiveMetaskill(metaskill.internalName)}
                  className={`p-3 cursor-pointer transition-colors group ${
                    activeMetaskillId === metaskill.internalName
                      ? 'bg-primary/20 border-l-2 border-primary'
                      : 'hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate flex items-center gap-2">
                        {metaskill.internalName}
                        {isUnused && (
                          <span title="Unused metaskill">
                            <AlertCircle
                              size={14}
                              className="text-yellow-500 flex-shrink-0"
                            />
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {metaskill.skills.length} skill{metaskill.skills.length !== 1 ? 's' : ''}
                        {usageCount > 0 && ` • Used ${usageCount}×`}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(metaskill.internalName, e)}
                      className="ml-2 p-1 text-gray-400 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete metaskill"
                    >
                      <Trash2 size={16} strokeWidth={2} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
