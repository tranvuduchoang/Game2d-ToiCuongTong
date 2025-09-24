import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  BookOpen, 
  Sword, 
  Shield, 
  Flame, 
  Snowflake, 
  Zap, 
  Star,
  Clock,
  Target,
  TrendingUp
} from "lucide-react";

interface Technique {
  id: string;
  name: string;
  type: 'active' | 'passive';
  element: 'physical' | 'fire' | 'ice' | 'poison' | 'lightning';
  mastery: number;
  maxMastery: number;
  level: number;
  skills: Skill[];
  description: string;
}

interface Skill {
  id: string;
  name: string;
  type: 'active' | 'passive';
  damageType: string;
  scaling: number;
  mpCost: number;
  cooldown: number;
  level: number;
  description: string;
  effects: string[];
}

export function TechniquesSkills() {
  const techniques: Technique[] = [
    {
      id: 'basic-sword',
      name: 'Cơ Bản Kiếm Pháp',
      type: 'active',
      element: 'physical',
      mastery: 750,
      maxMastery: 1000,
      level: 3,
      description: 'Kiếm pháp cơ bản, dễ học và dễ dùng',
      skills: [
        {
          id: 'thrust',
          name: 'Bạch Vũ Đột Thích',
          type: 'active',
          damageType: 'Kiếm',
          scaling: 120,
          mpCost: 15,
          cooldown: 3,
          level: 3,
          description: 'Đâm thẳng với tốc độ cao',
          effects: ['Sát thương 120% STR', '+15% chính xác']
        }
      ]
    },
    {
      id: 'flame-palm',
      name: 'Liệt Hỏa Chưởng',
      type: 'active', 
      element: 'fire',
      mastery: 450,
      maxMastery: 1000,
      level: 2,
      description: 'Chưởng pháp hỏa hệ, sát thương cao',
      skills: [
        {
          id: 'fire-strike',
          name: 'Liệt Hỏa Phá',
          type: 'active',
          damageType: 'Hỏa',
          scaling: 150,
          mpCost: 25,
          cooldown: 5,
          level: 2,
          description: 'Tấn công bằng sức mạnh hỏa hệ',
          effects: ['Sát thương 150% STR', 'Có 20% khả năng gây bỏng (2 lượt)']
        }
      ]
    },
    {
      id: 'iron-body',
      name: 'Kim Cang Bất Hoại',
      type: 'passive',
      element: 'physical',
      mastery: 320,
      maxMastery: 800,
      level: 1,
      description: 'Thân pháp phòng thủ, tăng sức bền',
      skills: [
        {
          id: 'iron-skin',
          name: 'Kim Cang Phiến Thân',
          type: 'passive',
          damageType: 'Phòng thủ',
          scaling: 0,
          mpCost: 0,
          cooldown: 0,
          level: 1,
          description: 'Thường trực tăng phòng thủ',
          effects: ['+25% phòng thủ', '+100 HP tối đa']
        }
      ]
    }
  ];

  const getElementIcon = (element: string) => {
    switch (element) {
      case 'fire': return <Flame className="w-4 h-4 text-red-500" />;
      case 'ice': return <Snowflake className="w-4 h-4 text-blue-500" />;
      case 'lightning': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'poison': return <div className="w-4 h-4 bg-green-500 rounded-full" />;
      default: return <Sword className="w-4 h-4 text-slate-600" />;
    }
  };

  const getElementName = (element: string) => {
    switch (element) {
      case 'fire': return 'Hỏa';
      case 'ice': return 'Băng';
      case 'lightning': return 'Lôi';
      case 'poison': return 'Độc';
      default: return 'Vật Lý';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl">Công Pháp & Kỹ Năng</h2>
        <Button>
          <BookOpen className="w-4 h-4 mr-2" />
          Thư Viện Công Pháp
        </Button>
      </div>

      <Tabs defaultValue="techniques" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="techniques">Công Pháp</TabsTrigger>
          <TabsTrigger value="skills">Kỹ Năng</TabsTrigger>
        </TabsList>

        <TabsContent value="techniques" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {techniques.map((technique) => (
              <Card key={technique.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getElementIcon(technique.element)}
                      <CardTitle className="text-base">{technique.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={technique.type === 'active' ? 'default' : 'secondary'}>
                        {technique.type === 'active' ? 'Chủ Động' : 'Bị Động'}
                      </Badge>
                      <Badge variant="outline">
                        Cấp {technique.level}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">{technique.description}</p>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Thành Thạo</span>
                      <span>{technique.mastery}/{technique.maxMastery}</span>
                    </div>
                    <Progress value={(technique.mastery / technique.maxMastery) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">Thuộc Tính:</span>
                      <Badge variant="outline" className="text-xs">
                        {getElementName(technique.element)}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm">Kỹ Năng ({technique.skills.length})</h5>
                    {technique.skills.map((skill) => (
                      <div key={skill.id} className="p-2 bg-slate-50 rounded text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-800">{skill.name}</span>
                          <Badge variant="outline" className="text-xs">
                            Cấp {skill.level}
                          </Badge>
                        </div>
                        <div className="text-slate-600">{skill.description}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Tu Luyện
                    </Button>
                    <Button size="sm" className="flex-1">
                      Chi Tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <div className="grid gap-4">
            {techniques.flatMap(technique => technique.skills).map((skill) => (
              <Card key={skill.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-base mb-1">{skill.name}</h4>
                      <p className="text-sm text-slate-600">{skill.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={skill.type === 'active' ? 'default' : 'secondary'}>
                        {skill.type === 'active' ? 'Chủ Động' : 'Bị Động'}
                      </Badge>
                      <Badge variant="outline">Cấp {skill.level}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-2 bg-slate-50 rounded">
                      <div className="flex items-center justify-center mb-1">
                        <Target className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="text-xs text-slate-600">Sát Thương</div>
                      <div className="text-sm">{skill.scaling}%</div>
                    </div>
                    
                    <div className="text-center p-2 bg-slate-50 rounded">
                      <div className="flex items-center justify-center mb-1">
                        <Zap className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-xs text-slate-600">Chi Phí MP</div>
                      <div className="text-sm">{skill.mpCost}</div>
                    </div>
                    
                    <div className="text-center p-2 bg-slate-50 rounded">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="text-xs text-slate-600">Hồi Chiêu</div>
                      <div className="text-sm">{skill.cooldown}s</div>
                    </div>
                    
                    <div className="text-center p-2 bg-slate-50 rounded">
                      <div className="flex items-center justify-center mb-1">
                        <Sword className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="text-xs text-slate-600">Loại</div>
                      <div className="text-sm">{skill.damageType}</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm mb-2">Hiệu Ứng</h5>
                    <div className="space-y-1">
                      {skill.effects.map((effect, index) => (
                        <div key={index} className="text-xs p-2 bg-green-50 rounded border-l-2 border-green-300">
                          <Star className="w-3 h-3 inline mr-1 text-green-500" />
                          {effect}
                        </div>
                      ))}
                    </div>
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