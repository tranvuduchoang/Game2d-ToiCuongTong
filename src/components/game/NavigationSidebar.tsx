import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Map, 
  Mountain, 
  Sword, 
  Users, 
  Flame, 
  BookOpen, 
  Gem, 
  Calendar,
  Trophy,
  Settings,
  User,
  Package
} from "lucide-react";

interface NavigationSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: "map", label: "Khám Phá", icon: Map, description: "Bản đồ thế giới" },
  { id: "player", label: "Nhân Vật", icon: User, description: "Thông tin chi tiết" },
  { id: "equipment", label: "Trang Bị", icon: Package, description: "Vũ khí & áo giáp" },
  { id: "techniques", label: "Công Pháp", icon: BookOpen, description: "Kỹ năng võ học" },
  { id: "cultivation", label: "Tu Luyện", icon: Mountain, description: "Tăng tu vi" },
  { id: "combat", label: "Chiến Đấu", icon: Sword, description: "Đấu võ đài" },
  { id: "sect", label: "Tông Môn", icon: Users, description: "Quản lý tông môn" },
  { id: "disciples", label: "Đệ Tử", icon: Users, description: "Quản lý đệ tử" },
  { id: "alchemy", label: "Đan Các", icon: Flame, description: "Luyện đan dược" },
  { id: "forge", label: "Tụ Bảo Các", icon: Gem, description: "Rèn trang bị" },
  { id: "events", label: "Sự Kiện", icon: Calendar, description: "Hoạt động đặc biệt", hasNotification: true },
  { id: "ranking", label: "Bảng Xếp Hạng", icon: Trophy, description: "Danh hiệu võ lâm" },
  { id: "settings", label: "Cài Đặt", icon: Settings, description: "Thiết lập game" }
];

export function NavigationSidebar({ activeSection, onSectionChange }: NavigationSidebarProps) {
  return (
    <Card className="h-full sect-border ancient-scroll relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />
      <div className="p-4 relative z-10">
        <h3 className="text-lg mb-4 text-primary font-bold tracking-wider border-b border-primary/30 pb-2 martial-glow">
          ⚔️ Tối Cường Tông ⚔️
        </h3>
        
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-auto p-3 transition-all duration-300 ${
                  isActive 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 martial-glow sect-border" 
                    : "text-foreground hover:bg-accent/20 hover:text-accent-foreground hover:martial-glow"
                }`}
                onClick={() => onSectionChange(item.id)}
              >
                <div className="flex items-center w-full">
                  <Icon className={`w-4 h-4 mr-3 flex-shrink-0 ${isActive ? 'floating-animation' : ''}`} />
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.hasNotification && (
                        <Badge variant="destructive" className="text-xs px-1 py-0 h-5 power-pulse">
                          !
                        </Badge>
                      )}
                    </div>
                    <div className={`text-xs opacity-70 ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {item.description}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}