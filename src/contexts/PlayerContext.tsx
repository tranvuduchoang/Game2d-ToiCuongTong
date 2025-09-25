"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getPlayerData } from '@/lib/api';
import { PlayerData, PlayerStatusData } from '@/dto/player';

interface PlayerContextType {
  playerData: PlayerStatusData | null;
  loading: boolean;
  error: string | null;
  refreshPlayerData: () => Promise<void>;
  updatePlayerData: (updates: Partial<PlayerStatusData>) => void;
  refreshFromBackend: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

interface PlayerProviderProps {
  children: ReactNode;
}

export function PlayerProvider({ children }: PlayerProviderProps) {
  const [playerData, setPlayerData] = useState<PlayerStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayerData = async () => {
    try {
      setLoading(true);
      const data = await getPlayerData();
      console.log('Player data from API:', data);
      
      // Chuyển đổi dữ liệu từ backend thành format cho UI
      const statusData: PlayerStatusData = {
        playerName: data.name || "Chưa đặt tên",
        cultivationLevel: data.cultivationLevel || "Luyện Thể",
        cultivationRealm: data.cultivationRealm || "Tầng 1",
        physicalStrength: Math.min(data.currentStamina || 100, data.maxStamina || 100),
        maxPhysicalStrength: data.maxStamina || 100,
        experience: data.experience || 0,
        maxExperience: data.maxExperience || 2000,
        spiritStones: data.spiritStones || 0,
        gold: data.gold || 0,
        reputation: data.reputation || 0
      };
      
      setPlayerData(statusData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      console.error('Error fetching player data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshPlayerData = async () => {
    await fetchPlayerData();
  };

  const updatePlayerData = (updates: Partial<PlayerStatusData>) => {
    setPlayerData(prev => prev ? { ...prev, ...updates } : null);
  };

  // Function to refresh data from backend
  const refreshFromBackend = async () => {
    try {
      await fetchPlayerData();
    } catch (error) {
      console.error('Failed to refresh player data from backend:', error);
    }
  };

  useEffect(() => {
    fetchPlayerData();
  }, []);

  return (
    <PlayerContext.Provider value={{
      playerData,
      loading,
      error,
      refreshPlayerData,
      updatePlayerData,
      refreshFromBackend
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
