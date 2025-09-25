"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  ScrollText, 
  Filter, 
  Search, 
  Download, 
  Trash2,
  X,
  Eye,
  EyeOff,
  Clock,
  Sword,
  Heart,
  Zap,
  Star
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface CombatLogEntry {
  id: string;
  timestamp: string;
  type: 'damage' | 'heal' | 'skill' | 'item' | 'system' | 'victory' | 'defeat';
  message: string;
  damage?: number;
  healing?: number;
  skillName?: string;
  itemName?: string;
  source: string;
  target?: string;
  critical?: boolean;
  miss?: boolean;
  block?: boolean;
}

interface CombatLogProps {
  onClose: () => void;
  onClear?: () => void;
  onExport?: () => void;
  entries?: CombatLogEntry[];
  maxEntries?: number;
}

export function CombatLog({ onClose, onClear, onExport, entries = [], maxEntries = 100 }: CombatLogProps) {
  const [filter, setFilter] = useState<'all' | 'damage' | 'heal' | 'skill' | 'item' | 'system'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTimestamp, setShowTimestamp] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const logRef = useRef<HTMLDivElement>(null);

  const filteredEntries = entries
    .filter(entry => {
      if (filter !== 'all' && entry.type !== filter) return false;
      if (searchTerm && !entry.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .slice(-maxEntries);

  useEffect(() => {
    if (autoScroll && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [filteredEntries, autoScroll]);

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'damage': return <Sword className="w-4 h-4 text-red-500" />;
      case 'heal': return <Heart className="w-4 h-4 text-green-500" />;
      case 'skill': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'item': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'system': return <Clock className="w-4 h-4 text-slate-500" />;
      case 'victory': return <Sword className="w-4 h-4 text-green-500" />;
      case 'defeat': return <Sword className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getEntryColor = (type: string) => {
    switch (type) {
      case 'damage': return 'text-red-400';
      case 'heal': return 'text-green-400';
      case 'skill': return 'text-blue-400';
      case 'item': return 'text-yellow-400';
      case 'system': return 'text-slate-400';
      case 'victory': return 'text-green-500 font-bold';
      case 'defeat': return 'text-red-500 font-bold';
      default: return 'text-slate-400';
    }
  };

  const getEntryBadge = (entry: CombatLogEntry) => {
    if (entry.critical) return <Badge className="bg-red-500 text-xs">Critical!</Badge>;
    if (entry.miss) return <Badge className="bg-slate-500 text-xs">Miss</Badge>;
    if (entry.block) return <Badge className="bg-blue-500 text-xs">Blocked</Badge>;
    return null;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const exportLog = () => {
    const logText = filteredEntries
      .map(entry => {
        const timestamp = showTimestamp ? `[${formatTimestamp(entry.timestamp)}] ` : '';
        const badges = entry.critical ? ' [Critical!]' : entry.miss ? ' [Miss]' : entry.block ? ' [Blocked]' : '';
        return `${timestamp}${entry.message}${badges}`;
      })
      .join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `combat-log-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <ScrollText className="w-6 h-6 text-blue-500" />
            <span>Nhật ký chiến đấu</span>
          </CardTitle>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-1 bg-slate-800 border border-slate-600 rounded text-sm"
            >
              <option value="all">Tất cả</option>
              <option value="damage">Sát thương</option>
              <option value="heal">Hồi máu</option>
              <option value="skill">Kỹ năng</option>
              <option value="item">Vật phẩm</option>
              <option value="system">Hệ thống</option>
            </select>
          </div>

          {/* Search */}
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 bg-slate-800 border border-slate-600 rounded text-sm w-48"
            />
          </div>

          {/* Toggle Timestamp */}
          <Button
            onClick={() => setShowTimestamp(!showTimestamp)}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            {showTimestamp ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>Thời gian</span>
          </Button>

          {/* Auto Scroll */}
          <Button
            onClick={() => setAutoScroll(!autoScroll)}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            {autoScroll ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>Tự động cuộn</span>
          </Button>
        </div>

        {/* Log Entries */}
        <div 
          ref={logRef}
          className="h-96 overflow-y-auto bg-slate-900/50 rounded-lg p-4 space-y-2"
        >
          {filteredEntries.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              <ScrollText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Chưa có nhật ký chiến đấu</p>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start space-x-3 p-2 rounded hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getEntryIcon(entry.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {showTimestamp && (
                      <span className="text-xs text-slate-500 font-mono">
                        {formatTimestamp(entry.timestamp)}
                      </span>
                    )}
                    <span className="text-sm font-medium text-slate-300">
                      {entry.source}
                    </span>
                    {entry.target && (
                      <>
                        <span className="text-slate-500">→</span>
                        <span className="text-sm text-slate-300">{entry.target}</span>
                      </>
                    )}
                    {getEntryBadge(entry)}
                  </div>
                  
                  <p className={`text-sm ${getEntryColor(entry.type)}`}>
                    {entry.message}
                  </p>
                  
                  {(entry.damage || entry.healing) && (
                    <div className="flex items-center space-x-4 mt-1 text-xs text-slate-400">
                      {entry.damage && (
                        <span className="text-red-400">
                          Sát thương: {entry.damage}
                        </span>
                      )}
                      {entry.healing && (
                        <span className="text-green-400">
                          Hồi máu: {entry.healing}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>
            Hiển thị {filteredEntries.length} / {entries.length} mục
          </span>
          <div className="flex items-center space-x-2">
            <span>Bộ lọc: {filter}</span>
            {searchTerm && <span>• Tìm: "{searchTerm}"</span>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t border-slate-700">
          <div className="flex space-x-2">
            {onClear && (
              <Button onClick={onClear} variant="outline" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa nhật ký
              </Button>
            )}
            <Button onClick={exportLog} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Xuất file
            </Button>
          </div>
          
          <Button onClick={onClose}>
            Đóng
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
