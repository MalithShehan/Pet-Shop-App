import { API_URL } from '../constants/app-theme';

export async function getNotificationsAPI(token: string) {
  const res = await fetch(`${API_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function markNotificationAPI(id: string, isRead: boolean, token: string) {
  const res = await fetch(`${API_URL}/notifications/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isRead }),
  });
  if (!res.ok) throw new Error('Failed to update notification');
  return res.json();
}
