import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

interface PlayerStatusProps {
  playerName: string;
  cultivationLevel: string;
  cultivationRealm: string;
  physicalStrength: number;
  maxPhysicalStrength: number;
  experience: number;
  maxExperience: number;
  spiritStones: number;
  reputation: number;
}

export function PlayerStatus({
  playerName = "Tiểu Tử",
  cultivationLevel = "Luyện Khí",
  cultivationRealm = "Tầng 3",
  physicalStrength = 75,
  maxPhysicalStrength = 100,
  experience = 1250,
  maxExperience = 2000,
  spiritStones = 4890,
  reputation = 750
}: Partial<PlayerStatusProps>) {
  const strengthPercent = (physicalStrength / maxPhysicalStrength) * 100;
  const expPercent = (experience / maxExperience) * 100;

  return (
    <Card className="ancient-scroll martial-glow power-pulse relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10" />
      <CardContent className="p-4 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl text-primary font-semibold tracking-wide">{playerName}</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                {cultivationLevel}
              </Badge>
              <Badge variant="outline" className="border-accent text-accent">
                {cultivationRealm}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Danh Tiếng</div>
            <div className="text-lg text-primary font-semibold">{reputation.toLocaleString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Thể Lực</span>
              <span className="text-foreground">{physicalStrength}/{maxPhysicalStrength}</span>
            </div>
            <Progress value={strengthPercent} className="h-3 bg-muted" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Tu Vi</span>
              <span className="text-foreground">{experience}/{maxExperience}</span>
            </div>
            <Progress value={expPercent} className="h-3 bg-muted" />
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded-full martial-glow floating-animation"></div>
            <span className="text-sm text-muted-foreground">Linh Thạch</span>
          </div>
          <span className="text-primary font-semibold">{spiritStones.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}