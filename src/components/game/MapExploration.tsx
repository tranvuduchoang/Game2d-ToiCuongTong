import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Mountain, 
  Trees, 
  Skull, 
  Gem, 
  Scroll, 
  Zap,
  MapPin,
  Eye,
  Lock,
  Compass,
  Swords,
  Shield
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MapCell {
  id: string;
  type: 'unexplored' | 'explored' | 'current' | 'enemy' | 'treasure' | 'resource' | 'event';
  difficulty?: number;
  discovered?: boolean;
}

const mapRegions = [
  {
    id: 'forest',
    name: 'Rừng Nguyên Sinh',
    description: 'Khu rừng cổ thụ với nhiều linh thảo quý hiếm',
    image: 'https://images.unsplash.com/photo-1559720738-78a58d915d39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwZm9yZXN0JTIwbXlzdGljYWx8ZW58MXx8fHwxNzU4NzIxNzc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    difficulty: 'Phàm Nhân',
    unlocked: true,
    theme: 'forest'
  },
  {
    id: 'swamp',
    name: 'Đầm Lầy Hắc Ám',
    description: 'Vùng đất nguy hiểm với nhiều độc tố và ma khí',
    image: 'https://images.unsplash.com/photo-1593432078727-956a55f333c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwc3dhbXAlMjBteXN0ZXJpb3VzfGVufDF8fHx8MTc1ODcyMTc4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    difficulty: 'Tiên Nhân',
    unlocked: true,
    theme: 'swamp'
  },
  {
    id: 'ancient',
    name: 'Thành Cổ Ngàn Năm',
    description: 'Di tích cổ xưa chứa đựng nhiều bí ẩn',
    image: 'https://images.unsplash.com/photo-1626088413336-d694ee55440a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwdGVtcGxlJTIwcnVpbnN8ZW58MXx8fHwxNzU4NzIxNzg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    difficulty: 'Thánh Nhân',
    unlocked: false,
    theme: 'ancient'
  }
];

export function MapExploration() {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 25, y: 25 });
  const [activeRegion, setActiveRegion] = useState('forest');
  const [mapData, setMapData] = useState<MapCell[][]>([]);

  // Tạo bản đồ 50x50 với dữ liệu mẫu
  const generateMap = (): MapCell[][] => {
    const map: MapCell[][] = [];
    for (let y = 0; y < 50; y++) {
      const row: MapCell[] = [];
      for (let x = 0; x < 50; x++) {
        const distance = Math.abs(x - playerPosition.x) + Math.abs(y - playerPosition.y);
        let type: MapCell['type'] = 'unexplored';
        
        if (x === playerPosition.x && y === playerPosition.y) {
          type = 'current';
        } else if (distance <= 3 && Math.random() > 0.7) {
          const rand = Math.random();
          if (rand < 0.3) type = 'enemy';
          else if (rand < 0.5) type = 'treasure';
          else if (rand < 0.7) type = 'resource';
          else type = 'event';
        } else if (distance <= 2) {
          type = 'explored';
        }

        row.push({
          id: `${x}-${y}`,
          type,
          difficulty: Math.floor(Math.random() * 5) + 1,
          discovered: distance <= 2
        });
      }
      map.push(row);
    }
    return map;
  };

  // Generate map data on client side only
  useEffect(() => {
    setMapData(generateMap());
  }, [playerPosition]);

  const getCellIcon = (cell: MapCell) => {
    switch (cell.type) {
      case 'current': return <MapPin className="w-3 h-3 text-blue-600" />;
      case 'enemy': return <Skull className="w-3 h-3 text-red-500" />;
      case 'treasure': return <Gem className="w-3 h-3 text-yellow-500" />;
      case 'resource': return <Trees className="w-3 h-3 text-green-500" />;
      case 'event': return <Scroll className="w-3 h-3 text-purple-500" />;
      default: return null;
    }
  };

  const getCellColor = (cell: MapCell, theme: string) => {
    if (!cell.discovered) return 'bg-muted/50';
    
    const themeClasses: { [key: string]: { [key: string]: string } } = {
      forest: {
        'current': 'bg-primary ring-2 ring-primary/50 martial-glow',
        'explored': 'bg-jade-green/20 hover:bg-jade-green/30',
        'enemy': 'bg-destructive/30 hover:bg-destructive/40',
        'treasure': 'bg-primary/40 hover:bg-primary/50',
        'resource': 'bg-accent/40 hover:bg-accent/50',
        'event': 'bg-secondary/40 hover:bg-secondary/50',
        'default': 'bg-muted hover:bg-muted/80'
      },
      swamp: {
        'current': 'bg-primary ring-2 ring-primary/50 martial-glow',
        'explored': 'bg-mountain-mist/30 hover:bg-mountain-mist/40',
        'enemy': 'bg-destructive/40 hover:bg-destructive/50',
        'treasure': 'bg-primary/50 hover:bg-primary/60',
        'resource': 'bg-bronze-brown/30 hover:bg-bronze-brown/40',
        'event': 'bg-mystic-purple/30 hover:bg-mystic-purple/40',
        'default': 'bg-muted/60 hover:bg-muted/80'
      },
      ancient: {
        'current': 'bg-primary ring-2 ring-primary/50 martial-glow',
        'explored': 'bg-bronze-brown/30 hover:bg-bronze-brown/40',
        'enemy': 'bg-destructive/50 hover:bg-destructive/60',
        'treasure': 'bg-primary/60 hover:bg-primary/70',
        'resource': 'bg-accent/50 hover:bg-accent/60',
        'event': 'bg-secondary/50 hover:bg-secondary/60',
        'default': 'bg-muted/70 hover:bg-muted/90'
      }
    };
    
    return themeClasses[theme]?.[cell.type] || themeClasses[theme]?.['default'] || 'bg-muted';
  };

  const visibleRange = 10; // Hiển thị 20x20 ô xung quanh người chơi
  const startX = Math.max(0, playerPosition.x - visibleRange);
  const endX = Math.min(50, playerPosition.x + visibleRange + 1);
  const startY = Math.max(0, playerPosition.y - visibleRange);
  const endY = Math.min(50, playerPosition.y + visibleRange + 1);

  // Show loading state while map data is being generated
  if (mapData.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        <div className="lg:col-span-3">
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Đang tạo bản đồ...</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-32 bg-card rounded-lg animate-pulse"></div>
          <div className="h-32 bg-card rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* Bản đồ chính */}
      <div className="lg:col-span-3">
        <Tabs value={activeRegion} onValueChange={setActiveRegion} className="h-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 bg-card/50">
            {mapRegions.map((region) => (
              <TabsTrigger 
                key={region.id} 
                value={region.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                disabled={!region.unlocked}
              >
                <div className="flex items-center gap-2">
                  {!region.unlocked && <Lock className="w-3 h-3" />}
                  <span className="text-xs">{region.name}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {mapRegions.map((region) => (
            <TabsContent key={region.id} value={region.id} className="h-[calc(100%-60px)]">
              <Card className={`h-full sect-border ${region.theme === 'forest' ? 'map-theme-forest' : region.theme === 'swamp' ? 'map-theme-swamp' : 'map-theme-ancient'}`}>
                <CardHeader className="relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <ImageWithFallback 
                      src={region.image}
                      alt={region.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <Compass className="w-5 h-5 floating-animation" />
                        {region.name}
                      </CardTitle>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-accent power-pulse" />
                          <span className="text-sm text-foreground">Thể lực: 75/100</span>
                        </div>
                        <Badge variant="outline" className="border-primary text-primary">
                          Vị trí: ({playerPosition.x}, {playerPosition.y})
                        </Badge>
                        <Badge 
                          variant={region.difficulty === 'Phàm Nhân' ? 'secondary' : region.difficulty === 'Tiên Nhân' ? 'default' : 'destructive'}
                          className="martial-glow"
                        >
                          {region.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{region.description}</p>
                    <Progress value={75} className="h-3 mt-2 qi-flow" />
                  </div>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="grid gap-1 p-4 ancient-scroll rounded-lg overflow-auto max-h-96"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {mapData.slice(startY, endY).map((row, y) => (
                      <div key={y} className="flex gap-1">
                        {row.slice(startX, endX).map((cell, x) => (
                          <motion.button
                            key={cell.id}
                            className={`w-4 h-4 rounded-sm transition-all duration-300 flex items-center justify-center ${getCellColor(cell, region.theme)} ${
                              selectedCell === cell.id ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => setSelectedCell(cell.id)}
                            disabled={!cell.discovered && cell.type !== 'current'}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {getCellIcon(cell)}
                          </motion.button>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Panel thông tin bên phải */}
      <div className="space-y-4">
        {/* Chú thích */}
        <Card className="ancient-scroll martial-glow">
          <CardHeader>
            <CardTitle className="text-sm text-primary flex items-center gap-2">
              <Eye className="w-4 h-4 floating-animation" />
              Chú Thích
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <motion.div 
              className="flex items-center gap-2 text-xs"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-3 h-3 bg-primary rounded-sm martial-glow"></div>
              <span className="text-foreground">Vị trí hiện tại</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 text-xs"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-3 h-3 bg-muted rounded-sm"></div>
              <span className="text-foreground">Đã khám phá</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 text-xs"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-3 h-3 bg-destructive/30 rounded-sm flex items-center justify-center">
                <Skull className="w-2 h-2 text-destructive" />
              </div>
              <span className="text-foreground">Quái vật</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 text-xs"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-3 h-3 bg-primary/40 rounded-sm flex items-center justify-center">
                <Gem className="w-2 h-2 text-primary power-pulse" />
              </div>
              <span className="text-foreground">Báu vật</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 text-xs"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-3 h-3 bg-accent/40 rounded-sm flex items-center justify-center">
                <Trees className="w-2 h-2 text-accent" />
              </div>
              <span className="text-foreground">Tài nguyên</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 text-xs"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-3 h-3 bg-secondary/40 rounded-sm flex items-center justify-center">
                <Scroll className="w-2 h-2 text-secondary-foreground" />
              </div>
              <span className="text-foreground">Sự kiện</span>
            </motion.div>
          </CardContent>
        </Card>

        {/* Thông tin ô được chọn */}
        {selectedCell && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="ancient-scroll martial-glow">
              <CardHeader>
                <CardTitle className="text-sm text-primary flex items-center gap-2">
                  <MapPin className="w-4 h-4 power-pulse" />
                  Chi Tiết Khu Vực
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm">
                    <div className="text-xs text-muted-foreground mb-1">Tọa độ</div>
                    <div className="text-primary font-semibold">{selectedCell}</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-xs text-muted-foreground mb-2">Độ khó</div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <motion.div
                          key={level}
                          className={`w-3 h-3 rounded-full ${
                            level <= 3 ? 'bg-primary martial-glow' : 'bg-muted'
                          }`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: level * 0.1 }}
                        />
                      ))}
                    </div>
                  </div>
                  <Button size="sm" className="w-full martial-glow power-pulse">
                    <Swords className="w-3 h-3 mr-2" />
                    Khám Phá (Tốn 5 Thể Lực)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Nhiệm vụ hiện tại */}
        <Card className="ancient-scroll martial-glow">
          <CardHeader>
            <CardTitle className="text-sm text-primary flex items-center gap-2">
              <Scroll className="w-4 h-4 floating-animation" />
              Nhiệm Vụ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-xs">
              <motion.div 
                className="p-3 bg-primary/10 rounded border-l-4 border-primary ancient-scroll"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-primary font-semibold">⭐ Thiên cấp: Tìm Linh Thảo Ngàn Năm</div>
                <Progress value={60} className="h-2 mt-2 qi-flow" />
                <div className="text-primary/80 mt-1 font-medium">3/5 hoàn thành</div>
              </motion.div>
              <motion.div 
                className="p-3 bg-accent/10 rounded border-l-4 border-accent ancient-scroll"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-accent-foreground font-semibold">🗡️ Địa cấp: Đánh bại 10 Ma Thú</div>
                <Progress value={80} className="h-2 mt-2 qi-flow" />
                <div className="text-accent-foreground/80 mt-1 font-medium">8/10 hoàn thành</div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}