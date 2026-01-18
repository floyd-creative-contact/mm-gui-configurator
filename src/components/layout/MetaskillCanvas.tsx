import { useProjectStore } from '../../stores/projectStore';
import { MetaskillEditor } from '../metaskill-editor/MetaskillEditor';
import { Wand2 } from 'lucide-react';

export function MetaskillCanvas() {
  const activeMetaskill = useProjectStore((state) => state.getActiveMetaskill());

  if (!activeMetaskill) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Wand2 size={64} className="mx-auto mb-4 text-gray-600" strokeWidth={1.5} />
          <h2 className="text-xl font-semibold mb-2">No Metaskill Selected</h2>
          <p className="text-sm">Select a metaskill from the list or create a new one to get started</p>
        </div>
      </div>
    );
  }

  return <MetaskillEditor metaskill={activeMetaskill} />;
}
