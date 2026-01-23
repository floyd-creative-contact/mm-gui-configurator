import { useState, useEffect } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { Upload, Download, ChevronDown, FileArchive, File, Undo, Redo } from 'lucide-react';
import { downloadAsZip, exportToMultipleFiles, exportToSingleFile } from '../../lib/yaml/multiFileExport';

export function Header() {
  const { projectName, mobs, metaskills, validateAll, undo, redo, canUndo, canRedo } = useProjectStore();
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z or Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) {
          undo();
        }
      }
      // Ctrl+Y or Ctrl+Shift+Z or Cmd+Shift+Z for redo
      if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')
      ) {
        e.preventDefault();
        if (canRedo()) {
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  const checkValidationBeforeExport = (): boolean => {
    const validation = validateAll();

    if (!validation.canExport) {
      const errorCount = Array.from(validation.mobs.values())
        .concat(Array.from(validation.metaskills.values()))
        .reduce((sum, result) => sum + result.errors.length, 0);

      const proceed = confirm(
        `Your configuration has ${errorCount} error${errorCount !== 1 ? 's' : ''} that may cause issues in-game.\n\n` +
        `Do you want to export anyway?\n\n` +
        `Tip: Check the validation indicators (red badges) in the mob/metaskill lists to see what needs fixing.`
      );

      if (!proceed) {
        setShowExportMenu(false);
        return false;
      }
    }

    return true;
  };

  const handleExportSingleFile = () => {
    if (!checkValidationBeforeExport()) return;

    const yaml = exportToSingleFile(mobs, metaskills);
    if (!yaml) {
      alert('No mobs or metaskills to export!');
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
    setShowExportMenu(false);
  };

  const handleExportMultiFile = async () => {
    if (!checkValidationBeforeExport()) return;

    if (mobs.size === 0 && metaskills.size === 0) {
      alert('No mobs or metaskills to export!');
      return;
    }

    const files = exportToMultipleFiles(mobs, metaskills);
    await downloadAsZip(files, `${projectName.replace(/\s+/g, '_')}.zip`);
    setShowExportMenu(false);
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

        {/* Undo/Redo buttons */}
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className="p-2 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 disabled:hover:bg-transparent"
            title="Undo (Ctrl+Z)"
          >
            <Undo size={16} strokeWidth={2} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className="p-2 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 disabled:hover:bg-transparent"
            title="Redo (Ctrl+Y)"
          >
            <Redo size={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleImport}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors flex items-center gap-2"
        >
          <Upload size={16} strokeWidth={2} />
          Import YAML
        </button>

        {/* Export dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="px-4 py-2 bg-primary hover:bg-blue-700 rounded transition-colors flex items-center gap-2"
          >
            <Download size={16} strokeWidth={2} />
            Export
            <ChevronDown size={14} strokeWidth={2} />
          </button>

          {showExportMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowExportMenu(false)}
              />

              {/* Menu */}
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20">
                <button
                  onClick={handleExportSingleFile}
                  className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-start gap-3 rounded-t-lg"
                >
                  <File size={18} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Single File</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      All mobs and metaskills in one .yml file
                    </div>
                  </div>
                </button>

                <div className="border-t border-gray-700" />

                <button
                  onClick={handleExportMultiFile}
                  className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-start gap-3 rounded-b-lg"
                >
                  <FileArchive size={18} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      Multi-File Package
                      <span className="text-xs px-1.5 py-0.5 bg-green-900/30 text-green-400 rounded">Recommended</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Professional structure: Mobs/ and Skills/ folders in .zip
                    </div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
