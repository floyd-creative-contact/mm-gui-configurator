import { useProjectStore } from '../../stores/projectStore';
import { MobConfig, MinecraftEntity } from '../../types/mob';
import { Info, Settings } from 'lucide-react';

interface MobEditorProps {
  mob: MobConfig;
}

const COMMON_ENTITIES: MinecraftEntity[] = [
  'ZOMBIE', 'SKELETON', 'CREEPER', 'SPIDER', 'ENDERMAN',
  'WITHER_SKELETON', 'BLAZE', 'GHAST', 'SLIME', 'MAGMA_CUBE',
  'VILLAGER', 'IRON_GOLEM', 'WOLF', 'HORSE', 'GUARDIAN',
  'SHULKER', 'PHANTOM', 'DROWNED', 'HUSK', 'STRAY',
  'PILLAGER', 'RAVAGER', 'VINDICATOR', 'EVOKER', 'VEX',
  'PIGLIN', 'ZOMBIFIED_PIGLIN', 'HOGLIN', 'WARDEN',
];

export function MobEditor({ mob }: MobEditorProps) {
  const updateMob = useProjectStore((state) => state.updateMob);

  const handleChange = (field: keyof MobConfig, value: any) => {
    updateMob(mob.internalName, { [field]: value });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Editing: {mob.display || mob.internalName}
      </h2>

      <div className="space-y-6">
        {/* Basic Information Section */}
        <section className="bg-surface border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Info size={20} strokeWidth={2} className="text-primary" />
            Basic Information
          </h3>

          <div className="space-y-4">
            {/* Entity Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Entity Type <span className="text-error">*</span>
              </label>
              <select
                value={mob.type}
                onChange={(e) => handleChange('type', e.target.value as MinecraftEntity)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
              >
                {COMMON_ENTITIES.map((entity) => (
                  <option key={entity} value={entity}>
                    {entity}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                The base Minecraft entity type for this mob
              </p>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={mob.display || ''}
                onChange={(e) => handleChange('display', e.target.value)}
                placeholder="e.g., &cFire Boss"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supports Minecraft color codes (&amp;a, &amp;c, etc.)
              </p>
            </div>

            {/* Health */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Health
              </label>
              <input
                type="number"
                value={mob.health || 20}
                onChange={(e) => handleChange('health', parseFloat(e.target.value) || 20)}
                min="1"
                step="1"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum health points (Default: 20)
              </p>
            </div>

            {/* Damage */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Damage
              </label>
              <input
                type="number"
                value={mob.damage || 1}
                onChange={(e) => handleChange('damage', parseFloat(e.target.value) || 1)}
                min="0"
                step="0.5"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                Base attack damage
              </p>
            </div>

            {/* Armor */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Armor
              </label>
              <input
                type="number"
                value={mob.armor || 0}
                onChange={(e) => handleChange('armor', parseFloat(e.target.value) || 0)}
                min="0"
                step="1"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                Armor value (0-20)
              </p>
            </div>
          </div>
        </section>

        {/* Advanced Settings Placeholder */}
        <section className="bg-surface border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Settings size={20} strokeWidth={2} className="text-primary" />
            Advanced Settings
          </h3>
          <p className="text-sm text-gray-500">
            Additional features like Skills, AI, Equipment, and more will be added in future updates.
          </p>
        </section>
      </div>
    </div>
  );
}
