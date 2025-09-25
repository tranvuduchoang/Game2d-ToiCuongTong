"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Sword, 
  Shield, 
  Zap, 
  Heart, 
  Star, 
  Eye,
  ArrowRight,
  ArrowLeft,
  X
} from "lucide-react";
import { useState } from "react";

interface CombatTutorialProps {
  onClose: () => void;
  onStartCombat?: () => void;
}

export function CombatTutorial({ onClose, onStartCombat }: CombatTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Chào mừng đến với hệ thống chiến đấu!",
      content: "Đây là hướng dẫn cơ bản về cách chiến đấu trong Tối Cường Tông. Hãy làm theo các bước để hiểu rõ cách thức hoạt động.",
      icon: <Sword className="w-8 h-8 text-yellow-500" />,
      actions: [
        { text: "Tấn công cơ bản", description: "Gây sát thương dựa trên sức mạnh" },
        { text: "Sử dụng kỹ năng", description: "Kỹ năng mạnh hơn nhưng có hồi chiêu" },
        { text: "Dùng vật phẩm", description: "Hồi máu hoặc tăng sức mạnh" },
        { text: "Phòng thủ", description: "Giảm sát thương nhận vào" }
      ]
    },
    {
      title: "Giao diện chiến đấu",
      content: "Màn hình chiến đấu được chia thành các phần chính: thông tin người chơi, thông tin quái vật, và các hành động có thể thực hiện.",
      icon: <Eye className="w-8 h-8 text-blue-500" />,
      features: [
        { name: "Thanh máu", description: "Hiển thị HP hiện tại và tối đa" },
        { name: "Chỉ số", description: "Sức mạnh, nhanh nhẹn, trí tuệ, thể lực" },
        { name: "Kỹ năng", description: "Danh sách kỹ năng có thể sử dụng" },
        { name: "Vật phẩm", description: "Các vật phẩm có thể dùng trong chiến đấu" }
      ]
    },
    {
      title: "Các loại kỹ năng",
      content: "Kỹ năng được chia thành 4 loại chính, mỗi loại có tác dụng khác nhau trong chiến đấu.",
      icon: <Zap className="w-8 h-8 text-purple-500" />,
      skillTypes: [
        { 
          type: "Tấn công", 
          color: "bg-red-500", 
          icon: <Sword className="w-4 h-4" />,
          description: "Gây sát thương trực tiếp cho kẻ thù"
        },
        { 
          type: "Hồi máu", 
          color: "bg-green-500", 
          icon: <Heart className="w-4 h-4" />,
          description: "Khôi phục HP cho bản thân"
        },
        { 
          type: "Tăng cường", 
          color: "bg-blue-500", 
          icon: <Shield className="w-4 h-4" />,
          description: "Tăng chỉ số tạm thời"
        },
        { 
          type: "Gây hại", 
          color: "bg-purple-500", 
          icon: <Zap className="w-4 h-4" />,
          description: "Gây hiệu ứng tiêu cực cho kẻ thù"
        }
      ]
    },
    {
      title: "Chiến thuật chiến đấu",
      content: "Để chiến thắng, bạn cần có chiến thuật phù hợp. Hãy cân nhắc kỹ trước khi hành động.",
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      tips: [
        "Quan sát chỉ số của kẻ thù để chọn kỹ năng phù hợp",
        "Sử dụng kỹ năng tấn công khi kẻ thù yếu",
        "Dùng kỹ năng hồi máu khi HP thấp",
        "Tận dụng kỹ năng tăng cường để tăng sức mạnh",
        "Chú ý đến hồi chiêu của kỹ năng",
        "Sử dụng vật phẩm khi cần thiết"
      ]
    },
    {
      title: "Phần thưởng chiến đấu",
      content: "Sau mỗi trận chiến, bạn sẽ nhận được kinh nghiệm, vàng và có thể là vật phẩm quý hiếm.",
      icon: <Star className="w-8 h-8 text-green-500" />,
      rewards: [
        { name: "Kinh nghiệm", description: "Để tăng cấp và mở khóa kỹ năng mới" },
        { name: "Vàng", description: "Để mua vật phẩm và trang bị" },
        { name: "Vật phẩm", description: "Có thể sử dụng hoặc bán" },
        { name: "Danh tiếng", description: "Để mở khóa nội dung mới" }
      ]
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            {currentStepData.icon}
            <span>{currentStepData.title}</span>
          </CardTitle>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-slate-600">{currentStepData.content}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Step Content */}
        <div className="min-h-[300px]">
          {currentStep === 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Các hành động cơ bản:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentStepData.actions.map((action, index) => (
                  <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                    <h5 className="font-medium text-yellow-500 mb-2">{action.text}</h5>
                    <p className="text-sm text-slate-400">{action.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Các thành phần giao diện:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentStepData.features.map((feature, index) => (
                  <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                    <h5 className="font-medium text-blue-500 mb-2">{feature.name}</h5>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Các loại kỹ năng:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentStepData.skillTypes.map((skill, index) => (
                  <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-full ${skill.color}`}>
                        {skill.icon}
                      </div>
                      <h5 className="font-medium">{skill.type}</h5>
                    </div>
                    <p className="text-sm text-slate-400">{skill.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Mẹo chiến đấu:</h4>
              <div className="space-y-2">
                {currentStepData.tips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-slate-800/30 rounded-lg">
                    <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-yellow-500">{index + 1}</span>
                    </div>
                    <p className="text-sm text-slate-300">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Phần thưởng bạn có thể nhận được:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentStepData.rewards.map((reward, index) => (
                  <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                    <h5 className="font-medium text-green-500 mb-2">{reward.name}</h5>
                    <p className="text-sm text-slate-400">{reward.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentStep ? 'bg-yellow-500' : 'bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t border-slate-700">
          <Button 
            onClick={prevStep} 
            disabled={currentStep === 0}
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Trước
          </Button>
          
          <div className="flex space-x-2">
            {currentStep === steps.length - 1 ? (
              <>
                <Button onClick={onClose} variant="outline">
                  Đóng
                </Button>
                {onStartCombat && (
                  <Button onClick={onStartCombat}>
                    <Sword className="w-4 h-4 mr-2" />
                    Bắt đầu chiến đấu
                  </Button>
                )}
              </>
            ) : (
              <Button onClick={nextStep}>
                Tiếp theo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
