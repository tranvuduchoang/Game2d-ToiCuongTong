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