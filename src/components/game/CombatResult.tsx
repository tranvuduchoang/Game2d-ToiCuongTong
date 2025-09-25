"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Trophy, 
  Sword, 
  Star, 
  Coins, 
  Heart, 
  Zap, 
  Shield,
  ArrowLeft,
  RotateCcw
} from "lucide-react";

interface CombatResultProps {
  result: {
    victory: boolean;
    experience: number;
    gold: number;
    items: Array<{
      id: number;
      name: string;
      quantity: number;
      rarity: string;
    }>;
    damageDealt: number;
    damageTaken: number;
    turns: number;
    skillsUsed: number;
  };
  onContinue?: () => void;
  onRetry?: () => void;
  onBackToMap?: () => void;
}

export function CombatResult({ result, onContinue, onRetry, onBackToMap }: CombatResultProps) {
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
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-center space-x-3">
          {result.victory ? (
            <>
              <Trophy className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl text-green-500">Chiến Thắng!</span>
            </>
          ) : (
            <>
              <Sword className="w-8 h-8 text-red-500" />
              <span className="text-2xl text-red-500">Thất Bại!</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Combat Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium flex items-center">
              <Sword className="w-4 h-4 mr-2" />
              Thống kê chiến đấu
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Sát thương gây ra:</span>
                <span className="font-medium text-red-500">{result.damageDealt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Sát thương nhận:</span>
                <span className="font-medium text-orange-500">{result.damageTaken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Số lượt:</span>
                <span className="font-medium">{result.turns}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Kỹ năng sử dụng:</span>
                <span className="font-medium">{result.skillsUsed}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Phần thưởng
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Kinh nghiệm:</span>
                <span className="font-medium text-blue-500">+{result.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Vàng:</span>
                <span className="font-medium text-yellow-500">+{result.gold}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Vật phẩm:</span>
                <span className="font-medium">{result.items.length} loại</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Dropped */}
        {result.items.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Vật phẩm nhận được
            </h4>
            <div className="space-y-2">
              {result.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getRarityColor(item.rarity)}`} />
                    <span className="font-medium">{item.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {getRarityText(item.rarity)}
                    </Badge>
                  </div>
                  <span className="text-sm text-slate-400">x{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Victory/Defeat Message */}
        <div className="text-center p-4 bg-slate-800/30 rounded-lg">
          {result.victory ? (
            <div>
              <p className="text-lg font-medium text-green-500 mb-2">
                Chúc mừng! Bạn đã đánh bại kẻ thù!
              </p>
              <p className="text-sm text-slate-400">
                Bạn đã nhận được {result.experience} kinh nghiệm và {result.gold} vàng.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-red-500 mb-2">
                Thất bại! Hãy cố gắng hơn nữa!
              </p>
              <p className="text-sm text-slate-400">
                Bạn vẫn nhận được một ít kinh nghiệm từ trận chiến.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4 border-t border-slate-700">
          {result.victory ? (
            <>
              <Button onClick={onContinue} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Tiếp tục khám phá
              </Button>
              <Button onClick={onRetry} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Chiến đấu lại
              </Button>
            </>
          ) : (
            <>
              <Button onClick={onRetry} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Thử lại
              </Button>
              <Button onClick={onBackToMap} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại bản đồ
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
