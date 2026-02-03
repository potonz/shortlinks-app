interface SpinnerProps {
    size?: "sm" | "md" | "lg";
    class?: string;
}

export function Spinner({ size = "md", class: className = "" }: SpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4 border-2",
        md: "w-8 h-8 border-2",
        lg: "w-12 h-12 border-4",
    };

    return (
        <div class={`animate-spin rounded-full border-zinc-300 border-t-zinc-600 ${sizeClasses[size]} ${className}`}>
        </div>
    );
}
