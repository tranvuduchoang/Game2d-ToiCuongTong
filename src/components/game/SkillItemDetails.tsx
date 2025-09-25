"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Sword, 
  Heart, 
  Shield, 
  Zap, 
  Star, 
  Clock, 
  Coins,
  X,
  Eye
} from "lucide-react";

interface SkillDetailsProps {
  skill: {
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
  };
  onClose: () => void;
  onUse?: () => void;
  canUse?: boolean;
}

interface ItemDetailsProps {
  item: {
    id: number;
    name: string;
    description: string;
    healing?: number;
    damage?: number;
    quantity: number;
    type: 'consumable' | 'weapon' | 'armor' | 'accessory';
    rarity: string;
    effects?: string[];
  };
  onClose: () => void;
  onUse?: () => void;
  canUse?: boolean;
}

export function SkillDetails({ skill, onClose, onUse, canUse = true }: SkillDetailsProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'attack': return 'bg-red-500';
      case 'heal': return 'bg-green-500';
      case 'buff': return 'bg-blue-500';
      case 'debuff': return 'bg-purple-500';
      default: return 'bg-slate-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'attack': return <Sword className="w-5 h-5" />;
      case 'heal': return <Heart className="w-5 h-5" />;
      case 'buff': return <Shield className="w-5 h-5" />;
      case 'debuff': return <Zap className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${getTypeColor(skill.type)}`}>
              {getTypeIcon(skill.type)}
            </div>
            <span>{skill.name}</span>
          </CardTitle>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Description */}
        <div>
          <h4 className="font-medium mb-2">Mô tả</h4>
          <p className="text-sm text-slate-400">{skill.description}</p>
        </div>

        {/* Stats */}
        <div>
          <h4 className="font-medium mb-2">Thông số</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Sát thương:</span>
                <span className="font-medium text-red-500">{skill.damage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Chi phí:</span>
                <span className="font-medium text-blue-500">{skill.cost}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Hồi chiêu:</span>
                <span className="font-medium">{skill.cooldown} lượt</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Loại:</span>
                <Badge className={getTypeColor(skill.type)}>
                  {skill.type}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Scaling */}
        {skill.scaling && (
          <div>
            <h4 className="font-medium mb-2">Hệ số tăng trưởng</h4>
            <div className="space-y-1 text-sm">
              {Object.entries(skill.scaling).map(([stat, value]) => (
                <div key={stat} className="flex justify-between">
                  <span className="text-slate-600">{stat}:</span>
                  <span className="font-medium">+{value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Effects */}
        {skill.effects && skill.effects.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Hiệu ứng đặc biệt</h4>
            <div className="space-y-1">
              {skill.effects.map((effect, index) => (
                <div key={index} className="text-sm text-slate-400 flex items-center">
                  <Star className="w-3 h-3 mr-2 text-yellow-500" />
                  {effect}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cooldown Status */}
        {skill.currentCooldown > 0 && (
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">
                Hồi chiêu: {skill.currentCooldown} lượt
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        {onUse && (
          <Button 
            onClick={onUse} 
            disabled={!canUse || skill.currentCooldown > 0}
            className="w-full"
          >
            <Sword className="w-4 h-4 mr-2" />
            Sử dụng kỹ năng
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function ItemDetails({ item, onClose, onUse, canUse = true }: ItemDetailsProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consumable': return 'bg-green-500';
      case 'weapon': return 'bg-red-500';
      case 'armor': return 'bg-blue-500';
      case 'accessory': return 'bg-purple-500';
      default: return 'bg-slate-500';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'bg-slate-500';
      case 'uncommon': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${getTypeColor(item.type)}`}>
              <Star className="w-5 h-5" />
            </div>
            <span>{item.name}</span>
          </CardTitle>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Description */}
        <div>
          <h4 className="font-medium mb-2">Mô tả</h4>
          <p className="text-sm text-slate-400">{item.description}</p>
        </div>

        {/* Stats */}
        <div>
          <h4 className="font-medium mb-2">Thông số</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              {item.healing && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Hồi máu:</span>
                  <span className="font-medium text-green-500">+{item.healing}</span>
                </div>
              )}
              {item.damage && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Sát thương:</span>
                  <span className="font-medium text-red-500">+{item.damage}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Số lượng:</span>
                <span className="font-medium">{item.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Độ hiếm:</span>
                <Badge className={getRarityColor(item.rarity)}>
                  {item.rarity}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Effects */}
        {item.effects && item.effects.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Hiệu ứng đặc biệt</h4>
            <div className="space-y-1">
              {item.effects.map((effect, index) => (
                <div key={index} className="text-sm text-slate-400 flex items-center">
                  <Star className="w-3 h-3 mr-2 text-yellow-500" />
                  {effect}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        {onUse && (
          <Button 
            onClick={onUse} 
            disabled={!canUse || item.quantity <= 0}
            className="w-full"
          >
            <Star className="w-4 h-4 mr-2" />
            Sử dụng vật phẩm
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
