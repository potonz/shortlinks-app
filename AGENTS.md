// Solid.js with Tailwind CSS .cursorrules

// Prefer functional components

const preferFunctionalComponents = true;

// Solid.js and Tailwind CSS best practices

const solidjsTailwindBestPractices = [
"Use createSignal() for reactive state",
"Implement Tailwind CSS classes for styling",
"Utilize TypeScript's strict mode",
"Utilize @apply directive in CSS files for reusable styles",
"Implement responsive design using Tailwind's responsive classes",
"Use Tailwind's CSS in /src/styles.css for global styles",
"Implement dark mode using Tailwind's dark variant",
];

// Additional instructions

const additionalInstructions = `

1. Use .tsx extension for files with JSX
2. Implement strict TypeScript checks
3. Implement proper Tailwind CSS purging for production builds
4. Utilize TanStack Router for routing when applicable
5. Use type-safe context with createContext
6. Implement proper typing for event handlers
7. Follow TypeScript best practices and naming conventions
8. Use type assertions sparingly and only when necessary
9. Use Tailwind's @layer directive for custom styles
10. Implement utility-first CSS approach
11. Follow both Solid.js and Tailwind naming conventions
12. Use JIT (Just-In-Time) mode for faster development
13. Use Solid.js createSignal for reactive state management
14. Use TanStack Router for client-side routing with proper type safety
15. Implement proper error boundaries and loading states
16. Use Solid.js components with proper props typing
17. Follow the project's existing code structure and patterns
18. Use Zod for form validation where applicable
19. Implement proper form handling with Solid.js
20. Use client-side rendering with Suspense for better UX
    `;

// Project structure overview

const projectStructure = {
  "src/": {
    "components/": {
      "common/": "Reusable UI components",
      "CopyButton.tsx": "Button to copy text to clipboard",
      "LinksHistory.tsx": "Component to display link history"
    },
    "routes/": {
      "$shortId.tsx": "Route for individual short links",
      "__root.tsx": "Root layout component",
      "index.tsx": "Main landing page route"
    },
    "stores/": "State management files",
    "styles/": {
      "styles.css": "Main Tailwind CSS configuration",
      "glow-bg.css": "Glow background styles",
      "stars-bg.css": "Starry background styles",
      "tw-animate-css.css": "Tailwind animation utilities"
    },
    "libs/": "Utility functions and API clients",
    "types/": "Type definitions",
    "router.tsx": "Router configuration",
    "routeTree.gen.ts": "Generated route tree for TanStack Router"
  },
  "public/": "Static assets",
  "package.json": "Project dependencies and scripts",
  "vite.config.ts": "Vite configuration",
  "tsconfig.json": "TypeScript configuration"
};

// Key technologies used

const technologies = {
  "Solid.js": "Reactive frontend framework",
  "Tailwind CSS": "Utility-first CSS framework",
  "TanStack Router": "Type-safe routing solution",
  "TypeScript": "Type-safe JavaScript",
  "Zod": "Schema validation library",
  "Vite": "Build tool and development server"
};

// Code patterns and conventions

const codePatterns = {
  "State Management": "Use createSignal() for local component state",
  "Routing": "Use TanStack Router with proper type safety",
  "Forms": "Implement proper form handling with Solid.js",
  "Validation": "Use Zod for form validation",
  "Styling": "Use Tailwind CSS utility classes",
  "Components": "Functional components with proper props typing",
  "Error Handling": "Implement proper error boundaries and loading states",
  "API Calls": "Use libs/ directory for API clients",
  "Store Management": "Use stores/ directory for global state",
  "Testing": "Follow existing test patterns in the project"
};

// Environment variables

const environmentVariables = [
  "VITE_SHORT_LINK_BASE_URL",
  "VITE_CF_TURNSTILE_SITE_KEY"
];

// Build and deployment

const buildProcess = {
  "Development": "npm run dev",
  "Build": "npm run build",
  "Preview": "npm run preview",
  "Deploy": "npm run deploy",
  "Lint": "npm run lint"
};