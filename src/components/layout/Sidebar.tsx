// /components/layout/Sidebar.tsx
"use client";

import React from 'react';
import { useAuth } from '@/lib/auth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <>
      {/* Lớp phủ nền */}
      <div 
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>
      
      {/* Nội dung Sidebar */}
      <aside 
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 shadow-lg p-6 z-50 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <h2 className="text-lg font-semibold mb-6">Tùy chọn</h2>
        <ul>
          <li className="mb-4">
            <button className="w-full text-left px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50" disabled>
              Nạp tiền
            </button>
          </li>
          <li>
            <button 
              className="w-full text-left px-3 py-2 rounded bg-red-600 hover:bg-red-700"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;