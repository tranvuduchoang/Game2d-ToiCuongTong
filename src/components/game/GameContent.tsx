import { MapExploration } from "./MapExploration";
import { MapExplorationWithCombat } from "./MapExplorationWithCombat";
import { SectManagement } from "./SectManagement";
import { PlayerDetails } from "./PlayerDetails";
import { EquipmentInventory } from "./EquipmentInventory";
import { TechniquesSkills } from "./TechniquesSkills";
import { DiscipleDetails } from "./DiscipleDetails";
import { CombatSystemIntegration } from "./CombatSystemIntegration";
import { Card, CardContent } from "./ui/card";
import { Construction, Users, Sword, Mountain, BookOpen, Flame, Gem, Calendar, Trophy, Settings, User, Package } from "lucide-react";

interface GameContentProps {
  activeSection: string;
}

export function GameContent({ activeSection }: GameContentProps) {
  const renderContent = () => {
    switch (activeSection) {
      case "map":
        return <MapExplorationWithCombat />;
      
      case "player":
        return <PlayerDetails />;
      
      case "equipment":
        return <EquipmentInventory />;
      
      case "techniques":
        return <TechniquesSkills />;
      
      case "disciples":
        return <DiscipleDetails />;
      
      case "sect":
        return <SectManagement />;
      
      case "cultivation":
        return (
          <Card className="h-full">
            <CardContent className="p-6 flex items-center justify-center">
              <div className="text-center">
                <Mountain className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl mb-2">Tu Luyện</h3>
                <p className="text-slate-600">Tăng tu vi và thăng cảnh tu luyện</p>
                <p className="text-sm text-slate-500 mt-2">Tính năng đang phát triển...</p>
              </div>
            </CardContent>
          </Card>
        );
      
      case "combat":
        return <CombatSystemIntegration />;
      

      
      case "alchemy":
        return (
          <Card className="h-full">
            <CardContent className="p-6 flex items-center justify-center">
              <div className="text-center">
                <Flame className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl mb-2">Đan Các</h3>
                <p className="text-slate-600">Luyện đan dược và chế tác thuốc</p>
                <p className="text-sm text-slate-500 mt-2">Tính năng đang phát triển...</p>
              </div>
            </CardContent>
          </Card>
        );
      
      case "forge":
        return (
          <Card className="h-full">
            <CardContent className="p-6 flex items-center justify-center">
              <div className="text-center">
                <Gem className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl mb-2">Tụ Bảo Các</h3>
                <p className="text-slate-600">Rèn trang bị và khảm ngọc</p>
                <p className="text-sm text-slate-500 mt-2">Tính năng đang phát triển...</p>
              </div>
            </CardContent>
          </Card>
        );
      
      case "events":
        return (
          <Card className="h-full">
            <CardContent className="p-6 flex items-center justify-center">
              <div className="text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl mb-2">Sự Kiện</h3>
                <p className="text-slate-600">Hoạt động đặc biệt và boss theo mùa</p>
                <p className="text-sm text-slate-500 mt-2">Tính năng đang phát triển...</p>
              </div>
            </CardContent>
          </Card>
        );
      
      case "ranking":
        return (
          <Card className="h-full">
            <CardContent className="p-6 flex items-center justify-center">
              <div className="text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl mb-2">Bảng Xếp Hạng</h3>
                <p className="text-slate-600">Danh hiệu và thứ hạng võ lâm</p>
                <p className="text-sm text-slate-500 mt-2">Tính năng đang phát triển...</p>
              </div>
            </CardContent>
          </Card>
        );
      
      case "settings":
        return (
          <Card className="h-full">
            <CardContent className="p-6 flex items-center justify-center">
              <div className="text-center">
                <Settings className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl mb-2">Cài Đặt</h3>
                <p className="text-slate-600">Thiết lập game và tài khoản</p>
                <p className="text-sm text-slate-500 mt-2">Tính năng đang phát triển...</p>
              </div>
            </CardContent>
          </Card>
        );
      
      default:
        return <MapExploration />;
    }
  };

  return (
    <div className="h-full">
      {renderContent()}
    </div>
  );
}