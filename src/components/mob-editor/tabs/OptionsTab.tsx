import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useProjectStore } from '../../../stores/projectStore';
import { MobConfig } from '../../../types/mob';

interface OptionsTabProps {
  mob: MobConfig;
}

interface OptionDefinition {
  key: string;
  label: string;
  description: string;
  type: 'boolean' | 'number' | 'string';
  defaultValue?: any;
  category: string;
}

const OPTION_DEFINITIONS: OptionDefinition[] = [
  // Movement & Pathfinding
  { key: 'MovementSpeed', label: 'Movement Speed', description: 'Base movement speed multiplier', type: 'number', defaultValue: 1.0, category: 'Movement' },
  { key: 'FollowRange', label: 'Follow Range', description: 'Range at which mob will follow targets', type: 'number', defaultValue: 32, category: 'Movement' },
  { key: 'KnockbackResistance', label: 'Knockback Resistance', description: 'Resistance to knockback (0.0-1.0)', type: 'number', defaultValue: 0, category: 'Movement' },
  { key: 'PreventSlime', label: 'Prevent Slime', description: 'Prevent slimes from splitting', type: 'boolean', category: 'Movement' },
  { key: 'PreventTeleporting', label: 'Prevent Teleporting', description: 'Prevent endermen from teleporting', type: 'boolean', category: 'Movement' },
  { key: 'RepeatAllSkills', label: 'Repeat All Skills', description: 'Whether to repeat all skills on cooldown', type: 'boolean', category: 'Movement' },

  // Display & Visibility
  { key: 'AlwaysShowName', label: 'Always Show Name', description: 'Always display mob name tag', type: 'boolean', category: 'Display' },
  { key: 'Glowing', label: 'Glowing', description: 'Apply glowing effect to mob', type: 'boolean', category: 'Display' },
  { key: 'Invisible', label: 'Invisible', description: 'Make mob invisible', type: 'boolean', category: 'Display' },
  { key: 'ShowHealth', label: 'Show Health', description: 'Show health in name tag', type: 'boolean', category: 'Display' },
  { key: 'Silent', label: 'Silent', description: 'Prevent mob from making sounds', type: 'boolean', category: 'Display' },

  // Spawning & Despawning
  { key: 'Despawn', label: 'Despawn', description: 'Allow mob to despawn naturally', type: 'boolean', defaultValue: true, category: 'Spawning' },
  { key: 'Persistent', label: 'Persistent', description: 'Prevent mob from despawning', type: 'boolean', category: 'Spawning' },
  { key: 'PreventOtherDrops', label: 'Prevent Other Drops', description: 'Prevent vanilla drops', type: 'boolean', category: 'Spawning' },
  { key: 'PreventRenaming', label: 'Prevent Renaming', description: 'Prevent renaming with name tags', type: 'boolean', category: 'Spawning' },

  // Combat
  { key: 'AttackSpeed', label: 'Attack Speed', description: 'Attack speed multiplier', type: 'number', defaultValue: 1.0, category: 'Combat' },
  { key: 'PreventSunburn', label: 'Prevent Sunburn', description: 'Prevent burning in sunlight', type: 'boolean', category: 'Combat' },
  { key: 'PreventItemPickup', label: 'Prevent Item Pickup', description: 'Prevent picking up items', type: 'boolean', category: 'Combat' },
  { key: 'PreventBlockInfection', label: 'Prevent Block Infection', description: 'Prevent endermen from picking up blocks', type: 'boolean', category: 'Combat' },
  { key: 'PreventMobKillDrops', label: 'Prevent Mob Kill Drops', description: 'Prevent drops when killed by non-player', type: 'boolean', category: 'Combat' },

  // AI & Behavior
  { key: 'CanPickupItems', label: 'Can Pickup Items', description: 'Allow mob to pickup items', type: 'boolean', category: 'AI' },
  { key: 'Collidable', label: 'Collidable', description: 'Can be pushed by other entities', type: 'boolean', defaultValue: true, category: 'AI' },
  { key: 'NoDamageTicks', label: 'No Damage Ticks', description: 'Invulnerability ticks after taking damage', type: 'number', defaultValue: 10, category: 'AI' },
  { key: 'NoGravity', label: 'No Gravity', description: 'Disable gravity for this mob', type: 'boolean', category: 'AI' },

  // Breeding & Interaction
  { key: 'Tameable', label: 'Tameable', description: 'Can be tamed by players', type: 'boolean', category: 'Interaction' },
  { key: 'PreventLeashing', label: 'Prevent Leashing', description: 'Prevent mob from being leashed', type: 'boolean', category: 'Interaction' },
  { key: 'Interactable', label: 'Interactable', description: 'Can be interacted with', type: 'boolean', defaultValue: true, category: 'Interaction' },

  // Advanced
  { key: 'MaxCombatDistance', label: 'Max Combat Distance', description: 'Maximum distance from spawn before leashing', type: 'number', category: 'Advanced' },
  { key: 'RepelPlayers', label: 'Repel Players', description: 'Push players away from mob', type: 'boolean', category: 'Advanced' },
  { key: 'UseThreatTable', label: 'Use Threat Table', description: 'Use threat-based targeting', type: 'boolean', category: 'Advanced' },
  { key: 'PreventMounting', label: 'Prevent Mounting', description: 'Prevent players from mounting', type: 'boolean', category: 'Advanced' },
  { key: 'PreventTransformation', label: 'Prevent Transformation', description: 'Prevent natural transformations (e.g., zombie villager curing)', type: 'boolean', category: 'Advanced' },

  // Villager-specific
  { key: 'Profession', label: 'Profession', description: 'Villager profession', type: 'string', category: 'Villager' },
  { key: 'Type', label: 'Villager Type', description: 'Villager biome type', type: 'string', category: 'Villager' },

  // Horse-specific
  { key: 'HorseColor', label: 'Horse Color', description: 'Horse color variant', type: 'string', category: 'Horse' },
  { key: 'HorseStyle', label: 'Horse Style', description: 'Horse marking style', type: 'string', category: 'Horse' },
  { key: 'HorseArmor', label: 'Horse Armor', description: 'Horse armor material', type: 'string', category: 'Horse' },

  // Wolf/Cat-specific
  { key: 'Sitting', label: 'Sitting', description: 'Start sitting', type: 'boolean', category: 'Pet' },
  { key: 'Angry', label: 'Angry', description: 'Start angry', type: 'boolean', category: 'Pet' },
  { key: 'CollarColor', label: 'Collar Color', description: 'Wolf/cat collar color', type: 'string', category: 'Pet' },

  // Slime-specific
  { key: 'Size', label: 'Slime Size', description: 'Slime/magma cube size', type: 'number', category: 'Slime' },

  // Creeper-specific
  { key: 'ExplosionRadius', label: 'Explosion Radius', description: 'Creeper explosion radius', type: 'number', category: 'Creeper' },
  { key: 'FuseTicks', label: 'Fuse Ticks', description: 'Creeper fuse duration in ticks', type: 'number', category: 'Creeper' },
  { key: 'Powered', label: 'Powered', description: 'Make creeper charged', type: 'boolean', category: 'Creeper' },

  // Zombie-specific
  { key: 'Baby', label: 'Baby', description: 'Make mob a baby', type: 'boolean', category: 'Age' },
  { key: 'Age', label: 'Age', description: 'Age in ticks', type: 'number', category: 'Age' },
  { key: 'AgeLock', label: 'Age Lock', description: 'Prevent aging', type: 'boolean', category: 'Age' },
];

export function OptionsTab({ mob }: OptionsTabProps) {
  const updateMob = useProjectStore((state) => state.updateMob);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const options = mob.options || {};

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(OPTION_DEFINITIONS.map((opt) => opt.category));
    return ['All', ...Array.from(cats).sort()];
  }, []);

  // Filter options
  const filteredOptions = useMemo(() => {
    return OPTION_DEFINITIONS.filter((opt) => {
      const matchesSearch =
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opt.key.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || opt.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleOptionChange = (key: string, value: any) => {
    const newOptions = { ...options };

    if (value === '' || value === null || value === undefined) {
      delete newOptions[key];
    } else {
      newOptions[key] = value;
    }

    updateMob(mob.internalName, { options: newOptions });
  };

  const handleBooleanToggle = (key: string, currentValue: boolean | undefined) => {
    handleOptionChange(key, !currentValue);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Mob Options</h3>
          <p className="text-sm text-gray-400">
            Configure advanced options for this mob. Over 50 options available.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search options..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-400">
          Showing {filteredOptions.length} of {OPTION_DEFINITIONS.length} options
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {filteredOptions.map((option) => {
            const currentValue = options[option.key];
            const hasValue = currentValue !== undefined;

            return (
              <div
                key={option.key}
                className={`bg-gray-800 border rounded-lg p-4 transition-all ${
                  hasValue ? 'border-primary/50' : 'border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{option.label}</h4>
                      <span className="px-2 py-0.5 text-xs bg-gray-700 text-gray-400 rounded">
                        {option.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{option.description}</p>
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      Key: {option.key}
                    </p>
                  </div>

                  <div className="flex-shrink-0 w-48">
                    {option.type === 'boolean' ? (
                      <button
                        onClick={() => handleBooleanToggle(option.key, currentValue as boolean)}
                        className={`w-full px-4 py-2 rounded transition-colors ${
                          currentValue
                            ? 'bg-primary text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {currentValue ? 'Enabled' : 'Disabled'}
                      </button>
                    ) : option.type === 'number' ? (
                      <input
                        type="number"
                        value={currentValue ?? option.defaultValue ?? ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
                          handleOptionChange(option.key, val);
                        }}
                        placeholder={option.defaultValue?.toString() || 'Default'}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
                      />
                    ) : (
                      <input
                        type="text"
                        value={currentValue ?? ''}
                        onChange={(e) => handleOptionChange(option.key, e.target.value || undefined)}
                        placeholder="Default"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredOptions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No options found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
