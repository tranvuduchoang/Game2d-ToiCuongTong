// File: /dto/player.ts
export interface PlayerData {
  id: number;
  name: string;
  avatarUrl?: string;
  characterCreated: boolean; // Đổi tên để match với backend
  stats: {
    STR?: number;
    AGI?: number;
    DEF?: number;
    // Các stats khác có thể được thêm vào
    [key: string]: any;
  };
  userId: number; // Thay vì có toàn bộ user object
}

export interface PlayerStatusData {
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
