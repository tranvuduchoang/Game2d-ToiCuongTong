"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Sword, Shield, Zap, Heart, Coins, Star, X, CheckCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { MonsterDetails } from './MonsterDetails';
import { CombatResult } from './CombatResult';
import { CombatInventory } from './CombatInventory';

interface CombatParticipant {
  id: number;
  name: string;
  currentHp: number;
  maxHp: number;
  stats: Record<string, number>;
  skills: CombatSkill[];
  items: CombatItem[];
}

interface CombatSkill {
  id: number;
  name: string;
  description: string;
  damage: number;
  cooldown: number;
  currentCooldown: number;
  cost: number;
}

interface CombatItem {
  id: number;
  name: string;
  description: string;
  healing?: number;
  damage?: number;
  quantity: number;
}

interface CombatState {
  id: string;
  player: CombatParticipant;
  monster: CombatParticipant;
  currentTurn: 'player' | 'monster';
  turnNumber: number;
  isActive: boolean;
  messages: string[];
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

export function CombatSystem() {
  const [combatState, setCombatState] = useState<CombatState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');

  // Mock data for testing
  const mockCombatState: CombatState = {
    id: 'combat_001',
    player: {
      id: 1,
      name: 'Trang',
      currentHp: 150,
      maxHp: 200,
      stats: { strength: 50, agility: 30, intelligence: 40, vitality: 60 },
      skills: [
        { id: 1, name: 'Kiếm Pháp Cơ Bản', description: 'Tấn công cơ bản với kiếm', damage: 25, cooldown: 0, currentCooldown: 0, cost: 0 },
        { id: 2, name: 'Hỏa Long Quyền', description: 'Quyền pháp hỏa thuộc', damage: 40, cooldown: 3, currentCooldown: 0, cost: 20 },
        { id: 3, name: 'Thiên Lôi Chưởng', description: 'Chưởng pháp lôi thuộc', damage: 60, cooldown: 5, currentCooldown: 0, cost: 30 }
      ],
      items: [
        { id: 1, name: 'Hồi Huyết Đan', description: 'Hồi phục 50 HP', healing: 50, quantity: 3 },
        { id: 2, name: 'Tăng Công Đan', description: 'Tăng sát thương 20%', damage: 0, quantity: 2 }
      ]
    },
    monster: {
      id: 2,
      name: 'Ma Thú Rừng Nguyên Sinh',
      currentHp: 120,
      maxHp: 180,
      stats: { strength: 45, agility: 25, intelligence: 20, vitality: 50 },
      skills: [
        { id: 4, name: 'Cắn Xé', description: 'Tấn công cơ bản', damage: 20, cooldown: 0, currentCooldown: 0, cost: 0 },
        { id: 5, name: 'Gầm Thét', description: 'Làm choáng đối thủ', damage: 15, cooldown: 2, currentCooldown: 0, cost: 10 }
      ],
      items: []
    },
    currentTurn: 'player',
    turnNumber: 1,
    isActive: true,
    messages: ['Trận chiến bắt đầu!', 'Ma Thú xuất hiện!']
  };

  useEffect(() => {
    // Load combat state from API
    loadCombatState();
  }, []);

  const loadCombatState = async () => {
    setIsLoading(true);
    try {
      // For now, use mock data
      setCombatState(mockCombatState);
    } catch (error) {
      console.error('Error loading combat state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startCombat = async (monsterId: number) => {
    setIsLoading(true);
    try {
      const response = await api.post('/combat/start', { monsterId });
      setCombatState(response.data);
    } catch (error) {
      console.error('Error starting combat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const performAction = async (action: CombatAction) => {
    if (!combatState || combatState.currentTurn !== 'player') return;

    setIsLoading(true);
    try {
      const response = await api.post('/combat/action', {
        combatId: combatState.id,
        action
      });
      setCombatState(response.data);
    } catch (error) {
      console.error('Error performing action:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
    if (!combatState || skill.currentCooldown > 0) return;
    
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

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Đang tải trận chiến...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!combatState) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="text-center">
            <Sword className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl mb-2">Chưa có trận chiến</h3>
            <p className="text-slate-600 mb-4">Hãy khám phá bản đồ để tìm quái vật</p>
            <Button onClick={() => startCombat(1)}>
              Bắt đầu trận chiến thử nghiệm
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Combat Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Trận Chiến #{combatState.turnNumber}</span>
            <Badge variant={combatState.currentTurn === 'player' ? 'default' : 'secondary'}>
              {combatState.currentTurn === 'player' ? 'Lượt của bạn' : 'Lượt quái vật'}
            </Badge>
          </CardTitle>
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
              <Button onClick={handleAttack} className="flex-1">
                <Sword className="w-4 h-4 mr-2" />
                Tấn công
              </Button>
              <Button onClick={handleDefend} variant="outline" className="flex-1">
                <Shield className="w-4 h-4 mr-2" />
                Phòng thủ
              </Button>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-sm font-medium mb-2">Kỹ năng</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {combatState.player.skills.map((skill) => (
                  <Button
                    key={skill.id}
                    onClick={() => handleSkill(skill)}
                    disabled={skill.currentCooldown > 0}
                    variant="outline"
                    className="justify-start"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">{skill.name}</div>
                      <div className="text-xs text-slate-500">
                        Sát thương: {skill.damage}
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
                    disabled={item.quantity <= 0}
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
    </div>
  );
}
