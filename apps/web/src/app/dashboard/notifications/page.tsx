'use client';

import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/lib/api/notifications-service/hooks';
import { NotificationType } from '@/lib/api/notifications-service/client';
import styles from './page.module.css';
import { Bell, CheckCircle2, XCircle, UserPlus, AlertTriangle, TrendingUp, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Notifications Page
 */
export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.CONTENT_APPROVED:
        return <CheckCircle2 size={20} color="#10b981" />;
      case NotificationType.CONTENT_REJECTED:
        return <XCircle size={20} color="#ef4444" />;
      case NotificationType.INVITATION:
        return <UserPlus size={20} color="#3b82f6" />;
      case NotificationType.TOKEN_ALERT_80:
      case NotificationType.TOKEN_ALERT_100:
        return <AlertTriangle size={20} color="#f59e0b" />;
      case NotificationType.PLAN_UPGRADED:
        return <TrendingUp size={20} color="#8b5cf6" />;
      default:
        return <Bell size={20} />;
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  const hasNotifications = notifications?.data && notifications.data.length > 0;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Notificaciones</h1>
        {hasNotifications && (
          <button
            className={styles.markAllBtn}
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
          >
            Marcar todas como leídas
          </button>
        )}
      </header>

      {!hasNotifications ? (
        <div className={styles.emptyState}>
          <Inbox size={48} />
          <p>No tienes notificaciones por el momento.</p>
        </div>
      ) : (
        <div className={styles.notificationList}>
          {notifications.data.map(notif => (
            <div
              key={notif.id}
              className={cn(styles.notificationItem, !notif.read && styles.unread)}
              onClick={() => !notif.read && markAsRead.mutate(notif.id)}
            >
              {!notif.read && <div className={styles.unreadDot} />}
              <div className={styles.iconWrapper}>{getIcon(notif.type)}</div>
              <div className={styles.content}>
                <h3 className={styles.notifTitle}>{notif.title}</h3>
                <p className={styles.notifBody}>{notif.body}</p>
                <span className={styles.notifTime}>
                  {formatDistanceToNow(new Date(notif.createdAt), {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
