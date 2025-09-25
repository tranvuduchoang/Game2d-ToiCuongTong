"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Keyboard, 
  Sword, 
  Shield, 
  Zap, 
  Heart, 
  Star,
  X,
  Eye,
  EyeOff
} from "lucide-react";
import { useState } from "react";

interface CombatHotkeysProps {
  onClose: () => void;
  onToggleHotkeys?: (show: boolean) => void;
  showHotkeys?: boolean;
}

export function CombatHotkeys({ onClose, onToggleHotkeys, showHotkeys = true }: CombatHotkeysProps) {
  const [selectedCategory, setSelectedCategory] = useState<'combat' | 'ui' | 'navigation'>('combat');

  const hotkeys = {
    combat: [
      { key: 'Space', action: 'Tấn công cơ bản', description: 'Thực hiện tấn công cơ bản' },
      { key: '1-9', action: 'Sử dụng kỹ năng', description: 'Sử dụng kỹ năng tương ứng với số' },
      { key: 'Q', action: 'Kỹ năng 1', description: 'Sử dụng kỹ năng đầu tiên' },
      { key: 'W', action: 'Kỹ năng 2', description: 'Sử dụng kỹ năng thứ hai' },
      { key: 'E', action: 'Kỹ năng 3', description: 'Sử dụng kỹ năng thứ ba' },
      { key: 'R', action: 'Kỹ năng 4', description: 'Sử dụng kỹ năng thứ tư' },
      { key: 'T', action: 'Kỹ năng 5', description: 'Sử dụng kỹ năng thứ năm' },
      { key: 'A', action: 'Vật phẩm 1', description: 'Sử dụng vật phẩm đầu tiên' },
      { key: 'S', action: 'Vật phẩm 2', description: 'Sử dụng vật phẩm thứ hai' },
      { key: 'D', action: 'Vật phẩm 3', description: 'Sử dụng vật phẩm thứ ba' },
      { key: 'F', action: 'Vật phẩm 4', description: 'Sử dụng vật phẩm thứ tư' },
      { key: 'G', action: 'Vật phẩm 5', description: 'Sử dụng vật phẩm thứ năm' },
      { key: 'Shift', action: 'Phòng thủ', description: 'Chuyển sang chế độ phòng thủ' },
      { key: 'Ctrl', action: 'Tự động tấn công', description: 'Bật/tắt tự động tấn công' },
      { key: 'Alt', action: 'Tự động dùng vật phẩm', description: 'Bật/tắt tự động dùng vật phẩm' }
    ],
    ui: [
      { key: 'Tab', action: 'Chuyển đổi mục tiêu', description: 'Chuyển đổi giữa các mục tiêu' },
      { key: 'Enter', action: 'Xác nhận', description: 'Xác nhận hành động hiện tại' },
      { key: 'Escape', action: 'Hủy bỏ', description: 'Hủy bỏ hành động hiện tại' },
      { key: 'F1', action: 'Trợ giúp', description: 'Mở cửa sổ trợ giúp' },
      { key: 'F2', action: 'Cài đặt', description: 'Mở cửa sổ cài đặt' },
      { key: 'F3', action: 'Thống kê', description: 'Hiển thị thống kê chiến đấu' },
      { key: 'F4', action: 'Nhật ký', description: 'Mở nhật ký chiến đấu' },
      { key: 'F5', action: 'Lưu game', description: 'Lưu tiến trình game' },
      { key: 'F9', action: 'Tải game', description: 'Tải tiến trình game' },
      { key: 'F11', action: 'Toàn màn hình', description: 'Chuyển đổi chế độ toàn màn hình' },
      { key: 'F12', action: 'Chụp màn hình', description: 'Chụp màn hình game' }
    ],
    navigation: [
      { key: 'W/A/S/D', action: 'Di chuyển', description: 'Di chuyển trong bản đồ' },
      { key: 'Arrow Keys', action: 'Di chuyển', description: 'Di chuyển trong bản đồ (phím mũi tên)' },
      { key: 'Mouse Wheel', action: 'Zoom', description: 'Phóng to/thu nhỏ bản đồ' },
      { key: 'Middle Click', action: 'Xoay bản đồ', description: 'Xoay góc nhìn bản đồ' },
      { key: 'Right Click', action: 'Menu ngữ cảnh', description: 'Mở menu ngữ cảnh' },
      { key: 'Left Click', action: 'Chọn mục tiêu', description: 'Chọn mục tiêu hoặc vị trí' },
      { key: 'Shift + Click', action: 'Chọn nhiều', description: 'Chọn nhiều mục tiêu' },
      { key: 'Ctrl + Click', action: 'Thông tin', description: 'Xem thông tin chi tiết' },
      { key: 'Alt + Click', action: 'Tương tác', description: 'Tương tác với đối tượng' }
    ]
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'combat': return <Sword className="w-5 h-5" />;
      case 'ui': return <Eye className="w-5 h-5" />;
      case 'navigation': return <Keyboard className="w-5 h-5" />;
      default: return <Keyboard className="w-5 h-5" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'combat': return 'Chiến đấu';
      case 'ui': return 'Giao diện';
      case 'navigation': return 'Điều hướng';
      default: return 'Khác';
    }
  };

  const getKeyColor = (key: string) => {
    if (key.includes('F') && key.length <= 3) return 'bg-blue-500';
    if (key.includes('Ctrl') || key.includes('Shift') || key.includes('Alt')) return 'bg-purple-500';
    if (key.includes('Arrow') || key.includes('Mouse')) return 'bg-green-500';
    if (key.includes('+')) return 'bg-orange-500';
    return 'bg-slate-500';
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <Keyboard className="w-6 h-6 text-blue-500" />
            <span>Phím tắt chiến đấu</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => onToggleHotkeys?.(!showHotkeys)}
              variant="outline"
              size="sm"
            >
              {showHotkeys ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showHotkeys ? 'Ẩn' : 'Hiện'} phím tắt
            </Button>
            <Button onClick={onClose} variant="outline" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Category Tabs */}
        <div className="flex space-x-2">
          {(['combat', 'ui', 'navigation'] as const).map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="flex items-center space-x-2"
            >
              {getCategoryIcon(category)}
              <span>{getCategoryTitle(category)}</span>
            </Button>
          ))}
        </div>

        {/* Hotkeys List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center">
            {getCategoryIcon(selectedCategory)}
            <span className="ml-2">{getCategoryTitle(selectedCategory)}</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotkeys[selectedCategory].map((hotkey, index) => (
              <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{hotkey.action}</h4>
                  <Badge className={getKeyColor(hotkey.key)}>
                    {hotkey.key}
                  </Badge>
                </div>
                <p className="text-sm text-slate-400">{hotkey.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Reference */}
        <div className="p-4 bg-slate-800/30 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            Mẹo sử dụng phím tắt
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-yellow-500 mb-2">Chiến đấu hiệu quả</h5>
              <ul className="space-y-1 text-slate-400">
                <li>• Sử dụng phím số để nhanh chóng sử dụng kỹ năng</li>
                <li>• Kết hợp Shift + phím để thực hiện hành động đặc biệt</li>
                <li>• Sử dụng Space để tấn công nhanh</li>
                <li>• Nhấn Escape để hủy bỏ hành động</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-blue-500 mb-2">Điều hướng nhanh</h5>
              <ul className="space-y-1 text-slate-400">
                <li>• Sử dụng WASD hoặc phím mũi tên để di chuyển</li>
                <li>• Click chuột phải để mở menu ngữ cảnh</li>
                <li>• Sử dụng Ctrl + Click để xem thông tin chi tiết</li>
                <li>• Nhấn Tab để chuyển đổi mục tiêu</li>
              </ul>
            </div>
          </div>
        </div>

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
