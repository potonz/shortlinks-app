import "./CopyButton.css";

import { createSignal } from "solid-js";

import { addNotification } from "./notifications/notificationUtils";

interface IProps {
    text: string;
}

export function CopyButton(props: IProps) {
    const [copied, setCopied] = createSignal(false);

    function onClick() {
        try {
            navigator.clipboard?.writeText(props.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
            addNotification("Copied short link to clipboard");
        }
        catch {
            // ignore clipboard failures
        }
    }

    return (
        <button
            type="button"
            onClick={onClick}
            class="text-zinc-400 hover:text-zinc-200 copy-button"
            aria-label="Copy"
            data-copied={copied() ? "true" : "false"}
        >
            <span class="copy-text">
                <i class="bi bi-clipboard" />
            </span>
            <span class="check-icon">
                <i class="bi bi-check-lg" />
            </span>
        </button>
    );
}
