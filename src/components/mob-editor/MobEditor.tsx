import { useState } from 'react';
import { MobConfig } from '../../types/mob';
import { Info, Wand2, Brain, Shield, Gift, Crown, Settings } from 'lucide-react';

// Import tab components
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { SkillsTab } from './tabs/SkillsTab';
import { AITab } from './tabs/AITab';
import { EquipmentTab } from './tabs/EquipmentTab';
import { DropsTab } from './tabs/DropsTab';
import { BossBarTab } from './tabs/BossBarTab';
import { OptionsTab } from './tabs/OptionsTab';

interface MobEditorProps {
  mob: MobConfig;
}

type TabId = 'basic' | 'skills' | 'ai' | 'equipment' | 'drops' | 'bossbar' | 'options';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
  component: React.ComponentType<{ mob: MobConfig }>;
}

const TABS: Tab[] = [
  { id: 'basic', label: 'Basic Info', icon: Info, component: BasicInfoTab },
  { id: 'skills', label: 'Skills', icon: Wand2, component: SkillsTab },
  { id: 'ai', label: 'AI & Behavior', icon: Brain, component: AITab },
  { id: 'equipment', label: 'Equipment', icon: Shield, component: EquipmentTab },
  { id: 'drops', label: 'Drops', icon: Gift, component: DropsTab },
  { id: 'bossbar', label: 'Boss Bar', icon: Crown, component: BossBarTab },
  { id: 'options', label: 'Options', icon: Settings, component: OptionsTab },
];

export function MobEditor({ mob }: MobEditorProps) {
  const [activeTab, setActiveTab] = useState<TabId>('basic');

  const ActiveTabComponent = TABS.find(t => t.id === activeTab)?.component || BasicInfoTab;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold">
          Editing: {mob.display || mob.internalName}
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Internal Name: <span className="font-mono text-gray-300">{mob.internalName}</span>
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
        <ActiveTabComponent mob={mob} />
      </div>
    </div>
  );
}
