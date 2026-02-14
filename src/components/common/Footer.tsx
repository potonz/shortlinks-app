import { Link } from "@tanstack/solid-router";

export function Footer() {
    return (
        <footer class="text-zinc-500 text-sm w-full flex justify-center">
            <div class="flex flex-wrap justify-between items-center gap-2 w-full max-w-4xl">
                <div>
                    &copy;
                    {" " + new Date().getFullYear() + " Thomas Nguyen. "}
                    <a href="/LICENSE" class="whitespace-nowrap">MIT license</a>
                    .
                </div>
                <div class="flex gap-4">
                    <Link to="/terms-of-service" class="whitespace-nowrap">Terms of service</Link>
                    <Link to="/privacy-policy" class="whitespace-nowrap">Privacy policy</Link>
                </div>
            </div>
        </footer>
    );
}
