# AGENTS.md - Development Guidelines for shortlinks-app

## Project Description

shortlinks-app is a web-based URL shortener service built with TanStack Start and Solid.js. Features include URL shortening, link management, analytics (clicks, referrers, countries, time series), and user authentication via Better Auth.

## Build, Lint, and Test Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Vite dev server (port 3000) |
| `bun run build` | Create production build |
| `bun run preview` | Serve production build locally |
| `bun run lint` | Run TypeScript check + ESLint auto-fix |
| `bun run lint:check` | Only check lint issues without fixing |
| `bun run deploy` | Deploy to Cloudflare Workers |
| `bun run cf-typegen` | Regenerate worker types |
| `bun run release` | Manage versioning and changelog |

## Code Style Guidelines

### Imports
- Use absolute imports via `~/*` aliases
- Sort with ESLint (`simple-import-sort`)
- Order: third-party → components → utils → types

### Formatting
- **Indentation:** 4 spaces
- **Quotes:** Double quotes
- **Semicolons:** Required
- **Braces:** Always use braces
- **Line length:** Max 80 characters
- **Function parens:** Space before anonymous functions, none before named functions

### TypeScript
- Explicit type annotations for function params/returns
- Avoid `any` or `// @ts-ignore`
- Use inline type imports (e.g., `import type { TLink } from "~types/links"`)

### Naming Conventions
- **Components:** PascalCase (e.g., `LinksTable.tsx`)
- **Functions:** camelCase (e.g., `fetchUserLinks`)
- **Variables:** camelCase (e.g., `shortId`)
- **Constants:** UPPER_SNAKE_CASE
- **Types:** PascalCase with `T` prefix (e.g., `TLink`)
- **Directories:** snake_case

### Error Handling
- Use try/catch for async operations
- Parse and display user-friendly error messages
- Log errors to console in development

### Solid.js Specifics
- Use `createSignal`, `createStore`, `createContext` for state
- Avoid direct DOM manipulation
- Use `createEffect` for side effects on signals
- Type event handlers explicitly

## Architecture Patterns

### Folder Structure
```
src/
  routes/          # TanStack Start routes
  components/      # Reusable UI components
  libs/            # Business logic
    auth/          # Better Auth configuration
    analytics/     # Analytics data fetching
    shortlinks/    # Link management
    captcha/       # Turnstile validation
  stores/          # Client-side state
  types/           # TypeScript definitions
```

### API Pattern
Server functions in `*.server.ts` files, client wrappers in `*.functions.ts`:
```typescript
// libs/analytics/summaryByShortId.server.ts
export async function getSummaryByShortId({ data }: { data: { shortId: string } }) {
    // DB query with D1/Kysely
}

// libs/analytics/summaryByShortId.functions.ts
export async function getSummaryByShortId({ data }: { data: { shortId: string } }) {
    const res = await fetch("/api/analytics/summary", { body: JSON.stringify(data), method: "POST" });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}
```

### TanStack Query Usage
Use `queryOptions` for consistent query configuration:
```typescript
export const queryConfig = (shortId: string) => queryOptions({
    queryKey: ["analytics", "summary", shortId],
    queryFn: async () => { /* ... */ },
});
```

### Better Auth Integration
- Auth config in `src/libs/auth/auth.ts`
- Client helpers in `src/libs/auth/auth-client.ts`
- Use `signIn`, `signOut`, `useSession` from auth client
- Server-side: access session via `auth.api.getSession`

### Analytics Features
- Summary (total clicks, unique visitors, time series)
- Referrers (by link and aggregated)
- Countries (geolocation data)
- Time-series clicks data
- Use `d3` for charting, `date-fns` for date formatting

### D1 Database
- Use Kysely for type-safe queries
- Dialect configured in `src/libs/db/client.ts`
- Helper in `src/libs/auth/d1helper.ts` for Better Auth

### Common Development Tasks

#### Creating a new API endpoint
1. Create server function in `src/libs/*/[name].server.ts`
2. Create client wrapper in `src/libs/*/[name].functions.ts`
3. Add route handler in appropriate route file

## Linting & ESLint

Extended from `@tanstack/eslint-config` with `@stylistic/eslint-plugin`:
- Import sorting with `simple-import-sort`
- 4-space indentation
- Consistent type imports
- Space before anonymous function parens

## Testing

No test framework configured.

## Environment Variables

- Browser: `VITE_*` prefix
- Server: `process.env.*` (Cloudflare secrets)
- Auth: `GOOGLE_OAUTH_*`, `MICROSOFT_*`, `GITHUB_*`, `VITE_BETTER_AUTH_BASE_URL`

## Git Workflow

- Conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`
- Feature branches, PRs with review
- CI: lint workflow in `.github/workflows/lint.yml`

## Troubleshooting

1. **Module errors:** Run `bun install`, clear Vite cache
2. **Type errors:** Check `tsconfig.json` paths, run `cf-typegen`
3. **Auth issues:** Verify Cloudflare secrets and `VITE_BETTER_AUTH_BASE_URL`
