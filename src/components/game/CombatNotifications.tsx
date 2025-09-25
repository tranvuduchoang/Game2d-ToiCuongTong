"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Star,
  Sword,
  Heart,
  Zap,
  Shield,
  Coins,
  Trophy
} from "lucide-react";
import { useState, useEffect } from "react";

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'achievement' | 'combat';
  title: string;
  message: string;
  timestamp: string;
  duration?: number; // in milliseconds
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'default' | 'outline' | 'destructive';
  }>;
}

interface CombatNotificationsProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
  maxNotifications?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function CombatNotifications({ 
  notifications, 
  onDismiss, 
  onDismissAll, 
  maxNotifications = 5,
  position = 'top-right'
}: CombatNotificationsProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Auto-dismiss notifications after their duration
    notifications.forEach(notification => {
      if (notification.duration) {
        setTimeout(() => {
          onDismiss(notification.id);
        }, notification.duration);
      }
    });

    // Update visible notifications
    setVisibleNotifications(notifications.slice(-maxNotifications));
  }, [notifications, maxNotifications, onDismiss]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      case 'achievement': return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'combat': return <Sword className="w-5 h-5 text-red-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-500 bg-green-500/10';
      case 'warning': return 'border-yellow-500 bg-yellow-500/10';
      case 'error': return 'border-red-500 bg-red-500/10';
      case 'info': return 'border-blue-500 bg-blue-500/10';
      case 'achievement': return 'border-yellow-500 bg-yellow-500/10';
      case 'combat': return 'border-red-500 bg-red-500/10';
      default: return 'border-slate-500 bg-slate-500/10';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right': return 'top-4 right-4';
      case 'top-left': return 'top-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'top-center': return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center': return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default: return 'top-4 right-4';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) { // Less than 1 minute
      return 'Vừa xong';
    } else if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes} phút trước`;
    } else if (diff < 86400000) { // Less than 1 day
      const hours = Math.floor(diff / 3600000);
      return `${hours} giờ trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-50 space-y-2 max-w-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-300">
            Thông báo ({visibleNotifications.length})
          </span>
        </div>
        <Button
          onClick={onDismissAll}
          variant="outline"
          size="sm"
          className="h-6 px-2 text-xs"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* Notifications */}
      <div className="space-y-2">
        {visibleNotifications.map((notification) => (
          <Card
            key={notification.id}
            className={`border-l-4 ${getNotificationColor(notification.type)} animate-in slide-in-from-right duration-300`}
          >
            <CardContent className="p-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-slate-200">
                      {notification.title}
                    </h4>
                    <Button
                      onClick={() => onDismiss(notification.id)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <p className="text-xs text-slate-400 mb-2">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                    
                    {notification.actions && notification.actions.length > 0 && (
                      <div className="flex space-x-1">
                        {notification.actions.map((action, index) => (
                          <Button
                            key={index}
                            onClick={action.action}
                            variant={action.variant || 'outline'}
                            size="sm"
                            className="h-6 px-2 text-xs"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Hook for managing notifications
export function useCombatNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    setNotifications(prev => [...prev, newNotification]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const dismissAllNotifications = () => {
    setNotifications([]);
  };

  const addCombatNotification = (title: string, message: string, type: 'success' | 'warning' | 'error' = 'info') => {
    addNotification({
      type: 'combat',
      title,
      message,
      duration: 5000
    });
  };

  const addAchievementNotification = (title: string, message: string) => {
    addNotification({
      type: 'achievement',
      title,
      message,
      duration: 10000
    });
  };

  const addDamageNotification = (damage: number, isCritical: boolean = false) => {
    addNotification({
      type: 'combat',
      title: isCritical ? 'Critical Hit!' : 'Damage Dealt',
      message: `Gây ${damage} sát thương${isCritical ? ' (Critical!)' : ''}`,
      duration: 3000
    });
  };

  const addHealingNotification = (healing: number) => {
    addNotification({
      type: 'success',
      title: 'Healing',
      message: `Hồi phục ${healing} HP`,
      duration: 3000
    });
  };

  const addSkillNotification = (skillName: string, damage?: number) => {
    addNotification({
      type: 'combat',
      title: 'Skill Used',
      message: `Sử dụng ${skillName}${damage ? ` - ${damage} damage` : ''}`,
      duration: 4000
    });
  };

  const addItemNotification = (itemName: string, effect?: string) => {
    addNotification({
      type: 'info',
      title: 'Item Used',
      message: `Sử dụng ${itemName}${effect ? ` - ${effect}` : ''}`,
      duration: 4000
    });
  };

  const addVictoryNotification = (experience: number, gold: number) => {
    addNotification({
      type: 'achievement',
      title: 'Victory!',
      message: `Nhận ${experience} XP và ${gold} gold`,
      duration: 8000
    });
  };

  const addDefeatNotification = () => {
    addNotification({
      type: 'error',
      title: 'Defeat',
      message: 'Bạn đã thất bại trong trận chiến',
      duration: 10000
    });
  };

  return {
    notifications,
    addNotification,
    dismissNotification,
    dismissAllNotifications,
    addCombatNotification,
    addAchievementNotification,
    addDamageNotification,
    addHealingNotification,
    addSkillNotification,
    addItemNotification,
    addVictoryNotification,
    addDefeatNotification
  };
}
