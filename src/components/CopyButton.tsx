import "./CopyButton.css";

import { createSignal } from "solid-js";

interface IProps {
    text: string;
}

export function CopyButton(props: IProps) {
    const [copied, setCopied] = createSignal(false);

    return (
        <button
            type="button"
            onClick={() => {
                try {
                    navigator.clipboard?.writeText(props.text);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1000);
                }
                catch {
                    // ignore clipboard failures
                }
            }}
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
