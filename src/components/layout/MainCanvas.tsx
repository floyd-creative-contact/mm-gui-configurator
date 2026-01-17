import { useProjectStore } from '../../stores/projectStore';
import { MobEditor } from '../mob-editor/MobEditor';
import { FileText } from 'lucide-react';

export function MainCanvas() {
  const activeMob = useProjectStore((state) => state.getActiveMob());

  if (!activeMob) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <FileText size={64} className="mx-auto mb-4 text-gray-600" strokeWidth={1.5} />
          <h2 className="text-xl font-semibold mb-2">No Mob Selected</h2>
          <p className="text-sm">Select a mob from the list or create a new one to get started</p>
        </div>
      </div>
    );
  }

  return <MobEditor mob={activeMob} />;
}
