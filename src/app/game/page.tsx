"use client";

import { useState } from 'react';
import { PlayerStatus } from '../../components/game/PlayerStatus';
import { NavigationSidebar } from '../../components/game/NavigationSidebar';
import { GameContent } from '../../components/game/GameContent';

export default function App() {
  const [activeSection, setActiveSection] = useState('map');

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Mystical Background Pattern */}
      <div 
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(0, 168, 107, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 50% 50%, rgba(75, 0, 130, 0.1) 0%, transparent 50%)`,
          backgroundSize: '400px 400px, 300px 300px, 500px 500px',
          animation: 'floating 8s ease-in-out infinite'
        }}
      />

      {/* Header với thông tin người chơi */}
      <div className="relative p-4 bg-card/90 backdrop-blur-sm border-b border-border martial-glow">
        <div className="absolute inset-0 qi-flow opacity-20" />
        <div className="relative z-10">
          <PlayerStatus />
        </div>
      </div>

      {/* Main game layout */}
      <div className="flex h-[calc(100vh-120px)] relative">
        {/* Sidebar navigation */}
        <div className="w-64 p-4 bg-card/50 backdrop-blur-sm border-r border-border">
          <NavigationSidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 p-4 cultivation-bg">
          <GameContent activeSection={activeSection} />
        </div>
      </div>
    </div>
  );
}