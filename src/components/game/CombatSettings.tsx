"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff,
  Zap,
  Shield,
  Sword,
  Heart,
  X
} from "lucide-react";
import { useState } from "react";

interface CombatSettingsProps {
  onClose: () => void;
  onSave?: (settings: CombatSettingsData) => void;
  initialSettings?: CombatSettingsData;
}

interface CombatSettingsData {
  // Audio Settings
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  voiceVolume: number;
  
  // Visual Settings
  showDamageNumbers: boolean;
  showHealthBars: boolean;
  showSkillCooldowns: boolean;
  showCombatLog: boolean;
  showParticleEffects: boolean;
  showScreenShake: boolean;
  
  // Combat Settings
  autoAttack: boolean;
  autoUseItems: boolean;
  autoUseSkills: boolean;
  confirmActions: boolean;
  pauseOnTurn: boolean;
  
  // UI Settings
  compactMode: boolean;
  showTooltips: boolean;
  showHotkeys: boolean;
  showFPS: boolean;
}

export function CombatSettings({ onClose, onSave, initialSettings }: CombatSettingsProps) {
  const [settings, setSettings] = useState<CombatSettingsData>(initialSettings || {
    // Audio Settings
    masterVolume: 80,
    sfxVolume: 70,
    musicVolume: 60,
    voiceVolume: 80,
    
    // Visual Settings
    showDamageNumbers: true,
    showHealthBars: true,
    showSkillCooldowns: true,
    showCombatLog: true,
    showParticleEffects: true,
    showScreenShake: true,
    
    // Combat Settings
    autoAttack: false,
    autoUseItems: false,
    autoUseSkills: false,
    confirmActions: true,
    pauseOnTurn: false,
    
    // UI Settings
    compactMode: false,
    showTooltips: true,
    showHotkeys: true,
    showFPS: false
  });

  const updateSetting = <K extends keyof CombatSettingsData>(
    key: K, 
    value: CombatSettingsData[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(settings);
    }
    onClose();
  };

  const resetToDefault = () => {
    setSettings({
      masterVolume: 80,
      sfxVolume: 70,
      musicVolume: 60,
      voiceVolume: 80,
      showDamageNumbers: true,
      showHealthBars: true,
      showSkillCooldowns: true,
      showCombatLog: true,
      showParticleEffects: true,
      showScreenShake: true,
      autoAttack: false,
      autoUseItems: false,
      autoUseSkills: false,
      confirmActions: true,
      pauseOnTurn: false,
      compactMode: false,
      showTooltips: true,
      showHotkeys: true,
      showFPS: false
    });
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-blue-500" />
            <span>Cài đặt chiến đấu</span>
          </CardTitle>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Audio Settings */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Volume2 className="w-5 h-5 mr-2" />
            Âm thanh
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Âm lượng chính</label>
              <div className="flex items-center space-x-4">
                <VolumeX className="w-4 h-4 text-slate-400" />
                <Slider
                  value={[settings.masterVolume]}
                  onValueChange={([value]: number[]) => updateSetting('masterVolume', value)}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <Volume2 className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium w-12">{settings.masterVolume}%</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Hiệu ứng âm thanh</label>
              <div className="flex items-center space-x-4">
                <VolumeX className="w-4 h-4 text-slate-400" />
                <Slider
                  value={[settings.sfxVolume]}
                  onValueChange={([value]: number[]) => updateSetting('sfxVolume', value)}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <Volume2 className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium w-12">{settings.sfxVolume}%</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Nhạc nền</label>
              <div className="flex items-center space-x-4">
                <VolumeX className="w-4 h-4 text-slate-400" />
                <Slider
                  value={[settings.musicVolume]}
                  onValueChange={([value]: number[]) => updateSetting('musicVolume', value)}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <Volume2 className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium w-12">{settings.musicVolume}%</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Giọng nói</label>
              <div className="flex items-center space-x-4">
                <VolumeX className="w-4 h-4 text-slate-400" />
                <Slider
                  value={[settings.voiceVolume]}
                  onValueChange={([value]: number[]) => updateSetting('voiceVolume', value)}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <Volume2 className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium w-12">{settings.voiceVolume}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Settings */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Hiển thị
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <label className="text-sm font-medium">Hiển thị số sát thương</label>
                <p className="text-xs text-slate-400">Hiển thị số sát thương khi tấn công</p>
              </div>
              <Switch
                checked={settings.showDamageNumbers}
                onCheckedChange={(checked: boolean) => updateSetting('showDamageNumbers', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <label className="text-sm font-medium">Hiển thị thanh máu</label>
                <p className="text-xs text-slate-400">Hiển thị thanh máu của kẻ thù</p>
              </div>
              <Switch
                checked={settings.showHealthBars}
                onCheckedChange={(checked: boolean) => updateSetting('showHealthBars', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <label className="text-sm font-medium">Hiển thị hồi chiêu</label>
                <p className="text-xs text-slate-400">Hiển thị thời gian hồi chiêu kỹ năng</p>
              </div>
              <Switch
                checked={settings.showSkillCooldowns}
                onCheckedChange={(checked: boolean) => updateSetting('showSkillCooldowns', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <label className="text-sm font-medium">Hiển thị nhật ký</label>
                <p className="text-xs text-slate-400">Hiển thị nhật ký chiến đấu</p>
              </div>
              <Switch
                checked={settings.showCombatLog}
                onCheckedChange={(checked: boolean) => updateSetting('showCombatLog', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <label className="text-sm font-medium">Hiệu ứng hạt</label>
                <p className="text-xs text-slate-400">Hiển thị hiệu ứng hạt khi sử dụng kỹ năng</p>
              </div>
              <Switch
                checked={settings.showParticleEffects}
                onCheckedChange={(checked: boolean) => updateSetting('showParticleEffects', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <label className="text-sm font-medium">Rung màn hình</label>
                <p className="text-xs text-slate-400">Rung màn hình khi tấn công</p>
              </div>
              <Switch
                checked={settings.showScreenShake}
                onCheckedChange={(checked: boolean) => updateSetting('showScreenShake', checked)}
              />
            </div>
          </div>
        </div>

        {/* Combat Settings */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Sword className="w-5 h-5 mr-2" />
            Chiến đấu
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <label className="text-sm font-medium">Tự động tấn công</label>
                <p className="text-xs text-slate-400">Tự động tấn công khi đến lượt</p>
              </div>
              <Switch
                checked={settings.autoAttack}
                onCheckedChange={(checked: boolean) => updateSetting('autoAttack', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <label className="text-sm font-medium">Tự động dùng vật phẩm</label>
                <p className="text-xs text-slate-400">Tự động dùng vật phẩm khi cần</p>
              </div>
              <Switch
                checked={settings.autoUseItems}
                onCheckedChange={(checked: boolean) => updateSetting('autoUseItems', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <label className="text-sm font-medium">Tự động dùng kỹ năng</label>
                <p className="text-xs text-slate-400">Tự động sử dụng kỹ năng phù hợp</p>
              </div>
              <Switch
                checked={settings.autoUseSkills}
                onCheckedChange={(checked) => updateSetting('autoUseSkills', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <label className="text-sm font-medium">Xác nhận hành động</label>
                <p className="text-xs text-slate-400">Xác nhận trước khi thực hiện hành động</p>
              </div>
              <Switch
                checked={settings.confirmActions}
                onCheckedChange={(checked) => updateSetting('confirmActions', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <label className="text-sm font-medium">Tạm dừng khi đến lượt</label>
                <p className="text-xs text-slate-400">Tạm dừng game khi đến lượt của bạn</p>
              </div>
              <Switch
                checked={settings.pauseOnTurn}
                onCheckedChange={(checked) => updateSetting('pauseOnTurn', checked)}
              />
            </div>
          </div>
        </div>

        {/* UI Settings */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Giao diện
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <label className="text-sm font-medium">Chế độ compact</label>
                <p className="text-xs text-slate-400">Hiển thị giao diện gọn gàng hơn</p>
              </div>
              <Switch
                checked={settings.compactMode}
                onCheckedChange={(checked) => updateSetting('compactMode', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <label className="text-sm font-medium">Hiển thị tooltip</label>
                <p className="text-xs text-slate-400">Hiển thị thông tin khi hover</p>
              </div>
              <Switch
                checked={settings.showTooltips}
                onCheckedChange={(checked) => updateSetting('showTooltips', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <label className="text-sm font-medium">Hiển thị phím tắt</label>
                <p className="text-xs text-slate-400">Hiển thị phím tắt trên giao diện</p>
              </div>
              <Switch
                checked={settings.showHotkeys}
                onCheckedChange={(checked) => updateSetting('showHotkeys', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <label className="text-sm font-medium">Hiển thị FPS</label>
                <p className="text-xs text-slate-400">Hiển thị số khung hình mỗi giây</p>
              </div>
              <Switch
                checked={settings.showFPS}
                onCheckedChange={(checked) => updateSetting('showFPS', checked)}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t border-slate-700">
          <Button onClick={resetToDefault} variant="outline">
            Đặt lại mặc định
          </Button>
          
          <div className="flex space-x-2">
            <Button onClick={onClose} variant="outline">
              Hủy
            </Button>
            <Button onClick={handleSave}>
              Lưu cài đặt
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
