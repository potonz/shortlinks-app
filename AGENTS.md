# AGENTS.md - Development Guidelines for shortlinks-app

## Project Description

shortlinks-app is a web-based URL shortener service built with TanStack Start and Solid.js. The application allows users to shorten long URLs and provides a simple, clean interface for managing and tracking links.

## Build, Lint, and Test Commands

### Running the Development Server
- **Command:** `bun run dev`
- **Description:** Starts the Vite development server with hot module replacement
- **Default Port:** 3000

### Building for Production
- **Command:** `bun run build`
- **Description:** Creates an optimized production build

### Preview Production Build
- **Command:** `bun run preview`
- **Description:** Serves the production build locally for testing

### Linting
- **Command:** `bun run lint`
- **Description:** Runs ESLint to check for code quality issues
- **Auto-fix:** `bun run lint:fix` - Automatically fixes fixable issues

### Cloudflare Deployment
- **Command:** `bun run deploy`
- **Description:** Deploys the application to Cloudflare using Wrangler
- **Generate Types:** `bun run cf-typegen` - Regenerates Cloudflare worker types

### Release Management
- **Command:** `bun run release`
- **Description:** Executes the release script to manage versioning and changelog

## Code Style Guidelines

### Imports
- Use absolute imports via TypeScript path aliases configured in `tsconfig.json`
- Sort imports automatically with ESLint (`simple-import-sort`)
- Group imports in this order:
  1. Third-party libraries
  2. Internal components
  3. Internal utilities
  4. Internal types

### Formatting
- **Indentation:** 4 spaces (no tabs)
- **Quotes:** Double quotes for strings
- **Semicolons:** Required at end of statements
- **Braces:** Always use braces for blocks (no inline statements)
- **Line length:** Max 80 characters (soft limit)

### TypeScript
- Type annotations are strongly preferred for function parameters and return types
- Use inline type imports when possible:
  ```typescript
  import { createSignal } from "solid-js";
  import { z } from "zod";
  ```
- Avoid using `any` or `// @ts-ignore`

### Naming Conventions
- **Components:** PascalCase (e.g., `LinksHistory.tsx`)
- **Functions:** camelCase (e.g., `createShortLink`)
- **Variables:** camelCase (e.g., `captchaToken`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `BASE_URL`)
- **Type names:** PascalCase prefixed with `T` (e.g., `TUser`)
- **Files:** snake_case for directories, PascalCase for component files

### Solid.js Specifics
- Use `createEffect` for side effects that depend on signals
- Avoid direct DOM manipulation; use Solid's reactivity system
- For event handlers, type the event explicitly when needed:
  ```typescript
  function handleClick(event: MouseEvent) { ... }
  ```

### Error Handling
- Use try/catch for asynchronous operations
- Validate errors and provide user-friendly messages
- Log errors to console for debugging (in development only)
- Example from `src/routes/index.tsx`:
  ```typescript
  .catch((err) => {
      if (err instanceof Error) {
          const zodErrors = JSON.parse(err.message);
          if (Array.isArray(zodErrors)) {
              zodErrors.forEach(err => addNotification(err.message, "error", 5000));
          }
      } else {
          throw err;
      }
  })
  ```

### Tailwind CSS
- Use Tailwind utility classes for styling
- Group similar utility classes together
- Follow the utility-first approach
- Example from `src/routes/index.tsx`:
  ```tsx
  <input
      class="w-full px-6 py-4 bg-zinc-950 text-center text-white placeholder-zinc-500 border border-zinc-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all animation-duration-300 placeholder-shown:text-ellipsis"
      ...
  />
  ```

## Architecture Patterns

### Folder Structure
- `/src/routes` - TanStack Start route definitions
- `/src/components` - Reusable UI components
- `/src/libs` - Business logic and utility functions
- `/src/stores` - State management with Solid's context/store system
- `/src/types` - TypeScript type definitions

### Component Design
- Keep components focused and single-purpose
- Use compound components for related functionality
- Pass functions as props rather than exposing implementation details

### State Management
- Use Solid's built-in `createSignal`, `createStore`, `createContext`
- Lift state up to the nearest common ancestor
- Avoid global state when component-level state suffices
- Example from `src/stores/linkHistoryStore.ts`:
  ```typescript
  const [linkHistory, setLinkHistory] = createStore<Record<string, string>>({});
  ```

### API Calls
- Use `fetch` with proper error handling
- Validate responses with Zod schemas
- Example from `src/libs/shortlinks/createShortLink.ts`:
  ```typescript
  const response = await fetch(`/api/shortlinks`, { method: "POST", body: JSON.stringify(data) });
  if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
  }
  ```

## Linting and ESLint Configuration

### ESLint Rules
- Extended from `@tanstack/eslint-config` for TanStack-specific rules
- Uses `@stylistic/eslint-plugin` for formatting rules
- TypeScript support via `typescript-eslint`

### Key Rules Enforced
1. **Import Sorting:** `simple-import-sort/imports` and `simple-import-sort/exports`
2. **Consistent Type Imports:** `@typescript-eslint/consistent-type-imports`
3. **No Unused Variables:** `@typescript-eslint/no-unused-vars` (warn level)
4. **Indentation:** 4 spaces with special handling for ternary and switch-case
5. **Space Before Function Paren:** 
   - Always for anonymous functions
   - Never for named functions
   - Always for async arrows

### Ignored Files
- `dist/` - Build output
- `.tanstack/` - TanStack configuration
- `.wrangler/` - Wrangler configuration
- `**/worker-configuration.d.ts` - Auto-generated types

## Testing Approach

### No Test Framework Currently Configured
Currently, the project doesn't have a dedicated testing framework. However, you can:
- Test interactively with the development server
- Verify functionality using browser DevTools
- Check API endpoints with `curl` or Postman

## Development Workflow

### Git Commit Messages
- Follow conventional commits format:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `style:` for formatting changes
  - `refactor:` for code refactoring
  - `chore:` for maintenance tasks

### Branching Strategy
- Use feature branches for new functionality
- Keep `main` branch stable and deployable
- Merge through pull requests with code review

## Environment Variables

- Use `VITE_*` prefix for variables needed in the browser
- Keep sensitive information in `.env` file (gitignored)
- Example variables:
  - `VITE_SHORT_LINK_BASE_URL` - Base URL for generated short links
  - `VITE_CF_TURNSTILE_SITE_KEY` - Cloudflare Turnstile site key

## Cloudflare Integration

### Worker Configuration
- Application is deployed as a Cloudflare worker
- Configuration in `wrangler.toml`
- Environment variables managed through Cloudflare

### D1 Database
- Uses Kysely with D1 for database operations
- ORM setup in `src/libs/db/client.ts`

## Testing

There is no need to test anything. Do not write tests.

## Continuous Integration

### GitHub Actions
- Linting workflow: `.github/workflows/lint.yml`
- Deployment workflow: `.github/workflows/deploy.yml`

## Migration Guidelines

### Upgrading Dependencies
- Check breaking changes before upgrading
- Test thoroughly after upgrades
- Update documentation for new features

### Refactoring
- Make incremental changes
- Ensure backward compatibility
- Update tests for modified behavior

## Troubleshooting

### Common Issues
1. **Module not found errors:**
   - Run `bun install`
   - Check `node_modules/.vite` for Vite cache issues

2. **Type errors:**
   - Ensure `tsconfig.json` paths are correct
   - Regenerate types with `bun run cf-typegen`
