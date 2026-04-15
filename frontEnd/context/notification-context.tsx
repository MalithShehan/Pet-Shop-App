import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { getNotificationsAPI, markNotificationAPI } from '../services/notification-api';
import { useAuth } from './auth-context';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user && token) {
      getNotificationsAPI(token).then((data) => {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
      });
      const s = io(process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000');
      s.emit('join', user._id);
      s.on('notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
      setSocket(s);
      return () => s.disconnect();
    }
  }, [user, token]);

  const markAsRead = useCallback(async (id, isRead) => {
    await markNotificationAPI(id, isRead, token);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead } : n))
    );
    setUnreadCount((prev) =>
      isRead ? prev - 1 : prev + 1
    );
  }, [token]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
