import { useProjectStore } from '../../../stores/projectStore';
import { MetaskillConfig } from '../../../types/mob';

interface MetaskillBasicTabProps {
  metaskill: MetaskillConfig;
}

export function MetaskillBasicTab({ metaskill }: MetaskillBasicTabProps) {
  const updateMetaskill = useProjectStore((state) => state.updateMetaskill);
  const usageCount = useProjectStore((state) => state.getMetaskillUsageCount(metaskill.internalName));

  const handleChange = (field: keyof MetaskillConfig, value: any) => {
    updateMetaskill(metaskill.internalName, { [field]: value });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Internal Name (read-only) */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Internal Name
          </label>
          <input
            type="text"
            value={metaskill.internalName}
            disabled
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            The internal name cannot be changed after creation
          </p>
        </div>

        {/* Cooldown */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Cooldown (seconds)
          </label>
          <input
            type="number"
            value={metaskill.cooldown ?? ''}
            onChange={(e) => {
              const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
              handleChange('cooldown', val);
            }}
            min="0"
            step="0.1"
            placeholder="No cooldown"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
          />
          <p className="text-xs text-gray-500 mt-1">
            Time in seconds before this metaskill can be used again. Leave empty for no cooldown.
          </p>
        </div>

        {/* Usage Stats */}
        <div className="p-4 bg-gray-800 border border-gray-700 rounded">
          <h3 className="text-sm font-semibold mb-2">Usage Statistics</h3>
          <div className="text-sm text-gray-400">
            This metaskill is referenced <span className="font-semibold text-primary">{usageCount}</span> time(s)
            {usageCount === 0 && (
              <span className="text-yellow-500"> (Unused - consider deleting or using it)</span>
            )}
          </div>
        </div>

        {/* Help */}
        <div className="p-4 bg-gray-800 border border-gray-700 rounded">
          <h4 className="text-sm font-semibold mb-2">About Metaskills</h4>
          <div className="text-xs text-gray-400 space-y-2">
            <p>
              Metaskills are reusable skills that can be called from mob skills or other metaskills using the <code className="text-gray-300">skill{'{'}s=MetaskillName{'}'}</code> mechanic.
            </p>
            <p>
              Benefits of using metaskills:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Reduce duplication - define complex skill sequences once, use many times</li>
              <li>Easier maintenance - update in one place, affects all usages</li>
              <li>Parameter passing - customize behavior with <code className="text-gray-300">&lt;skill.varname&gt;</code> placeholders</li>
              <li>Organize complex behaviors into logical, named components</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
