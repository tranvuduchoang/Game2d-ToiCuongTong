import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useState } from 'react';
import { 
  Users, 
  Star, 
  Brain, 
  Heart, 
  Mountain,
  Gift,
  BookOpen,
  Sword,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

interface DiscipleStats {
  str: number;
  hp: number;
  def: number;
  mp: number;
  agi: number;
  acc: number;
  luk: number;
}

interface Disciple {
  id: string;
  name: string;
  originalName?: string;
  isUnique: boolean;
  cultivation: string;
  cultivationLevel: number;
  talent: number; // 1-10
  intelligence: number; // 1-10
  aptitude: number; // 1-10
  loyalty: number; // 0-100
  task: string;
  taskProgress: number;
  stats: DiscipleStats;
  techniques: string[];
  profession?: string;
  professionLevel?: number;
  joinDate: string;
  status: 'training' | 'guarding' | 'researching' | 'gathering' | 'idle';
}

export function DiscipleDetails() {
  const disciples: Disciple[] = [
    {
      id: '1',
      name: 'Lý Thanh Vũ',
      originalName: 'Tán Tu 1',
      isUnique: false,
      cultivation: 'Luyện Khí',
      cultivationLevel: 5,
      talent: 8,
      intelligence: 6,
      aptitude: 7,
      loyalty: 85,
      task: 'Tu luyện tại Tháp Thí Luyện',
      taskProgress: 65,
      stats: {
        str: 95,
        hp: 650,
        def: 45,
        mp: 280,
        agi: 58,
        acc: 72,
        luk: 23
      },
      techniques: ['Cơ Bản Kiếm Pháp', 'Liệt Hỏa Chưởng'],
      profession: 'Luyện Khí Sư',
      professionLevel: 2,
      joinDate: '2024-01-15',
      status: 'training'
    },
    {
      id: '2',
      name: 'Trần Minh Nguyệt',
      originalName: 'Tán Tu 2',
      isUnique: false,
      cultivation: 'Luyện Khí',
      cultivationLevel: 3,
      talent: 6,
      intelligence: 9,
      aptitude: 8,
      loyalty: 75,
      task: 'Luyện đan tại Đan Các',
      taskProgress: 40,
      stats: {
        str: 65,
        hp: 480,
        def: 38,
        mp: 350,
        agi: 45,
        acc: 68,
        luk: 41
      },
      techniques: ['Kim Cang Bất Hoại'],
      profession: 'Luyện Đan Sư',
      professionLevel: 3,
      joinDate: '2024-02-08',
      status: 'researching'
    },
    {
      id: '3',
      name: 'Kiếm Tâm',
      isUnique: true,
      cultivation: 'Luyện Khí',
      cultivationLevel: 7,
      talent: 10,
      intelligence: 8,
      aptitude: 9,
      loyalty: 95,
      task: 'Trấn thủ tông môn',
      taskProgress: 100,
      stats: {
        str: 125,
        hp: 780,
        def: 65,
        mp: 420,
        agi: 78,
        acc: 88,
        luk: 35
      },
      techniques: ['Cơ Bản Kiếm Pháp', 'Thiên Kiếm Quyết', 'Vô Ảnh Thần Kiếm'],
      joinDate: '2024-01-20',
      status: 'guarding'
    }
  ];

  const [selectedDisciple, setSelectedDisciple] = useState<Disciple>(disciples[0]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'training': return 'bg-blue-100 text-blue-800';
      case 'guarding': return 'bg-green-100 text-green-800';
      case 'researching': return 'bg-purple-100 text-purple-800';
      case 'gathering': return 'bg-orange-100 text-orange-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'training': return 'Tu Luyện';
      case 'guarding': return 'Trấn Thủ';
      case 'researching': return 'Nghiên Cứu';
      case 'gathering': return 'Thu Thập';
      default: return 'Rảnh Rỗi';
    }
  };

  const getLoyaltyColor = (loyalty: number) => {
    if (loyalty >= 80) return 'text-green-600';
    if (loyalty >= 60) return 'text-yellow-600';
    if (loyalty >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl">Quản Lý Đệ Tử</h2>
        <Button>
          <Users className="w-4 h-4 mr-2" />
          Chiêu Mộ
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Danh sách đệ tử */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Danh Sách Đệ Tử ({disciples.length}/20)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {disciples.map((disciple) => (
              <div
                key={disciple.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedDisciple.id === disciple.id 
                    ? 'border-blue-300 bg-blue-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setSelectedDisciple(disciple)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {disciple.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm">{disciple.name}</div>
                      {disciple.isUnique && (
                        <Badge className="text-xs bg-gold-100 text-gold-800">Độc Nhất</Badge>
                      )}
                    </div>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(disciple.status)}`}>
                    {getStatusName(disciple.status)}
                  </Badge>
                </div>
                
                <div className="text-xs text-slate-600">
                  {disciple.cultivation} Tầng {disciple.cultivationLevel}
                </div>
                
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(10)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-2 h-2 ${
                        i < disciple.talent 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Chi tiết đệ tử */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>
                      {selectedDisciple.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{selectedDisciple.name}</CardTitle>
                    {selectedDisciple.originalName && (
                      <div className="text-sm text-slate-600">
                        (Tên cũ: {selectedDisciple.originalName})
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">
                        {selectedDisciple.cultivation} Tầng {selectedDisciple.cultivationLevel}
                      </Badge>
                      {selectedDisciple.isUnique && (
                        <Badge className="bg-amber-100 text-amber-800">
                          Đệ Tử Độc Nhất
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Đổi Tên
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="stats" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="stats">Thuộc Tính</TabsTrigger>
                  <TabsTrigger value="techniques">Công Pháp</TabsTrigger>
                  <TabsTrigger value="tasks">Nhiệm Vụ</TabsTrigger>
                  <TabsTrigger value="loyalty">Lòng Trung</TabsTrigger>
                </TabsList>

                <TabsContent value="stats" className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Tư chất cơ bản */}
                    <div>
                      <h4 className="text-sm mb-3">Tư Chất Cơ Bản</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Tư Chất</span>
                            <span>{selectedDisciple.talent}/10</span>
                          </div>
                          <Progress value={(selectedDisciple.talent / 10) * 100} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Trí Lực</span>
                            <span>{selectedDisciple.intelligence}/10</span>
                          </div>
                          <Progress value={(selectedDisciple.intelligence / 10) * 100} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Căn Cốt</span>
                            <span>{selectedDisciple.aptitude}/10</span>
                          </div>
                          <Progress value={(selectedDisciple.aptitude / 10) * 100} className="h-2" />
                        </div>
                      </div>
                    </div>

                    {/* Thuộc tính chiến đấu */}
                    <div>
                      <h4 className="text-sm mb-3">Thuộc Tính Chiến Đấu</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span>STR:</span>
                          <span>{selectedDisciple.stats.str}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>HP:</span>
                          <span>{selectedDisciple.stats.hp}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>DEF:</span>
                          <span>{selectedDisciple.stats.def}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>MP:</span>
                          <span>{selectedDisciple.stats.mp}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>AGI:</span>
                          <span>{selectedDisciple.stats.agi}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ACC:</span>
                          <span>{selectedDisciple.stats.acc}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>LUK:</span>
                          <span>{selectedDisciple.stats.luk}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedDisciple.profession && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                      <h4 className="text-sm mb-2">Nghề Phụ</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{selectedDisciple.profession}</span>
                        <Badge variant="outline">
                          Cấp {selectedDisciple.professionLevel}
                        </Badge>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="techniques" className="space-y-4">
                  <div>
                    <h4 className="text-sm mb-3">Công Pháp Đã Học ({selectedDisciple.techniques.length})</h4>
                    <div className="space-y-2">
                      {selectedDisciple.techniques.map((technique, index) => (
                        <div key={index} className="p-2 bg-slate-50 rounded flex items-center justify-between">
                          <span className="text-sm">{technique}</span>
                          <Badge variant="outline" className="text-xs">Thành Thạo</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Dạy Công Pháp Mới
                  </Button>
                </TabsContent>

                <TabsContent value="tasks" className="space-y-4">
                  <div>
                    <h4 className="text-sm mb-3">Nhiệm Vụ Hiện Tại</h4>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">{selectedDisciple.task}</span>
                        <Badge className={getStatusColor(selectedDisciple.status)}>
                          {getStatusName(selectedDisciple.status)}
                        </Badge>
                      </div>
                      <Progress value={selectedDisciple.taskProgress} className="h-2 mb-1" />
                      <div className="text-xs text-slate-600">{selectedDisciple.taskProgress}% hoàn thành</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <Mountain className="w-4 h-4 mr-1" />
                      Tu Luyện
                    </Button>
                    <Button variant="outline" size="sm">
                      <Sword className="w-4 h-4 mr-1" />
                      Trấn Thủ
                    </Button>
                    <Button variant="outline" size="sm">
                      <BookOpen className="w-4 h-4 mr-1" />
                      Nghiên Cứu
                    </Button>
                    <Button variant="outline" size="sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Thu Thập
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="loyalty" className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm">Lòng Trung Thành</h4>
                      <span className={`text-sm ${getLoyaltyColor(selectedDisciple.loyalty)}`}>
                        {selectedDisciple.loyalty}/100
                      </span>
                    </div>
                    <Progress value={selectedDisciple.loyalty} className="h-3" />
                    
                    {selectedDisciple.loyalty < 50 && (
                      <div className="flex items-center gap-2 p-2 bg-red-50 rounded text-xs text-red-700">
                        <AlertTriangle className="w-4 h-4" />
                        Cảnh báo: Lòng trung thành thấp, đệ tử có thể rời khỏi tông môn!
                      </div>
                    )}
                  </div>

                  <div>
                    <h5 className="text-sm mb-2">Tặng Quà Tăng Lòng Trung</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        <Gift className="w-4 h-4 mr-1" />
                        Linh Thạch (+5)
                      </Button>
                      <Button variant="outline" size="sm">
                        <Sword className="w-4 h-4 mr-1" />
                        Trang Bị (+10)
                      </Button>
                      <Button variant="outline" size="sm">
                        <BookOpen className="w-4 h-4 mr-1" />
                        Công Pháp (+15)
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4 mr-1" />
                        Đan Dược (+8)
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 p-3 bg-slate-50 rounded">
                    <div className="mb-1">Gia nhập: {new Date(selectedDisciple.joinDate).toLocaleDateString('vi-VN')}</div>
                    <div>Thời gian trong tông: {Math.floor((Date.now() - new Date(selectedDisciple.joinDate).getTime()) / (1000 * 60 * 60 * 24))} ngày</div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}