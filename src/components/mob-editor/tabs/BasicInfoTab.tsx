import { useProjectStore } from '../../../stores/projectStore';
import { MobConfig, MinecraftEntity } from '../../../types/mob';
import { MinecraftTextPreview } from '../../common/MinecraftText';

interface BasicInfoTabProps {
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

export function BasicInfoTab({ mob }: BasicInfoTabProps) {
  const updateMob = useProjectStore((state) => state.updateMob);

  const handleChange = (field: keyof MobConfig, value: any) => {
    updateMob(mob.internalName, { [field]: value });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
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
            Supports Minecraft color codes (&a, &c, etc.)
          </p>

          {/* Live Preview */}
          {mob.display && (
            <div className="mt-3">
              <MinecraftTextPreview text={mob.display} />
            </div>
          )}
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

        {/* Faction */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Faction
          </label>
          <input
            type="text"
            value={mob.faction || ''}
            onChange={(e) => handleChange('faction', e.target.value)}
            placeholder="e.g., Undead"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
          />
          <p className="text-xs text-gray-500 mt-1">
            Faction for AI targeting and threat tables
          </p>
        </div>

        {/* Mount */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Mount
          </label>
          <input
            type="text"
            value={mob.mount || ''}
            onChange={(e) => handleChange('mount', e.target.value)}
            placeholder="e.g., SkeletonHorse"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
          />
          <p className="text-xs text-gray-500 mt-1">
            Internal name of another MythicMob to mount
          </p>
        </div>
      </div>
    </div>
  );
}
