import { useProjectStore } from '../../stores/projectStore';
import { MobEditor } from '../mob-editor/MobEditor';

export function MainCanvas() {
  const activeMob = useProjectStore((state) => state.getActiveMob());

  if (!activeMob) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold mb-2">No Mob Selected</h2>
          <p className="text-sm">Select a mob from the list or create a new one to get started</p>
        </div>
      </div>
    );
  }

  return <MobEditor mob={activeMob} />;
}
