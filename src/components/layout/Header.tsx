import { useProjectStore } from '../../stores/projectStore';
import { Upload, Download } from 'lucide-react';

export function Header() {
  const { projectName, exportYAML } = useProjectStore();

  const handleExport = () => {
    const yaml = exportYAML();
    if (!yaml) {
      alert('No mobs to export!');
      return;
    }

    // Create a download link
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}.yml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.yml,.yaml';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const yaml = event.target?.result as string;
          useProjectStore.getState().importYAML(yaml);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <header className="h-14 border-b border-gray-700 bg-surface flex items-center px-4 justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">MythicMobs GUI Editor</h1>
        <span className="text-sm text-gray-400">{projectName}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleImport}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors flex items-center gap-2"
        >
          <Upload size={16} strokeWidth={2} />
          Import YAML
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-primary hover:bg-blue-700 rounded transition-colors flex items-center gap-2"
        >
          <Download size={16} strokeWidth={2} />
          Export YAML
        </button>
      </div>
    </header>
  );
}
