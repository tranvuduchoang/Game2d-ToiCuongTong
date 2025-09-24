import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { 
  Package, 
  Crown, 
  Gem, 
  Hand, 
  Shirt, 
  Footprints,
  Plus,
  Star,
  Sword,
  Shield,
  Zap
} from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  slot: string;
  quality: 'common' | 'fine' | 'spiritual' | 'supreme' | 'divine';
  tier: string;
  grade: string;
  stats: { [key: string]: number };
  affixes: string[];
  equipped: boolean;
}

interface InventoryItem {
  id: string;
  name: string;
  type: 'equipment' | 'material' | 'consumable' | 'technique';
  quality: string;
  quantity: number;
  description: string;
}

export function EquipmentInventory() {
  const equipmentSlots = [
    { id: 'head', name: 'Đầu', icon: Crown },
    { id: 'neck', name: 'Cổ', icon: Gem },
    { id: 'leftHand', name: 'Tay Trái', icon: Hand },
    { id: 'rightHand', name: 'Tay Phải', icon: Hand },
    { id: 'chest', name: 'Ngực', icon: Shirt },
    { id: 'legs', name: 'Chân', icon: Footprints },
    { id: 'ring', name: 'Nhẫn Trữ Vật', icon: Gem }
  ];

  const equippedItems: { [key: string]: Equipment } = {
    head: {
      id: 'helm1',
      name: 'Phục Ma Quan',
      slot: 'head',
      quality: 'spiritual',
      tier: 'Huyền',
      grade: 'Trung',
      stats: { def: 25, hp: 150, resPsn: 10 },
      affixes: ['Tăng 5% kháng độc', 'Hồi 2 HP/giây'],
      equipped: true
    },
    rightHand: {
      id: 'weapon1',
      name: 'Thanh Phong Kiếm',
      slot: 'rightHand',
      quality: 'fine',
      tier: 'Hoàng',
      grade: 'Cao',
      stats: { str: 35, agi: 12, cr: 8 },
      affixes: ['Tăng 10% tốc độ đánh', 'Có 5% khả năng gây choáng'],
      equipped: true
    }
  };

  const inventory: InventoryItem[] = [
    {
      id: 'sword2',
      name: 'Thiết Huyết Đao',
      type: 'equipment',
      quality: 'supreme',
      quantity: 1,
      description: 'Vũ khí uy lực, tăng sát thương chí mạng'
    },
    {
      id: 'herb1',
      name: 'Linh Thảo',
      type: 'material',
      quality: 'common',
      quantity: 25,
      description: 'Nguyên liệu luyện đan cơ bản'
    },
    {
      id: 'pill1',
      name: 'Hồi Khí Đan',
      type: 'consumable',
      quality: 'fine',
      quantity: 8,
      description: 'Hồi phục 200 MP'
    }
  ];

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'common': return 'text-slate-600 bg-slate-100';
      case 'fine': return 'text-green-600 bg-green-100';
      case 'spiritual': return 'text-blue-600 bg-blue-100';
      case 'supreme': return 'text-purple-600 bg-purple-100';
      case 'divine': return 'text-orange-600 bg-orange-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getQualityName = (quality: string) => {
    switch (quality) {
      case 'common': return 'Thường';
      case 'fine': return 'Tinh Xảo';
      case 'spiritual': return 'Linh Phẩm';
      case 'supreme': return 'Cực Phẩm';
      case 'divine': return 'Thần Phẩm';
      default: return 'Thường';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="equipment" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="equipment">Trang Bị</TabsTrigger>
          <TabsTrigger value="inventory">Kho Đồ</TabsTrigger>
        </TabsList>

        <TabsContent value="equipment" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Equipment Slots */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shirt className="w-4 h-4" />
                  Trang Bị Hiện Tại
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {equipmentSlots.map((slot) => {
                    const Icon = slot.icon;
                    const equipped = equippedItems[slot.id];
                    
                    return (
                      <div
                        key={slot.id}
                        className={`p-3 border-2 border-dashed rounded-lg transition-colors ${
                          equipped 
                            ? 'border-blue-300 bg-blue-50' 
                            : 'border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-slate-600" />
                          <span className="text-sm text-slate-700">{slot.name}</span>
                        </div>
                        
                        {equipped ? (
                          <div className="space-y-1">
                            <div className="text-sm">{equipped.name}</div>
                            <Badge 
                              className={`text-xs ${getQualityColor(equipped.quality)}`}
                            >
                              {getQualityName(equipped.quality)}
                            </Badge>
                            <div className="text-xs text-slate-600">
                              {equipped.tier} {equipped.grade}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-12">
                            <Plus className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Equipment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Chi Tiết Trang Bị</CardTitle>
              </CardHeader>
              <CardContent>
                {equippedItems.rightHand ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-base">{equippedItems.rightHand.name}</h4>
                        <Badge className={getQualityColor(equippedItems.rightHand.quality)}>
                          {getQualityName(equippedItems.rightHand.quality)}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600 mb-3">
                        {equippedItems.rightHand.tier} {equippedItems.rightHand.grade}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h5 className="text-sm mb-2">Thuộc Tính</h5>
                      <div className="space-y-1">
                        {Object.entries(equippedItems.rightHand.stats).map(([stat, value]) => (
                          <div key={stat} className="flex justify-between text-sm">
                            <span className="text-slate-600 capitalize">{stat.toUpperCase()}</span>
                            <span className="text-green-600">+{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h5 className="text-sm mb-2">Affix Đặc Biệt</h5>
                      <div className="space-y-1">
                        {equippedItems.rightHand.affixes.map((affix, index) => (
                          <div key={index} className="text-xs p-2 bg-amber-50 rounded border-l-2 border-amber-300">
                            <Star className="w-3 h-3 inline mr-1 text-amber-500" />
                            {affix}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      Tháo Trang Bị
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 py-8">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Chọn một trang bị để xem chi tiết</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg">Kho Đồ (Dung lượng: 45/100)</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Sắp Xếp</Button>
              <Button variant="outline" size="sm">Lọc</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {inventory.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-3">
                  <div className="aspect-square bg-slate-100 rounded mb-2 flex items-center justify-center">
                    {item.type === 'equipment' && <Sword className="w-6 h-6 text-slate-600" />}
                    {item.type === 'material' && <Gem className="w-6 h-6 text-slate-600" />}
                    {item.type === 'consumable' && <Zap className="w-6 h-6 text-slate-600" />}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs truncate">{item.name}</div>
                    <Badge className={`text-xs ${getQualityColor(item.quality)}`}>
                      {getQualityName(item.quality)}
                    </Badge>
                    {item.quantity > 1 && (
                      <div className="text-xs text-slate-600">x{item.quantity}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: 12 }).map((_, index) => (
              <Card key={`empty-${index}`} className="opacity-50">
                <CardContent className="p-3">
                  <div className="aspect-square bg-slate-50 rounded border-2 border-dashed border-slate-200 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-slate-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}