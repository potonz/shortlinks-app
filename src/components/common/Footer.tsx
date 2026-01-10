import { Link } from "@tanstack/solid-router";

export function Footer() {
    return (
        <footer class="text-zinc-500 text-sm w-full flex justify-center">
            <div class="flex justify-between items-center w-full max-w-xl">
                <div>
                    &copy;
                    {" 2025 Thomas Nguyen. "}
                    <a href="/LICENSE" class="whitespace-nowrap">MIT license</a>
                    .
                </div>
                <div class="text-right">
                    <Link to="/terms-of-service" class="whitespace-nowrap">Terms of service</Link>
                    <br />
                    <Link to="/privacy-policy" class="whitespace-nowrap">Privacy policy</Link>
                </div>
            </div>
        </footer>
    );
}
