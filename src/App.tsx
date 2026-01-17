import { Header } from './components/layout/Header';
import { MobList } from './components/layout/MobList';
import { MainCanvas } from './components/layout/MainCanvas';
import { Inspector } from './components/layout/Inspector';

function App() {
  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <Header />

      {/* Main 3-panel layout */}
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
    </div>
  );
}

export default App;
