// File: /app/create-character/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { getCharacterCreationData, createCharacter } from '@/lib/api';
import { useRouter } from 'next/navigation';

// Định nghĩa kiểu dữ liệu cho data nhận về từ API
interface Avatar {
  id: number;
  imageUrl: string;
}

interface Technique {
  id: number;
  name: string;
  description: string;
  bookImageUrl: string;
}

const STATS_BASE = {
  STR: 5,
  AGI: 5,
  DEF: 5,
  HP: 100,
  MP: 50,
};

const MAX_SP = 20;

export default function CreateCharacterPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [avatars, setAvatars] = useState<Avatar[]>([]);
    const [techniques, setTechniques] = useState<Technique[]>([]);
    
    const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string | null>(null);
    const [selectedTechniqueIds, setSelectedTechniqueIds] = useState<number[]>([]);
    const [stats, setStats] = useState(STATS_BASE);
    const [remainingSp, setRemainingSp] = useState(MAX_SP);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCharacterCreationData();
                setAvatars(data.randomAvatars);
                setTechniques(data.randomTechniques);
                if (data.randomAvatars.length > 0) {
                    setSelectedAvatarUrl(data.randomAvatars[0].imageUrl);
                }
            } catch (err) {
                setError("Không thể tải dữ liệu tạo nhân vật.");
            }
        };
        fetchData();
    }, []);

    const handleSelectTechnique = (id: number) => {
        const isSelected = selectedTechniqueIds.includes(id);
        if (isSelected) {
            setSelectedTechniqueIds(current => current.filter(techId => techId !== id));
        } else {
            if (selectedTechniqueIds.length < 2) {
                setSelectedTechniqueIds(current => [...current, id]);
            }
        }
    };
    
    const handleStatChange = (stat: keyof typeof STATS_BASE, amount: number) => {
        if (amount > 0 && remainingSp > 0) {
            setStats(current => ({ ...current, [stat]: current[stat] + 1 }));
            setRemainingSp(current => current - 1);
        } else if (amount < 0 && stats[stat] > STATS_BASE[stat]) {
            setStats(current => ({ ...current, [stat]: current[stat] - 1 }));
            setRemainingSp(current => current + 1);
        }
    };

    const handleSubmit = async () => {
        if (!selectedAvatarUrl || selectedTechniqueIds.length !== 2 || remainingSp !== 0) {
            setError("Vui lòng chọn 1 Avatar, 2 Công Pháp và dùng hết điểm tiềm năng.");
            return;
        }
        setError(null);
        setIsLoading(true);

        const finalStats = { ...stats, LUK: 0 }; // Thêm LUK = 0

        const characterData = {
            avatarUrl: selectedAvatarUrl,
            techniqueIds: selectedTechniqueIds,
            stats: finalStats,
        };

        try {
            await createCharacter(characterData);
            router.push('/game');
        } catch (err: any) {
            setError(err.message || "Tạo nhân vật thất bại!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen p-4 sm:p-8">
            <div className="max-w-4xl mx-auto bg-gray-800/50 rounded-lg shadow-xl p-6 border border-gray-700">
                
                {/* TIÊU ĐỀ */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 font-serif tracking-wider">Khởi Tạo Nguyên Thần</h1>
                    <p className="text-gray-400 mt-2">Định hình con đường tu tiên của riêng bạn.</p>
                </div>

                {/* TÊN NHÂN VẬT */}
                <div className="mb-8 p-4 bg-gray-900/50 rounded-md">
                    <span className="text-gray-400 text-sm">Tên Nhân Vật:</span>
                    <p className="text-xl font-semibold text-white">{user?.displayName || "Đang tải..."}</p>
                </div>

                {/* CHỌN AVATAR */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-yellow-500 mb-4 font-serif">Chọn Pháp Tướng</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-2 sm:gap-4">
                        {avatars.map((avatar) => (
                            <button
                                key={avatar.id}
                                onClick={() => setSelectedAvatarUrl(avatar.imageUrl)}
                                className={`aspect-square rounded-lg overflow-hidden transition-all duration-200 transform hover:scale-105 focus:outline-none ${selectedAvatarUrl === avatar.imageUrl ? 'ring-4 ring-yellow-400' : 'ring-2 ring-gray-600 hover:ring-yellow-500'}`}
                            >
                                <img src={avatar.imageUrl} alt={`Avatar ${avatar.id}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* CHỌN CÔNG PHÁP */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-yellow-500 mb-4 font-serif">Lựa Chọn Công Pháp (Chọn 2)</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {techniques.map((tech) => (
                            // Thẻ cha cần có class `group` để kích hoạt popover
                            <div key={tech.id} className="relative group">
                                <button
                                    onClick={() => handleSelectTechnique(tech.id)}
                                    disabled={selectedTechniqueIds.length >= 2 && !selectedTechniqueIds.includes(tech.id)}
                                    className={`w-full h-full p-2 bg-gray-900/60 rounded-lg border-2 transition-all duration-200 text-center disabled:opacity-40 disabled:cursor-not-allowed ${selectedTechniqueIds.includes(tech.id) ? 'border-yellow-400' : 'border-gray-600 hover:border-yellow-500'}`}
                                >
                                    <img src={tech.bookImageUrl || '/images/placeholder_book.png'} alt={tech.name} className="w-16 h-16 mx-auto mb-2"/>
                                    <p className="text-xs sm:text-sm font-medium">{tech.name}</p>
                                </button>
                                
                                {/* --- PHẦN POPOVER --- */}
                                <div className="absolute bottom-full mb-2 w-64 p-3 bg-gray-900 border border-yellow-500 rounded-lg shadow-lg 
                                                text-sm text-left opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                                                transition-all duration-300 transform scale-95 group-hover:scale-100 z-10
                                                left-1/2 -translate-x-1/2">
                                    <h4 className="font-bold text-yellow-400 border-b border-gray-700 pb-1 mb-2">{tech.name}</h4>
                                    <p className="text-gray-300">{tech.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PHÂN PHỐI ĐIỂM */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-yellow-500 mb-4 font-serif">Phân Phối Tiềm Năng</h2>
                    <p className="text-lg mb-4">Điểm còn lại: <span className="font-bold text-green-400">{remainingSp}</span></p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.keys(STATS_BASE).map((statKey) => {
                            const key = statKey as keyof typeof STATS_BASE;
                            if (key === 'HP' || key === 'MP') return null; // Không cho cộng điểm HP, MP
                            return (
                                <div key={key} className="flex items-center justify-between bg-gray-900/60 p-3 rounded-md">
                                    <span className="font-bold text-lg">{key}</span>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => handleStatChange(key, -1)} className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-xl font-bold">-</button>
                                        <span className="text-xl font-bold w-8 text-center">{stats[key]}</span>
                                        <button onClick={() => handleStatChange(key, 1)} className="w-8 h-8 rounded-full bg-green-600 hover:bg-green-500 text-xl font-bold">+</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* NÚT HOÀN TẤT */}
                <div className="mt-8 text-center">
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-10 py-4 bg-yellow-500 text-gray-900 font-bold text-lg rounded-lg shadow-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-wait"
                    >
                        {isLoading ? "Đang Khai Mở..." : "Hoàn Tất Sáng Tạo"}
                    </button>
                </div>

            </div>
        </div>
    );
}