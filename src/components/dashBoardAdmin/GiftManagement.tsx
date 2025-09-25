import { useState } from 'react';
import { Card } from '../game/ui/card';
import { Button } from '../game/ui/button';
import { Input } from '../game/ui/input';
import { Label } from '../game/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../game/ui/select';
import { Textarea } from '../game/ui/textarea';
import { Badge } from '../game/ui/badge';
import { Checkbox } from '../game/ui/checkbox';
import { Search, Gift, Send, User, Sparkles, Sword, Star, Gem } from 'lucide-react';
import { toast } from 'sonner';

interface GiftItem {
  id: string;
  name: string;
  type: 'sp' | 'technique' | 'item' | 'resource';
  icon: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Player {
  id: string;
  username: string;
  level: number;
  sect: string;
  status: 'online' | 'offline';
}

export function GiftManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedGifts, setSelectedGifts] = useState<string[]>([]);
  const [giftAmounts, setGiftAmounts] = useState<Record<string, number>>({});
  const [giftMessage, setGiftMessage] = useState('');

  // Mock data
  const players: Player[] = [
    { id: '1', username: 'TieuDaoThan123', level: 45, sect: 'Thiên Kiếm Tông', status: 'online' },
    { id: '2', username: 'VoLamKiemKhach', level: 78, sect: 'Huyền Thiên Tông', status: 'offline' },
    { id: '3', username: 'ThienHaVoSong', level: 23, sect: 'Vô Cực Tông', status: 'online' },
    { id: '4', username: 'KiemTongChiTon', level: 56, sect: 'Thiên Kiếm Tông', status: 'online' },
    { id: '5', username: 'HuyenThienDaoNhan', level: 89, sect: 'Huyền Thiên Tông', status: 'offline' }
  ];

  const giftItems: GiftItem[] = [
    {
      id: 'sp_free',
      name: 'Điểm SP tự do',
      type: 'sp',
      icon: '⭐',
      description: 'Điểm kỹ năng có thể phân bổ tự do',
      rarity: 'common'
    },
    {
      id: 'gold',
      name: 'Vàng',
      type: 'resource',
      icon: '💰',
      description: 'Tiền tệ chính trong game',
      rarity: 'common'
    },
    {
      id: 'spirit_stone',
      name: 'Linh thạch',
      type: 'resource',
      icon: '💎',
      description: 'Tiền tệ cao cấp dùng trong tu luyện',
      rarity: 'rare'
    },
    {
      id: 'technique_basic',
      name: 'Công pháp Cơ Bản',
      type: 'technique',
      icon: '📜',
      description: 'Công pháp tu luyện cấp độ cơ bản',
      rarity: 'common'
    },
    {
      id: 'technique_advanced',
      name: 'Công pháp Cao Cấp',
      type: 'technique',
      icon: '📋',
      description: 'Công pháp tu luyện cấp độ cao cấp',
      rarity: 'epic'
    },
    {
      id: 'technique_legendary',
      name: 'Công pháp Huyền Thoại',
      type: 'technique',
      icon: '📚',
      description: 'Công pháp tu luyện cấp độ huyền thoại',
      rarity: 'legendary'
    },
    {
      id: 'weapon_sword',
      name: 'Thiên Kiếm',
      type: 'item',
      icon: '⚔️',
      description: 'Kiếm pháp khí cấp cao',
      rarity: 'epic'
    },
    {
      id: 'armor_robe',
      name: 'Thiên Tằm Bảo Y',
      type: 'item',
      icon: '👘',
      description: 'Áo giáp phòng thủ tuyệt đỉnh',
      rarity: 'legendary'
    },
    {
      id: 'pill_healing',
      name: 'Hồi Thiên Đan',
      type: 'item',
      icon: '💊',
      description: 'Đan dược hồi phục thương tích',
      rarity: 'rare'
    },
    {
      id: 'pill_cultivation',
      name: 'Tu Vi Đan',
      type: 'item',
      icon: '🌟',
      description: 'Đan dược tăng tốc tu luyện',
      rarity: 'epic'
    }
  ];

  const filteredPlayers = players.filter(player =>
    player.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black';
      case 'epic':
        return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white';
      case 'rare':
        return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sp':
        return <Star className="w-4 h-4" />;
      case 'technique':
        return <Sparkles className="w-4 h-4" />;
      case 'item':
        return <Sword className="w-4 h-4" />;
      case 'resource':
        return <Gem className="w-4 h-4" />;
      default:
        return <Gift className="w-4 h-4" />;
    }
  };

  const handleGiftSelection = (giftId: string, checked: boolean) => {
    if (checked) {
      setSelectedGifts([...selectedGifts, giftId]);
      setGiftAmounts({ ...giftAmounts, [giftId]: 1 });
    } else {
      setSelectedGifts(selectedGifts.filter(id => id !== giftId));
      const newAmounts = { ...giftAmounts };
      delete newAmounts[giftId];
      setGiftAmounts(newAmounts);
    }
  };

  const handleAmountChange = (giftId: string, amount: number) => {
    setGiftAmounts({ ...giftAmounts, [giftId]: Math.max(1, amount) });
  };

  const handleSendGifts = () => {
    if (!selectedPlayer) {
      toast.error('Vui lòng chọn người chơi để tặng quà!');
      return;
    }
    
    if (selectedGifts.length === 0) {
      toast.error('Vui lòng chọn ít nhất một món quà!');
      return;
    }

    const giftList = selectedGifts.map(giftId => {
      const gift = giftItems.find(g => g.id === giftId);
      return `${gift?.name} x${giftAmounts[giftId] || 1}`;
    }).join(', ');

    toast.success(
      `Đã gửi quà cho ${selectedPlayer.username}: ${giftList}`,
      { duration: 5000 }
    );

    // Reset form
    setSelectedGifts([]);
    setGiftAmounts({});
    setGiftMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-primary">Tặng quà người chơi</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Gift className="w-4 h-4" />
          Gửi quà tặng trực tiếp cho người chơi
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Player Selection */}
        <Card className="p-6 ancient-scroll">
          <h3 className="text-xl font-bold text-primary mb-4">Chọn người chơi</h3>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm người chơi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {filteredPlayers.map((player) => (
                <div
                  key={player.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedPlayer?.id === player.id
                      ? 'border-primary bg-primary/10 martial-glow'
                      : 'border-border hover:border-primary/50 hover:bg-secondary/20'
                  }`}
                  onClick={() => setSelectedPlayer(player)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{player.username}</p>
                        <p className="text-sm text-muted-foreground">
                          Level {player.level} • {player.sect}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      className={player.status === 'online' 
                        ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }
                    >
                      {player.status === 'online' ? 'Trực tuyến' : 'Ngoại tuyến'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Gift Selection */}
        <Card className="p-6 ancient-scroll">
          <h3 className="text-xl font-bold text-primary mb-4">Chọn món quà</h3>
          
          <div className="max-h-80 overflow-y-auto space-y-3">
            {giftItems.map((gift) => (
              <div
                key={gift.id}
                className={`p-3 rounded-lg border transition-all ${
                  selectedGifts.includes(gift.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedGifts.includes(gift.id)}
                    onCheckedChange={(checked: boolean) => handleGiftSelection(gift.id, checked)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{gift.icon}</span>
                      <span className="font-medium">{gift.name}</span>
                      {getTypeIcon(gift.type)}
                      <Badge className={`text-xs ${getRarityColor(gift.rarity)}`}>
                        {gift.rarity === 'legendary' ? 'Huyền thoại' :
                         gift.rarity === 'epic' ? 'Sử thi' :
                         gift.rarity === 'rare' ? 'Hiếm' : 'Thường'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{gift.description}</p>
                    
                    {selectedGifts.includes(gift.id) && (
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`amount-${gift.id}`} className="text-sm">Số lượng:</Label>
                        <Input
                          id={`amount-${gift.id}`}
                          type="number"
                          min="1"
                          value={giftAmounts[gift.id] || 1}
                          onChange={(e) => handleAmountChange(gift.id, parseInt(e.target.value) || 1)}
                          className="w-20 h-8"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Gift Summary & Send */}
      <Card className="p-6 ancient-scroll">
        <h3 className="text-xl font-bold text-primary mb-4">Xác nhận tặng quà</h3>
        
        <div className="space-y-4">
          {selectedPlayer && (
            <div className="p-4 bg-secondary/20 rounded-lg">
              <p className="font-medium text-primary">Người nhận: {selectedPlayer.username}</p>
              <p className="text-sm text-muted-foreground">
                Level {selectedPlayer.level} • {selectedPlayer.sect} • {selectedPlayer.status === 'online' ? 'Đang trực tuyến' : 'Ngoại tuyến'}
              </p>
            </div>
          )}

          {selectedGifts.length > 0 && (
            <div className="p-4 bg-accent/10 rounded-lg">
              <p className="font-medium text-accent mb-2">Danh sách quà tặng:</p>
              <div className="space-y-1">
                {selectedGifts.map(giftId => {
                  const gift = giftItems.find(g => g.id === giftId);
                  return (
                    <div key={giftId} className="text-sm">
                      {gift?.icon} {gift?.name} x{giftAmounts[giftId] || 1}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Lời nhắn (tùy chọn)</Label>
            <Textarea
              id="message"
              placeholder="Nhập lời nhắn gửi kèm quà tặng..."
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSendGifts}
              disabled={!selectedPlayer || selectedGifts.length === 0}
              className="martial-glow"
            >
              <Send className="w-4 h-4 mr-2" />
              Gửi quà tặng
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}