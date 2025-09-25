"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Sword, 
  Shield, 
  Zap, 
  Heart, 
  Coins, 
  Star, 
  X, 
  CheckCircle,
  Settings,
  HelpCircle,
  BarChart3,
  ScrollText,
  Bug,
  Bell
} from 'lucide-react';
import { api } from '../../lib/api';
import { MonsterDetails } from './MonsterDetails';
import { CombatResult } from './CombatResult';
import { CombatInventory } from './CombatInventory';
import { SkillDetails, ItemDetails } from './SkillItemDetails';
import { MapDetails } from './MapDetails';
import { GameDataDetails } from './GameDataDetails';
import { CombatTutorial } from './CombatTutorial';
import { CombatSettings } from './CombatSettings';
import { CombatHotkeys } from './CombatHotkeys';
import { CombatStatistics } from './CombatStatistics';
import { CombatLog } from './CombatLog';
import { CombatDebug } from './CombatDebug';
import { CombatNotifications, useCombatNotifications } from './CombatNotifications';

interface CombatParticipant {
  id: number;
  name: string;
  currentHp: number;
  maxHp: number;
  currentMana: number;
  maxMana: number;
  stats: Record<string, number>;
  skills: CombatSkill[];
  items: CombatItem[];
  level: number;
  experience: number;
}

interface CombatSkill {
  id: number;
  name: string;
  description: string;
  damage: number;
  cooldown: number;
  currentCooldown: number;
  cost: number;
  type: 'attack' | 'heal' | 'buff' | 'debuff';
  scaling?: Record<string, number>;
  effects?: string[];
  rarity: string;
}

interface CombatItem {
  id: number;
  name: string;
  description: string;
  healing?: number;
  damage?: number;
  quantity: number;
  type: 'consumable' | 'weapon' | 'armor' | 'accessory';
  rarity: string;
  effects?: string[];
  value: number;
}

interface CombatState {
  id: string;
  player: CombatParticipant;
  monster: CombatParticipant;
  currentTurn: 'player' | 'monster';
  turnNumber: number;
  isActive: boolean;
  messages: string[];
  phase: 'action_selection' | 'skill_selection' | 'item_selection' | 'monster_turn' | 'victory' | 'defeat';
}

interface CombatAction {
  type: 'attack' | 'skill' | 'item' | 'defend';
  targetId?: number;
  skillId?: number;
  itemId?: number;
  damage?: number;
  healing?: number;
  message: string;
}

export function CombatSystemComplete() {
  // State management
  const [combatState, setCombatState] = useState<CombatState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [showMonsterDetails, setShowMonsterDetails] = useState(false);
  const [showCombatResult, setShowCombatResult] = useState(false);
  const [showSkillDetails, setShowSkillDetails] = useState(false);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [showMapDetails, setShowMapDetails] = useState(false);
  const [showGameData, setShowGameData] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHotkeys, setShowHotkeys] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showCombatLog, setShowCombatLog] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<CombatSkill | null>(null);
  const [selectedItem, setSelectedItem] = useState<CombatItem | null>(null);
  const [combatResult, setCombatResult] = useState<any>(null);

  // Notifications
  const {
    notifications,
    addNotification,
    dismissNotification,
    dismissAllNotifications,
    addCombatNotification,
    addDamageNotification,
    addHealingNotification,
    addSkillNotification,
    addItemNotification,
    addVictoryNotification,
    addDefeatNotification
  } = useCombatNotifications();

  // Mock data for testing
  const mockCombatState: CombatState = {
    id: 'combat_001',
    player: {
      id: 1,
      name: 'Trang',
      currentHp: 150,
      maxHp: 200,
      currentMana: 80,
      maxMana: 100,
      level: 5,
      experience: 1250,
      stats: { strength: 50, agility: 30, intelligence: 40, vitality: 60 },
      skills: [
        { 
          id: 1, 
          name: 'Kiếm Pháp Cơ Bản', 
          description: 'Tấn công cơ bản với kiếm', 
          damage: 25, 
          cooldown: 0, 
          currentCooldown: 0, 
          cost: 0,
          type: 'attack',
          rarity: 'common'
        },
        { 
          id: 2, 
          name: 'Hỏa Long Quyền', 
          description: 'Quyền pháp hỏa thuộc', 
          damage: 40, 
          cooldown: 3, 
          currentCooldown: 0, 
          cost: 20,
          type: 'attack',
          scaling: { strength: 0.5 },
          rarity: 'uncommon'
        },
        { 
          id: 3, 
          name: 'Thiên Lôi Chưởng', 
          description: 'Chưởng pháp lôi thuộc', 
          damage: 60, 
          cooldown: 5, 
          currentCooldown: 0, 
          cost: 30,
          type: 'attack',
          scaling: { intelligence: 0.3 },
          rarity: 'rare'
        },
        { 
          id: 4, 
          name: 'Hồi Sinh Thuật', 
          description: 'Hồi phục HP', 
          damage: 0, 
          cooldown: 2, 
          currentCooldown: 0, 
          cost: 15,
          type: 'heal',
          scaling: { intelligence: 0.4 },
          rarity: 'uncommon'
        }
      ],
      items: [
        { 
          id: 1, 
          name: 'Hồi Huyết Đan', 
          description: 'Hồi phục 50 HP', 
          healing: 50, 
          quantity: 3,
          type: 'consumable',
          rarity: 'common',
          value: 10
        },
        { 
          id: 2, 
          name: 'Tăng Công Đan', 
          description: 'Tăng sát thương 20%', 
          damage: 0, 
          quantity: 2,
          type: 'consumable',
          rarity: 'uncommon',
          effects: ['Tăng sát thương 20% trong 3 lượt'],
          value: 25
        }
      ]
    },
    monster: {
      id: 2,
      name: 'Ma Thú Rừng Nguyên Sinh',
      currentHp: 120,
      maxHp: 180,
      currentMana: 60,
      maxMana: 80,
      level: 4,
      experience: 0,
      stats: { strength: 45, agility: 25, intelligence: 20, vitality: 50 },
      skills: [
        { 
          id: 5, 
          name: 'Cắn Xé', 
          description: 'Tấn công cơ bản', 
          damage: 20, 
          cooldown: 0, 
          currentCooldown: 0, 
          cost: 0,
          type: 'attack',
          rarity: 'common'
        },
        { 
          id: 6, 
          name: 'Gầm Thét', 
          description: 'Làm choáng đối thủ', 
          damage: 15, 
          cooldown: 2, 
          currentCooldown: 0, 
          cost: 10,
          type: 'debuff',
          rarity: 'uncommon'
        }
      ],
      items: []
    },
    currentTurn: 'player',
    turnNumber: 1,
    isActive: true,
    messages: ['Trận chiến bắt đầu!', 'Ma Thú xuất hiện!'],
    phase: 'action_selection'
  };

  // Initialize combat state
  useEffect(() => {
    if (!combatState) {
      setCombatState(mockCombatState);
    }
  }, [combatState]);

  // Combat logic
  const performAction = useCallback(async (action: CombatAction) => {
    if (!combatState || combatState.currentTurn !== 'player') return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Process action
      const newState = { ...combatState };
      
      if (action.type === 'attack') {
        const damage = action.damage || 0;
        newState.monster.currentHp = Math.max(0, newState.monster.currentHp - damage);
        newState.messages.push(action.message);
        addDamageNotification(damage);
        
        if (newState.monster.currentHp <= 0) {
          newState.phase = 'victory';
          newState.isActive = false;
          setCombatResult({
            victory: true,
            experience: 100,
            gold: 50,
            items: [],
            damageDealt: damage,
            damageTaken: 0,
            turns: newState.turnNumber,
            skillsUsed: 0
          });
          addVictoryNotification(100, 50);
        } else {
          newState.currentTurn = 'monster';
          newState.phase = 'monster_turn';
        }
      } else if (action.type === 'skill') {
        const skill = newState.player.skills.find(s => s.id === action.skillId);
        if (skill) {
          const damage = action.damage || 0;
          newState.monster.currentHp = Math.max(0, newState.monster.currentHp - damage);
          newState.player.currentMana = Math.max(0, newState.player.currentMana - skill.cost);
          newState.messages.push(action.message);
          addSkillNotification(skill.name, damage);
          
          if (newState.monster.currentHp <= 0) {
            newState.phase = 'victory';
            newState.isActive = false;
            setCombatResult({
              victory: true,
              experience: 100,
              gold: 50,
              items: [],
              damageDealt: damage,
              damageTaken: 0,
              turns: newState.turnNumber,
              skillsUsed: 1
            });
            addVictoryNotification(100, 50);
          } else {
            newState.currentTurn = 'monster';
            newState.phase = 'monster_turn';
          }
        }
      } else if (action.type === 'item') {
        const item = newState.player.items.find(i => i.id === action.itemId);
        if (item) {
          const healing = action.healing || 0;
          newState.player.currentHp = Math.min(newState.player.maxHp, newState.player.currentHp + healing);
          newState.player.items = newState.player.items.map(i => 
            i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
          );
          newState.messages.push(action.message);
          addItemNotification(item.name, `Hồi ${healing} HP`);
          
          newState.currentTurn = 'monster';
          newState.phase = 'monster_turn';
        }
      } else if (action.type === 'defend') {
        newState.messages.push(action.message);
        newState.currentTurn = 'monster';
        newState.phase = 'monster_turn';
      }
      
      setCombatState(newState);
    } catch (error) {
      console.error('Error performing action:', error);
      addCombatNotification('Lỗi', 'Không thể thực hiện hành động');
    } finally {
      setIsLoading(false);
    }
  }, [combatState, addDamageNotification, addSkillNotification, addItemNotification, addVictoryNotification, addCombatNotification]);

  const handleAttack = () => {
    if (!combatState) return;
    
    const action: CombatAction = {
      type: 'attack',
      targetId: combatState.monster.id,
      damage: combatState.player.stats.strength,
      message: `${combatState.player.name} tấn công ${combatState.monster.name}!`
    };
    
    performAction(action);
  };

  const handleSkill = (skill: CombatSkill) => {
    if (!combatState || skill.currentCooldown > 0 || combatState.player.currentMana < skill.cost) return;
    
    const action: CombatAction = {
      type: 'skill',
      targetId: combatState.monster.id,
      skillId: skill.id,
      damage: skill.damage,
      message: `${combatState.player.name} sử dụng ${skill.name}!`
    };
    
    performAction(action);
  };

  const handleItem = (item: CombatItem) => {
    if (!combatState || item.quantity <= 0) return;
    
    const action: CombatAction = {
      type: 'item',
      itemId: item.id,
      healing: item.healing,
      damage: item.damage,
      message: `${combatState.player.name} sử dụng ${item.name}!`
    };
    
    performAction(action);
  };

  const handleDefend = () => {
    if (!combatState) return;
    
    const action: CombatAction = {
      type: 'defend',
      message: `${combatState.player.name} phòng thủ!`
    };
    
    performAction(action);
  };

  const handleViewSkill = (skill: CombatSkill) => {
    setSelectedSkill(skill);
    setShowSkillDetails(true);
  };

  const handleViewItem = (item: CombatItem) => {
    setSelectedItem(item);
    setShowItemDetails(true);
  };

  const handleStartCombat = () => {
    setCombatState(mockCombatState);
    setShowCombatResult(false);
    addCombatNotification('Chiến đấu', 'Trận chiến bắt đầu!');
  };

  const handleContinue = () => {
    setShowCombatResult(false);
    setCombatState(null);
  };

  const handleRetry = () => {
    setShowCombatResult(false);
    setCombatState(mockCombatState);
  };

  // Render combat result
  if (showCombatResult && combatResult) {
    return (
      <div className="h-full flex items-center justify-center">
        <CombatResult
          result={combatResult}
          onContinue={handleContinue}
          onRetry={handleRetry}
          onBackToMap={() => setCombatState(null)}
        />
      </div>
    );
  }

  // Render tutorial
  if (showTutorial) {
    return (
      <div className="h-full flex items-center justify-center">
        <CombatTutorial
          onClose={() => setShowTutorial(false)}
          onStartCombat={handleStartCombat}
        />
      </div>
    );
  }

  // Render settings
  if (showSettings) {
    return (
      <div className="h-full flex items-center justify-center">
        <CombatSettings
          onClose={() => setShowSettings(false)}
          onSave={(settings) => {
            console.log('Settings saved:', settings);
            setShowSettings(false);
          }}
        />
      </div>
    );
  }

  // Render hotkeys
  if (showHotkeys) {
    return (
      <div className="h-full flex items-center justify-center">
        <CombatHotkeys
          onClose={() => setShowHotkeys(false)}
          onToggleHotkeys={(show) => console.log('Toggle hotkeys:', show)}
          showHotkeys={true}
        />
      </div>
    );
  }

  // Render statistics
  if (showStatistics) {
    return (
      <div className="h-full flex items-center justify-center">
        <CombatStatistics
          onClose={() => setShowStatistics(false)}
          onReset={() => console.log('Reset statistics')}
        />
      </div>
    );
  }

  // Render combat log
  if (showCombatLog) {
    return (
      <div className="h-full flex items-center justify-center">
        <CombatLog
          onClose={() => setShowCombatLog(false)}
          onClear={() => console.log('Clear log')}
          onExport={() => console.log('Export log')}
          entries={combatState?.messages.map((msg, index) => ({
            id: index.toString(),
            timestamp: new Date().toISOString(),
            type: 'system' as const,
            message: msg,
            source: 'System'
          })) || []}
        />
      </div>
    );
  }

  // Render debug
  if (showDebug) {
    return (
      <div className="h-full flex items-center justify-center">
        <CombatDebug
          onClose={() => setShowDebug(false)}
          onStartDebug={() => setDebugMode(true)}
          onStopDebug={() => setDebugMode(false)}
          onResetDebug={() => console.log('Reset debug')}
          debugMode={debugMode}
          debugData={combatState ? {
            combatState: combatState,
            playerData: combatState.player,
            monsterData: combatState.monster,
            actionQueue: [],
            turnHistory: [],
            performance: { fps: 60, memory: 45.2, latency: 12 }
          } : undefined}
        />
      </div>
    );
  }

  // Render monster details
  if (showMonsterDetails && combatState) {
    return (
      <div className="h-full flex items-center justify-center">
        <MonsterDetails
          monster={{
            id: combatState.monster.id,
            name: combatState.monster.name,
            level: combatState.monster.level,
            hp: combatState.monster.currentHp,
            maxHp: combatState.monster.maxHp,
            stats: combatState.monster.stats,
            skills: combatState.monster.skills,
            drops: [],
            experience: 100,
            gold: 50
          }}
          onClose={() => setShowMonsterDetails(false)}
          onStartCombat={() => {
            setShowMonsterDetails(false);
            handleStartCombat();
          }}
        />
      </div>
    );
  }

  // Render skill details
  if (showSkillDetails && selectedSkill) {
    return (
      <div className="h-full flex items-center justify-center">
        <SkillDetails
          skill={selectedSkill}
          onClose={() => setShowSkillDetails(false)}
          onUse={() => {
            handleSkill(selectedSkill);
            setShowSkillDetails(false);
          }}
          canUse={combatState?.currentTurn === 'player' && selectedSkill.currentCooldown === 0 && (combatState.player.currentMana >= selectedSkill.cost)}
        />
      </div>
    );
  }

  // Render item details
  if (showItemDetails && selectedItem) {
    return (
      <div className="h-full flex items-center justify-center">
        <ItemDetails
          item={selectedItem}
          onClose={() => setShowItemDetails(false)}
          onUse={() => {
            handleItem(selectedItem);
            setShowItemDetails(false);
          }}
          canUse={combatState?.currentTurn === 'player' && selectedItem.quantity > 0}
        />
      </div>
    );
  }

  // Render map details
  if (showMapDetails) {
    return (
      <div className="h-full flex items-center justify-center">
        <MapDetails
          map={{
            id: 1,
            name: 'Rừng Nguyên Sinh',
            description: 'Khu rừng cổ thụ với nhiều linh thảo quý hiếm',
            difficulty: 'Phàm Nhân',
            unlocked: true,
            requiredLevel: 1,
            playerLevel: 5,
            monsters: [],
            rewards: { experience: 100, gold: 50, items: [] }
          }}
          onClose={() => setShowMapDetails(false)}
          onStartExploration={() => {
            setShowMapDetails(false);
            handleStartCombat();
          }}
        />
      </div>
    );
  }

  // Render game data
  if (showGameData) {
    return (
      <div className="h-full flex items-center justify-center">
        <GameDataDetails
          skills={combatState?.player.skills || []}
          items={combatState?.player.items || []}
          onClose={() => setShowGameData(false)}
          onUseSkill={(skill) => {
            const combatSkill = combatState?.player.skills.find(s => s.id === skill.id);
            if (combatSkill) {
              handleSkill(combatSkill);
              setShowGameData(false);
            }
          }}
          onUseItem={(item) => {
            const combatItem = combatState?.player.items.find(i => i.id === item.id);
            if (combatItem) {
              handleItem(combatItem);
              setShowGameData(false);
            }
          }}
        />
      </div>
    );
  }

  // Main combat interface
  if (!combatState) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Chưa có trận chiến</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-slate-600">
              Hãy khám phá bản đồ để tìm quái vật và bắt đầu chiến đấu
            </p>
            <div className="flex space-x-2">
              <Button onClick={handleStartCombat} className="flex-1">
                <Sword className="w-4 h-4 mr-2" />
                Bắt đầu trận chiến thử nghiệm
              </Button>
              <Button onClick={() => setShowTutorial(true)} variant="outline">
                <HelpCircle className="w-4 h-4 mr-2" />
                Hướng dẫn
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Combat Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <Sword className="w-5 h-5 text-red-500" />
              <span>Trận Chiến #{combatState.turnNumber}</span>
              <Badge variant={combatState.currentTurn === 'player' ? 'default' : 'secondary'}>
                {combatState.currentTurn === 'player' ? 'Lượt của bạn' : 'Lượt quái vật'}
              </Badge>
            </CardTitle>
            <div className="flex space-x-2">
              <Button onClick={() => setShowSettings(true)} variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button onClick={() => setShowHotkeys(true)} variant="outline" size="sm">
                <HelpCircle className="w-4 h-4" />
              </Button>
              <Button onClick={() => setShowStatistics(true)} variant="outline" size="sm">
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button onClick={() => setShowCombatLog(true)} variant="outline" size="sm">
                <ScrollText className="w-4 h-4" />
              </Button>
              <Button onClick={() => setShowDebug(true)} variant="outline" size="sm">
                <Bug className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Combat Arena */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Player Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span>{combatState.player.name}</span>
              <Badge variant="outline">Cấp {combatState.player.level}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* HP Bar */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Máu</span>
                <span>{combatState.player.currentHp}/{combatState.player.maxHp}</span>
              </div>
              <Progress 
                value={(combatState.player.currentHp / combatState.player.maxHp) * 100} 
                className="h-2"
              />
            </div>

            {/* Mana Bar */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Năng lượng</span>
                <span>{combatState.player.currentMana}/{combatState.player.maxMana}</span>
              </div>
              <Progress 
                value={(combatState.player.currentMana / combatState.player.maxMana) * 100} 
                className="h-2"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Sức mạnh:</span>
                <span>{combatState.player.stats.strength}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Nhanh nhẹn:</span>
                <span>{combatState.player.stats.agility}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Trí tuệ:</span>
                <span>{combatState.player.stats.intelligence}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Thể lực:</span>
                <span>{combatState.player.stats.vitality}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monster Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-orange-500" />
              <span>{combatState.monster.name}</span>
              <Badge variant="outline">Cấp {combatState.monster.level}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* HP Bar */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Máu</span>
                <span>{combatState.monster.currentHp}/{combatState.monster.maxHp}</span>
              </div>
              <Progress 
                value={(combatState.monster.currentHp / combatState.monster.maxHp) * 100} 
                className="h-2"
              />
            </div>

            {/* Mana Bar */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Năng lượng</span>
                <span>{combatState.monster.currentMana}/{combatState.monster.maxMana}</span>
              </div>
              <Progress 
                value={(combatState.monster.currentMana / combatState.monster.maxMana) * 100} 
                className="h-2"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Sức mạnh:</span>
                <span>{combatState.monster.stats.strength}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Nhanh nhẹn:</span>
                <span>{combatState.monster.stats.agility}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Trí tuệ:</span>
                <span>{combatState.monster.stats.intelligence}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Thể lực:</span>
                <span>{combatState.monster.stats.vitality}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Combat Actions */}
      {combatState.currentTurn === 'player' && (
        <Card>
          <CardHeader>
            <CardTitle>Hành động của bạn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Actions */}
            <div className="flex space-x-2">
              <Button onClick={handleAttack} className="flex-1" disabled={isLoading}>
                <Sword className="w-4 h-4 mr-2" />
                Tấn công
              </Button>
              <Button onClick={handleDefend} variant="outline" className="flex-1" disabled={isLoading}>
                <Shield className="w-4 h-4 mr-2" />
                Phòng thủ
              </Button>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-sm font-medium mb-2">Kỹ năng</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {combatState.player.skills.map((skill) => (
                  <Button
                    key={skill.id}
                    onClick={() => handleSkill(skill)}
                    disabled={skill.currentCooldown > 0 || combatState.player.currentMana < skill.cost || isLoading}
                    variant="outline"
                    className="justify-start"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">{skill.name}</div>
                      <div className="text-xs text-slate-500">
                        Sát thương: {skill.damage} | Chi phí: {skill.cost}
                        {skill.currentCooldown > 0 && ` (Hồi chiêu: ${skill.currentCooldown})`}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="text-sm font-medium mb-2">Vật phẩm</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {combatState.player.items.map((item) => (
                  <Button
                    key={item.id}
                    onClick={() => handleItem(item)}
                    disabled={item.quantity <= 0 || isLoading}
                    variant="outline"
                    className="justify-start"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-slate-500">
                        Số lượng: {item.quantity}
                        {item.healing && ` (Hồi máu: ${item.healing})`}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Combat Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Nhật ký trận chiến</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {combatState.messages.map((message, index) => (
              <div key={index} className="text-sm text-slate-600">
                {message}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <CombatNotifications
        notifications={notifications}
        onDismiss={dismissNotification}
        onDismissAll={dismissAllNotifications}
      />
    </div>
  );
}
