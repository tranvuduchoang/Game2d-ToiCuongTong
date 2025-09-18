// File: /components/ui/Avatar.tsx
"use client";

import { useState } from 'react';
import Sidebar from '../layout/Sidebar';

// Định nghĩa kiểu cho User, khớp với kiểu trong AuthContext
interface User {
  id: number;
  displayName: string;
}

// Định nghĩa props cho component Avatar
const Avatar = ({ user }: { user: User }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div 
        className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center font-bold cursor-pointer"
        onClick={() => setSidebarOpen(true)}
      >
        {user.displayName.charAt(0).toUpperCase()}
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Avatar;