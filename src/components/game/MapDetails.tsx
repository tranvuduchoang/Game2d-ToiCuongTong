"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  MapPin, 
  Shield, 
  Sword, 
  Star, 
  Eye, 
  Lock, 
  Unlock,
  Zap,
  Heart,
  Coins
} from "lucide-react";

interface MapDetailsProps {
  map: {
    id: number;
    name: string;
    description: string;
    difficulty: string;
    unlocked: boolean;
    requiredLevel: number;
    playerLevel: number;
    monsters: Array<{
      id: number;
      name: string;
      level: number;
      hp: number;
      stats: Record<string, number>;
      experience: number;
      gold: number;
      drops: Array<{
        id: number;
        name: string;
        chance: number;
        quantity: number;
      }>;
    }>;
    rewards: {
      experience: number;
      gold: number;
      items: Array<{
        id: number;
        name: string;
        chance: number;
      }>;
    };
  };
  onStartExploration?: () => void;
  onClose?: () => void;
}

export function MapDetails({ map, onStartExploration, onClose }: MapDetailsProps) {
  const canAccess = map.unlocked && map.playerLevel >= map.requiredLevel;
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Phàm Nhân': return 'bg-green-500';
      case 'Tiên Nhân': return 'bg-yellow-500';
      case 'Thánh Nhân': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getMonsterDifficultyColor = (level: number) => {
    if (level <= 5) return 'bg-green-500';
    if (level <= 10) return 'bg-yellow-500';
    if (level <= 15) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <MapPin className="w-6 h-6 text-blue-500" />
            <span>{map.name}</span>
            <Badge className={getDifficultyColor(map.difficulty)}>
              {map.difficulty}
            </Badge>
          </CardTitle>
          {onClose && (
            <Button onClick={onClose} variant="outline" size="sm">
              ✕
            </Button>
          )}
        </div>
        <p className="text-slate-600">{map.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Access Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              {map.unlocked ? <Unlock className="w-4 h-4 mr-2 text-green-500" /> : <Lock className="w-4 h-4 mr-2 text-red-500" />}
              Yêu cầu truy cập
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Cấp độ yêu cầu:</span>
                <span className={map.playerLevel >= map.requiredLevel ? 'text-green-500' : 'text-red-500'}>
                  {map.requiredLevel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Cấp độ hiện tại:</span>
                <span>{map.playerLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Trạng thái:</span>
                <Badge className={canAccess ? 'bg-green-500' : 'bg-red-500'}>
                  {canAccess ? 'Có thể truy cập' : 'Không thể truy cập'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              Phần thưởng
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Kinh nghiệm:</span>
                <span className="text-blue-500">+{map.rewards.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Vàng:</span>
                <span className="text-yellow-500">+{map.rewards.gold}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Vật phẩm:</span>
                <span>{map.rewards.items.length} loại</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monsters */}
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <Sword className="w-4 h-4 mr-2 text-red-500" />
            Quái vật trong bản đồ
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {map.monsters.map((monster) => (
              <Card key={monster.id} className="bg-slate-800/50">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium">{monster.name}</h5>
                      <Badge className={getMonsterDifficultyColor(monster.level)}>
                        Cấp {monster.level}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Máu:</span>
                        <span>{monster.hp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Kinh nghiệm:</span>
                        <span className="text-blue-500">+{monster.experience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Vàng:</span>
                        <span className="text-yellow-500">+{monster.gold}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h6 className="text-xs font-medium text-slate-400 mb-1">Chỉ số</h6>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className="flex justify-between">
                          <span>Sức mạnh:</span>
                          <span>{monster.stats.strength}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nhanh nhẹn:</span>
                          <span>{monster.stats.agility}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Trí tuệ:</span>
                          <span>{monster.stats.intelligence}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Thể lực:</span>
                          <span>{monster.stats.vitality}</span>
                        </div>
                      </div>
                    </div>
                    
                    {monster.drops.length > 0 && (
                      <div>
                        <h6 className="text-xs font-medium text-slate-400 mb-1">Vật phẩm rơi</h6>
                        <div className="space-y-1">
                          {monster.drops.slice(0, 2).map((drop) => (
                            <div key={drop.id} className="flex justify-between text-xs">
                              <span className="truncate">{drop.name}</span>
                              <span className="text-slate-400">{drop.chance}%</span>
                            </div>
                          ))}
                          {monster.drops.length > 2 && (
                            <div className="text-xs text-slate-400">
                              +{monster.drops.length - 2} khác
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4 border-t border-slate-700">
          {canAccess ? (
            <>
              <Button onClick={onStartExploration} className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                Bắt đầu khám phá
              </Button>
              <Button onClick={onClose} variant="outline">
                <MapPin className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
            </>
          ) : (
            <div className="w-full text-center">
              <p className="text-slate-400 mb-2">
                {!map.unlocked 
                  ? 'Bản đồ này chưa được mở khóa'
                  : `Cần đạt cấp độ ${map.requiredLevel} để truy cập`
                }
              </p>
              <Button onClick={onClose} variant="outline">
                <MapPin className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
