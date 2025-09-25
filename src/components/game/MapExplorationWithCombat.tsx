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
  Cloud,
  Star,
  Coins
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { api, getMaps, getMapDetails, startMapRun, moveInMap, getMapTiles, startCombat, getMonsters, updatePlayerRewards } from "../../lib/api";
import { CombatSystemIntegration } from "./CombatSystemIntegration";
import { usePlayer } from "../../contexts/PlayerContext";

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
  const { playerData, updatePlayerData, refreshPlayerData, refreshFromBackend } = usePlayer();
  const [activeMap, setActiveMap] = useState('forest');
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [encounteredMonster, setEncounteredMonster] = useState<MonsterEncounter | null>(null);
  const [showCombat, setShowCombat] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('pham_nhan');
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);
  const [combatResult, setCombatResult] = useState<'victory' | 'defeat' | 'retreat' | null>(null);
  const [currentCell, setCurrentCell] = useState<MapCell | null>(null);
  const [currentMapRun, setCurrentMapRun] = useState<any>(null);
  const [realMaps, setRealMaps] = useState<any[]>([]);
  const [currentCombatId, setCurrentCombatId] = useState<string | null>(null);
  const [playerPosition, setPlayerPosition] = useState<{x: number, y: number}>({x: -1, y: -1}); // -1 means not started yet
  const [mapSeed, setMapSeed] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [mapState, setMapState] = useState<{
    tiles: MapCell[][];
    playerPosition: {x: number, y: number};
    gameStarted: boolean;
    seed: string;
  } | null>(null);

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
    cultivationRealm: "Luyện thể",
    luck: 50 // Luck stat for map generation
  };

  // Generate map seed based on date and player ID
  const generateMapSeed = (playerId: number, mapId: string, difficulty: string) => {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD
    return `${playerId}_${mapId}_${difficulty}_${dateString}`;
  };

  // Save map state to localStorage
  const saveMapState = (tiles: MapCell[][], playerPos: {x: number, y: number}, started: boolean, seed: string) => {
    const state = {
      tiles,
      playerPosition: playerPos,
      gameStarted: started,
      seed,
      timestamp: Date.now()
    };
    localStorage.setItem(`mapState_${activeMap}_${selectedDifficulty}`, JSON.stringify(state));
  };

  // Load map state from localStorage
  const loadMapState = (): {
    tiles: MapCell[][];
    playerPosition: {x: number, y: number};
    gameStarted: boolean;
    seed: string;
  } | null => {
    try {
      const saved = localStorage.getItem(`mapState_${activeMap}_${selectedDifficulty}`);
      if (saved) {
        const state = JSON.parse(saved);
        // Check if state is from today (reset daily)
        const today = new Date().toISOString().split('T')[0];
        const stateDate = new Date(state.timestamp).toISOString().split('T')[0];
        if (stateDate === today) {
          return state;
        }
      }
    } catch (error) {
      console.warn('Failed to load map state:', error);
    }
    return null;
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
    // Reset game state when changing maps
    setGameStarted(false);
    setPlayerPosition({x: -1, y: -1});
    loadMapData(activeMap);
  }, [activeMap]);

  // Auto-refresh player data when component mounts
  useEffect(() => {
    refreshFromBackend();
  }, []);

  // Periodic refresh to ensure data sync (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshFromBackend();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadMapData = async (mapId: string) => {
    setIsLoading(true);
    try {
      // First, try to load saved map state
      const savedState = loadMapState();
      if (savedState) {
        console.log('Loading saved map state:', savedState);
        setMapState(savedState);
        setPlayerPosition(savedState.playerPosition);
        setGameStarted(savedState.gameStarted);
        setMapSeed(savedState.seed);
        
        // Create map data from saved state
        const mapData: MapData = {
          id: 1,
          name: mapRegions.find(r => r.id === mapId)?.name || 'Unknown Map',
          description: mapRegions.find(r => r.id === mapId)?.description || '',
          difficulty: currentDifficulty?.name || 'Phàm Nhân',
          unlocked: true,
          playerPosition: savedState.playerPosition,
          stamina: { current: 75, max: 100 },
          tiles: savedState.tiles
        };
        setMapData(mapData);
        setIsLoading(false);
        return;
      }
      
      // Generate map seed for persistence
      const currentSeed = generateMapSeed(mockPlayerData.id, mapId, selectedDifficulty);
      setMapSeed(currentSeed);
      
      // Try to load real map data from API
      try {
        const maps = await getMaps();
        setRealMaps(maps);
        
        // Find the map by ID or name
        const map = maps.find((m: any) => m.id.toString() === mapId || m.name.toLowerCase().includes(mapId.toLowerCase()));
        
        if (map) {
          // Start a map run
          const mapRun = await startMapRun(map.id, selectedDifficulty);
          setCurrentMapRun(mapRun);
          
          // Load map tiles
          const tiles = await getMapTiles(mapRun.id);
          
          const realMapData: MapData = {
            id: map.id,
            name: map.name,
            description: map.description || '',
            difficulty: currentDifficulty?.name || 'Phàm Nhân',
            unlocked: true,
            playerPosition: playerPosition,
            stamina: { current: 75, max: 100 },
            tiles: tiles || generateMapTiles(50, 50, mapId, currentSeed, mockPlayerData.luck, false)
          };
          setMapData(realMapData);
        } else {
          // Fallback to mock data
          const mockMapData: MapData = {
            id: 1,
            name: mapRegions.find(r => r.id === mapId)?.name || 'Unknown Map',
            description: mapRegions.find(r => r.id === mapId)?.description || '',
            difficulty: currentDifficulty?.name || 'Phàm Nhân',
            unlocked: true,
            playerPosition: playerPosition,
            stamina: { current: 75, max: 100 },
            tiles: generateMapTiles(50, 50, mapId, currentSeed, mockPlayerData.luck, false)
          };
          setMapData(mockMapData);
        }
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
        // Fallback to mock data if API fails
        const mockMapData: MapData = {
          id: 1,
          name: mapRegions.find(r => r.id === mapId)?.name || 'Unknown Map',
          description: mapRegions.find(r => r.id === mapId)?.description || '',
          difficulty: currentDifficulty?.name || 'Phàm Nhân',
          unlocked: true,
          playerPosition: playerPosition,
          stamina: { current: 75, max: 100 },
          tiles: generateMapTiles(50, 50, mapId, currentSeed, mockPlayerData.luck, false)
        };
        setMapData(mockMapData);
      }
    } catch (error) {
      console.error('Error loading map data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple seeded random number generator
  const seededRandom = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return () => {
      hash = (hash * 9301 + 49297) % 233280;
      return hash / 233280;
    };
  };

  const generateMapTiles = (width: number, height: number, mapId: string, seed?: string, luck: number = 50, gameStarted: boolean = false): MapCell[][] => {
    const tiles: MapCell[][] = [];
    const random = seed ? seededRandom(seed) : Math.random;
    
    for (let y = 0; y < height; y++) {
      const row: MapCell[] = [];
      for (let x = 0; x < width; x++) {
        const id = `${x}-${y}`;
        
        // All tiles start as unexplored
        let type: 'unexplored' | 'explored' | 'current' | 'enemy' | 'treasure' | 'resource' | 'event' = 'unexplored';
        let discovered = false;
        let monsterId: number | undefined;
        let monsterName: string | undefined;
        let monsterLevel: number | undefined;
        
        // Only reveal tiles if game has started and they are adjacent to player position
        if (gameStarted && playerPosition.x >= 0 && playerPosition.y >= 0) {
          const isStartingArea = Math.abs(x - playerPosition.x) <= 1 && Math.abs(y - playerPosition.y) <= 1;
          
          if (isStartingArea) {
            discovered = true;
            if (x === playerPosition.x && y === playerPosition.y) {
              type = 'current';
            } else {
            // Random content for adjacent cells with luck influence
            const baseRandom = random();
            const playerLuck = playerData?.reputation || 50; // Use reputation as luck stat
            const luckBonus = (playerLuck - 50) / 100; // -0.5 to 0.5
            const adjustedRandom = Math.max(0, Math.min(1, baseRandom + luckBonus));
              
              if (adjustedRandom < 0.2) {
                type = 'enemy';
                const monster = getRandomMonsterName(mapId);
                monsterId = Math.floor(random() * 10) + 1;
                monsterName = monster;
                monsterLevel = Math.floor(random() * 10) + 1;
              } else if (adjustedRandom < 0.4) {
                type = 'treasure';
              } else if (adjustedRandom < 0.6) {
                type = 'resource';
              } else if (adjustedRandom < 0.8) {
                type = 'event';
              } else {
                type = 'explored';
              }
            }
          }
        }
        
        row.push({
          id,
          type,
          difficulty: Math.floor(random() * 5) + 1,
          discovered,
          monsterId,
          monsterName,
          monsterLevel,
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
    // Parse cell coordinates from id
    const [x, y] = cell.id.split('-').map(Number);
    
    console.log('Cell clicked:', { cell, x, y, gameStarted, playerPosition });
    
    // If game hasn't started yet, start the game at this position
    if (!gameStarted) {
      const newPosition = { x, y };
      setPlayerPosition(newPosition);
      setGameStarted(true);
      
      // Update map data with new position and reveal adjacent cells
      if (mapData) {
        const newTiles = mapData.tiles.map((row, rowIndex) => 
          row.map((tile, colIndex) => {
            const tileX = colIndex;
            const tileY = rowIndex;
            const isNewAdjacent = Math.abs(tileX - newPosition.x) <= 1 && Math.abs(tileY - newPosition.y) <= 1;
            const isCurrentPosition = tileX === newPosition.x && tileY === newPosition.y;
            
            if (isCurrentPosition) {
              return { ...tile, type: 'current', discovered: true };
            } else if (isNewAdjacent) {
              // Generate content for newly discovered adjacent cells
              const baseRandom = Math.random();
              const luckBonus = (mockPlayerData.luck - 50) / 100;
              const adjustedRandom = Math.max(0, Math.min(1, baseRandom + luckBonus));
              
              let newType: 'unexplored' | 'explored' | 'current' | 'enemy' | 'treasure' | 'resource' | 'event' = 'explored';
              let monsterId: number | undefined;
              let monsterName: string | undefined;
              let monsterLevel: number | undefined;
              
              if (adjustedRandom < 0.2) {
                newType = 'enemy';
                const monster = getRandomMonsterName(activeMap);
                monsterId = Math.floor(Math.random() * 10) + 1;
                monsterName = monster;
                monsterLevel = Math.floor(Math.random() * 10) + 1;
              } else if (adjustedRandom < 0.4) {
                newType = 'treasure';
              } else if (adjustedRandom < 0.6) {
                newType = 'resource';
              } else if (adjustedRandom < 0.8) {
                newType = 'event';
              }
              
              return { 
                ...tile, 
                type: newType, 
                discovered: true,
                monsterId,
                monsterName,
                monsterLevel
              };
            }
            return tile;
          })
        );
        
        setMapData({ ...mapData, tiles: newTiles as MapCell[][], playerPosition: newPosition });
        
        // Save state to localStorage
        saveMapState(newTiles as MapCell[][], newPosition, true, mapSeed || '');
      }
      return;
    }
    
    // If game has started, check if cell is discovered and adjacent
    if (!cell.discovered) return; // Can't click on unexplored cells
    
    const isAdjacent = Math.abs(x - playerPosition.x) <= 1 && Math.abs(y - playerPosition.y) <= 1;
    if (!isAdjacent) return; // Can only move to adjacent cells
    
    // Move player to new position
    const newPosition = { x, y };
    setPlayerPosition(newPosition);
    
    // Update map data with new position and reveal adjacent cells
    if (mapData) {
      const newTiles = mapData.tiles.map((row, rowIndex) => 
        row.map((tile, colIndex) => {
          const tileX = colIndex;
          const tileY = rowIndex;
          const isNewAdjacent = Math.abs(tileX - newPosition.x) <= 1 && Math.abs(tileY - newPosition.y) <= 1;
          const isCurrentPosition = tileX === newPosition.x && tileY === newPosition.y;
          
          if (isCurrentPosition) {
            return { ...tile, type: 'current', discovered: true };
          } else if (isNewAdjacent && !tile.discovered) {
            // Generate content for newly discovered adjacent cells
            const baseRandom = Math.random();
            const playerLuck = playerData?.reputation || 50; // Use reputation as luck stat
            const luckBonus = (playerLuck - 50) / 100;
            const adjustedRandom = Math.max(0, Math.min(1, baseRandom + luckBonus));
            
            let newType: 'unexplored' | 'explored' | 'current' | 'enemy' | 'treasure' | 'resource' | 'event' = 'explored';
            let monsterId: number | undefined;
            let monsterName: string | undefined;
            let monsterLevel: number | undefined;
            
            if (adjustedRandom < 0.2) {
              newType = 'enemy';
              const monster = getRandomMonsterName(activeMap);
              monsterId = Math.floor(Math.random() * 10) + 1;
              monsterName = monster;
              monsterLevel = Math.floor(Math.random() * 10) + 1;
            } else if (adjustedRandom < 0.4) {
              newType = 'treasure';
            } else if (adjustedRandom < 0.6) {
              newType = 'resource';
            } else if (adjustedRandom < 0.8) {
              newType = 'event';
            }
            
            return { 
              ...tile, 
              type: newType, 
              discovered: true,
              monsterId,
              monsterName,
              monsterLevel
            };
          } else if (tileX === playerPosition.x && tileY === playerPosition.y) {
            // Clear previous position
            return { ...tile, type: 'explored' };
          }
          return tile;
        })
      );
      
      setMapData({ ...mapData, tiles: newTiles as MapCell[][], playerPosition: newPosition });
      
      // Save state to localStorage
      saveMapState(newTiles as MapCell[][], newPosition, gameStarted, mapSeed || '');
    }
    
    if (cell.type === 'enemy' && cell.monsterId && !cell.completed) {
      // Start combat
      try {
        // Try to start real combat
        if (currentMapRun) {
          const combatData = await startCombat(cell.monsterId, currentMapRun.id);
          setCurrentCombatId(combatData.id);
          const monster: MonsterEncounter = {
            id: combatData.monster.id,
            name: combatData.monster.name,
            level: combatData.monster.level,
            hp: combatData.monster.currentHp,
            maxHp: combatData.monster.maxHp,
            stats: combatData.monster.stats
          };
          setEncounteredMonster(monster);
          setCurrentCell(cell);
          setShowCombat(true);
        } else {
          // Fallback to mock combat
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
          setCurrentCell(cell);
          setShowCombat(true);
        }
      } catch (error) {
        console.warn('Combat API not available, using mock data:', error);
        // Fallback to mock combat
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
        setCurrentCell(cell);
        setShowCombat(true);
      }
    } else if (cell.type === 'treasure' && !cell.completed) {
      // Handle treasure
      handleTreasureCollection(cell);
    } else if (cell.type === 'resource' && !cell.completed) {
      // Handle resource
      handleResourceCollection(cell);
    } else if (cell.type === 'event' && !cell.completed) {
      // Handle event
      handleEventTrigger(cell);
    }
  };

  const handleTreasureCollection = (cell: MapCell) => {
    // Simulate treasure collection
    const goldReward = Math.floor(Math.random() * 100) + 50;
    const itemReward = Math.random() < 0.3 ? 'Vật phẩm quý hiếm' : null;
    
    alert(`Bạn tìm thấy kho báu!\nVàng: +${goldReward}${itemReward ? `\nVật phẩm: ${itemReward}` : ''}`);
    
    // Mark as completed
    if (mapData) {
      const newTiles = mapData.tiles.map(row => 
        row.map(tile => 
          tile.id === cell.id ? { ...tile, completed: true } : tile
        )
      );
      setMapData({ ...mapData, tiles: newTiles });
    }
  };

  const handleResourceCollection = (cell: MapCell) => {
    // Simulate resource collection
    const resourceTypes = ['Linh thảo', 'Khoáng thạch', 'Linh khí', 'Huyết tinh'];
    const resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
    const amount = Math.floor(Math.random() * 5) + 1;
    
    alert(`Bạn thu thập được tài nguyên!\n${resourceType}: +${amount}`);
    
    // Mark as completed
    if (mapData) {
      const newTiles = mapData.tiles.map(row => 
        row.map(tile => 
          tile.id === cell.id ? { ...tile, completed: true } : tile
        )
      );
      setMapData({ ...mapData, tiles: newTiles });
    }
  };

  const handleEventTrigger = (cell: MapCell) => {
    // Simulate event
    const events = [
      'Gặp được tiền bối cao thủ, nhận được lời khuyên tu luyện!',
      'Phát hiện hang động bí mật với nhiều báu vật!',
      'Gặp phải ma khí, cần vận công để tránh!',
      'Tìm thấy di tích cổ, học được kỹ năng mới!'
    ];
    const event = events[Math.floor(Math.random() * events.length)];
    
    alert(`Một sự kiện đặc biệt xảy ra!\n${event}`);
    
    // Mark as completed
    if (mapData) {
      const newTiles = mapData.tiles.map(row => 
        row.map(tile => 
          tile.id === cell.id ? { ...tile, completed: true } : tile
        )
      );
      setMapData({ ...mapData, tiles: newTiles });
    }
  };

  const handleCombatResult = async (result: 'victory' | 'defeat' | 'retreat') => {
    setCombatResult(result);
    setShowCombat(false);
    
    if (result === 'victory' && currentCell) {
      // Mark monster as defeated
      if (mapData) {
        const newTiles = mapData.tiles.map(row => 
          row.map(tile => 
            tile.id === currentCell.id ? { ...tile, completed: true } : tile
          )
        );
        setMapData({ ...mapData, tiles: newTiles });
      }
      
      // Try to update player data with rewards
      try {
        const expReward = Math.floor(Math.random() * 50) + 25;
        const goldReward = Math.floor(Math.random() * 30) + 15;
        
        // Update player experience and gold via API
        const updatedPlayerData = await updatePlayerRewards({
          experience: expReward,
          gold: goldReward
        });
        
        // Refresh data from backend to get accurate values
        await refreshFromBackend();
        
        // Update map stamina
        setMapData(prev => prev ? {
          ...prev,
          stamina: {
            ...prev.stamina,
            current: Math.max(0, prev.stamina.current - 10)
          }
        } : prev);
        
        // Show victory rewards with updated data
        const currentExp = playerData?.experience || 0;
        const currentGold = playerData?.gold || 0;
        alert(`Chiến thắng!\nKinh nghiệm: +${expReward}\nVàng: +${goldReward}\n\nKinh nghiệm hiện tại: ${currentExp + expReward}\nVàng hiện tại: ${currentGold + goldReward}`);
      } catch (error) {
        console.warn('Failed to update rewards via API:', error);
        // Fallback to mock rewards
        const expReward = Math.floor(Math.random() * 50) + 25;
        const goldReward = Math.floor(Math.random() * 30) + 15;
        
        // Update context even in fallback
        if (playerData) {
          updatePlayerData({
            experience: playerData.experience + expReward,
            gold: playerData.gold + goldReward,
            physicalStrength: Math.max(0, playerData.physicalStrength - 10)
          });
        }
        
        // Update map stamina
        setMapData(prev => prev ? {
          ...prev,
          stamina: {
            ...prev.stamina,
            current: Math.max(0, prev.stamina.current - 10)
          }
        } : prev);
        
        alert(`Chiến thắng!\nKinh nghiệm: +${expReward}\nVàng: +${goldReward}\n\nKinh nghiệm hiện tại: ${(playerData?.experience || 0) + expReward}\nVàng hiện tại: ${(playerData?.gold || 0) + goldReward}`);
      }
    } else if (result === 'retreat' && currentCell) {
      // Mark as retreated - monster remains visible
      if (mapData) {
        const newTiles = mapData.tiles.map(row => 
          row.map(tile => 
            tile.id === currentCell.id ? { ...tile, retreated: true } : tile
          )
        );
        setMapData({ ...mapData, tiles: newTiles });
      }
    }
    
    setCurrentCell(null);
    setEncounteredMonster(null);
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
      // If game hasn't started, allow clicking on unexplored cells
      if (!gameStarted) {
        return 'bg-slate-800/20 border-slate-800/50 hover:bg-slate-700/30 cursor-pointer';
      }
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
        <CombatSystemIntegration 
          monsterData={encounteredMonster}
          combatId={currentCombatId}
          onCombatEnd={handleCombatResult}
          onBackToMap={() => setShowCombat(false)}
        />
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
                    <span>Vị trí: {gameStarted ? `(${mapData.playerPosition.x}, ${mapData.playerPosition.y})` : 'Chưa bắt đầu'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Cấp độ: {region.hasDifficultySelection ? currentDifficulty?.name : region.difficulty}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-purple-500" />
                    <span>Kinh nghiệm: {playerData?.experience || 0}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    <span>Vàng: {playerData?.gold || 0}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gem className="w-4 h-4 text-blue-500" />
                    <span>Linh thạch: {playerData?.spiritStones || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bản đồ khám phá</CardTitle>
                {!gameStarted && (
                  <p className="text-sm text-yellow-400 mt-2">
                    💡 Click vào một ô bất kỳ để bắt đầu khám phá map!
                  </p>
                )}
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
                        disabled={gameStarted && cell.type === 'unexplored'}
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
