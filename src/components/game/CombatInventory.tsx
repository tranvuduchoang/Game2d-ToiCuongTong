"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Zap, 
  Star, 
  Clock, 
  Shield, 
  Sword, 
  Heart,
  Coins,
  Eye
} from "lucide-react";

interface Skill {
  id: number;
  name: string;
  description: string;
  damage: number;
  cooldown: number;
  currentCooldown: number;
  cost: number;
  type: 'attack' | 'heal' | 'buff' | 'debuff';
}

interface Item {
  id: number;
  name: string;
  description: string;
  healing?: number;
  damage?: number;
  quantity: number;
  type: 'consumable' | 'weapon' | 'armor' | 'accessory';
}

interface CombatInventoryProps {
  skills: Skill[];
  items: Item[];
  currentMana: number;
  maxMana: number;
  onUseSkill: (skill: Skill) => void;
  onUseItem: (item: Item) => void;
  onViewDetails: (type: 'skill' | 'item', id: number) => void;
}

export function CombatInventory({ 
  skills, 
  items, 
  currentMana, 
  maxMana, 
  onUseSkill, 
  onUseItem, 
  onViewDetails 
}: CombatInventoryProps) {
  const getSkillTypeColor = (type: string) => {
    switch (type) {
      case 'attack': return 'bg-red-500';
      case 'heal': return 'bg-green-500';
      case 'buff': return 'bg-blue-500';
      case 'debuff': return 'bg-purple-500';
      default: return 'bg-slate-500';
    }
  };

  const getSkillTypeIcon = (type: string) => {
    switch (type) {
      case 'attack': return <Sword className="w-4 h-4" />;
      case 'heal': return <Heart className="w-4 h-4" />;
      case 'buff': return <Shield className="w-4 h-4" />;
      case 'debuff': return <Zap className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getItemTypeColor = (type: string) => {
    switch (type) {
      case 'consumable': return 'bg-green-500';
      case 'weapon': return 'bg-red-500';
      case 'armor': return 'bg-blue-500';
      case 'accessory': return 'bg-purple-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Mana Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="flex items-center">
              <Zap className="w-4 h-4 mr-1 text-blue-500" />
              Năng lượng
            </span>
            <span>{currentMana}/{maxMana}</span>
          </div>
          <Progress 
            value={(currentMana / maxMana) * 100} 
            className="h-2"
          />
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Sword className="w-5 h-5 mr-2" />
            Kỹ năng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skills.map((skill) => (
              <div key={skill.id} className="relative">
                <Button
                  onClick={() => onUseSkill(skill)}
                  disabled={skill.currentCooldown > 0 || currentMana < skill.cost}
                  variant="outline"
                  className="w-full h-auto p-3 justify-start"
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`p-2 rounded-full ${getSkillTypeColor(skill.type)}`}>
                      {getSkillTypeIcon(skill.type)}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{skill.name}</div>
                      <div className="text-xs text-slate-400 mb-1">
                        {skill.description}
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Sát thương: {skill.damage}</span>
                        <span>Chi phí: {skill.cost}</span>
                      </div>
                    </div>
                  </div>
                </Button>
                
                {/* Cooldown Overlay */}
                {skill.currentCooldown > 0 && (
                  <div className="absolute inset-0 bg-slate-900/80 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">
                        {skill.currentCooldown}
                      </div>
                      <div className="text-xs text-slate-300">
                        Hồi chiêu
                      </div>
                    </div>
                  </div>
                )}
                
                {/* View Details Button */}
                <Button
                  onClick={() => onViewDetails('skill', skill.id)}
                  variant="ghost"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                >
                  <Eye className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Vật phẩm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map((item) => (
              <div key={item.id} className="relative">
                <Button
                  onClick={() => onUseItem(item)}
                  disabled={item.quantity <= 0}
                  variant="outline"
                  className="w-full h-auto p-3 justify-start"
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`p-2 rounded-full ${getItemTypeColor(item.type)}`}>
                      <Star className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-slate-400 mb-1">
                        {item.description}
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>
                          {item.healing && `Hồi máu: ${item.healing}`}
                          {item.damage && `Sát thương: ${item.damage}`}
                        </span>
                        <span>Số lượng: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                </Button>
                
                {/* View Details Button */}
                <Button
                  onClick={() => onViewDetails('item', item.id)}
                  variant="ghost"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                >
                  <Eye className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
