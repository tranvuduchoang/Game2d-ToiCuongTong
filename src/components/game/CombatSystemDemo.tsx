"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Sword, 
  Shield, 
  Zap, 
  Heart, 
  Star, 
  Play,
  Settings,
  HelpCircle,
  BarChart3,
  ScrollText,
  Bug,
  Eye,
  EyeOff
} from 'lucide-react';

interface CombatSystemDemoProps {
  onStartCombat?: () => void;
  onShowSettings?: () => void;
  onShowHelp?: () => void;
  onShowStats?: () => void;
  onShowLog?: () => void;
  onShowDebug?: () => void;
}

export function CombatSystemDemo({ 
  onStartCombat, 
  onShowSettings, 
  onShowHelp, 
  onShowStats, 
  onShowLog, 
  onShowDebug 
}: CombatSystemDemoProps) {
  const [showFeatures, setShowFeatures] = useState(false);

  const features = [
    {
      title: "Hệ thống chiến đấu theo lượt",
      description: "Chiến đấu theo lượt với kỹ năng, vật phẩm và chiến thuật",
      icon: <Sword className="w-6 h-6 text-red-500" />,
      status: "Hoàn thành"
    },
    {
      title: "Quản lý kỹ năng và vật phẩm",
      description: "Sử dụng kỹ năng với hồi chiêu và vật phẩm với số lượng hạn chế",
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      status: "Hoàn thành"
    },
    {
      title: "Hệ thống thông báo",
      description: "Thông báo real-time về sát thương, hồi máu và sự kiện",
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      status: "Hoàn thành"
    },
    {
      title: "Giao diện chi tiết",
      description: "Xem thông tin chi tiết về kỹ năng, vật phẩm và quái vật",
      icon: <Eye className="w-6 h-6 text-green-500" />,
      status: "Hoàn thành"
    },
    {
      title: "Hệ thống cài đặt",
      description: "Tùy chỉnh âm thanh, hiển thị và chiến đấu",
      icon: <Settings className="w-6 h-6 text-purple-500" />,
      status: "Hoàn thành"
    },
    {
      title: "Thống kê và nhật ký",
      description: "Theo dõi thống kê chiến đấu và nhật ký chi tiết",
      icon: <BarChart3 className="w-6 h-6 text-orange-500" />,
      status: "Hoàn thành"
    },
    {
      title: "Hướng dẫn và phím tắt",
      description: "Hướng dẫn chi tiết và danh sách phím tắt",
      icon: <HelpCircle className="w-6 h-6 text-cyan-500" />,
      status: "Hoàn thành"
    },
    {
      title: "Debug và kiểm thử",
      description: "Công cụ debug để kiểm thử và phát triển",
      icon: <Bug className="w-6 h-6 text-red-500" />,
      status: "Hoàn thành"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành': return 'bg-green-500';
      case 'Đang phát triển': return 'bg-yellow-500';
      case 'Chưa bắt đầu': return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Sword className="w-8 h-8 text-red-500" />
            <span>Combat System Demo</span>
            <Badge className="bg-green-500">Hoàn thành</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-4">
            Hệ thống chiến đấu hoàn chỉnh với đầy đủ tính năng cho game Tối Cường Tông.
            Bao gồm chiến đấu theo lượt, quản lý kỹ năng, vật phẩm, thông báo và nhiều tính năng khác.
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={onStartCombat} className="flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Bắt đầu chiến đấu</span>
            </Button>
            
            <Button onClick={onShowSettings} variant="outline" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Cài đặt</span>
            </Button>
            
            <Button onClick={onShowHelp} variant="outline" className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4" />
              <span>Hướng dẫn</span>
            </Button>
            
            <Button onClick={onShowStats} variant="outline" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Thống kê</span>
            </Button>
            
            <Button onClick={onShowLog} variant="outline" className="flex items-center space-x-2">
              <ScrollText className="w-4 h-4" />
              <span>Nhật ký</span>
            </Button>
            
            <Button onClick={onShowDebug} variant="outline" className="flex items-center space-x-2">
              <Bug className="w-4 h-4" />
              <span>Debug</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Tính năng đã triển khai</span>
            </CardTitle>
            <Button
              onClick={() => setShowFeatures(!showFeatures)}
              variant="outline"
              size="sm"
            >
              {showFeatures ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showFeatures ? 'Ẩn' : 'Hiện'} chi tiết
            </Button>
          </div>
        </CardHeader>
        
        {showFeatures && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-lg mb-2">{feature.title}</h4>
                      <p className="text-sm text-slate-400 mb-3">{feature.description}</p>
                      <Badge className={getStatusColor(feature.status)}>
                        {feature.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">8</div>
            <div className="text-sm text-slate-400">Tính năng hoàn thành</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">15+</div>
            <div className="text-sm text-slate-400">Component UI</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">100%</div>
            <div className="text-sm text-slate-400">TypeScript</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">0</div>
            <div className="text-sm text-slate-400">Lỗi linting</div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5" />
            <span>Hướng dẫn sử dụng</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">1</div>
              <div>
                <h4 className="font-medium">Bắt đầu chiến đấu</h4>
                <p className="text-sm text-slate-400">Nhấn "Bắt đầu chiến đấu" để bắt đầu trận chiến thử nghiệm</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">2</div>
              <div>
                <h4 className="font-medium">Sử dụng kỹ năng và vật phẩm</h4>
                <p className="text-sm text-slate-400">Click vào kỹ năng hoặc vật phẩm để sử dụng trong chiến đấu</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">3</div>
              <div>
                <h4 className="font-medium">Khám phá các tính năng</h4>
                <p className="text-sm text-slate-400">Sử dụng các nút trên thanh công cụ để khám phá cài đặt, thống kê, nhật ký và debug</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">4</div>
              <div>
                <h4 className="font-medium">Tùy chỉnh giao diện</h4>
                <p className="text-sm text-slate-400">Sử dụng cài đặt để tùy chỉnh âm thanh, hiển thị và các tùy chọn khác</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
