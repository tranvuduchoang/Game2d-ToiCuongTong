"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  HelpCircle, 
  Sword, 
  Shield, 
  Zap, 
  Heart, 
  Star,
  X,
  BookOpen,
  Lightbulb,
  Target,
  Clock
} from "lucide-react";

interface CombatHelpProps {
  onClose: () => void;
  onStartTutorial?: () => void;
}

export function CombatHelp({ onClose, onStartTutorial }: CombatHelpProps) {
  const combatBasics = [
    {
      title: "Tấn công cơ bản",
      description: "Sử dụng tấn công cơ bản để gây sát thương cho kẻ thù. Sát thương dựa trên sức mạnh của bạn.",
      tips: [
        "Tấn công cơ bản không tốn năng lượng",
        "Sát thương = Sức mạnh + (Sức mạnh × 0.1)",
        "Có thể bị né tránh hoặc chặn bởi kẻ thù"
      ]
    },
    {
      title: "Sử dụng kỹ năng",
      description: "Kỹ năng mạnh hơn tấn công cơ bản nhưng có hồi chiêu và tốn năng lượng.",
      tips: [
        "Mỗi kỹ năng có hồi chiêu riêng",
        "Sử dụng kỹ năng đúng lúc để tối đa hóa hiệu quả",
        "Kết hợp nhiều kỹ năng để tạo combo mạnh"
      ]
    },
    {
      title: "Sử dụng vật phẩm",
      description: "Vật phẩm có thể hồi máu, tăng sức mạnh hoặc cung cấp hiệu ứng đặc biệt.",
      tips: [
        "Vật phẩm có số lượng hạn chế",
        "Sử dụng vật phẩm khi cần thiết",
        "Một số vật phẩm có hiệu ứng kéo dài"
      ]
    },
    {
      title: "Phòng thủ",
      description: "Phòng thủ giảm sát thương nhận vào và có thể phản công.",
      tips: [
        "Phòng thủ giảm 50% sát thương nhận vào",
        "Có thể phản công khi phòng thủ thành công",
        "Phòng thủ không tốn năng lượng"
      ]
    }
  ];

  const combatTips = [
    {
      category: "Chiến thuật cơ bản",
      icon: <Target className="w-5 h-5" />,
      tips: [
        "Quan sát chỉ số của kẻ thù trước khi tấn công",
        "Sử dụng kỹ năng tấn công khi kẻ thù yếu",
        "Dùng kỹ năng hồi máu khi HP thấp",
        "Tận dụng kỹ năng tăng cường để tăng sức mạnh"
      ]
    },
    {
      category: "Quản lý tài nguyên",
      icon: <Star className="w-5 h-5" />,
      tips: [
        "Tiết kiệm năng lượng cho kỹ năng quan trọng",
        "Sử dụng vật phẩm khi cần thiết",
        "Không lãng phí kỹ năng mạnh vào kẻ thù yếu",
        "Chờ hồi chiêu trước khi sử dụng kỹ năng"
      ]
    },
    {
      category: "Timing và combo",
      icon: <Clock className="w-5 h-5" />,
      tips: [
        "Kết hợp kỹ năng tấn công với kỹ năng tăng cường",
        "Sử dụng kỹ năng gây hại trước khi tấn công",
        "Chờ kẻ thù sử dụng kỹ năng mạnh rồi phản công",
        "Tận dụng thời gian hồi chiêu để lên kế hoạch"
      ]
    }
  ];

  const commonMistakes = [
    {
      mistake: "Sử dụng kỹ năng mạnh ngay từ đầu",
      solution: "Hãy quan sát kẻ thù trước, sử dụng kỹ năng cơ bản để thăm dò",
      severity: "warning"
    },
    {
      mistake: "Không chú ý đến hồi chiêu",
      solution: "Luôn kiểm tra thời gian hồi chiêu trước khi sử dụng kỹ năng",
      severity: "error"
    },
    {
      mistake: "Lãng phí vật phẩm",
      solution: "Chỉ sử dụng vật phẩm khi thực sự cần thiết, không dùng khi HP còn cao",
      severity: "warning"
    },
    {
      mistake: "Không phòng thủ khi cần",
      solution: "Phòng thủ khi HP thấp hoặc khi kẻ thù sử dụng kỹ năng mạnh",
      severity: "error"
    },
    {
      mistake: "Tấn công liên tục không nghỉ",
      solution: "Hãy dừng lại để quan sát tình hình và lên kế hoạch",
      severity: "info"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <HelpCircle className="w-6 h-6 text-blue-500" />
            <span>Trợ giúp chiến đấu</span>
          </CardTitle>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basics" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Cơ bản</span>
            </TabsTrigger>
            <TabsTrigger value="tips" className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4" />
              <span>Mẹo hay</span>
            </TabsTrigger>
            <TabsTrigger value="mistakes" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Lỗi thường gặp</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center space-x-2">
              <Sword className="w-4 h-4" />
              <span>Nâng cao</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Kiến thức cơ bản về chiến đấu</h3>
              <div className="space-y-4">
                {combatBasics.map((item, index) => (
                  <Card key={index} className="bg-slate-800/50">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-lg mb-2">{item.title}</h4>
                      <p className="text-slate-400 mb-3">{item.description}</p>
                      <div className="space-y-1">
                        {item.tips.map((tip, tipIndex) => (
                          <div key={tipIndex} className="flex items-start space-x-2 text-sm">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span className="text-slate-300">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tips" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Mẹo chiến đấu hiệu quả</h3>
              <div className="space-y-4">
                {combatTips.map((category, index) => (
                  <Card key={index} className="bg-slate-800/50">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-lg mb-3 flex items-center">
                        {category.icon}
                        <span className="ml-2">{category.category}</span>
                      </h4>
                      <div className="space-y-2">
                        {category.tips.map((tip, tipIndex) => (
                          <div key={tipIndex} className="flex items-start space-x-2 text-sm">
                            <span className="text-blue-500 mt-1">•</span>
                            <span className="text-slate-300">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mistakes" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Lỗi thường gặp và cách khắc phục</h3>
              <div className="space-y-4">
                {commonMistakes.map((item, index) => (
                  <Card key={index} className="bg-slate-800/50">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Badge className={getSeverityColor(item.severity)}>
                          {item.severity === 'error' ? 'Nghiêm trọng' : 
                           item.severity === 'warning' ? 'Cảnh báo' : 'Thông tin'}
                        </Badge>
                        <div className="flex-1">
                          <h4 className="font-medium text-red-400 mb-2">
                            ❌ {item.mistake}
                          </h4>
                          <p className="text-green-400">
                            ✅ {item.solution}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Kỹ thuật chiến đấu nâng cao</h3>
              <div className="space-y-4">
                <Card className="bg-slate-800/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-lg mb-3">Combo kỹ năng</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-slate-300">
                        Kết hợp nhiều kỹ năng để tạo ra combo mạnh mẽ:
                      </p>
                      <ul className="space-y-1 ml-4">
                        <li>• Tăng cường → Tấn công → Gây hại</li>
                        <li>• Hồi máu → Phòng thủ → Phản công</li>
                        <li>• Gây hại → Tấn công → Kết thúc</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-lg mb-3">Quản lý tài nguyên</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-slate-300">
                        Cách quản lý năng lượng và vật phẩm hiệu quả:
                      </p>
                      <ul className="space-y-1 ml-4">
                        <li>• Ưu tiên kỹ năng có tỷ lệ sát thương/năng lượng cao</li>
                        <li>• Sử dụng vật phẩm khi HP < 30%</li>
                        <li>• Chờ hồi chiêu trước khi sử dụng kỹ năng mạnh</li>
                        <li>• Lưu kỹ năng mạnh cho kẻ thù mạnh</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-lg mb-3">Đọc hiểu kẻ thù</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-slate-300">
                        Cách phân tích và đối phó với các loại kẻ thù:
                      </p>
                      <ul className="space-y-1 ml-4">
                        <li>• Kẻ thù tấn công mạnh: Phòng thủ và phản công</li>
                        <li>• Kẻ thù phòng thủ tốt: Sử dụng kỹ năng gây hại</li>
                        <li>• Kẻ thù nhanh nhẹn: Chờ cơ hội và tấn công chính xác</li>
                        <li>• Kẻ thù có kỹ năng đặc biệt: Quan sát và thích ứng</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t border-slate-700">
          <div className="flex space-x-2">
            {onStartTutorial && (
              <Button onClick={onStartTutorial}>
                <BookOpen className="w-4 h-4 mr-2" />
                Bắt đầu hướng dẫn
              </Button>
            )}
          </div>
          
          <Button onClick={onClose}>
            Đóng
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
