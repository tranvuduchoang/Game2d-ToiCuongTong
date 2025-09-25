"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  BarChart3, 
  Trophy, 
  Sword, 
  Shield, 
  Zap, 
  Heart,
  Star,
  Clock,
  Target,
  X,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface CombatStatisticsProps {
  onClose: () => void;
  onReset?: () => void;
  statistics?: {
    // Overall Stats
    totalBattles: number;
    totalWins: number;
    totalLosses: number;
    winRate: number;
    
    // Combat Stats
    totalDamageDealt: number;
    totalDamageTaken: number;
    totalHealing: number;
    totalSkillsUsed: number;
    totalItemsUsed: number;
    
    // Time Stats
    totalCombatTime: number; // in seconds
    averageBattleTime: number; // in seconds
    longestBattle: number; // in seconds
    shortestBattle: number; // in seconds
    
    // Experience Stats
    totalExperienceGained: number;
    totalGoldEarned: number;
    totalItemsLooted: number;
    
    // Skill Stats
    mostUsedSkill: {
      name: string;
      count: number;
    };
    mostEffectiveSkill: {
      name: string;
      damage: number;
    };
    
    // Item Stats
    mostUsedItem: {
      name: string;
      count: number;
    };
    mostValuableItem: {
      name: string;
      value: number;
    };
    
    // Recent Battles
    recentBattles: Array<{
      id: string;
      opponent: string;
      result: 'win' | 'loss';
      duration: number;
      damageDealt: number;
      damageTaken: number;
      experience: number;
      gold: number;
      timestamp: string;
    }>;
  };
}

export function CombatStatistics({ onClose, onReset, statistics }: CombatStatisticsProps) {
  const defaultStats = {
    totalBattles: 0,
    totalWins: 0,
    totalLosses: 0,
    winRate: 0,
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    totalHealing: 0,
    totalSkillsUsed: 0,
    totalItemsUsed: 0,
    totalCombatTime: 0,
    averageBattleTime: 0,
    longestBattle: 0,
    shortestBattle: 0,
    totalExperienceGained: 0,
    totalGoldEarned: 0,
    totalItemsLooted: 0,
    mostUsedSkill: { name: 'Chưa có', count: 0 },
    mostEffectiveSkill: { name: 'Chưa có', damage: 0 },
    mostUsedItem: { name: 'Chưa có', count: 0 },
    mostValuableItem: { name: 'Chưa có', value: 0 },
    recentBattles: []
  };

  const stats = statistics || defaultStats;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getWinRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-500';
    if (rate >= 60) return 'text-yellow-500';
    if (rate >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            <span>Thống kê chiến đấu</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {onReset && (
              <Button onClick={onReset} variant="outline" size="sm">
                Đặt lại
              </Button>
            )}
            <Button onClick={onClose} variant="outline" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Stats */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Tổng quan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-500">{stats.totalBattles}</div>
                <div className="text-sm text-slate-400">Tổng trận chiến</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">{stats.totalWins}</div>
                <div className="text-sm text-slate-400">Chiến thắng</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-500">{stats.totalLosses}</div>
                <div className="text-sm text-slate-400">Thất bại</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50">
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${getWinRateColor(stats.winRate)}`}>
                  {stats.winRate.toFixed(1)}%
                </div>
                <div className="text-sm text-slate-400">Tỷ lệ thắng</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Combat Stats */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Sword className="w-5 h-5 mr-2" />
            Chiến đấu
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Sát thương gây ra</span>
                  <Sword className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-xl font-bold text-red-500">
                  {formatNumber(stats.totalDamageDealt)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Sát thương nhận</span>
                  <Shield className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-xl font-bold text-orange-500">
                  {formatNumber(stats.totalDamageTaken)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Hồi máu</span>
                  <Heart className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-xl font-bold text-green-500">
                  {formatNumber(stats.totalHealing)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Kỹ năng sử dụng</span>
                  <Zap className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-xl font-bold text-blue-500">
                  {formatNumber(stats.totalSkillsUsed)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Time Stats */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Thời gian
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50">
              <CardContent className="p-4">
                <div className="text-sm text-slate-400 mb-2">Tổng thời gian chiến đấu</div>
                <div className="text-xl font-bold text-blue-500">
                  {formatTime(stats.totalCombatTime)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50">
              <CardContent className="p-4">
                <div className="text-sm text-slate-400 mb-2">Thời gian trung bình</div>
                <div className="text-xl font-bold text-green-500">
                  {formatTime(stats.averageBattleTime)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50">
              <CardContent className="p-4">
                <div className="text-sm text-slate-400 mb-2">Trận dài nhất</div>
                <div className="text-xl font-bold text-orange-500">
                  {formatTime(stats.longestBattle)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50">
              <CardContent className="p-4">
                <div className="text-sm text-slate-400 mb-2">Trận ngắn nhất</div>
                <div className="text-xl font-bold text-purple-500">
                  {formatTime(stats.shortestBattle)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rewards Stats */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Phần thưởng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-800/50">
              <CardContent className="p-4">
                <div className="text-sm text-slate-400 mb-2">Kinh nghiệm nhận được</div>
                <div className="text-xl font-bold text-blue-500">
                  {formatNumber(stats.totalExperienceGained)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50">
              <CardContent className="p-4">
                <div className="text-sm text-slate-400 mb-2">Vàng kiếm được</div>
                <div className="text-xl font-bold text-yellow-500">
                  {formatNumber(stats.totalGoldEarned)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50">
              <CardContent className="p-4">
                <div className="text-sm text-slate-400 mb-2">Vật phẩm nhặt được</div>
                <div className="text-xl font-bold text-green-500">
                  {formatNumber(stats.totalItemsLooted)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Most Used Stats */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Thống kê sử dụng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800/50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Kỹ năng sử dụng nhiều nhất</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tên:</span>
                    <span className="font-medium">{stats.mostUsedSkill.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Số lần:</span>
                    <span className="text-blue-500 font-medium">{stats.mostUsedSkill.count}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Kỹ năng hiệu quả nhất</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tên:</span>
                    <span className="font-medium">{stats.mostEffectiveSkill.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sát thương:</span>
                    <span className="text-red-500 font-medium">{formatNumber(stats.mostEffectiveSkill.damage)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Battles */}
        {stats.recentBattles.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Trận chiến gần đây
            </h3>
            <div className="space-y-2">
              {stats.recentBattles.slice(0, 5).map((battle) => (
                <Card key={battle.id} className="bg-slate-800/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge className={battle.result === 'win' ? 'bg-green-500' : 'bg-red-500'}>
                          {battle.result === 'win' ? 'Thắng' : 'Thua'}
                        </Badge>
                        <span className="font-medium">{battle.opponent}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <span>{formatTime(battle.duration)}</span>
                        <span>{formatNumber(battle.damageDealt)} dmg</span>
                        <span>+{battle.experience} XP</span>
                        <span>+{battle.gold} gold</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

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
