import { useProjectStore } from '../../../stores/projectStore';
import { MobConfig, MinecraftEntity } from '../../../types/mob';
import { MinecraftTextPreview } from '../../common/MinecraftText';
import { HelpTooltip, DocLink, InfoBox } from '../../common/Tooltip';

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
        <InfoBox type="tip" className="mb-6">
          <strong>Getting Started:</strong> Configure the basic properties of your mob here. Required fields are marked with <span className="text-error">*</span>.
          Hover over <HelpTooltip content="Like this!" /> icons for more help.
        </InfoBox>

        {/* Entity Type */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            Entity Type <span className="text-error">*</span>
            <HelpTooltip
              content={
                <div>
                  <p className="font-semibold mb-1">Entity Type</p>
                  <p>The base Minecraft entity this mob is built on. This determines the mob's default behavior, size, and capabilities.</p>
                  <p className="mt-2 text-xs text-gray-400">Example: ZOMBIE can walk on land, GUARDIAN swims in water.</p>
                </div>
              }
            />
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
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-500">
              The base Minecraft entity type for this mob
            </p>
            <DocLink url="https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/EntityType.html" label="All Entity Types" />
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            Display Name
            <HelpTooltip
              content={
                <div>
                  <p className="font-semibold mb-1">Display Name</p>
                  <p>The name shown above the mob in-game. Use Minecraft color codes for styling:</p>
                  <div className="mt-2 space-y-1 text-xs">
                    <p>&c = Red, &a = Green, &b = Cyan</p>
                    <p>&l = Bold, &n = Underline, &r = Reset</p>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">Example: &c&lBoss Name creates red bold text</p>
                </div>
              }
            />
          </label>
          <input
            type="text"
            value={mob.display || ''}
            onChange={(e) => handleChange('display', e.target.value)}
            placeholder="e.g., &cFire Boss"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
          />
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-500">
              Supports Minecraft color codes (&a, &c, etc.)
            </p>
            <DocLink url="https://www.digminecraft.com/lists/color_list_pc.php" label="Color Codes" />
          </div>

          {/* Live Preview */}
          {mob.display && (
            <div className="mt-3">
              <MinecraftTextPreview text={mob.display} />
            </div>
          )}
        </div>

        {/* Health */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            Health
            <HelpTooltip
              content={
                <div>
                  <p className="font-semibold mb-1">Health</p>
                  <p>Maximum health points for this mob.</p>
                  <div className="mt-2 text-xs text-gray-400">
                    <p>20 HP = 10 hearts</p>
                    <p>200 HP = 100 hearts (typical boss)</p>
                    <p>1000+ HP = Raid boss</p>
                  </div>
                </div>
              }
            />
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
            Maximum health points (Default: 20 = 10 hearts)
          </p>
        </div>

        {/* Damage */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            Damage
            <HelpTooltip
              content={
                <div>
                  <p className="font-semibold mb-1">Damage</p>
                  <p>Base attack damage dealt to players/entities.</p>
                  <div className="mt-2 text-xs text-gray-400">
                    <p>2 = 1 heart (weak)</p>
                    <p>6 = 3 hearts (normal)</p>
                    <p>20+ = 10+ hearts (deadly)</p>
                  </div>
                </div>
              }
            />
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
            Base attack damage (2 damage = 1 heart)
          </p>
        </div>

        {/* Armor */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            Armor
            <HelpTooltip
              content={
                <div>
                  <p className="font-semibold mb-1">Armor</p>
                  <p>Armor value for damage reduction. Higher = more protection.</p>
                  <div className="mt-2 text-xs text-gray-400">
                    <p>0 = No armor</p>
                    <p>10 = Half armor bar (like iron)</p>
                    <p>20 = Full armor bar (like diamond)</p>
                  </div>
                </div>
              }
            />
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
            Armor value (0-20, higher = more damage reduction)
          </p>
        </div>

        {/* Faction */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            Faction
            <HelpTooltip
              content={
                <div>
                  <p className="font-semibold mb-1">Faction</p>
                  <p>Group this mob belongs to. Mobs in the same faction won't attack each other.</p>
                  <div className="mt-2 text-xs text-gray-400">
                    <p>Example: "Undead" faction for zombies and skeletons</p>
                    <p>Used for AI targeting and threat tables</p>
                  </div>
                </div>
              }
            />
          </label>
          <input
            type="text"
            value={mob.faction || ''}
            onChange={(e) => handleChange('faction', e.target.value)}
            placeholder="e.g., Undead"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
          />
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-500">
              Faction for AI targeting and threat tables
            </p>
            <DocLink url="https://git.lumine.io/mythiccraft/MythicMobs/-/wikis/Mobs/Factions" label="Factions Guide" />
          </div>
        </div>

        {/* Mount */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            Mount
            <HelpTooltip
              content={
                <div>
                  <p className="font-semibold mb-1">Mount</p>
                  <p>Make this mob ride another mob. Great for creating mounted enemies!</p>
                  <div className="mt-2 text-xs text-gray-400">
                    <p>Example: Skeleton on a SkeletonHorse</p>
                    <p>Tip: Create the mount mob first, then reference its internal name here</p>
                  </div>
                </div>
              }
            />
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

        {/* Help Section */}
        <div className="pt-4 border-t border-gray-700">
          <InfoBox type="info">
            <strong>Next Steps:</strong> Configure additional options in the other tabs:
            <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
              <li><strong>Skills:</strong> Add abilities and mechanics</li>
              <li><strong>Equipment:</strong> Configure armor and weapons</li>
              <li><strong>Options:</strong> Fine-tune behavior and appearance</li>
              <li><strong>Boss Bar:</strong> Add a health bar at top of screen</li>
            </ul>
          </InfoBox>
          <div className="mt-3 flex justify-center">
            <DocLink url="https://git.lumine.io/mythiccraft/MythicMobs/-/wikis/Mobs/Mobs" label="MythicMobs Full Documentation" />
          </div>
        </div>
      </div>
    </div>
  );
}
