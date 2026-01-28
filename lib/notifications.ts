const BASE_URL = "http://localhost:5050/api/notifications"; // ✅ adjust for your backend IP

// 📬 Fetch all notifications for a specific user
export async function getNotifications(userId: string) {
  const res = await fetch(`${BASE_URL}/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch notifications (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data?.data || []; // backend returns { data: [...] }
}

// 🟢 Mark all notifications as read
export async function markAllAsRead(userId: string) {
  const res = await fetch(`${BASE_URL}/read/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to mark notifications as read (${res.status}): ${text}`);
  }

  return await res.json(); // { message: "✅ All notifications marked as read" }
}

// 🟡 Mark a single notification as read (optional)
export async function markOneAsRead(notifId: string) {
  const res = await fetch(`${BASE_URL}/read_one/${notifId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to mark notification as read (${res.status}): ${text}`);
  }

  return await res.json();
}
