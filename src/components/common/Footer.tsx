import { Link } from "@tanstack/solid-router";

export function Footer() {
    return (
        <footer class="text-zinc-500 text-sm w-full flex justify-center">
            <div class="flex justify-between items-center w-full max-w-xl">
                <div>
                    &copy;
                    {" 2025 Thomas Nguyen. "}
                    <a href="/LICENSE">MIT license</a>
                    .
                </div>
                <div class="text-right">
                    <Link to="/privacy-policy">Privacy policy</Link>
                    <br />
                    <Link to="/terms-of-service">Terms of service</Link>
                </div>
            </div>
        </footer>
    );
}
