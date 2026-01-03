import { For } from "solid-js";

import Notification from "./Notification";
import { notifications, removeNotification } from "./notificationUtils";

const NotificationsContainer = () => {
    return (
        <div class="fixed z-50 top-4 right-4 flex flex-col gap-2">
            <For each={notifications}>
                {notification => (
                    <Notification
                        id={notification.id}
                        message={notification.message}
                        type={notification.type}
                        duration={notification.duration}
                        onClose={removeNotification}
                    />
                )}
            </For>
        </div>
    );
};

export default NotificationsContainer;
