import { useProjectStore } from '../../stores/projectStore';

export function Inspector() {
  const activeMob = useProjectStore((state) => state.getActiveMob());

  if (!activeMob) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Inspector</h2>
        <p className="text-sm text-gray-500">
          Select a mob to view and edit its properties
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Inspector</h2>
      <div className="space-y-4">
        <div>
          <div className="text-sm font-medium text-gray-400 mb-1">Internal Name</div>
          <div className="text-sm font-mono bg-gray-800 px-2 py-1 rounded">
            {activeMob.internalName}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-400 mb-1">Entity Type</div>
          <div className="text-sm">{activeMob.type}</div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-400 mb-1">Display Name</div>
          <div className="text-sm">{activeMob.display || 'None'}</div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <div className="text-xs font-medium text-gray-400 mb-1">Health</div>
            <div className="text-sm">{activeMob.health}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-400 mb-1">Damage</div>
            <div className="text-sm">{activeMob.damage}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-400 mb-1">Armor</div>
            <div className="text-sm">{activeMob.armor || 0}</div>
          </div>
        </div>

        {activeMob.skills && activeMob.skills.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-400 mb-1">Skills</div>
            <div className="text-xs text-gray-500">{activeMob.skills.length} skill(s)</div>
          </div>
        )}
      </div>
    </div>
  );
}
