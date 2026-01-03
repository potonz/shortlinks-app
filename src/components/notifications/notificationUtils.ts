import { createStore } from "solid-js/store";

type NotificationType = "success" | "error" | "info" | "warning";

export interface NotificationItem {
    id: string;
    message: string;
    type?: NotificationType;
    duration?: number;
}

const [notifications, setNotifications] = createStore<NotificationItem[]>([]);

// Add a notification
const addNotification = (
    message: string,
    type: NotificationType = "info",
    duration = 2000,
) => {
    const id = crypto.randomUUID();
    setNotifications(notifications.length, { id, message, type, duration });
    return id;
};

// Remove a notification
const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
};

// Clear all notifications
const clearNotifications = () => {
    setNotifications([]);
};

export {
    addNotification,
    clearNotifications,
    notifications,
    removeNotification,
};
