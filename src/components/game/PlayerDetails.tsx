import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
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
  TrendingUp
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
  const playerStats: PlayerStats = {
    str: 145,
    hp: 850,
    maxHp: 850,
    def: 89,
    mp: 420,
    maxMp: 420,
    agi: 76,
    acc: 82,
    resPsn: 15,
    resBld: 12,
    luk: 34,
    cr: 18,
    cd: 150
  };

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
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header thông tin cơ bản */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-blue-900 mb-2">Tiểu Tử</h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-blue-100 text-blue-800">
                  {cultivation.majorRealm} Tầng {cultivation.layer}
                </Badge>
                <Badge variant="outline" className="border-blue-300">
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
                <CardTitle className="text-base">Thuộc Tính Cơ Bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatIcon('STR')}
                        <span className="text-sm">Sức Mạnh</span>
                      </div>
                      <span className="text-sm">{playerStats.str}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatIcon('DEF')}
                        <span className="text-sm">Phòng Thủ</span>
                      </div>
                      <span className="text-sm">{playerStats.def}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatIcon('AGI')}
                        <span className="text-sm">Nhanh Nhẹn</span>
                      </div>
                      <span className="text-sm">{playerStats.agi}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatIcon('ACC')}
                        <span className="text-sm">Chính Xác</span>
                      </div>
                      <span className="text-sm">{playerStats.acc}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {getStatIcon('HP')}
                          <span className="text-sm">Sinh Lực</span>
                        </div>
                        <span className="text-sm">{playerStats.hp}/{playerStats.maxHp}</span>
                      </div>
                      <Progress value={(playerStats.hp / playerStats.maxHp) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {getStatIcon('MP')}
                          <span className="text-sm">Nội Lực</span>
                        </div>
                        <span className="text-sm">{playerStats.mp}/{playerStats.maxMp}</span>
                      </div>
                      <Progress value={(playerStats.mp / playerStats.maxMp) * 100} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatIcon('LUK')}
                        <span className="text-sm">May Mắn</span>
                      </div>
                      <span className="text-sm">{playerStats.luk}</span>
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
                    <span className="text-sm">{playerStats.cr}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatIcon('CD')}
                      <span className="text-sm">Sát Thương Chí Mạng</span>
                    </div>
                    <span className="text-sm">{playerStats.cd}%</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="text-sm">Kháng Tính</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Kháng Độc</span>
                      <span>{playerStats.resPsn}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Kháng Chảy Máu</span>
                      <span>{playerStats.resBld}%</span>
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
                      className={`p-2 rounded text-center text-sm ${
                        index < cultivation.majorRealmIndex
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