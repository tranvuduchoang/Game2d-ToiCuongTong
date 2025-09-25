import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AccountManagement } from './AccountManagement';
import { GiftManagement } from './GiftManagement';
import { GiftCodeManagement } from './GiftCodeManagement';
import { UserStatistics } from './UserStatistics';
import { SystemSettings } from './SystemSettings';
import { Card } from '../game/ui/card';
import { Crown, Shield, Users, Gift, Ticket, BarChart3, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'accounts':
        return <AccountManagement />;
      case 'gifts':
        return <GiftManagement />;
      case 'giftcodes':
        return <GiftCodeManagement />;
      case 'statistics':
        return <UserStatistics />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Mystical Admin Background */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(139, 0, 0, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 40% 40%, rgba(75, 0, 130, 0.15) 0%, transparent 50%)`,
          backgroundSize: '600px 600px, 400px 400px, 700px 700px',
          animation: 'floating 12s ease-in-out infinite'
        }}
      />

      {/* Admin Header */}
      <div className="relative p-6 bg-card/95 backdrop-blur-sm border-b border-border martial-glow">
        <div className="absolute inset-0 qi-flow opacity-30" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Crown className="w-8 h-8 text-primary power-pulse" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Tối Cường Tông - Admin Dashboard</h1>
              <p className="text-muted-foreground">Bảng điều khiển quản trị viên</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg border border-primary/30">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">Super Admin</span>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Admin Sidebar */}
        <div className="w-72 bg-card/50 backdrop-blur-sm border-r border-border">
          <AdminSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 cultivation-bg overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Overview Component
function AdminOverview() {
  const stats = [
    {
      title: 'Tổng người chơi',
      value: '2,847',
      change: '+127',
      icon: Users,
      color: 'text-jade-green'
    },
    {
      title: 'Hoạt động hôm nay',
      value: '1,203',
      change: '+89',
      icon: BarChart3,
      color: 'text-primary'
    },
    {
      title: 'Giftcode đã phát',
      value: '156',
      change: '+23',
      icon: Ticket,
      color: 'text-mystic-purple'
    },
    {
      title: 'Quà tặng tuần này',
      value: '892',
      change: '+145',
      icon: Gift,
      color: 'text-deep-crimson'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-primary">Tổng quan hệ thống</h2>
        <div className="text-sm text-muted-foreground">
          Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 ancient-scroll martial-glow hover:martial-glow transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className={`text-sm ${stat.color}`}>
                  {stat.change} từ tuần trước
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-secondary/20 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 ancient-scroll">
          <h3 className="text-xl font-bold text-primary mb-4">Hoạt động gần đây</h3>
          <div className="space-y-3">
            {[
              { user: 'TieuDaoThan123', action: 'đăng nhập', time: '2 phút trước' },
              { user: 'VoLamKiemKhach', action: 'nhận giftcode NEWBIE2024', time: '5 phút trước' },
              { user: 'ThienHaVoSong', action: 'thăng cấp lên Chúc Cơ cảnh', time: '8 phút trước' },
              { user: 'KiemTongChiTon', action: 'hoàn thành nhiệm vụ', time: '12 phút trước' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border/50">
                <div>
                  <span className="font-medium text-primary">{activity.user}</span>
                  <span className="text-foreground"> {activity.action}</span>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 ancient-scroll">
          <h3 className="text-xl font-bold text-primary mb-4">Thông báo hệ thống</h3>
          <div className="space-y-3">
            {[
              { type: 'warning', message: 'Server 2 đang quá tải', time: '1 giờ trước' },
              { type: 'info', message: 'Bảo trì định kỳ vào 2:00 AM', time: '3 giờ trước' },
              { type: 'success', message: 'Cập nhật phiên bản 1.2.5 thành công', time: '1 ngày trước' },
              { type: 'error', message: 'Lỗi database đã được khắc phục', time: '2 ngày trước' }
            ].map((notification, index) => (
              <div key={index} className="flex items-start gap-3 py-2 border-b border-border/50">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  notification.type === 'warning' ? 'bg-yellow-500' :
                  notification.type === 'error' ? 'bg-destructive' :
                  notification.type === 'success' ? 'bg-accent' : 'bg-primary'
                }`} />
                <div className="flex-1">
                  <p className="text-foreground">{notification.message}</p>
                  <p className="text-sm text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}