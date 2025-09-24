// /app/welcome/page.tsx
"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getPlayerStatus } from '@/lib/api'; // Import API mới

export default function WelcomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Nếu chưa đăng nhập, đá về trang chủ
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Nếu đang tải hoặc chưa đăng nhập, không hiển thị gì
  if (isLoading || !user) {
    return <div className="flex justify-center items-center h-screen">Đang xác thực...</div>;
  }

  const handleStartJourney = async () => {
    try {
      const status = await getPlayerStatus();
      if (status.isCharacterCreated) {
        router.push('/game'); // Nếu đã tạo, vào game
      } else {
        router.push('/create-character'); // Nếu chưa, đến trang tạo nhân vật
      }
    } catch (error) {
      console.error(error);
      // Nếu lỗi 404 hoặc không tìm thấy Player, vẫn chuyển đến trang tạo nhân vật
      router.push('/create-character');
    }
  };

  return (
    <div className="container mx-auto text-center py-20 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Chào mừng trở lại, {user.displayName}!</h1>
      <p className="text-lg text-gray-400 mb-8">
        Con đường tu tiên của bạn đang chờ. Bạn đã sẵn sàng chưa?
      </p>
      <button
        className="px-8 py-4 text-xl font-bold rounded bg-yellow-500 text-gray-900 hover:bg-yellow-400"
        onClick={handleStartJourney}
      >
        Bắt đầu hành trình
      </button>
    </div>
  );
}