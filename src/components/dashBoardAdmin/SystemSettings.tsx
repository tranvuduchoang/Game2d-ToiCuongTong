import { useState } from 'react';
import { Card } from '../game/ui/card';
import { Button } from '../game/ui/button';
import { Input } from '../game/ui/input';
import { Label } from '../game/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../game/ui/select';
import { Switch } from '../game/ui/switch';
import { Textarea } from '../game/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../game/ui/tabs';
import { Badge } from '../game/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../game/ui/alert-dialog';
import { Server, Database, Settings, Bell, Shield, Activity, Save, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function SystemSettings() {
  const [gameSettings, setGameSettings] = useState({
    serverName: 'Tối Cường Tông - Server 1',
    maxPlayers: 5000,
    experienceRate: 1.0,
    dropRate: 1.0,
    goldRate: 1.0,
    maintenanceMode: false,
    registrationOpen: true,
    chatFilter: true,
    autoSave: true,
    debugMode: false
  });

  const [notifications, setNotifications] = useState({
    systemAlerts: true,
    playerReports: true,
    serverWarnings: true,
    emailNotifications: true,
    discordWebhook: '',
    maintenanceNotice: ''
  });

  const [security, setSecurity] = useState({
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    ipWhitelist: '',
    enableTwoFactor: true,
    logRetentionDays: 30,
    encryptionLevel: 'high'
  });

  const handleSaveSettings = (section: string) => {
    toast.success(`Cài đặt ${section} đã được lưu thành công!`);
  };

  const handleMaintenanceMode = (enabled: boolean) => {
    setGameSettings({ ...gameSettings, maintenanceMode: enabled });
    if (enabled) {
      toast.warning('Đã bật chế độ bảo trì. Server sẽ từ chối kết nối mới.');
    } else {
      toast.success('Đã tắt chế độ bảo trì. Server hoạt động bình thường.');
    }
  };

  const serverStatus = [
    { name: 'CPU Usage', value: '45%', status: 'good', color: 'text-green-400' },
    { name: 'Memory Usage', value: '67%', status: 'warning', color: 'text-yellow-400' },
    { name: 'Disk Space', value: '23%', status: 'good', color: 'text-green-400' },
    { name: 'Network Load', value: '34%', status: 'good', color: 'text-green-400' },
    { name: 'Database Connections', value: '123/200', status: 'good', color: 'text-green-400' },
    { name: 'Active Sessions', value: '1,203', status: 'good', color: 'text-green-400' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-primary">Cài đặt hệ thống</h2>
        <div className="flex items-center gap-2">
          <Badge className={gameSettings.maintenanceMode 
            ? 'bg-destructive/20 text-destructive border-destructive/30' 
            : 'bg-green-500/20 text-green-300 border-green-500/30'
          }>
            {gameSettings.maintenanceMode ? 'Bảo trì' : 'Hoạt động'}
          </Badge>
        </div>
      </div>

      {/* Server Status Overview */}
      <Card className="p-6 ancient-scroll">
        <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <Server className="w-5 h-5" />
          Trạng thái Server
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {serverStatus.map((stat, index) => (
            <div key={index} className="text-center p-3 bg-secondary/20 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                {getStatusIcon(stat.status)}
              </div>
              <p className="text-sm text-muted-foreground">{stat.name}</p>
              <p className={`font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </Card>

      <Tabs defaultValue="game" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="game">Game Settings</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
          <TabsTrigger value="maintenance">Bảo trì</TabsTrigger>
        </TabsList>

        {/* Game Settings */}
        <TabsContent value="game">
          <Card className="p-6 ancient-scroll">
            <h3 className="text-xl font-bold text-primary mb-6">Cài đặt Game</h3>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSaveSettings('game'); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="serverName">Tên Server</Label>
                  <Input
                    id="serverName"
                    value={gameSettings.serverName}
                    onChange={(e) => setGameSettings({ ...gameSettings, serverName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPlayers">Số người chơi tối đa</Label>
                  <Input
                    id="maxPlayers"
                    type="number"
                    value={gameSettings.maxPlayers}
                    onChange={(e) => setGameSettings({ ...gameSettings, maxPlayers: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experienceRate">Tỷ lệ kinh nghiệm</Label>
                  <Select value={gameSettings.experienceRate.toString()} onValueChange={(value: string) => setGameSettings({ ...gameSettings, experienceRate: parseFloat(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">0.5x (Khó)</SelectItem>
                      <SelectItem value="1.0">1.0x (Bình thường)</SelectItem>
                      <SelectItem value="1.5">1.5x (Dễ)</SelectItem>
                      <SelectItem value="2.0">2.0x (Rất dễ)</SelectItem>
                      <SelectItem value="5.0">5.0x (Test)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dropRate">Tỷ lệ rơi vật phẩm</Label>
                  <Select value={gameSettings.dropRate.toString()} onValueChange={(value: string) => setGameSettings({ ...gameSettings, dropRate: parseFloat(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">0.5x</SelectItem>
                      <SelectItem value="1.0">1.0x</SelectItem>
                      <SelectItem value="1.5">1.5x</SelectItem>
                      <SelectItem value="2.0">2.0x</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                  <div>
                    <Label htmlFor="maintenanceMode">Chế độ bảo trì</Label>
                    <p className="text-sm text-muted-foreground">Tạm dừng tất cả kết nối mới</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={gameSettings.maintenanceMode}
                    onCheckedChange={handleMaintenanceMode}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                  <div>
                    <Label htmlFor="registrationOpen">Cho phép đăng ký</Label>
                    <p className="text-sm text-muted-foreground">Người chơi mới có thể tạo tài khoản</p>
                  </div>
                  <Switch
                    id="registrationOpen"
                    checked={gameSettings.registrationOpen}
                    onCheckedChange={(checked: boolean) => setGameSettings({ ...gameSettings, registrationOpen: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                  <div>
                    <Label htmlFor="chatFilter">Lọc chat</Label>
                    <p className="text-sm text-muted-foreground">Tự động lọc nội dung không phù hợp</p>
                  </div>
                  <Switch
                    id="chatFilter"
                    checked={gameSettings.chatFilter}
                    onCheckedChange={(checked: boolean) => setGameSettings({ ...gameSettings, chatFilter: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                  <div>
                    <Label htmlFor="autoSave">Tự động lưu</Label>
                    <p className="text-sm text-muted-foreground">Lưu dữ liệu định kỳ</p>
                  </div>
                  <Switch
                    id="autoSave"
                    checked={gameSettings.autoSave}
                    onCheckedChange={(checked: boolean) => setGameSettings({ ...gameSettings, autoSave: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="martial-glow">
                  <Save className="w-4 h-4 mr-2" />
                  Lưu cài đặt
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card className="p-6 ancient-scroll">
            <h3 className="text-xl font-bold text-primary mb-6">Cài đặt Thông báo</h3>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSaveSettings('thông báo'); }}>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                  <div>
                    <Label htmlFor="systemAlerts">Cảnh báo hệ thống</Label>
                    <p className="text-sm text-muted-foreground">Thông báo lỗi và cảnh báo quan trọng</p>
                  </div>
                  <Switch
                    id="systemAlerts"
                    checked={notifications.systemAlerts}
                    onCheckedChange={(checked: boolean) => setNotifications({ ...notifications, systemAlerts: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                  <div>
                    <Label htmlFor="playerReports">Báo cáo từ người chơi</Label>
                    <p className="text-sm text-muted-foreground">Thông báo khi có báo cáo vi phạm</p>
                  </div>
                  <Switch
                    id="playerReports"
                    checked={notifications.playerReports}
                    onCheckedChange={(checked: boolean) => setNotifications({ ...notifications, playerReports: checked })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="discordWebhook">Discord Webhook URL</Label>
                  <Input
                    id="discordWebhook"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={notifications.discordWebhook}
                    onChange={(e) => setNotifications({ ...notifications, discordWebhook: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenanceNotice">Thông báo bảo trì</Label>
                  <Textarea
                    id="maintenanceNotice"
                    placeholder="Nội dung thông báo khi bảo trì..."
                    value={notifications.maintenanceNotice}
                    onChange={(e) => setNotifications({ ...notifications, maintenanceNotice: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="martial-glow">
                  <Save className="w-4 h-4 mr-2" />
                  Lưu cài đặt
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card className="p-6 ancient-scroll">
            <h3 className="text-xl font-bold text-primary mb-6">Cài đặt Bảo mật</h3>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSaveSettings('bảo mật'); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Thời gian session (giờ)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity({ ...security, sessionTimeout: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Số lần đăng nhập tối đa</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={security.maxLoginAttempts}
                    onChange={(e) => setSecurity({ ...security, maxLoginAttempts: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logRetentionDays">Lưu log (ngày)</Label>
                  <Input
                    id="logRetentionDays"
                    type="number"
                    value={security.logRetentionDays}
                    onChange={(e) => setSecurity({ ...security, logRetentionDays: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="encryptionLevel">Mức độ mã hóa</Label>
                  <Select value={security.encryptionLevel} onValueChange={(value: string) => setSecurity({ ...security, encryptionLevel: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Thấp</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="high">Cao</SelectItem>
                      <SelectItem value="maximum">Tối đa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ipWhitelist">IP Whitelist (mỗi IP một dòng)</Label>
                <Textarea
                  id="ipWhitelist"
                  placeholder="192.168.1.1&#10;10.0.0.1&#10;..."
                  value={security.ipWhitelist}
                  onChange={(e) => setSecurity({ ...security, ipWhitelist: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                <div>
                  <Label htmlFor="enableTwoFactor">Bắt buộc 2FA cho Admin</Label>
                  <p className="text-sm text-muted-foreground">Yêu cầu xác thực 2 lớp cho tài khoản admin</p>
                </div>
                <Switch
                  id="enableTwoFactor"
                  checked={security.enableTwoFactor}
                  onCheckedChange={(checked: boolean) => setSecurity({ ...security, enableTwoFactor: checked })}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="martial-glow">
                  <Save className="w-4 h-4 mr-2" />
                  Lưu cài đặt
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        {/* Maintenance */}
        <TabsContent value="maintenance">
          <Card className="p-6 ancient-scroll">
            <h3 className="text-xl font-bold text-primary mb-6">Công cụ Bảo trì</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-primary" />
                    <span className="font-medium">Backup Database</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    Tạo bản sao lưu cơ sở dữ liệu
                  </p>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="w-5 h-5 text-primary" />
                    <span className="font-medium">Restart Services</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    Khởi động lại các dịch vụ hệ thống
                  </p>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-primary" />
                    <span className="font-medium">Clear Cache</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    Xóa bộ nhớ đệm hệ thống
                  </p>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start border-destructive/30 hover:bg-destructive/10">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        <span className="font-medium text-destructive">Reset Server</span>
                      </div>
                      <p className="text-sm text-muted-foreground text-left">
                        Khởi động lại hoàn toàn server
                      </p>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="ancient-scroll">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận Reset Server</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc chắn muốn khởi động lại server? Tất cả người chơi sẽ bị ngắt kết nối.
                        Thao tác này có thể mất vài phút để hoàn thành.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive hover:bg-destructive/80">
                        Reset Server
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <Card className="p-4 bg-muted/10">
                <h4 className="font-medium text-primary mb-2">Lịch bảo trì tự động</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Backup tự động:</span>
                    <Badge>Mỗi ngày 3:00 AM</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Dọn dẹp log:</span>
                    <Badge>Mỗi tuần Chủ nhật</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Kiểm tra bảo mật:</span>
                    <Badge>Mỗi ngày 1:00 AM</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}