"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Bug, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  X,
  Eye,
  EyeOff,
  Zap,
  Heart,
  Sword,
  Shield
} from "lucide-react";
import { useState } from "react";

interface CombatDebugProps {
  onClose: () => void;
  onStartDebug?: () => void;
  onStopDebug?: () => void;
  onResetDebug?: () => void;
  debugMode?: boolean;
  debugData?: {
    combatState: any;
    playerData: any;
    monsterData: any;
    actionQueue: any[];
    turnHistory: any[];
    performance: {
      fps: number;
      memory: number;
      latency: number;
    };
  };
}

export function CombatDebug({ 
  onClose, 
  onStartDebug, 
  onStopDebug, 
  onResetDebug, 
  debugMode = false,
  debugData 
}: CombatDebugProps) {
  const [activeTab, setActiveTab] = useState<'state' | 'performance' | 'actions' | 'settings'>('state');
  const [showRawData, setShowRawData] = useState(false);

  const mockDebugData = {
    combatState: {
      id: 'debug_001',
      currentTurn: 'player',
      turnNumber: 5,
      isActive: true,
      phase: 'action_selection'
    },
    playerData: {
      id: 1,
      name: 'Debug Player',
      hp: 150,
      maxHp: 200,
      mana: 80,
      maxMana: 100,
      stats: { strength: 50, agility: 30, intelligence: 40, vitality: 60 },
      skills: [
        { id: 1, name: 'Basic Attack', cooldown: 0, cost: 0 },
        { id: 2, name: 'Fireball', cooldown: 2, cost: 20 }
      ],
      items: [
        { id: 1, name: 'Health Potion', quantity: 3 },
        { id: 2, name: 'Mana Potion', quantity: 2 }
      ]
    },
    monsterData: {
      id: 2,
      name: 'Debug Monster',
      hp: 120,
      maxHp: 180,
      stats: { strength: 45, agility: 25, intelligence: 20, vitality: 50 },
      skills: [
        { id: 3, name: 'Claw Attack', cooldown: 0, cost: 0 },
        { id: 4, name: 'Roar', cooldown: 3, cost: 15 }
      ]
    },
    actionQueue: [
      { id: 1, type: 'player_attack', damage: 25, timestamp: '2024-01-01T10:00:00Z' },
      { id: 2, type: 'monster_skill', skill: 'Roar', timestamp: '2024-01-01T10:00:01Z' }
    ],
    turnHistory: [
      { turn: 1, action: 'player_attack', result: 'hit', damage: 30 },
      { turn: 2, action: 'monster_attack', result: 'hit', damage: 20 },
      { turn: 3, action: 'player_skill', result: 'hit', damage: 45 },
      { turn: 4, action: 'monster_skill', result: 'miss', damage: 0 }
    ],
    performance: {
      fps: 60,
      memory: 45.2,
      latency: 12
    }
  };

  const data = debugData || mockDebugData;

  const formatValue = (value: any) => {
    if (typeof value === 'object') {
      return showRawData ? JSON.stringify(value, null, 2) : 'Object';
    }
    return String(value);
  };

  const getPerformanceColor = (value: number, type: 'fps' | 'memory' | 'latency') => {
    switch (type) {
      case 'fps':
        if (value >= 60) return 'text-green-500';
        if (value >= 30) return 'text-yellow-500';
        return 'text-red-500';
      case 'memory':
        if (value < 50) return 'text-green-500';
        if (value < 80) return 'text-yellow-500';
        return 'text-red-500';
      case 'latency':
        if (value < 20) return 'text-green-500';
        if (value < 50) return 'text-yellow-500';
        return 'text-red-500';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <Bug className="w-6 h-6 text-red-500" />
            <span>Debug Console</span>
            <Badge className={debugMode ? 'bg-green-500' : 'bg-red-500'}>
              {debugMode ? 'Đang chạy' : 'Dừng'}
            </Badge>
          </CardTitle>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Debug Controls */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
          <div className="flex items-center space-x-4">
            <Button
              onClick={debugMode ? onStopDebug : onStartDebug}
              variant={debugMode ? 'destructive' : 'default'}
              size="sm"
            >
              {debugMode ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {debugMode ? 'Dừng Debug' : 'Bắt đầu Debug'}
            </Button>
            
            <Button
              onClick={onResetDebug}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            
            <Button
              onClick={() => setShowRawData(!showRawData)}
              variant="outline"
              size="sm"
            >
              {showRawData ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showRawData ? 'Ẩn' : 'Hiện'} Raw Data
            </Button>
          </div>
          
          <div className="text-sm text-slate-400">
            Debug Mode: {debugMode ? 'ON' : 'OFF'}
          </div>
        </div>

        {/* Debug Tabs */}
        <div className="flex space-x-2">
          {[
            { id: 'state', label: 'Trạng thái', icon: <Settings className="w-4 h-4" /> },
            { id: 'performance', label: 'Hiệu suất', icon: <Zap className="w-4 h-4" /> },
            { id: 'actions', label: 'Hành động', icon: <Sword className="w-4 h-4" /> },
            { id: 'settings', label: 'Cài đặt', icon: <Settings className="w-4 h-4" /> }
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              size="sm"
              className="flex items-center space-x-2"
            >
              {tab.icon}
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Debug Content */}
        <div className="min-h-[400px]">
          {activeTab === 'state' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Trạng thái chiến đấu</h3>
              
              <Card className="bg-slate-800/50">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3 flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Combat State
                  </h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(data.combatState).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-slate-400">{key}:</span>
                        <span className="font-mono">{formatValue(value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-slate-800/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3 flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Player Data
                    </h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(data.playerData).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-slate-400">{key}:</span>
                          <span className="font-mono">{formatValue(value)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Monster Data
                    </h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(data.monsterData).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-slate-400">{key}:</span>
                          <span className="font-mono">{formatValue(value)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Hiệu suất hệ thống</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-800/50">
                  <CardContent className="p-4 text-center">
                    <div className={`text-2xl font-bold ${getPerformanceColor(data.performance.fps, 'fps')}`}>
                      {data.performance.fps}
                    </div>
                    <div className="text-sm text-slate-400">FPS</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/50">
                  <CardContent className="p-4 text-center">
                    <div className={`text-2xl font-bold ${getPerformanceColor(data.performance.memory, 'memory')}`}>
                      {data.performance.memory}%
                    </div>
                    <div className="text-sm text-slate-400">Memory Usage</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/50">
                  <CardContent className="p-4 text-center">
                    <div className={`text-2xl font-bold ${getPerformanceColor(data.performance.latency, 'latency')}`}>
                      {data.performance.latency}ms
                    </div>
                    <div className="text-sm text-slate-400">Latency</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Hành động và lịch sử</h3>
              
              <Card className="bg-slate-800/50">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Action Queue</h4>
                  <div className="space-y-2">
                    {data.actionQueue.map((action, index) => (
                      <div key={index} className="flex justify-between text-sm p-2 bg-slate-700/50 rounded">
                        <span className="text-slate-300">{action.type}</span>
                        <span className="text-slate-400">{action.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Turn History</h4>
                  <div className="space-y-2">
                    {data.turnHistory.map((turn, index) => (
                      <div key={index} className="flex justify-between text-sm p-2 bg-slate-700/50 rounded">
                        <span className="text-slate-300">Turn {turn.turn}: {turn.action}</span>
                        <span className="text-slate-400">{turn.result} - {turn.damage} damage</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Cài đặt Debug</h3>
              
              <Card className="bg-slate-800/50">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Debug Options</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Show Raw Data</span>
                      <Badge className={showRawData ? 'bg-green-500' : 'bg-red-500'}>
                        {showRawData ? 'ON' : 'OFF'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Debug Mode</span>
                      <Badge className={debugMode ? 'bg-green-500' : 'bg-red-500'}>
                        {debugMode ? 'ON' : 'OFF'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Performance Monitoring</span>
                      <Badge className="bg-green-500">ON</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-4 border-t border-slate-700">
          <Button onClick={onClose}>
            Đóng
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
