import { useProjectStore } from '../../../stores/projectStore';
import { MobConfig, BossBarConfig } from '../../../types/mob';

interface BossBarTabProps {
  mob: MobConfig;
}

const COLORS: BossBarConfig['color'][] = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PINK', 'PURPLE', 'WHITE'];
const STYLES: BossBarConfig['style'][] = ['SOLID', 'SEGMENTED_6', 'SEGMENTED_10', 'SEGMENTED_12', 'SEGMENTED_20'];

export function BossBarTab({ mob }: BossBarTabProps) {
  const updateMob = useProjectStore((state) => state.updateMob);

  const bossBar = mob.bossBar || { enabled: false };

  const handleToggle = (enabled: boolean) => {
    updateMob(mob.internalName, {
      bossBar: {
        ...bossBar,
        enabled,
        // Set defaults when enabling
        ...(enabled && !bossBar.title ? { title: mob.display || mob.internalName } : {}),
        ...(enabled && !bossBar.color ? { color: 'PURPLE' } : {}),
        ...(enabled && !bossBar.style ? { style: 'SOLID' } : {}),
      },
    });
  };

  const handleChange = (field: keyof BossBarConfig, value: any) => {
    updateMob(mob.internalName, {
      bossBar: {
        ...bossBar,
        [field]: value,
      },
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Boss Bar Configuration</h3>
          <p className="text-sm text-gray-400">
            Configure the boss bar that appears at the top of the screen when players are near this mob.
          </p>
        </div>

        {/* Enable Toggle */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={bossBar.enabled}
              onChange={(e) => handleToggle(e.target.checked)}
              className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-primary focus:ring-primary focus:ring-offset-0"
            />
            <div>
              <div className="font-medium">Enable Boss Bar</div>
              <div className="text-xs text-gray-400">
                Show a boss bar at the top of the screen for this mob
              </div>
            </div>
          </label>
        </div>

        {/* Boss Bar Settings (only shown when enabled) */}
        {bossBar.enabled && (
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Boss Bar Title
              </label>
              <input
                type="text"
                value={bossBar.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder={mob.display || mob.internalName}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                Text displayed in the boss bar. Supports Minecraft color codes.
              </p>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Boss Bar Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleChange('color', color)}
                    className={`px-4 py-2 rounded border-2 transition-all ${
                      bossBar.color === color
                        ? 'border-primary bg-primary/20'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded ${getColorClass(color)}`}
                      />
                      <span className="text-sm">{color}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Boss Bar Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => handleChange('style', style)}
                    className={`px-4 py-3 rounded border-2 transition-all text-left ${
                      bossBar.style === style
                        ? 'border-primary bg-primary/20'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="font-medium text-sm">{style}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {getStyleDescription(style)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 bg-gray-800 border border-gray-700 rounded">
              <h4 className="text-sm font-semibold mb-3">Preview</h4>
              <div className="bg-gray-900 rounded p-4">
                <div className="max-w-md mx-auto">
                  <div className="text-center text-sm mb-2">
                    {bossBar.title || mob.display || mob.internalName}
                  </div>
                  <div className="relative h-3 bg-gray-800 rounded overflow-hidden">
                    <div
                      className={`absolute inset-0 ${getColorClass(bossBar.color || 'PURPLE')} opacity-75`}
                      style={{ width: '60%' }}
                    >
                      {bossBar.style !== 'SOLID' && (
                        <div className="flex h-full">
                          {Array.from({ length: getSegmentCount(bossBar.style) }).map((_, i) => (
                            <div
                              key={i}
                              className="flex-1 border-r border-gray-900"
                              style={{ borderRightWidth: i === getSegmentCount(bossBar.style) - 1 ? 0 : 2 }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help */}
        <div className="p-4 bg-gray-800 border border-gray-700 rounded">
          <h4 className="text-sm font-semibold mb-2">Boss Bar Information</h4>
          <div className="text-xs text-gray-400 space-y-1">
            <p>The boss bar appears at the top of the screen when players are within range of the mob.</p>
            <p className="mt-2">
              <strong className="text-gray-300">Title:</strong> The text displayed on the boss bar. Can use Minecraft color codes (&a, &c, etc.)
            </p>
            <p>
              <strong className="text-gray-300">Color:</strong> The color of the health bar
            </p>
            <p>
              <strong className="text-gray-300">Style:</strong> The visual style of the bar (solid or segmented)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getColorClass(color: BossBarConfig['color']): string {
  const colorMap: Record<string, string> = {
    RED: 'bg-red-500',
    BLUE: 'bg-blue-500',
    GREEN: 'bg-green-500',
    YELLOW: 'bg-yellow-500',
    PINK: 'bg-pink-500',
    PURPLE: 'bg-purple-500',
    WHITE: 'bg-white',
  };
  return colorMap[color || 'PURPLE'] || 'bg-purple-500';
}

function getStyleDescription(style: BossBarConfig['style']): string {
  const descriptions: Record<string, string> = {
    SOLID: 'Continuous bar',
    SEGMENTED_6: '6 segments',
    SEGMENTED_10: '10 segments',
    SEGMENTED_12: '12 segments',
    SEGMENTED_20: '20 segments',
  };
  return descriptions[style || 'SOLID'] || '';
}

function getSegmentCount(style: BossBarConfig['style']): number {
  const match = style?.match(/\d+/);
  return match ? parseInt(match[0]) : 1;
}
