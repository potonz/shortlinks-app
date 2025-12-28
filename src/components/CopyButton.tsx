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
            class="text-white copy-button"
            data-copied={copied() ? "true" : "false"}
        >
            <span class="copy-text">
                Copy
            </span>
            <span class="check-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                </svg>
            </span>
        </button>
    );
}
