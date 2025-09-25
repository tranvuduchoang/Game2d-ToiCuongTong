import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { getPlayerData } from "@/lib/api";
import { PlayerData, PlayerStatusData } from "@/dto/player";

interface PlayerStatusProps {
  // Props không còn cần thiết vì sẽ lấy từ API
}

export function PlayerStatus({}: PlayerStatusProps) {
  const [playerData, setPlayerData] = useState<PlayerStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        const data = await getPlayerData();
        console.log('Player data from API:', data);
        console.log('Player stats:', data.stats);
        
        // Chuyển đổi dữ liệu từ backend thành format cho UI
        const statusData: PlayerStatusData = {
          playerName: data.name || "Chưa đặt tên", //tên nhân vật và người chơi đã đặt khi tạo tài khoản
          cultivationLevel: data.cultivationLevel || "Luyện Thể", // Tu vi của người chơi (Luyện thể - Luyện khí - Trúc cơ - Kết đan - Nguyên anh - Hóa thần)
          cultivationRealm: data.cultivationRealm || "Tầng 1", // Bậc trong tu vi người chơi (1-9) . Ví dụ một tài khoản mới tạo sẽ có tu vi luyện thể tầng 1
          physicalStrength: Math.min(data.currentStamina || 100, data.maxStamina || 100), // luôn phải <= maxPhysicalStrength và sẽ bị trừ đi khi tham gia "Khám phá" map và sẽ được hồi theo thời gian
          maxPhysicalStrength: data.maxStamina || 100, // Giới hạn tối đa 100, sẽ tăng thêm 10 khi tăng 1 tầng nhỏ, thăng thêm 50 khi tăng 1 cảnh giới
          experience: data.experience || 0, // Kinh nghiệm tu luyện của người chơi. Với tài khoản mới tạo thì sẽ là 0
          maxExperience: data.maxExperience || 2000, // Kinh nghiệm tu luyện tối đa của người chơi với tu vi đang luyện
          spiritStones: data.spiritStones || 0, // Linh thạch của người chơi. Với tài khoản mới tạo thì sẽ là 0. Phải nạp tiền mới có hoặc tham gia sự kiện để được tặng
          gold: data.gold || 0, // Vàng của người chơi. Với tài khoản mới tạo thì sẽ là 0. Có thể đánh quái vật, khám phá map, tham gia sự kiện để được tặng
          reputation: data.reputation || 0 // Danh tiếng của người chơi. Với tài khoản mới tạo thì sẽ là 0
        };
        
        setPlayerData(statusData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
        console.error('Error fetching player data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, []);

  if (loading) {
    return (
      <Card className="ancient-scroll martial-glow power-pulse relative overflow-hidden">
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">Đang tải thông tin nhân vật...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="ancient-scroll martial-glow power-pulse relative overflow-hidden">
        <CardContent className="p-4">
          <div className="text-center text-destructive">Lỗi: {error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!playerData) {
    return (
      <Card className="ancient-scroll martial-glow power-pulse relative overflow-hidden">
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">Không có dữ liệu nhân vật</div>
        </CardContent>
      </Card>
    );
  }

  const strengthPercent = (playerData.physicalStrength / playerData.maxPhysicalStrength) * 100;
  const expPercent = (playerData.experience / playerData.maxExperience) * 100;

  return (
    <Card className="ancient-scroll martial-glow power-pulse relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10" />
      <CardContent className="p-4 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl text-primary font-semibold tracking-wide">{playerData.playerName}</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                {playerData.cultivationLevel}
              </Badge>
              <Badge variant="outline" className="border-accent text-accent">
                {playerData.cultivationRealm}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Danh Tiếng</div>
            <div className="text-lg text-primary font-semibold">{playerData.reputation.toLocaleString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Thể Lực</span>
              <span className="text-foreground">{playerData.physicalStrength}/{playerData.maxPhysicalStrength}</span>
            </div>
            <Progress value={strengthPercent} className="h-3 bg-muted" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Tu Vi</span>
              <span className="text-foreground">{playerData.experience}/{playerData.maxExperience}</span>
            </div>
            <Progress value={expPercent} className="h-3 bg-muted" />
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded-full martial-glow floating-animation"></div>
            <span className="text-sm text-muted-foreground">Linh Thạch</span>
          </div>
          <span className="text-primary font-semibold">{playerData.spiritStones.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded-full martial-glow floating-animation"></div>
            <span className="text-sm text-muted-foreground">Vàng</span>
          </div>
          <span className="text-primary font-semibold">{playerData.gold.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}