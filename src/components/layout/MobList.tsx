import { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { MobConfig, MetaskillConfig } from '../../types/mob';
import { Trash2, FileText, Wand2 } from 'lucide-react';
import { TemplateModal } from '../templates/TemplateModal';
import { MobCreationWizard } from '../wizard/MobCreationWizard';

export function MobList() {
  const { mobs, activeMobId, addMob, setActiveMob, deleteMob } = useProjectStore();
  const [showTemplates, setShowTemplates] = useState(false);
  const [showWizard, setShowWizard] = useState(false);

  const mobList = Array.from(mobs.values());

  const handleWizardComplete = (mob: MobConfig) => {
    // Check if mob already exists
    if (mobs.has(mob.internalName)) {
      alert('A mob with this name already exists!');
      return;
    }

    addMob(mob);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete mob "${id}"?`)) {
      deleteMob(id);
    }
  };

  const handleTemplateSelect = (template: MobConfig | MetaskillConfig, _templateName: string) => {
    const templateData = template as MobConfig;
    // Generate unique internal name
    let baseName = templateData.internalName;
    let counter = 1;
    let internalName = baseName;

    while (mobs.has(internalName)) {
      internalName = `${baseName}_${counter}`;
      counter++;
    }

    const newMob: MobConfig = {
      ...templateData,
      internalName,
      display: templateData.display || _templateName
    };

    addMob(newMob);
  };

  return (
    <div className="flex flex-col h-full">
      <TemplateModal
        type="mob"
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelectTemplate={handleTemplateSelect}
      />

      <MobCreationWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onComplete={handleWizardComplete}
      />

      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold mb-3">Mobs</h2>
        <div className="space-y-2">
          <button
            onClick={() => setShowWizard(true)}
            className="w-full px-3 py-2 bg-primary hover:bg-blue-700 rounded transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Wand2 size={16} strokeWidth={2} />
            Guided Creation
          </button>
          <button
            onClick={() => setShowTemplates(true)}
            className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm flex items-center justify-center gap-2"
          >
            <FileText size={16} strokeWidth={2} />
            From Template
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {mobList.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No mobs yet. Create one to get started!
          </div>
        ) : (
          <ul className="divide-y divide-gray-700">
            {mobList.map((mob) => (
              <li
                key={mob.internalName}
                onClick={() => setActiveMob(mob.internalName)}
                className={`p-3 cursor-pointer transition-colors group ${
                  activeMobId === mob.internalName
                    ? 'bg-primary/20 border-l-2 border-primary'
                    : 'hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {mob.display || mob.internalName}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {mob.type}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(mob.internalName, e)}
                    className="ml-2 p-1 text-gray-400 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete mob"
                  >
                    <Trash2 size={16} strokeWidth={2} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
