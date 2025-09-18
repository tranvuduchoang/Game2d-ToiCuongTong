// File: /components/auth/AuthModal.tsx
"use client";

import { useState } from 'react';
import { registerUser, loginUser } from '@/lib/api';
import { useAuth } from '@/lib/auth'; // Import useAuth
import { RegisterRequest, LoginRequest } from '@/dto/auth';

interface AuthModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
}

export const AuthModal = ({ mode, onClose }: AuthModalProps) => {
  const auth = useAuth(); // Lấy context xác thực
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isLoginMode = mode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (isLoginMode) {
        const userData: LoginRequest = { email, password };
        const authResponse = await loginUser(userData);
        // Gọi hàm login từ context để lưu token và thông tin user
        auth.login({ id: authResponse.userId, displayName: authResponse.displayName }, authResponse.token);
        onClose(); // Đóng modal ngay khi thành công
      } else {
        // Bước 1: Tạo tài khoản như cũ
        const registerData: RegisterRequest = { email, displayName, password };
        await registerUser(registerData);

        // Bước 2: Tự động đăng nhập ngay sau khi đăng ký thành công
        const loginData: LoginRequest = { email, password };
        const authResponse = await loginUser(loginData);

        // Bước 3: Cập nhật trạng thái ứng dụng với thông tin nhận được
        auth.login({ id: authResponse.userId, displayName: authResponse.displayName }, authResponse.token);
        onClose(); // Đóng modal ngay lập tức
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý khi đóng modal, reset lại trạng thái
  const handleClose = () => {
    setError(null);
    setSuccess(null);
    setIsLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md relative">
        <button onClick={handleClose} className="absolute top-4 right-4 text-2xl hover:text-gray-400">&times;</button>
        {/* Tiêu đề thay đổi theo mode */}
        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">
          {isLoginMode ? 'Đăng Nhập' : 'Đăng Ký Tài Khoản'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-300">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:ring-yellow-500 focus:border-yellow-500" required />
          </div>

          {/* Chỉ hiển thị trường này khi ở mode đăng ký */}
          {!isLoginMode && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-300">Tên hiển thị</label>
              <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:ring-yellow-500 focus:border-yellow-500" required />
            </div>
          )}
          
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-300">Mật khẩu</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:ring-yellow-500 focus:border-yellow-500" required />
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
            {isLoading ? 'Đang xử lý...' : (isLoginMode ? 'Đăng Nhập' : 'Tạo Tài Khoản')}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mt-4 text-center">{success}</p>}
      </div>
    </div>
  );
};