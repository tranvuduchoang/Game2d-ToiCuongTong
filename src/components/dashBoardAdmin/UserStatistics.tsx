import { useState } from 'react';
import { Card } from '../game/ui/card';
import { Button } from '../game/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../game/ui/select';
import { Badge } from '../game/ui/badge';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, Clock, Star, Crown, Activity, Calendar, Award } from 'lucide-react';

export function UserStatistics() {
  const [timeRange, setTimeRange] = useState('7days');

  // Mock data
  const overviewStats = [
    {
      title: 'Tổng người chơi',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: 'Hoạt động hôm nay',
      value: '1,203',
      change: '+8.2%',
      trend: 'up',
      icon: Activity,
      color: 'text-green-400'
    },
    {
      title: 'Thời gian chơi TB',
      value: '2.4h',
      change: '+15.3%',
      trend: 'up',
      icon: Clock,
      color: 'text-purple-400'
    },
    {
      title: 'Retention 7 ngày',
      value: '68.5%',
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      color: 'text-orange-400'
    }
  ];

  const dailyActiveUsers = [
    { date: '15/01', users: 1100, newUsers: 45 },
    { date: '16/01', users: 1250, newUsers: 67 },
    { date: '17/01', users: 1180, newUsers: 23 },
    { date: '18/01', users: 1350, newUsers: 89 },
    { date: '19/01', users: 1420, newUsers: 112 },
    { date: '20/01', users: 1380, newUsers: 78 },
    { date: '21/01', users: 1203, newUsers: 56 }
  ];

  const levelDistribution = [
    { level: '1-10', count: 856, percentage: 30.1 },
    { level: '11-30', count: 742, percentage: 26.1 },
    { level: '31-50', count: 598, percentage: 21.0 },
    { level: '51-70', count: 384, percentage: 13.5 },
    { level: '71-90', count: 187, percentage: 6.6 },
    { level: '90+', count: 80, percentage: 2.8 }
  ];

  const sectDistribution = [
    { name: 'Thiên Kiếm Tông', value: 687, color: '#ffd700' },
    { name: 'Huyền Thiên Tông', value: 523, color: '#00a86b' },
    { name: 'Vô Cực Tông', value: 445, color: '#4b0082' },
    { name: 'Thiên Ma Tông', value: 389, color: '#8b0000' },
    { name: 'Tự Do', value: 803, color: '#cd7f32' }
  ];

  const playtimeDistribution = [
    { time: '< 1h', count: 423 },
    { time: '1-2h', count: 789 },
    { time: '2-4h', count: 656 },
    { time: '4-6h', count: 378 },
    { time: '6-8h', count: 245 },
    { time: '> 8h', count: 356 }
  ];

  const topPlayers = [
    { rank: 1, name: 'ThienHaVoSong', level: 99, sect: 'Thiên Kiếm Tông', power: 150000 },
    { rank: 2, name: 'KiemTongChiTon', level: 98, sect: 'Huyền Thiên Tông', power: 148500 },
    { rank: 3, name: 'VoLamDaoNhan', level: 97, sect: 'Vô Cực Tông', power: 147200 },
    { rank: 4, name: 'TieuDaoThan', level: 96, sect: 'Thiên Ma Tông', power: 145800 },
    { rank: 5, name: 'HuyenThienTon', level: 95, sect: 'Thiên Kiếm Tông', power: 144300 }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Award className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <Star className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-primary">Thống kê người chơi</h2>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1day">24 giờ qua</SelectItem>
              <SelectItem value="7days">7 ngày qua</SelectItem>
              <SelectItem value="30days">30 ngày qua</SelectItem>
              <SelectItem value="90days">90 ngày qua</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => (
          <Card key={index} className="p-6 ancient-scroll martial-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className={`text-sm flex items-center gap-1 ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  <TrendingUp className={`w-3 h-3 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-secondary/20 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Active Users */}
        <Card className="p-6 ancient-scroll">
          <h3 className="text-xl font-bold text-primary mb-4">Người chơi hoạt động hàng ngày</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyActiveUsers}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(26,26,26,0.95)', 
                  border: '1px solid rgba(255,215,0,0.3)',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#ffd700" 
                strokeWidth={2}
                name="Tổng người chơi"
              />
              <Line 
                type="monotone" 
                dataKey="newUsers" 
                stroke="#00a86b" 
                strokeWidth={2}
                name="Người chơi mới"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Level Distribution */}
        <Card className="p-6 ancient-scroll">
          <h3 className="text-xl font-bold text-primary mb-4">Phân bố level người chơi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={levelDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="level" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(26,26,26,0.95)', 
                  border: '1px solid rgba(255,215,0,0.3)',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="count" fill="#4b0082" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Sect Distribution */}
        <Card className="p-6 ancient-scroll">
          <h3 className="text-xl font-bold text-primary mb-4">Phân bố tông môn</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sectDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sectDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(26,26,26,0.95)', 
                  border: '1px solid rgba(255,215,0,0.3)',
                  borderRadius: '8px'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Playtime Distribution */}
        <Card className="p-6 ancient-scroll">
          <h3 className="text-xl font-bold text-primary mb-4">Phân bố thời gian chơi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={playtimeDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(26,26,26,0.95)', 
                  border: '1px solid rgba(255,215,0,0.3)',
                  borderRadius: '8px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#00a86b" 
                fill="rgba(0,168,107,0.3)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Players */}
      <Card className="p-6 ancient-scroll">
        <h3 className="text-xl font-bold text-primary mb-4">Bảng xếp hạng cao thủ</h3>
        <div className="space-y-3">
          {topPlayers.map((player) => (
            <div 
              key={player.rank}
              className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border/50"
            >
              <div className="flex items-center gap-4">
                {getRankIcon(player.rank)}
                <div>
                  <p className="font-bold text-primary">#{player.rank} {player.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Level {player.level} • {player.sect}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-accent">{player.power.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Sức mạnh</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 ancient-scroll">
          <h4 className="font-bold text-primary mb-3">Hoạt động gần đây</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Đăng nhập mới</span>
              <Badge>+89</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Hoàn thành nhiệm vụ</span>
              <Badge>+456</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Tăng cấp</span>
              <Badge>+123</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Gia nhập tông môn</span>
              <Badge>+67</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 ancient-scroll">
          <h4 className="font-bold text-primary mb-3">Server Status</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Server 1</span>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Bình thường
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Server 2</span>
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                Cao tải
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Ổn định
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 ancient-scroll">
          <h4 className="font-bold text-primary mb-3">Dự báo tuần tới</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Người chơi mới</span>
              <span className="text-accent">~400</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Retention dự kiến</span>
              <span className="text-accent">72%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Peak concurrent</span>
              <span className="text-accent">~1,800</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}