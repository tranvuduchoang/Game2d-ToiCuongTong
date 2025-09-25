import { Crown, Users, Gift, Ticket, BarChart3, Settings, Home, Shield, User, UserPlus } from 'lucide-react';
import { Button } from '../game/ui/button';
import { Separator } from '../game/ui/separator';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const menuItems = [
    {
      id: 'overview',
      label: 'Tổng quan',
      icon: Home,
      description: 'Bảng điều khiển chính'
    },
    {
      id: 'accounts',
      label: 'Quản lý tài khoản',
      icon: Users,
      description: 'Tạo, xóa, phân quyền tài khoản'
    },
    {
      id: 'gifts',
      label: 'Tặng quà người chơi',
      icon: Gift,
      description: 'Gửi quà cho tài khoản cụ thể'
    },
    {
      id: 'giftcodes',
      label: 'Quản lý Giftcode',
      icon: Ticket,
      description: 'Tạo và quản lý mã quà tặng'
    },
    {
      id: 'statistics',
      label: 'Thống kê',
      icon: BarChart3,
      description: 'Báo cáo và phân tích dữ liệu'
    },
    {
      id: 'settings',
      label: 'Cài đặt hệ thống',
      icon: Settings,
      description: 'Cấu hình server và game'
    }
  ];

  return (
    <div className="h-full p-4 space-y-4">
      {/* Admin Profile */}
      <div className="p-4 bg-primary/10 rounded-lg border border-primary/30 martial-glow">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Shield className="w-8 h-8 text-primary" />
            <Crown className="w-4 h-4 text-primary absolute -top-1 -right-1" />
          </div>
          <div>
            <p className="font-bold text-primary">Admin Panel</p>
            <p className="text-sm text-muted-foreground">Quản trị tối cao</p>
          </div>
        </div>
      </div>

      <Separator className="bg-border" />

      {/* Navigation Menu */}
      <div className="space-y-2">
        <h3 className="px-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Chức năng quản lý
        </h3>
        
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "default" : "ghost"}
            className={`w-full justify-start gap-3 p-3 h-auto ${
              activeSection === item.id 
                ? 'bg-primary text-primary-foreground martial-glow' 
                : 'hover:bg-secondary/20 hover:text-foreground'
            }`}
            onClick={() => onSectionChange(item.id)}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <div className="text-left">
              <div className="font-medium">{item.label}</div>
              <div className="text-xs opacity-70">{item.description}</div>
            </div>
          </Button>
        ))}
      </div>

      <Separator className="bg-border" />

      {/* Quick Actions */}
      <div className="space-y-2">
        <h3 className="px-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Thao tác nhanh
        </h3>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 border-accent/30 hover:bg-accent/10"
        >
          <UserPlus className="w-4 h-4" />
          Tạo tài khoản mới
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 border-primary/30 hover:bg-primary/10"
        >
          <Ticket className="w-4 h-4" />
          Tạo giftcode
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-border">
        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground">Tối Cường Tông</p>
          <p className="text-xs text-muted-foreground">Admin Dashboard v1.0</p>
        </div>
      </div>
    </div>
  );
}