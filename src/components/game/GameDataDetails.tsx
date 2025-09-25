"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Sword, 
  Star, 
  Shield, 
  Zap, 
  Heart, 
  Coins,
  Eye,
  X,
  BookOpen,
  Package
} from "lucide-react";

interface SkillData {
  id: number;
  name: string;
  description: string;
  damage: number;
  cooldown: number;
  cost: number;
  type: 'attack' | 'heal' | 'buff' | 'debuff';
  scaling?: Record<string, number>;
  effects?: string[];
  rarity: string;
}

interface ItemData {
  id: number;
  name: string;
  description: string;
  type: 'consumable' | 'weapon' | 'armor' | 'accessory';
  rarity: string;
  stats?: Record<string, number>;
  effects?: string[];
  value: number;
}

interface GameDataDetailsProps {
  skills: SkillData[];
  items: ItemData[];
  onClose: () => void;
  onUseSkill?: (skill: SkillData) => void;
  onUseItem?: (item: ItemData) => void;
}

export function GameDataDetails({ skills, items, onClose, onUseSkill, onUseItem }: GameDataDetailsProps) {
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

  const getRarityText = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'Thường';
      case 'uncommon': return 'Hiếm';
      case 'rare': return 'Quý';
      case 'epic': return 'Cực quý';
      case 'legendary': return 'Huyền thoại';
      default: return 'Thường';
    }
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <span>Thư viện kỹ năng & vật phẩm</span>
          </CardTitle>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="skills" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="skills" className="flex items-center space-x-2">
              <Sword className="w-4 h-4" />
              <span>Kỹ năng ({skills.length})</span>
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Vật phẩm ({items.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <Card key={skill.id} className="bg-slate-800/50">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-full ${getSkillTypeColor(skill.type)}`}>
                            {getSkillTypeIcon(skill.type)}
                          </div>
                          <h5 className="font-medium">{skill.name}</h5>
                        </div>
                        <Badge className={getRarityColor(skill.rarity)}>
                          {getRarityText(skill.rarity)}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-slate-400">{skill.description}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Sát thương:</span>
                          <span className="text-red-500 font-medium">{skill.damage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Chi phí:</span>
                          <span className="text-blue-500 font-medium">{skill.cost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Hồi chiêu:</span>
                          <span className="font-medium">{skill.cooldown} lượt</span>
                        </div>
                      </div>
                      
                      {skill.scaling && (
                        <div>
                          <h6 className="text-xs font-medium text-slate-400 mb-1">Hệ số tăng trưởng</h6>
                          <div className="space-y-1">
                            {Object.entries(skill.scaling).map(([stat, value]) => (
                              <div key={stat} className="flex justify-between text-xs">
                                <span>{stat}:</span>
                                <span>+{value}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {skill.effects && skill.effects.length > 0 && (
                        <div>
                          <h6 className="text-xs font-medium text-slate-400 mb-1">Hiệu ứng đặc biệt</h6>
                          <div className="space-y-1">
                            {skill.effects.map((effect, index) => (
                              <div key={index} className="text-xs text-slate-400 flex items-center">
                                <Star className="w-3 h-3 mr-1 text-yellow-500" />
                                {effect}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {onUseSkill && (
                        <Button 
                          onClick={() => onUseSkill(skill)} 
                          size="sm" 
                          className="w-full"
                        >
                          <Sword className="w-4 h-4 mr-2" />
                          Sử dụng
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="items" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <Card key={item.id} className="bg-slate-800/50">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-full ${getItemTypeColor(item.type)}`}>
                            <Star className="w-4 h-4" />
                          </div>
                          <h5 className="font-medium">{item.name}</h5>
                        </div>
                        <Badge className={getRarityColor(item.rarity)}>
                          {getRarityText(item.rarity)}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-slate-400">{item.description}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Loại:</span>
                          <span className="font-medium">{item.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Giá trị:</span>
                          <span className="text-yellow-500 font-medium">{item.value}</span>
                        </div>
                      </div>
                      
                      {item.stats && (
                        <div>
                          <h6 className="text-xs font-medium text-slate-400 mb-1">Chỉ số</h6>
                          <div className="space-y-1">
                            {Object.entries(item.stats).map(([stat, value]) => (
                              <div key={stat} className="flex justify-between text-xs">
                                <span>{stat}:</span>
                                <span>+{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {item.effects && item.effects.length > 0 && (
                        <div>
                          <h6 className="text-xs font-medium text-slate-400 mb-1">Hiệu ứng đặc biệt</h6>
                          <div className="space-y-1">
                            {item.effects.map((effect, index) => (
                              <div key={index} className="text-xs text-slate-400 flex items-center">
                                <Star className="w-3 h-3 mr-1 text-yellow-500" />
                                {effect}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {onUseItem && (
                        <Button 
                          onClick={() => onUseItem(item)} 
                          size="sm" 
                          className="w-full"
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Sử dụng
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
