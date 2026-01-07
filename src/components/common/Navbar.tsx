import { Link } from "@tanstack/solid-router";

export function Navbar() {
    return (
        <div class="flex justify-center px-4">
            <nav class="w-full max-w-xl my-4 bg-black/50 backdrop-blur-md rounded-md flex items-center justify-between">
                {/* Logo */}
                <Link to="/" class="text-4xl font-bold text-white">Poto</Link>

                {/* GitHub link */}
                <a
                    href="https://github.com/potonz"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-white hover:text-gray-300"
                >
                    <i class="bi bi-github text-2xl"></i>
                </a>
            </nav>
        </div>
    );
}
