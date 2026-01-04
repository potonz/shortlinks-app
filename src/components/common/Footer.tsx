import { Link } from "@tanstack/solid-router";

export function Footer() {
    return (
        <footer class="text-zinc-500 text-sm w-full flex justify-center">
            <div class="flex justify-between w-full max-w-4xl">
                <div>
                    &copy;
                    {" 2025 Thomas Nguyen. "}
                    <a href="/LICENSE">MIT license</a>
                    .
                </div>
                <div>
                    <Link to="/privacy-policy">Privacy policy</Link>
                </div>
            </div>
        </footer>
    );
}
