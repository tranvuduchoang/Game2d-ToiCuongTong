import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { getPlayerData } from "@/lib/api";
import { PlayerData } from "@/dto/player";
import {
  User,
  Sword,
  Shield,
  Heart,
  Zap,
  Target,
  Eye,
  Sparkles,
  Activity,
  TrendingUp,
  Plus,
  Minus
} from "lucide-react";

interface PlayerStats {
  str: number;
  hp: number;
  maxHp: number;
  def: number;
  mp: number;
  maxMp: number;
  agi: number;
  acc: number;
  resPsn: number;
  resBld: number;
  luk: number;
  cr: number;
  cd: number;
  sp: number; // Điểm SP tự do
}

interface CultivationRealm {
  majorRealm: string;
  majorRealmIndex: number;
  layer: number;
  experience: number;
  maxExperience: number;
}

interface Profession {
  name: string;
  level: number;
  mastery: string;
  experience: number;
  maxExperience: number;
}

export function PlayerDetails() {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStats, setEditingStats] = useState(false);
  const [tempStats, setTempStats] = useState<PlayerStats | null>(null);

  // Fetch player data from API
  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        const data = await getPlayerData();
        console.log('PlayerDetails - Player data from API:', data);
        setPlayerData(data);

        // Convert API data to PlayerStats format
        const stats: PlayerStats = {
          str: data.stats?.STR || 5,
          hp: data.stats?.HP || 100, // Sử dụng HP trực tiếp từ database
          maxHp: data.stats?.HP || 100,
          def: data.stats?.DEF || 5,
          mp: data.stats?.MP || 50, // Sử dụng MP trực tiếp từ database
          maxMp: data.stats?.MP || 50,
          agi: data.stats?.AGI || 5,
          acc: 75 + (data.stats?.AGI || 5) * 2, // ACC = base + AGI * 2
          resPsn: 10 + (data.stats?.DEF || 5), // Resistance based on DEF
          resBld: 8 + (data.stats?.DEF || 5),
          luk: 20 + Math.floor((data.stats?.LUK || 0) / 2),
          cr: 5 + (data.stats?.AGI || 5), // Critical rate based on AGI
          cd: 120 + (data.stats?.STR || 5) * 2, // Critical damage based on STR
          sp: data.stats?.SP || 0 // SP từ database
        };
        setTempStats(stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
        console.error('Error fetching player data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, []);

  const cultivation: CultivationRealm = {
    majorRealm: "Luyện Khí",
    majorRealmIndex: 1,
    layer: 3,
    experience: 1250,
    maxExperience: 2000
  };

  const professions: Profession[] = [
    {
      name: "Luyện Đan Sư",
      level: 3,
      mastery: "Tiểu Thành",
      experience: 750,
      maxExperience: 1000
    },
    {
      name: "Luyện Khí Sư",
      level: 2,
      mastery: "Sơ Thành",
      experience: 350,
      maxExperience: 800
    }
  ];

  const realms = ["Luyện Thể", "Luyện Khí", "Trúc Cơ", "Kết Đan", "Nguyên Anh", "Hóa Thần"];

  // Functions for SP management
  const adjustStat = (statName: keyof PlayerStats, delta: number) => {
    if (!tempStats) return;

    const newStats = { ...tempStats };
    const currentValue = newStats[statName] as number;
    const newValue = Math.max(5, currentValue + delta); // Minimum value is 5

    // Check if we have enough SP
    if (delta > 0 && newStats.sp < delta) return;

    newStats[statName] = newValue;
    newStats.sp = newStats.sp - delta;

    // Recalculate derived stats
    if (statName === 'str') {
      // HP và MP sẽ được cập nhật thông qua API, không tính toán ở đây
      newStats.cd = 120 + newValue * 2;
    } else if (statName === 'agi') {
      // HP và MP sẽ được cập nhật thông qua API, không tính toán ở đây
      newStats.acc = 75 + newValue * 2;
      newStats.cr = 5 + newValue;
    } else if (statName === 'def') {
      newStats.resPsn = 10 + newValue;
      newStats.resBld = 8 + newValue;
    }

    setTempStats(newStats);
  };

  const saveStats = async () => {
    // TODO: Implement API call to save stats
    console.log('Saving stats:', tempStats);
    setEditingStats(false);
  };

  const cancelEditing = () => {
    // Reset to original stats
    if (playerData) {
      const stats: PlayerStats = {
        str: playerData.stats?.STR || 5,
        hp: playerData.stats?.HP || 100,
        maxHp: playerData.stats?.HP || 100,
        def: playerData.stats?.DEF || 5,
        mp: playerData.stats?.MP || 50,
        maxMp: playerData.stats?.MP || 50,
        agi: playerData.stats?.AGI || 5,
        acc: (playerData.stats?.AGI || 5),
        resPsn: 10 + (playerData.stats?.DEF || 5),
        resBld: 8 + (playerData.stats?.DEF || 5),
        luk: 20 + Math.floor((playerData.stats?.LUK || 0) / 2),
        cr: 5 + (playerData.stats?.AGI || 5),
        cd: 120 + (playerData.stats?.STR || 5) * 2,
        sp: playerData.stats?.SP || 0
      };
      setTempStats(stats);
    }
    setEditingStats(false);
  };

  const getStatIcon = (stat: string) => {
    switch (stat) {
      case 'STR': return <Sword className="w-4 h-4" />;
      case 'HP': return <Heart className="w-4 h-4" />;
      case 'DEF': return <Shield className="w-4 h-4" />;
      case 'MP': return <Zap className="w-4 h-4" />;
      case 'AGI': return <Activity className="w-4 h-4" />;
      case 'ACC': return <Target className="w-4 h-4" />;
      case 'LUK': return <Sparkles className="w-4 h-4" />;
      case 'CR': return <Eye className="w-4 h-4" />;
      case 'CD': return <TrendingUp className="w-4 h-4" />;
      case 'SP': return <Sparkles className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">Đang tải thông tin nhân vật...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-destructive">Lỗi: {error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!playerData || !tempStats) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">Không có dữ liệu nhân vật</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header thông tin cơ bản */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-blue-900 mb-2">{playerData.name || "mockData"}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-blue-100 text-blue-800">
                  {cultivation.majorRealm} Tầng {cultivation.layer}
                </Badge>
                <Badge variant="outline" className="border-blue-300 text-blue-800">
                  Tông Chủ
                </Badge>
              </div>
            </div>
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="stats" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stats">Thuộc Tính</TabsTrigger>
          <TabsTrigger value="cultivation">Tu Luyện</TabsTrigger>
          <TabsTrigger value="professions">Nghề Phụ</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thuộc tính cơ bản */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Thuộc Tính Cơ Bản</CardTitle>
                  <div className="flex gap-2">
                    {!editingStats ? (
                      <Button
                        size="sm"
                        onClick={() => setEditingStats(true)}
                        disabled={tempStats.sp === 0}
                        className={tempStats.sp === 0 ? "opacity-50" : ""}
                      >
                        Chỉnh Sửa
                      </Button>
                    ) : (
                      <div className="flex gap-1">
                        <Button size="sm" onClick={saveStats}>Lưu</Button>
                        <Button size="sm" variant="outline" onClick={cancelEditing}>Hủy</Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* SP Display */}
                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatIcon('SP')}
                      <span className={`text-sm font-medium ${tempStats.sp === 0 ? 'text-gray-400' : 'text-purple-600'}`}>
                        Điểm SP Tự Do
                      </span>
                    </div>
                    <span className={`text-lg font-bold ${tempStats.sp === 0 ? 'text-gray-400' : 'text-purple-600'}`}>
                      {tempStats.sp}
                    </span>
                  </div>
                  {tempStats.sp === 0 && (
                    <p className="text-xs text-gray-500 mt-1">Không có điểm SP để phân bổ</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatIcon('STR')}
                        <span className="text-sm">Sức Mạnh</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{tempStats.str}</span>
                        {editingStats && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={() => adjustStat('str', -1)}
                              disabled={tempStats.str <= 5}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={() => adjustStat('str', 1)}
                              disabled={tempStats.sp === 0}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatIcon('DEF')}
                        <span className="text-sm">Phòng Thủ</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{tempStats.def}</span>
                        {editingStats && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={() => adjustStat('def', -1)}
                              disabled={tempStats.def <= 5}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={() => adjustStat('def', 1)}
                              disabled={tempStats.sp === 0}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatIcon('AGI')}
                        <span className="text-sm">Nhanh Nhẹn</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{tempStats.agi}</span>
                        {editingStats && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={() => adjustStat('agi', -1)}
                              disabled={tempStats.agi <= 5}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={() => adjustStat('agi', 1)}
                              disabled={tempStats.sp === 0}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatIcon('ACC')}
                        <span className="text-sm">Chính Xác</span>
                      </div>
                      <span className="text-sm">{tempStats.acc}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {getStatIcon('HP')}
                          <span className="text-sm">Sinh Lực</span>
                        </div>
                        <span className="text-sm">{tempStats.hp}/{tempStats.maxHp}</span>
                      </div>
                      <Progress value={(tempStats.hp / tempStats.maxHp) * 100} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {getStatIcon('MP')}
                          <span className="text-sm">Nội Lực</span>
                        </div>
                        <span className="text-sm">{tempStats.mp}/{tempStats.maxMp}</span>
                      </div>
                      <Progress value={(tempStats.mp / tempStats.maxMp) * 100} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatIcon('LUK')}
                        <span className="text-sm">May Mắn</span>
                      </div>
                      <span className="text-sm">{tempStats.luk}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thuộc tính chiến đấu */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Thuộc Tính Chiến Đấu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatIcon('CR')}
                      <span className="text-sm">Tỉ Lệ Chí Mạng</span>
                    </div>
                    <span className="text-sm">{tempStats.cr}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatIcon('CD')}
                      <span className="text-sm">Sát Thương Chí Mạng</span>
                    </div>
                    <span className="text-sm">{tempStats.cd}%</span>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="text-sm">Kháng Tính</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Kháng Độc</span>
                      <span>{tempStats.resPsn}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Kháng Chảy Máu</span>
                      <span>{tempStats.resBld}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cultivation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tiến Trình Tu Luyện</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cảnh giới hiện tại */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-blue-900">Cảnh Giới Hiện Tại</h4>
                  <Badge className="bg-blue-100 text-blue-800">
                    {cultivation.majorRealm} Tầng {cultivation.layer}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Kinh Nghiệm Tu Luyện</span>
                    <span>{cultivation.experience.toLocaleString()} / {cultivation.maxExperience.toLocaleString()}</span>
                  </div>
                  <Progress value={(cultivation.experience / cultivation.maxExperience) * 100} className="h-2" />
                </div>
              </div>

              {/* Lộ trình cảnh giới */}
              <div>
                <h4 className="mb-3">Lộ Trình Cảnh Giới</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {realms.map((realm, index) => (
                    <div
                      key={realm}
                      className={`p-2 rounded text-center text-sm ${index < cultivation.majorRealmIndex
                        ? 'bg-green-100 text-green-800'
                        : index === cultivation.majorRealmIndex
                          ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-300'
                          : 'bg-slate-100 text-slate-500'
                        }`}
                    >
                      {index < cultivation.majorRealmIndex && '✓ '}
                      {realm}
                    </div>
                  ))}
                </div>
              </div>

              {/* Nhiệm vụ thăng cảnh */}
              <div>
                <h4 className="mb-3">Nhiệm Vụ Thăng Cảnh</h4>
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Thiên Cấp: Đột Phá Luyện Khí Tầng 4</span>
                      <Badge variant="outline" className="text-xs">Khả Dụng</Badge>
                    </div>
                    <p className="text-xs text-slate-600">Tu luyện đạt đủ kinh nghiệm và hoàn thành thử thách</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {professions.map((profession) => (
              <Card key={profession.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{profession.name}</CardTitle>
                    <Badge variant="outline">
                      Cấp {profession.level} - {profession.mastery}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Thành Thạo</span>
                      <span>{profession.experience}/{profession.maxExperience}</span>
                    </div>
                    <Progress value={(profession.experience / profession.maxExperience) * 100} className="h-2" />
                  </div>

                  <div className="text-xs text-slate-600">
                    {profession.name === "Luyện Đan Sư"
                      ? "Có thể luyện đan dược cấp 3, hiệu quả +15%"
                      : "Có thể rèn trang bị cấp 2, khả năng khảm ngọc cơ bản"
                    }
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