// /app/page.tsx
"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Nếu người dùng đã đăng nhập, chuyển hướng họ đến trang welcome
    if (!isLoading && user) {
      router.push('/welcome');
    }
  }, [user, isLoading, router]);

  // Nếu đang tải hoặc đã đăng nhập, không hiển thị gì để tránh giật màn hình
  if(isLoading || user) {
    return <div className="flex justify-center items-center h-screen">Đang tải...</div>;
  }
  
  return (
    <div className="container mx-auto text-center py-20">
      <h1 className="text-5xl font-bold mb-4">Chào mừng đến với Tối Cường Tông</h1>
      <p className="text-xl text-gray-300">
        Một thế giới tu tiên rộng lớn đang chờ bạn khám phá. Hãy xây dựng tông môn,
        chiêu mộ đệ tử và trở thành kẻ mạnh nhất!
      </p>
      {/* Thêm các section giới thiệu game ở đây */}
    </div>
  );
}