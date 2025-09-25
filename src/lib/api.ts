// File: /lib/api.ts
import { RegisterRequest, LoginRequest, AuthResponse } from "@/dto/auth";

// Địa chỉ của server backend đang chạy
const API_BASE_URL = 'http://localhost:8081/api';

export const registerUser = async (userData: RegisterRequest) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      // Báo cho server biết chúng ta đang gửi dữ liệu dạng JSON
      'Content-Type': 'application/json',
    },
    // Chuyển đổi object JavaScript thành chuỗi JSON
    body: JSON.stringify(userData),
  });

  // Nếu response không thành công (ví dụ: lỗi 400 do email trùng)
  if (!response.ok) {
    // Đọc nội dung lỗi mà backend trả về (ví dụ: "Email đã được sử dụng!")
    const errorText = await response.text();
    // Ném lỗi này ra để component UI có thể bắt và hiển thị cho người dùng
    throw new Error(errorText || 'Đăng ký thất bại, vui lòng thử lại.');
  }

  // Nếu response thành công, trả về nội dung text (ví dụ: "Đăng ký thành công!")
  return await response.text();
};

export const loginUser = async (userData: LoginRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    // Lỗi 401 Unauthorized thường có nghĩa là sai mật khẩu/email
    throw new Error('Email hoặc mật khẩu không chính xác.');
  }

  // Nếu thành công, backend sẽ trả về JSON chứa token
  return await response.json();
};

// Hàm lấy token từ localStorage
const getToken = () => localStorage.getItem('jwt_token');

// API kiểm tra trạng thái nhân vật
export const getPlayerStatus = async (): Promise<{ isCharacterCreated: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/player/status`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Failed to fetch player status');
    return response.json();
};

// API lấy dữ liệu để tạo nhân vật
export const getCharacterCreationData = async () => {
    const response = await fetch(`${API_BASE_URL}/game-data/character-creation`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Failed to fetch creation data');
    return response.json();
};

// API gửi yêu cầu tạo nhân vật
export const createCharacter = async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/player/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Tạo nhân vật thất bại');
    }
    return response.json();
};

// API lấy thông tin chi tiết nhân vật
export const getPlayerData = async () => {
    const response = await fetch(`${API_BASE_URL}/player/data`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Không thể lấy thông tin nhân vật');
    }
    return response.json();
};

// ===== MAP EXPLORATION APIs =====

// API lấy danh sách maps
export const getMaps = async () => {
    const response = await fetch(`${API_BASE_URL}/maps`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Failed to fetch maps');
    return response.json();
};

// API lấy thông tin chi tiết map
export const getMapDetails = async (mapId: number) => {
    const response = await fetch(`${API_BASE_URL}/maps/${mapId}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Failed to fetch map details');
    return response.json();
};

// API bắt đầu map run
export const startMapRun = async (mapId: number, difficulty?: string) => {
    const response = await fetch(`${API_BASE_URL}/maps/${mapId}/start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ difficulty })
    });
    if (!response.ok) throw new Error('Failed to start map run');
    return response.json();
};

// API di chuyển trong map
export const moveInMap = async (runId: number, x: number, y: number) => {
    const response = await fetch(`${API_BASE_URL}/maps/runs/${runId}/move`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ x, y })
    });
    if (!response.ok) throw new Error('Failed to move in map');
    return response.json();
};

// API lấy thông tin map tiles
export const getMapTiles = async (runId: number) => {
    const response = await fetch(`${API_BASE_URL}/maps/runs/${runId}/tiles`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Failed to fetch map tiles');
    return response.json();
};

// ===== COMBAT SYSTEM APIs =====

// API bắt đầu combat
export const startCombat = async (monsterId: number, mapRunId?: number) => {
    const response = await fetch(`${API_BASE_URL}/combat/start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ monsterId, mapRunId })
    });
    if (!response.ok) throw new Error('Failed to start combat');
    return response.json();
};

// API thực hiện hành động trong combat
export const performCombatAction = async (combatId: string, action: any) => {
    const response = await fetch(`${API_BASE_URL}/combat/${combatId}/action`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(action)
    });
    if (!response.ok) throw new Error('Failed to perform combat action');
    return response.json();
};

// API lấy trạng thái combat
export const getCombatState = async (combatId: string) => {
    const response = await fetch(`${API_BASE_URL}/combat/${combatId}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Failed to fetch combat state');
    return response.json();
};

// API kết thúc combat
export const endCombat = async (combatId: string, result: 'victory' | 'defeat' | 'retreat') => {
    const response = await fetch(`${API_BASE_URL}/combat/${combatId}/end`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ result })
    });
    if (!response.ok) throw new Error('Failed to end combat');
    return response.json();
};

// ===== MONSTER APIs =====

// API lấy danh sách monsters
export const getMonsters = async (mapId?: number) => {
    const url = mapId ? `${API_BASE_URL}/monsters?mapId=${mapId}` : `${API_BASE_URL}/monsters`;
    const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Failed to fetch monsters');
    return response.json();
};

// API lấy thông tin chi tiết monster
export const getMonsterDetails = async (monsterId: number) => {
    const response = await fetch(`${API_BASE_URL}/monsters/${monsterId}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Failed to fetch monster details');
    return response.json();
};

// ===== PLAYER PROGRESSION APIs =====

// API hồi phục stamina
export const recoverStamina = async () => {
    const response = await fetch(`${API_BASE_URL}/player/recover-stamina`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Failed to recover stamina');
    return response.json();
};

// API kiểm tra và xử lý level up
export const checkLevelUp = async () => {
    const response = await fetch(`${API_BASE_URL}/player/check-level-up`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Failed to check level up');
    return response.json();
};

// API cập nhật rewards sau combat
export const updatePlayerRewards = async (rewards: { experience?: number, gold?: number, spiritStones?: number }) => {
    console.log('=== updatePlayerRewards API call ===');
    console.log('Rewards:', rewards);
    console.log('Token:', getToken());
    
    try {
        const response = await fetch(`${API_BASE_URL}/player/update-rewards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(rewards)
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            
            // Nếu là 403, thử refresh token
            if (response.status === 403) {
                console.log('403 Forbidden - Token might be expired, trying to refresh...');
                // Có thể implement token refresh logic ở đây
                // Hoặc redirect to login
                throw new Error('Token expired. Please login again.');
            }
            
            throw new Error(`Failed to update rewards: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log('API Response:', result);
        return result;
    } catch (error) {
        console.error('updatePlayerRewards error:', error);
        throw error;
    }
};

// API object for easy access
export const api = {
    get: async (url: string) => {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (!response.ok) throw new Error('Request failed');
        return response.json();
    },
    post: async (url: string, data: any) => {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Request failed');
        return response.json();
    },
    put: async (url: string, data: any) => {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Request failed');
        return response.json();
    },
    delete: async (url: string) => {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (!response.ok) throw new Error('Request failed');
        return response.json();
    }
};