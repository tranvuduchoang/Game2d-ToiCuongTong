import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Users, 
  Building, 
  TrendingUp, 
  Star,
  ChefHat,
  Castle,
  Sword,
  Flame,
  Gem,
  Plus,
  ArrowUp,
  Crown,
  ShieldCheck
} from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Disciple {
  id: string;
  name: string;
  cultivation: string;
  talent: number;
  task: string;
  progress: number;
}

interface Building {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  description: string;
  icon: any;
  upgradeRequirements: {
    spiritStones: number;
    materials: string[];
  };
}

export function SectManagement() {
  const sectLevel = "Sơ Cấp";
  const sectRank = 7;
  const sectRankMax = 9;
  
  const disciples: Disciple[] = [
    {
      id: "1",
      name: "Lý Thanh Vũ",
      cultivation: "Luyện Khí Tầng 5",
      talent: 8,
      task: "Tu luyện tại Tháp Thí Luyện",
      progress: 65
    },
    {
      id: "2", 
      name: "Trần Minh Nguyệt",
      cultivation: "Luyện Khí Tầng 3",
      talent: 6,
      task: "Luyện đan tại Đan Các",
      progress: 40
    },
    {
      id: "3",
      name: "Vương Thiết Sơn",
      cultivation: "Luyện Khí Tầng 4",
      talent: 7,
      task: "Rèn khí cụ tại Tụ Bảo Các",
      progress: 80
    }
  ];

  const buildings: Building[] = [
    {
      id: "kitchen",
      name: "Nhà Bếp",
      level: 3,
      maxLevel: 10,
      description: "Cung cấp buff thể lực và chỉ số tạm thời",
      icon: ChefHat,
      upgradeRequirements: {
        spiritStones: 2000,
        materials: ["Linh Mộc x10", "Hỏa Thạch x5"]
      }
    },
    {
      id: "trial",
      name: "Tháp Thí Luyện",
      level: 2,
      maxLevel: 10,
      description: "Roguelike theo tầng, thưởng nguyên liệu và công pháp",
      icon: Castle,
      upgradeRequirements: {
        spiritStones: 5000,
        materials: ["Tinh Thép x15", "Linh Thạch x20"]
      }
    },
    {
      id: "martial",
      name: "Võ Các",
      level: 4,
      maxLevel: 10,
      description: "Lưu trữ công pháp, huấn luyện đệ tử",
      icon: Sword,
      upgradeRequirements: {
        spiritStones: 3000,
        materials: ["Cổ Thư x8", "Linh Mộc x12"]
      }
    },
    {
      id: "alchemy",
      name: "Đan Các",
      level: 2,
      maxLevel: 10,
      description: "Điều chế đan dược, hồi máu và tăng tu vi",
      icon: Flame,
      upgradeRequirements: {
        spiritStones: 4000,
        materials: ["Đan Lô x1", "Linh Hỏa x10"]
      }
    },
    {
      id: "treasure",
      name: "Tụ Bảo Các",
      level: 1,
      maxLevel: 10,
      description: "Rèn trang bị, khảm ngọc và nâng cấp",
      icon: Gem,
      upgradeRequirements: {
        spiritStones: 6000,
        materials: ["Thiên Thiết x5", "Linh Ngọc x3"]
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header thông tin tông môn */}
      <Card className="sect-border martial-glow relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1708281195891-d9f1bd1d90d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwdGVtcGxlJTIwbW91bnRhaW58ZW58MXx8fHwxNzU4NzIxOTI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Tông môn background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20" />
        <CardContent className="p-6 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <motion.h1 
                className="text-3xl text-primary font-bold mb-2 flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Crown className="w-8 h-8 power-pulse" />
                ⚔️ Tiêu Dao Tông ⚔️
              </motion.h1>
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-primary/20 text-primary border-primary/30 martial-glow">
                  {sectLevel} - Bậc {sectRank}
                </Badge>
                <div className="text-sm text-foreground font-medium">
                  Danh tiếng: 2,450 / 5,000
                </div>
              </div>
              <Progress value={49} className="w-64 h-3 qi-flow" />
              <div className="text-xs text-muted-foreground mt-1">
                Tiến độ thăng cấp tông môn
              </div>
            </div>
            
            <div className="text-right">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <motion.div
                  className="p-3 ancient-scroll rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-muted-foreground">Đệ tử</div>
                  <div className="text-xl text-primary font-bold">{disciples.length}/20</div>
                </motion.div>
                <motion.div
                  className="p-3 ancient-scroll rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-muted-foreground">Công trình</div>
                  <div className="text-xl text-primary font-bold">{buildings.length}/10</div>
                </motion.div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="buildings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-card/50 martial-glow">
          <TabsTrigger 
            value="buildings" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Building className="w-4 h-4 floating-animation" />
            Công Trình
          </TabsTrigger>
          <TabsTrigger 
            value="disciples" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Users className="w-4 h-4 floating-animation" />
            Đệ Tử
          </TabsTrigger>
          <TabsTrigger 
            value="upgrades" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <TrendingUp className="w-4 h-4 floating-animation" />
            Nâng Cấp
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buildings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {buildings.map((building, index) => {
              const Icon = building.icon;
              return (
                <motion.div
                  key={building.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="ancient-scroll martial-glow hover:power-pulse transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-primary floating-animation" />
                          <CardTitle className="text-base text-foreground">{building.name}</CardTitle>
                        </div>
                        <Badge variant="outline" className="border-primary text-primary">
                          Cấp {building.level}/{building.maxLevel}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {building.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Tiến độ nâng cấp</span>
                            <span className="text-foreground">{building.level}/{building.maxLevel}</span>
                          </div>
                          <Progress 
                            value={(building.level / building.maxLevel) * 100} 
                            className="h-2 qi-flow" 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Button 
                            size="sm" 
                            className="w-full martial-glow" 
                            disabled={building.level >= building.maxLevel}
                          >
                            <ArrowUp className="w-3 h-3 mr-1" />
                            Nâng Cấp ({building.upgradeRequirements.spiritStones} Linh Thạch)
                          </Button>
                          <Button size="sm" variant="outline" className="w-full">
                            Quản Lý
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
            
            {/* Nút thêm công trình mới */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: buildings.length * 0.1 }}
            >
              <Card className="border-dashed border-2 border-primary/30 hover:border-primary transition-colors ancient-scroll">
                <CardContent className="flex items-center justify-center h-full min-h-[200px]">
                  <Button variant="ghost" className="flex-col h-auto p-6 hover:martial-glow">
                    <Plus className="w-8 h-8 mb-2 text-primary floating-animation" />
                    <span className="text-primary font-medium">Xây Dựng Mới</span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="disciples" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg text-primary font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 floating-animation" />
              Danh Sách Đệ Tử
            </h3>
            <Button className="martial-glow">
              <Plus className="w-4 h-4 mr-2" />
              Chiêu Mộ
            </Button>
          </div>
          
          <div className="grid gap-4">
            {disciples.map((disciple, index) => (
              <motion.div
                key={disciple.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="ancient-scroll martial-glow hover:power-pulse transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center martial-glow">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-base text-foreground font-semibold">{disciple.name}</h4>
                          <p className="text-sm text-muted-foreground">{disciple.cultivation}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-muted-foreground">Tư chất:</span>
                            {[...Array(10)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < disciple.talent 
                                    ? 'text-primary fill-current power-pulse' 
                                    : 'text-muted'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right min-w-[200px]">
                        <div className="text-sm text-foreground mb-1 font-medium">{disciple.task}</div>
                        <Progress value={disciple.progress} className="h-3 mb-2 qi-flow" />
                        <div className="text-xs text-muted-foreground">{disciple.progress}% hoàn thành</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upgrades" className="space-y-4">
          <Card className="ancient-scroll martial-glow">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 floating-animation" />
                Yêu Cầu Thăng Cấp Tông Môn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div 
                    className="p-4 ancient-scroll rounded-lg martial-glow"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-sm text-muted-foreground mb-1">Tu vi tông chủ</div>
                    <div className="text-lg text-foreground font-semibold">Chúc Cơ Tầng 1</div>
                    <Badge variant="secondary" className="mt-1 bg-accent/20 text-accent border-accent/30">
                      ✓ Đạt yêu cầu
                    </Badge>
                  </motion.div>
                  
                  <motion.div 
                    className="p-4 ancient-scroll rounded-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-sm text-muted-foreground mb-1">Đệ tử Luyện Khí Đỉnh</div>
                    <div className="text-lg text-foreground font-semibold">2/3 người</div>
                    <Badge variant="destructive" className="mt-1">Chưa đủ</Badge>
                  </motion.div>
                  
                  <motion.div 
                    className="p-4 ancient-scroll rounded-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-sm text-muted-foreground mb-1">Tổng số đệ tử</div>
                    <div className="text-lg text-foreground font-semibold">3/10 người</div>
                    <Badge variant="destructive" className="mt-1">Chưa đủ</Badge>
                  </motion.div>
                </div>
                
                <Button className="w-full martial-glow text-lg py-6" disabled>
                  <Crown className="w-5 h-5 mr-2" />
                  Thăng Cấp Lên Trung Cấp Tông Môn
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}