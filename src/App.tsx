import { useState } from 'react';
import { Header } from './components/layout/Header';
import { MobList } from './components/layout/MobList';
import { MainCanvas } from './components/layout/MainCanvas';
import { Inspector } from './components/layout/Inspector';
import { SkillEditorDemo } from './components/skill-editor';
import { Wand2, FileText } from 'lucide-react';

type View = 'mob-editor' | 'skill-editor';

function App() {
  const [activeView, setActiveView] = useState<View>('mob-editor');

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <Header />

      {/* View Tabs */}
      <div className="border-b border-gray-700 bg-surface">
        <div className="flex gap-1 p-2">
          <button
            onClick={() => setActiveView('mob-editor')}
            className={`
              px-4 py-2 rounded flex items-center gap-2 transition-colors
              ${activeView === 'mob-editor'
                ? 'bg-primary text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
            `}
          >
            <FileText size={16} />
            Mob Editor
          </button>
          <button
            onClick={() => setActiveView('skill-editor')}
            className={`
              px-4 py-2 rounded flex items-center gap-2 transition-colors
              ${activeView === 'skill-editor'
                ? 'bg-primary text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
            `}
          >
            <Wand2 size={16} />
            Skill Editor Demo
          </button>
        </div>
      </div>

      {/* Content */}
      {activeView === 'mob-editor' ? (
        /* Main 3-panel layout */
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Mob List */}
          <aside className="w-64 border-r border-gray-700 bg-surface flex flex-col">
            <MobList />
          </aside>

          {/* Center Panel - Main Canvas */}
          <main className="flex-1 overflow-auto">
            <MainCanvas />
          </main>

          {/* Right Panel - Inspector */}
          <aside className="w-80 border-l border-gray-700 bg-surface overflow-auto">
            <Inspector />
          </aside>
        </div>
      ) : (
        /* Skill Editor Demo */
        <div className="flex-1 overflow-hidden">
          <SkillEditorDemo />
        </div>
      )}
    </div>
  );
}

export default App;
