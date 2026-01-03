import { createEffect, createSignal } from "solid-js";

interface NotificationProps {
    id: string;
    message: string;
    type?: "success" | "error" | "info" | "warning";
    duration?: number;
    onClose?: (id: string) => void;
}

const Notification = (props: NotificationProps) => {
    const [isVisible, setIsVisible] = createSignal(true);

    createEffect(() => {
        if (props.duration && props.duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    if (props.onClose) {
                        props.onClose(props.id);
                    }
                }, 300);
            }, props.duration);

            return () => clearTimeout(timer);
        }
    });

    const getTypeClasses = () => {
        switch (props.type) {
            case "success":
                return "bg-green-800 border-green-600 text-green-100";
            case "error":
                return "bg-red-800 border-red-600 text-red-100";
            case "warning":
                return "bg-yellow-800 border-yellow-600 text-yellow-100";
            case "info":
            default:
                return "bg-zinc-800 border-zinc-600 text-zinc-100";
        }
    };

    return (
        <div
            class={`w-full md:w-96 ${getTypeClasses()} border rounded-lg p-4 shadow-lg transition-all duration-300 ease-in-out transform
                ${isVisible() ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"}`}
        >
            <div class="flex items-start">
                <div class="flex-1">
                    <p class="text-sm font-medium">{props.message}</p>
                </div>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        if (props.onClose) {
                            props.onClose(props.id);
                        }
                    }}
                    class="ml-4 shrink-0 text-zinc-300 hover:text-white focus:outline-none"
                    aria-label="Close notification"
                >
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
        </div>
    );
};

export default Notification;
