"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Sword, Shield, Zap, Heart, Star, Eye, Skull } from "lucide-react";

interface MonsterDetailsProps {
  monster: {
    id: number;
    name: string;
    level: number;
    hp: number;
    maxHp: number;
    stats: Record<string, number>;
    skills: Array<{
      id: number;
      name: string;
      description: string;
      damage: number;
      cooldown: number;
    }>;
    drops: Array<{
      id: number;
      name: string;
      chance: number;
      quantity: number;
    }>;
    experience: number;
    gold: number;
  };
  onStartCombat?: () => void;
  onClose?: () => void;
}

export function MonsterDetails({ monster, onStartCombat, onClose }: MonsterDetailsProps) {
  const getDifficultyColor = (level: number) => {
    if (level <= 5) return "bg-green-500";
    if (level <= 10) return "bg-yellow-500";
    if (level <= 15) return "bg-orange-500";
    return "bg-red-500";
  };

  const getDifficultyText = (level: number) => {
    if (level <= 5) return "Dễ";
    if (level <= 10) return "Trung bình";
    if (level <= 15) return "Khó";
    return "Rất khó";
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <Skull className="w-6 h-6 text-red-500" />
            <span>{monster.name}</span>
            <Badge className={getDifficultyColor(monster.level)}>
              Cấp {monster.level}
            </Badge>
          </CardTitle>
          {onClose && (
            <Button onClick={onClose} variant="outline" size="sm">
              ✕
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-4 text-sm text-slate-600">
          <span>Độ khó: {getDifficultyText(monster.level)}</span>
          <span>•</span>
          <span>Kinh nghiệm: {monster.experience}</span>
          <span>•</span>
          <span>Vàng: {monster.gold}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* HP Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1 text-red-500" />
              Máu
            </span>
            <span>{monster.hp}/{monster.maxHp}</span>
          </div>
          <Progress 
            value={(monster.hp / monster.maxHp) * 100} 
            className="h-3"
          />
        </div>

        {/* Stats */}
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Chỉ số
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Sức mạnh:</span>
                <span className="font-medium">{monster.stats.strength}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Nhanh nhẹn:</span>
                <span className="font-medium">{monster.stats.agility}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Trí tuệ:</span>
                <span className="font-medium">{monster.stats.intelligence}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Thể lực:</span>
                <span className="font-medium">{monster.stats.vitality}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Kỹ năng
          </h4>
          <div className="space-y-2">
            {monster.skills.map((skill) => (
              <div key={skill.id} className="p-3 bg-slate-800/50 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">{skill.name}</span>
                  <Badge variant="outline" className="text-xs">
                    Sát thương: {skill.damage}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mb-2">{skill.description}</p>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Hồi chiêu: {skill.cooldown} lượt</span>
                  <span>Chi phí: {skill.damage * 0.5} năng lượng</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drops */}
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <Star className="w-4 h-4 mr-2" />
            Vật phẩm rơi
          </h4>
          <div className="space-y-2">
            {monster.drops.map((drop) => (
              <div key={drop.id} className="flex justify-between items-center p-2 bg-slate-800/30 rounded">
                <span className="text-sm">{drop.name}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {drop.chance}%
                  </Badge>
                  <span className="text-xs text-slate-500">
                    x{drop.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {onStartCombat && (
          <div className="flex space-x-2 pt-4 border-t border-slate-700">
            <Button onClick={onStartCombat} className="flex-1">
              <Sword className="w-4 h-4 mr-2" />
              Bắt đầu chiến đấu
            </Button>
            <Button variant="outline" onClick={onClose}>
              <Eye className="w-4 h-4 mr-2" />
              Quan sát thêm
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
