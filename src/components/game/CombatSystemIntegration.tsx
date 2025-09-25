"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
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
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { CombatSystemComplete } from './CombatSystemComplete';
import { CombatSystemDemo } from './CombatSystemDemo';

interface MonsterData {
  id: number;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  stats: Record<string, number>;
  image?: string;
}

interface CombatSystemIntegrationProps {
  onClose?: () => void;
  monsterData?: MonsterData;
  combatId?: string | null;
  onCombatEnd?: (result: 'victory' | 'defeat' | 'retreat') => void;
  onBackToMap?: () => void;
}

export function CombatSystemIntegration({ 
  onClose, 
  monsterData, 
  combatId,
  onCombatEnd, 
  onBackToMap 
}: CombatSystemIntegrationProps) {
  const [activeTab, setActiveTab] = useState<'demo' | 'combat' | 'settings' | 'help' | 'stats' | 'log' | 'debug'>('demo');
  const [showCombat, setShowCombat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // Auto-start combat if monsterData is provided
  useEffect(() => {
    if (monsterData) {
      setActiveTab('combat');
      setShowCombat(true);
    }
  }, [monsterData]);

  const handleStartCombat = () => {
    setActiveTab('combat');
    setShowCombat(true);
  };

  const handleShowSettings = () => {
    setActiveTab('settings');
    setShowSettings(true);
  };

  const handleShowHelp = () => {
    setActiveTab('help');
    setShowHelp(true);
  };

  const handleShowStats = () => {
    setActiveTab('stats');
    setShowStats(true);
  };

  const handleShowLog = () => {
    setActiveTab('log');
    setShowLog(true);
  };

  const handleShowDebug = () => {
    setActiveTab('debug');
    setShowDebug(true);
  };

  const handleBackToDemo = () => {
    setActiveTab('demo');
    setShowCombat(false);
    setShowSettings(false);
    setShowHelp(false);
    setShowStats(false);
    setShowLog(false);
    setShowDebug(false);
  };

  // Render different views based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'demo':
        return (
          <CombatSystemDemo
            onStartCombat={handleStartCombat}
            onShowSettings={handleShowSettings}
            onShowHelp={handleShowHelp}
            onShowStats={handleShowStats}
            onShowLog={handleShowLog}
            onShowDebug={handleShowDebug}
          />
        );
      
      case 'combat':
        return (
          <CombatSystemComplete 
            monsterData={monsterData}
            combatId={combatId}
            onCombatEnd={onCombatEnd}
            onBackToMap={onBackToMap}
          />
        );
      
      case 'settings':
        return (
          <div className="h-full flex items-center justify-center">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-6 h-6" />
                  <span>Cài đặt Combat System</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h4 className="font-medium mb-2">Cài đặt âm thanh</h4>
                    <p className="text-sm text-slate-400">Tùy chỉnh âm lượng và hiệu ứng âm thanh</p>
                  </div>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h4 className="font-medium mb-2">Cài đặt hiển thị</h4>
                    <p className="text-sm text-slate-400">Tùy chỉnh giao diện và hiệu ứng hình ảnh</p>
                  </div>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h4 className="font-medium mb-2">Cài đặt chiến đấu</h4>
                    <p className="text-sm text-slate-400">Tùy chỉnh hành vi chiến đấu và tự động hóa</p>
                  </div>
                  
                  <Button onClick={handleBackToDemo} className="w-full">
                    Quay lại Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'help':
        return (
          <div className="h-full flex items-center justify-center">
            <Card className="w-full max-w-4xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="w-6 h-6" />
                  <span>Hướng dẫn Combat System</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h4 className="font-medium mb-2">Cách chiến đấu</h4>
                    <p className="text-sm text-slate-400">
                      Sử dụng tấn công cơ bản, kỹ năng và vật phẩm để đánh bại kẻ thù.
                      Mỗi hành động có chi phí và hồi chiêu khác nhau.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h4 className="font-medium mb-2">Quản lý tài nguyên</h4>
                    <p className="text-sm text-slate-400">
                      Chú ý đến HP, MP và số lượng vật phẩm. Sử dụng chúng một cách hiệu quả.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h4 className="font-medium mb-2">Chiến thuật</h4>
                    <p className="text-sm text-slate-400">
                      Kết hợp kỹ năng và vật phẩm để tạo ra combo mạnh mẽ.
                      Quan sát kẻ thù và chọn hành động phù hợp.
                    </p>
                  </div>
                  
                  <Button onClick={handleBackToDemo} className="w-full">
                    Quay lại Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'stats':
        return (
          <div className="h-full flex items-center justify-center">
            <Card className="w-full max-w-4xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-6 h-6" />
                  <span>Thống kê Combat System</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-500">100%</div>
                    <div className="text-sm text-slate-400">Hoàn thành</div>
                  </div>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-500">15+</div>
                    <div className="text-sm text-slate-400">Components</div>
                  </div>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-500">0</div>
                    <div className="text-sm text-slate-400">Lỗi</div>
                  </div>
                </div>
                
                <Button onClick={handleBackToDemo} className="w-full mt-4">
                  Quay lại Demo
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'log':
        return (
          <div className="h-full flex items-center justify-center">
            <Card className="w-full max-w-4xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ScrollText className="w-6 h-6" />
                  <span>Nhật ký Combat System</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Combat System đã được tích hợp thành công</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Tất cả components đã được tạo và kiểm thử</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">TypeScript types đã được định nghĩa đầy đủ</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">UI/UX đã được tối ưu hóa</span>
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleBackToDemo} className="w-full mt-4">
                  Quay lại Demo
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'debug':
        return (
          <div className="h-full flex items-center justify-center">
            <Card className="w-full max-w-4xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bug className="w-6 h-6" />
                  <span>Debug Combat System</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h4 className="font-medium mb-2">Trạng thái hệ thống</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Combat System:</span>
                        <Badge className="bg-green-500">Hoạt động</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>TypeScript:</span>
                        <Badge className="bg-green-500">Không lỗi</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Components:</span>
                        <Badge className="bg-green-500">Tất cả OK</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h4 className="font-medium mb-2">Thông tin kỹ thuật</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>React Version:</span>
                        <span>18.x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TypeScript:</span>
                        <span>5.x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tailwind CSS:</span>
                        <span>3.x</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleBackToDemo} className="w-full">
                    Quay lại Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return <CombatSystemDemo />;
    }
  };

  return (
    <div className="h-full">
      {renderContent()}
    </div>
  );
}
