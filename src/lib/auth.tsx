// /lib/auth.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Định nghĩa kiểu dữ liệu cho người dùng
interface User {
  id: number;
  displayName: string;
  // Thêm các trường khác nếu cần, ví dụ: avatarUrl
}

// Định nghĩa kiểu cho Context
interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

// Tạo Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tạo Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // useEffect để tự động đăng nhập khi tải lại trang
  useEffect(() => {
    try {
      const token = localStorage.getItem('jwt_token');
      const userDataString = localStorage.getItem('user_data');
      if (token && userDataString) {
        const userData: User = JSON.parse(userDataString);
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      // Nếu có lỗi, xóa dữ liệu cũ để tránh lặp lại
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User, token: string) => {
    // Lưu token và thông tin user vào localStorage
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setUser(userData);
    router.push('/welcome'); // Chuyển hướng đến trang chào mừng
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data'); // Xóa cả thông tin user
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Tạo một custom hook để sử dụng AuthContext dễ dàng hơn
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};