// /components/layout/Header.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import Avatar from '../ui/Avatar';
import { AuthModal } from '../auth/AuthModal';

const Header = () => {
  const { user, isLoading } = useAuth();
  const [modalMode, setModalMode] = useState<'login' | 'register' | null>(null);

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-gray-800/80 backdrop-blur-sm p-4 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-yellow-400">
            Tối Cường Tông
          </Link>
          <nav>
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
            ) : user ? (
              <Avatar user={user} />
            ) : (
              <div className="space-x-4">
                <button onClick={() => setModalMode('login')} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">
                  Đăng nhập
                </button>
                <button onClick={() => setModalMode('register')} className="px-4 py-2 rounded bg-green-600 hover:bg-green-700">
                  Đăng ký
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>
      {modalMode && (
        <AuthModal
          mode={modalMode}
          onClose={() => setModalMode(null)}
        />
      )}
    </>
  );
};

export default Header;