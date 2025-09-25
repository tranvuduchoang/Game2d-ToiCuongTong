import { useState } from 'react';
import { Card } from '../game/ui/card';
import { Button } from '../game/ui/button';
import { Input } from '../game/ui/input';
import { Label } from '../game/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../game/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../game/ui/table';
import { Badge } from '../game/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../game/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../game/ui/alert-dialog';
import { Checkbox } from '../game/ui/checkbox';
import { Switch } from '../game/ui/switch';
import { Calendar } from '../game/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../game/ui/popover';
import { Ticket, Plus, Trash2, Copy, Edit, Calendar as CalendarIcon, Clock, Users, Gift } from 'lucide-react';
import { toast } from 'sonner';

interface GiftCodeReward {
  id: string;
  name: string;
  type: 'sp' | 'gold' | 'item' | 'technique';
  amount: number;
  icon: string;
}

interface GiftCode {
  id: string;
  code: string;
  name: string;
  description: string;
  rewards: GiftCodeReward[];
  maxUses: number;
  currentUses: number;
  isActive: boolean;
  isPermanent: boolean;
  expiresAt?: string;
  createdAt: string;
  usageLimit: 'once' | 'daily' | 'unlimited';
}

export function GiftCodeManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Mock data
  const [giftCodes, setGiftCodes] = useState<GiftCode[]>([
    {
      id: '1',
      code: 'NEWBIE2024',
      name: 'Gói quà tân thủ',
      description: 'Quà chào mừng cho người chơi mới',
      rewards: [
        { id: '1', name: 'Vàng', type: 'gold', amount: 1000, icon: '💰' },
        { id: '2', name: 'Điểm SP', type: 'sp', amount: 10, icon: '⭐' },
        { id: '3', name: 'Kiếm Thép', type: 'item', amount: 1, icon: '⚔️' }
      ],
      maxUses: 1000,
      currentUses: 245,
      isActive: true,
      isPermanent: true,
      createdAt: '2024-01-01',
      usageLimit: 'once'
    },
    {
      id: '2',
      code: 'EVENT2024',
      name: 'Sự kiện đặc biệt',
      description: 'Giftcode cho sự kiện tháng 1',
      rewards: [
        { id: '4', name: 'Linh thạch', type: 'gold', amount: 500, icon: '💎' },
        { id: '5', name: 'Hồi Thiên Đan', type: 'item', amount: 5, icon: '💊' }
      ],
      maxUses: 500,
      currentUses: 156,
      isActive: true,
      isPermanent: false,
      expiresAt: '2024-01-31',
      createdAt: '2024-01-10',
      usageLimit: 'daily'
    },
    {
      id: '3',
      code: 'EXPIRED123',
      name: 'Giftcode đã hết hạn',
      description: 'Code này đã hết hạn sử dụng',
      rewards: [
        { id: '6', name: 'Vàng', type: 'gold', amount: 200, icon: '💰' }
      ],
      maxUses: 100,
      currentUses: 89,
      isActive: false,
      isPermanent: false,
      expiresAt: '2023-12-31',
      createdAt: '2023-12-01',
      usageLimit: 'once'
    }
  ]);

  const [newRewards, setNewRewards] = useState<GiftCodeReward[]>([]);

  const availableRewards = [
    { id: 'gold', name: 'Vàng', icon: '💰', type: 'gold' as const },
    { id: 'spirit_stone', name: 'Linh thạch', icon: '💎', type: 'gold' as const },
    { id: 'sp_points', name: 'Điểm SP', icon: '⭐', type: 'sp' as const },
    { id: 'sword', name: 'Kiếm', icon: '⚔️', type: 'item' as const },
    { id: 'pill', name: 'Đan dược', icon: '💊', type: 'item' as const },
    { id: 'technique', name: 'Công pháp', icon: '📜', type: 'technique' as const },
  ];

  const handleCreateGiftCode = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const newGiftCode: GiftCode = {
      id: Date.now().toString(),
      code: formData.get('code') as string,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      rewards: newRewards,
      maxUses: parseInt(formData.get('maxUses') as string),
      currentUses: 0,
      isActive: true,
      isPermanent: formData.get('isPermanent') === 'on',
      expiresAt: formData.get('isPermanent') === 'on' ? undefined : selectedDate?.toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      usageLimit: formData.get('usageLimit') as 'once' | 'daily' | 'unlimited'
    };

    setGiftCodes([newGiftCode, ...giftCodes]);
    setIsCreateDialogOpen(false);
    setNewRewards([]);
    setSelectedDate(undefined);
    toast.success(`Giftcode ${newGiftCode.code} đã được tạo thành công!`);
  };

  const handleDeleteGiftCode = (id: string) => {
    setGiftCodes(giftCodes.filter(gc => gc.id !== id));
    toast.success('Giftcode đã được xóa thành công!');
  };

  const handleToggleActive = (id: string) => {
    setGiftCodes(giftCodes.map(gc => 
      gc.id === id ? { ...gc, isActive: !gc.isActive } : gc
    ));
    const giftCode = giftCodes.find(gc => gc.id === id);
    toast.success(`Giftcode ${giftCode?.code} đã được ${giftCode?.isActive ? 'tắt' : 'bật'}!`);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Đã copy mã: ${code}`);
  };

  const addReward = (rewardType: string) => {
    const reward = availableRewards.find(r => r.id === rewardType);
    if (reward) {
      const newReward: GiftCodeReward = {
        id: Date.now().toString(),
        name: reward.name,
        type: reward.type,
        amount: 1,
        icon: reward.icon
      };
      setNewRewards([...newRewards, newReward]);
    }
  };

  const updateRewardAmount = (id: string, amount: number) => {
    setNewRewards(newRewards.map(reward => 
      reward.id === id ? { ...reward, amount: Math.max(1, amount) } : reward
    ));
  };

  const removeReward = (id: string) => {
    setNewRewards(newRewards.filter(reward => reward.id !== id));
  };

  const getStatusColor = (giftCode: GiftCode) => {
    if (!giftCode.isActive) return 'bg-destructive/20 text-destructive border-destructive/30';
    if (!giftCode.isPermanent && giftCode.expiresAt && new Date(giftCode.expiresAt) < new Date()) {
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    }
    return 'bg-green-500/20 text-green-300 border-green-500/30';
  };

  const getStatusText = (giftCode: GiftCode) => {
    if (!giftCode.isActive) return 'Đã tắt';
    if (!giftCode.isPermanent && giftCode.expiresAt && new Date(giftCode.expiresAt) < new Date()) {
      return 'Hết hạn';
    }
    return 'Hoạt động';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-primary">Quản lý Giftcode</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="martial-glow">
              <Plus className="w-4 h-4 mr-2" />
              Tạo Giftcode mới
            </Button>
          </DialogTrigger>
          <DialogContent className="ancient-scroll max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-primary">Tạo Giftcode mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateGiftCode} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Mã Giftcode</Label>
                  <Input id="code" name="code" placeholder="VD: NEWBIE2024" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Tên giftcode</Label>
                  <Input id="name" name="name" placeholder="VD: Gói quà tân thủ" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Input id="description" name="description" placeholder="Mô tả ngắn về giftcode" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxUses">Số lượt sử dụng tối đa</Label>
                  <Input id="maxUses" name="maxUses" type="number" min="1" defaultValue="100" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usageLimit">Giới hạn sử dụng</Label>
                  <Select name="usageLimit" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giới hạn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Một lần duy nhất</SelectItem>
                      <SelectItem value="daily">Mỗi ngày một lần</SelectItem>
                      <SelectItem value="unlimited">Không giới hạn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Expiry Settings */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="isPermanent" name="isPermanent" />
                  <Label htmlFor="isPermanent">Giftcode vĩnh viễn</Label>
                </div>
                
                <div className="space-y-2">
                  <Label>Ngày hết hạn (nếu không vĩnh viễn)</Label>
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? selectedDate.toLocaleDateString('vi-VN') : "Chọn ngày hết hạn"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date: Date | undefined) => {
                          setSelectedDate(date);
                          setIsDatePickerOpen(false);
                        }}
                        disabled={(date: Date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Rewards Section */}
              <div className="space-y-4">
                <Label>Phần thưởng</Label>
                <div className="grid grid-cols-3 gap-2">
                  {availableRewards.map(reward => (
                    <Button
                      key={reward.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addReward(reward.id)}
                      className="justify-start"
                    >
                      <span className="mr-2">{reward.icon}</span>
                      {reward.name}
                    </Button>
                  ))}
                </div>

                {newRewards.length > 0 && (
                  <div className="space-y-2">
                    <Label>Danh sách phần thưởng:</Label>
                    {newRewards.map(reward => (
                      <div key={reward.id} className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                        <span>{reward.icon}</span>
                        <span className="flex-1">{reward.name}</span>
                        <Input
                          type="number"
                          min="1"
                          value={reward.amount}
                          onChange={(e) => updateRewardAmount(reward.id, parseInt(e.target.value) || 1)}
                          className="w-20"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeReward(reward.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" className="martial-glow" disabled={newRewards.length === 0}>
                  Tạo Giftcode
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* GiftCodes Table */}
      <Card className="ancient-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã / Tên</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Phần thưởng</TableHead>
              <TableHead>Sử dụng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hết hạn</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {giftCodes.map((giftCode) => (
              <TableRow key={giftCode.id}>
                <TableCell>
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="bg-secondary/30 px-2 py-1 rounded text-sm font-mono">
                        {giftCode.code}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(giftCode.code)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="font-medium mt-1">{giftCode.name}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-muted-foreground">{giftCode.description}</p>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {giftCode.rewards.map(reward => (
                      <Badge key={reward.id} variant="outline" className="text-xs">
                        {reward.icon} {reward.name} x{reward.amount}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{giftCode.currentUses} / {giftCode.maxUses}</p>
                    <div className="w-20 bg-secondary/30 rounded-full h-2 mt-1">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(giftCode.currentUses / giftCode.maxUses) * 100}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(giftCode)}>
                    {getStatusText(giftCode)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {giftCode.isPermanent ? (
                      <Badge variant="secondary">
                        <Clock className="w-3 h-3 mr-1" />
                        Vĩnh viễn
                      </Badge>
                    ) : (
                      <span className={new Date(giftCode.expiresAt!) < new Date() ? 'text-destructive' : 'text-foreground'}>
                        {new Date(giftCode.expiresAt!).toLocaleDateString('vi-VN')}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Switch
                      checked={giftCode.isActive}
                      onCheckedChange={() => handleToggleActive(giftCode.id)}
                    />
                    <Button size="sm" variant="ghost">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="ancient-scroll">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa giftcode</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa giftcode "{giftCode.code}"? 
                            Hành động này không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteGiftCode(giftCode.id)}
                            className="bg-destructive hover:bg-destructive/80"
                          >
                            Xóa giftcode
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}