import { useState } from 'react';
import { MetaskillConfig } from '../../types/mob';
import { Info, Wand2, Filter } from 'lucide-react';

// Import tab components
import { MetaskillBasicTab } from './tabs/MetaskillBasicTab';
import { MetaskillSkillsTab } from './tabs/MetaskillSkillsTab';
import { MetaskillConditionsTab } from './tabs/MetaskillConditionsTab';

interface MetaskillEditorProps {
  metaskill: MetaskillConfig;
}

type TabId = 'basic' | 'skills' | 'conditions';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
  component: React.ComponentType<{ metaskill: MetaskillConfig }>;
}

const TABS: Tab[] = [
  { id: 'basic', label: 'Basic Info', icon: Info, component: MetaskillBasicTab },
  { id: 'skills', label: 'Skills', icon: Wand2, component: MetaskillSkillsTab },
  { id: 'conditions', label: 'Conditions', icon: Filter, component: MetaskillConditionsTab },
];

export function MetaskillEditor({ metaskill }: MetaskillEditorProps) {
  const [activeTab, setActiveTab] = useState<TabId>('basic');

  const ActiveTabComponent = TABS.find(t => t.id === activeTab)?.component || MetaskillBasicTab;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold">
          Editing: {metaskill.internalName}
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Reusable skill that can be called from mobs or other metaskills
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 bg-surface">
        <div className="flex overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'}
                `}
              >
                <Icon size={18} strokeWidth={2} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        <ActiveTabComponent metaskill={metaskill} />
      </div>
    </div>
  );
}
