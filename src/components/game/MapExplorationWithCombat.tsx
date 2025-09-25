"use client";

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
  Shield,
  Sword,
  CheckCircle,
  Cloud
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { api } from "../../lib/api";

interface MapCell {
  id: string;
  type: 'unexplored' | 'explored' | 'current' | 'enemy' | 'treasure' | 'resource' | 'event';
  difficulty?: number;
  discovered?: boolean;
  monsterId?: number;
  monsterName?: string;
  monsterLevel?: number;
  completed?: boolean; // For completed events
  retreated?: boolean; // For retreated from combat
}

interface MapData {
  id: number;
  name: string;
  description: string;
  difficulty: string;
  unlocked: boolean;
  playerPosition: { x: number; y: number };
  stamina: { current: number; max: number };
  tiles: MapCell[][];
}

interface MonsterEncounter {
  id: number;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  stats: Record<string, number>;
  image?: string;
}

export function MapExplorationWithCombat() {
  const [activeMap, setActiveMap] = useState('forest');
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [encounteredMonster, setEncounteredMonster] = useState<MonsterEncounter | null>(null);
  const [showCombat, setShowCombat] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('pham_nhan');
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);

  // Mock player data - replace with real API call
  const mockPlayerData = {
    id: 1,
    name: "Tối Cường Tông",
    cultivation: "Luyện thể tầng 3",
    currentRealmId: 1,
    currentSublevel: 3,
    experience: 1250,
    maxExperience: 2000,
    spiritStones: 500,
    gold: 1200,
    reputation: 100,
    currentStamina: 80,
    maxStamina: 100,
    cultivationLevel: 3,
    cultivationRealm: "Luyện thể"
  };

  // Map difficulty levels with unlock requirements
  const mapDifficulties = [
    {
      id: 'pham_nhan',
      name: 'Phàm nhân',
      description: 'Cấp độ cơ bản, phù hợp cho người mới bắt đầu',
      unlockRequirement: { realmId: 1, sublevel: 1 }, // Luyện thể tầng 1
      unlocked: true
    },
    {
      id: 'tien_nhan',
      name: 'Tiên nhân',
      description: 'Cấp độ trung bình, cần tu vi cao hơn',
      unlockRequirement: { realmId: 2, sublevel: 1 }, // Luyện khí tầng 1
      unlocked: mockPlayerData.currentRealmId >= 2
    },
    {
      id: 'thanh_nhan',
      name: 'Thánh nhân',
      description: 'Cấp độ cao nhất, chỉ dành cho cao thủ',
      unlockRequirement: { realmId: 3, sublevel: 1 }, // Luyện thần tầng 1
      unlocked: mockPlayerData.currentRealmId >= 3
    }
  ];

  // Check if player can unlock a difficulty level
  const canUnlockDifficulty = (difficulty: any) => {
    return mockPlayerData.currentRealmId >= difficulty.unlockRequirement.realmId;
  };

  // Get current difficulty info
  const currentDifficulty = mapDifficulties.find(d => d.id === selectedDifficulty);

  const mapRegions = [
    {
      id: 'forest',
      name: 'Rừng Nguyên Sinh',
      description: 'Khu rừng cổ thụ với nhiều linh thảo quý hiếm',
      image: 'https://images.unsplash.com/photo-1559720738-78a58d915d39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwZm9yZXN0JTIwbXlzdGljYWx8ZW58MXx8fHwxNzU4NzIxNzc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      difficulty: currentDifficulty?.name || 'Phàm Nhân',
      unlocked: true,
      theme: 'forest',
      hasDifficultySelection: true
    },
    {
      id: 'swamp',
      name: 'Đầm Lầy Hắc Ám',
      description: 'Vùng đất nguy hiểm với nhiều độc tố và ma khí',
      image: 'https://images.unsplash.com/photo-1593432078727-956a55f333c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwc3dhbXAlMjBteXN0ZXJpb3VzfGVufDF8fHx8MTc1ODcyMTc4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      difficulty: 'Tiên Nhân',
      unlocked: true,
      theme: 'swamp',
      hasDifficultySelection: false
    },
    {
      id: 'city',
      name: 'Thành Cổ Ngàn Năm',
      description: 'Thành phố cổ đại với nhiều bí mật và kho báu',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwY2l0eSUyMGNpdmlsaXphdGlvbnxlbnwxfHx8fDE3NTg3MjE3ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      difficulty: 'Thánh Nhân',
      unlocked: false,
      theme: 'city',
      hasDifficultySelection: false
    }
  ];

  useEffect(() => {
    loadMapData(activeMap);
  }, [activeMap]);

  const loadMapData = async (mapId: string) => {
    setIsLoading(true);
    try {
      // For now, generate mock data
      const mockMapData: MapData = {
        id: 1,
        name: mapRegions.find(r => r.id === mapId)?.name || 'Unknown Map',
        description: mapRegions.find(r => r.id === mapId)?.description || '',
        difficulty: mapRegions.find(r => r.id === mapId)?.difficulty || 'Phàm Nhân',
        unlocked: true,
        playerPosition: { x: 25, y: 25 },
        stamina: { current: 75, max: 100 },
        tiles: generateMapTiles(50, 50, mapId)
      };
      setMapData(mockMapData);
    } catch (error) {
      console.error('Error loading map data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMapTiles = (width: number, height: number, mapId: string): MapCell[][] => {
    const tiles: MapCell[][] = [];
    
    for (let y = 0; y < height; y++) {
      const row: MapCell[] = [];
      for (let x = 0; x < width; x++) {
        const distance = Math.sqrt((x - 25) ** 2 + (y - 25) ** 2);
        let type: MapCell['type'] = 'unexplored';
        let discovered = false;
        
        // Only reveal cells adjacent to current position (25,25) and the current cell itself
        if (x === 25 && y === 25) {
          type = 'current';
          discovered = true;
        } else if (Math.abs(x - 25) <= 1 && Math.abs(y - 25) <= 1) {
          // Adjacent cells (8 surrounding cells)
          discovered = true;
          if (Math.random() < 0.15) {
            const rand = Math.random();
            if (rand < 0.4) {
              type = 'enemy';
            } else if (rand < 0.7) {
              type = 'treasure';
            } else if (rand < 0.9) {
              type = 'resource';
            } else {
              type = 'event';
            }
          } else {
            type = 'explored';
          }
        }
        
        row.push({
          id: `${x}-${y}`,
          type,
          difficulty: Math.floor(Math.random() * 5) + 1,
          discovered,
          monsterId: type === 'enemy' ? Math.floor(Math.random() * 10) + 1 : undefined,
          monsterName: type === 'enemy' ? getRandomMonsterName(mapId) : undefined,
          monsterLevel: type === 'enemy' ? Math.floor(Math.random() * 10) + 1 : undefined,
          completed: false,
          retreated: false
        });
      }
      tiles.push(row);
    }
    
    return tiles;
  };

  const getRandomMonsterName = (mapId: string): string => {
    const monsters = {
      forest: ['Ma Thú Rừng', 'Linh Thú Cổ', 'Yêu Thú Rừng', 'Quái Thú Rừng'],
      swamp: ['Ma Thú Đầm', 'Độc Thú', 'Yêu Thú Đầm', 'Quái Thú Đầm'],
      city: ['Ma Thú Thành', 'Cổ Thú', 'Yêu Thú Thành', 'Quái Thú Thành']
    };
    const list = monsters[mapId as keyof typeof monsters] || monsters.forest;
    return list[Math.floor(Math.random() * list.length)];
  };

  const handleCellClick = async (cell: MapCell) => {
    if (!cell.discovered) return; // Can't click on unexplored cells
    
    if (cell.type === 'enemy' && cell.monsterId && !cell.completed) {
      // Start combat
      const monster: MonsterEncounter = {
        id: cell.monsterId,
        name: cell.monsterName || 'Unknown Monster',
        level: cell.monsterLevel || 1,
        hp: 100,
        maxHp: 100,
        stats: {
          strength: 20 + (cell.monsterLevel || 1) * 5,
          agility: 15 + (cell.monsterLevel || 1) * 3,
          intelligence: 10 + (cell.monsterLevel || 1) * 2,
          vitality: 25 + (cell.monsterLevel || 1) * 4
        }
      };
      
      setEncounteredMonster(monster);
      setShowCombat(true);
    } else if (cell.type === 'treasure' && !cell.completed) {
      // Handle treasure
      alert('Bạn tìm thấy kho báu!');
      // Mark as completed
      if (mapData) {
        const newTiles = mapData.tiles.map(row => 
          row.map(tile => 
            tile.id === cell.id ? { ...tile, completed: true } : tile
          )
        );
        setMapData({ ...mapData, tiles: newTiles });
      }
    } else if (cell.type === 'resource' && !cell.completed) {
      // Handle resource
      alert('Bạn thu thập được tài nguyên!');
      // Mark as completed
      if (mapData) {
        const newTiles = mapData.tiles.map(row => 
          row.map(tile => 
            tile.id === cell.id ? { ...tile, completed: true } : tile
          )
        );
        setMapData({ ...mapData, tiles: newTiles });
      }
    } else if (cell.type === 'event' && !cell.completed) {
      // Handle event
      alert('Một sự kiện đặc biệt xảy ra!');
      // Mark as completed
      if (mapData) {
        const newTiles = mapData.tiles.map(row => 
          row.map(tile => 
            tile.id === cell.id ? { ...tile, completed: true } : tile
          )
        );
        setMapData({ ...mapData, tiles: newTiles });
      }
    }
  };

  const getCellIcon = (cell: MapCell) => {
    if (!cell.discovered) {
      return <Cloud className="w-4 h-4 text-slate-500" />;
    }
    
    switch (cell.type) {
      case 'current':
        return <MapPin className="w-4 h-4 text-yellow-500" />;
      case 'enemy':
        if (cell.completed) {
          return <Swords className="w-4 h-4 text-red-300 opacity-50" />;
        }
        return <Swords className="w-4 h-4 text-red-500" />;
      case 'treasure':
        if (cell.completed) {
          return <Gem className="w-4 h-4 text-yellow-300 opacity-50" />;
        }
        return <Gem className="w-4 h-4 text-yellow-500" />;
      case 'resource':
        if (cell.completed) {
          return <Trees className="w-4 h-4 text-green-300 opacity-50" />;
        }
        return <Trees className="w-4 h-4 text-green-500" />;
      case 'event':
        if (cell.completed) {
          return <Scroll className="w-4 h-4 text-purple-300 opacity-50" />;
        }
        return <Scroll className="w-4 h-4 text-purple-500" />;
      case 'explored':
        return <Eye className="w-3 h-3 text-slate-400" />;
      default:
        return null;
    }
  };

  const getCellColor = (cell: MapCell) => {
    if (!cell.discovered) {
      return 'bg-slate-800/20 border-slate-800/50 cursor-not-allowed';
    }
    
    switch (cell.type) {
      case 'current':
        return 'bg-yellow-500/20 border-yellow-500/50';
      case 'enemy':
        if (cell.completed) {
          return 'bg-red-500/10 border-red-500/30 opacity-50 cursor-not-allowed';
        }
        return 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30';
      case 'treasure':
        if (cell.completed) {
          return 'bg-yellow-500/10 border-yellow-500/30 opacity-50 cursor-not-allowed';
        }
        return 'bg-yellow-500/20 border-yellow-500/50 hover:bg-yellow-500/30';
      case 'resource':
        if (cell.completed) {
          return 'bg-green-500/10 border-green-500/30 opacity-50 cursor-not-allowed';
        }
        return 'bg-green-500/20 border-green-500/50 hover:bg-green-500/30';
      case 'event':
        if (cell.completed) {
          return 'bg-purple-500/10 border-purple-500/30 opacity-50 cursor-not-allowed';
        }
        return 'bg-purple-500/20 border-purple-500/50 hover:bg-purple-500/30';
      case 'explored':
        return 'bg-slate-600/20 border-slate-600/50';
      default:
        return 'bg-slate-800/20 border-slate-800/50';
    }
  };

  if (showCombat && encounteredMonster) {
    return (
      <div className="h-full">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Gặp phải {encounteredMonster.name}!</span>
              <Button 
                onClick={() => setShowCombat(false)} 
                variant="outline" 
                size="sm"
              >
                Quay lại bản đồ
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Thông tin quái vật</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tên:</span>
                    <span>{encounteredMonster.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cấp độ:</span>
                    <span>{encounteredMonster.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Máu:</span>
                    <span>{encounteredMonster.hp}/{encounteredMonster.maxHp}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Chỉ số</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Sức mạnh:</span>
                    <span>{encounteredMonster.stats.strength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nhanh nhẹn:</span>
                    <span>{encounteredMonster.stats.agility}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trí tuệ:</span>
                    <span>{encounteredMonster.stats.intelligence}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thể lực:</span>
                    <span>{encounteredMonster.stats.vitality}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button 
                onClick={() => {
                  // Start combat with this monster
                  setShowCombat(false);
                  // Navigate to combat section
                  window.dispatchEvent(new CustomEvent('navigate', { detail: 'combat' }));
                }}
                className="flex-1"
              >
                <Sword className="w-4 h-4 mr-2" />
                Bắt đầu chiến đấu
              </Button>
              <Button 
                onClick={() => {
                  // Mark as retreated - monster remains visible but can be attacked again
                  if (mapData && encounteredMonster) {
                    const newTiles = mapData.tiles.map(row => 
                      row.map(tile => 
                        tile.monsterId === encounteredMonster.id ? { ...tile, retreated: true } : tile
                      )
                    );
                    setMapData({ ...mapData, tiles: newTiles });
                  }
                  setShowCombat(false);
                }} 
                variant="outline"
                className="flex-1"
              >
                <Shield className="w-4 h-4 mr-2" />
                Chạy trốn
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Đang tải bản đồ...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!mapData) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 flex items-center justify-center">
          <div className="text-center">
            <Compass className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl mb-2">Không thể tải bản đồ</h3>
            <p className="text-slate-600">Vui lòng thử lại sau</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Map Tabs */}
      <Tabs value={activeMap} onValueChange={setActiveMap}>
        <TabsList className="grid w-full grid-cols-3">
          {mapRegions.map((region) => (
            <TabsTrigger 
              key={region.id} 
              value={region.id}
              disabled={!region.unlocked}
              className="flex items-center space-x-2"
            >
              {!region.unlocked && <Lock className="w-4 h-4" />}
              <span>{region.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {mapRegions.map((region) => (
          <TabsContent key={region.id} value={region.id} className="space-y-4">
            {/* Map Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{region.name}</span>
                  <div className="flex items-center space-x-2">
                    {region.hasDifficultySelection ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDifficultySelector(true)}
                        className="text-slate-300 border-slate-600 hover:bg-slate-700"
                      >
                        {currentDifficulty?.name} ▼
                      </Button>
                    ) : (
                      <Badge variant="outline">{region.difficulty}</Badge>
                    )}
                  </div>
                </CardTitle>
                <p className="text-slate-600">{region.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>Thể lực: {mapData.stamina.current}/{mapData.stamina.max}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>Vị trí: ({mapData.playerPosition.x}, {mapData.playerPosition.y})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Cấp độ: {region.hasDifficultySelection ? currentDifficulty?.name : region.difficulty}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bản đồ khám phá</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-50 gap-1 max-h-96 overflow-auto p-2 bg-slate-900/50 rounded-lg">
                  {mapData.tiles.map((row, y) =>
                    row.map((cell, x) => (
                      <motion.button
                        key={cell.id}
                        className={`w-6 h-6 border rounded flex items-center justify-center transition-all duration-200 ${getCellColor(cell)}`}
                        onClick={() => handleCellClick(cell)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={cell.type === 'unexplored'}
                      >
                        {getCellIcon(cell)}
                      </motion.button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chú thích</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-yellow-500" />
                    <span>Vị trí hiện tại</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Cloud className="w-4 h-4 text-slate-500" />
                    <span>Chưa khám phá</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-slate-400" />
                    <span>Đã khám phá</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Swords className="w-4 h-4 text-red-500" />
                    <span>Quái vật</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Swords className="w-4 h-4 text-red-300 opacity-50" />
                    <span>Quái vật đã đánh bại</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gem className="w-4 h-4 text-yellow-500" />
                    <span>Báu vật</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gem className="w-4 h-4 text-yellow-300 opacity-50" />
                    <span>Báu vật đã lấy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trees className="w-4 h-4 text-green-500" />
                    <span>Tài nguyên</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trees className="w-4 h-4 text-green-300 opacity-50" />
                    <span>Tài nguyên đã thu thập</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Scroll className="w-4 h-4 text-purple-500" />
                    <span>Sự kiện</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Scroll className="w-4 h-4 text-purple-300 opacity-50" />
                    <span>Sự kiện đã hoàn thành</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Difficulty Selector Modal */}
      {showDifficultySelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Chọn Cấp Độ Khó</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mapDifficulties.map((difficulty) => (
                <div
                  key={difficulty.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    difficulty.unlocked
                      ? 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                      : 'border-slate-700 bg-slate-800/50 cursor-not-allowed opacity-50'
                  }`}
                  onClick={() => difficulty.unlocked && setSelectedDifficulty(difficulty.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white">{difficulty.name}</h3>
                      <p className="text-sm text-slate-400">{difficulty.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {difficulty.unlocked ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Lock className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                  </div>
                  {!difficulty.unlocked && (
                    <p className="text-xs text-slate-500 mt-2">
                      Cần tu vi: {difficulty.unlockRequirement.realmId === 1 ? 'Luyện thể' : 
                                 difficulty.unlockRequirement.realmId === 2 ? 'Luyện khí' : 'Luyện thần'} tầng {difficulty.unlockRequirement.sublevel}
                    </p>
                  )}
                </div>
              ))}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDifficultySelector(false)}
                  className="text-slate-300 border-slate-600"
                >
                  Hủy
                </Button>
                <Button
                  onClick={() => {
                    setShowDifficultySelector(false);
                    // Reload map data with new difficulty
                    loadMapData(activeMap);
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Xác nhận
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
