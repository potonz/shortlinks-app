# AGENTS.md - Development Guidelines for shortlinks-app

## Project Description

shortlinks-app is a web-based URL shortener service built with TanStack Start and Solid.js. Features include URL shortening, link management, analytics (clicks, referrers, countries, time series), and user authentication via Better Auth.

## Build, Lint, and Test Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Vite dev server (port 3000) |
| `bun run build` | Create production build |
| `bun run preview` | Serve production build locally |
| `bun run lint` | Run TypeScript check + ESLint check and auto-fix (recommended) |
| `bun run lint:check` | Only check lint issues without fixing |
| `bun run deploy` | Deploy to Cloudflare Workers |
| `bun run cf-typegen` | Regenerate worker types |
| `bun run release` | Manage versioning and changelog |

## Code Style Guidelines

### Imports
- Use absolute imports via `~/*` aliases
- Sorting enforced by ESLint (`simple-import-sort`): side-effect imports (CSS) → external packages → absolute imports → relative imports
- Within each group, imports are sorted alphabetically
- Use inline type imports (e.g., `import type { ILink } from "~types/links"`)

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
- Prefer `interface` over type aliases for object types

### Naming Conventions
- **Components:** PascalCase (e.g., `LinksTable.tsx`)
- **Functions:** camelCase (e.g., `fetchUserLinks`)
- **Variables:** camelCase (e.g., `shortId`)
- **Constants:** UPPER_SNAKE_CASE
- **Types/Interfaces:** PascalCase with `I` prefix (e.g., `ILink`)
- **Directories:** lowercase (e.g., `routes/`, `components/`)

### Error Handling
- Use try/catch for async operations
- Parse and display user-friendly error messages
- Log errors to console in development

### Solid.js Specifics
- Use `createSignal`, `createStore`, `createContext` for state
- Avoid direct DOM manipulation
- Use `createEffect` for side effects on signals
- Use `createResource` for async data fetching
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
  stores/          # Client-side state
  types/           # TypeScript definitions
```

### API Pattern
Three-layer architecture: server function → client wrapper → route handler:

1. **Server function** (`*.server.ts`): Direct DB access, returns plain objects
2. **Client wrapper** (`*.functions.ts`): `createServerFn` with validation, calls server function, handles auth
3. **Route handler** (`*.tsx`): UI component that invokes the client wrapper

Example:

```typescript
// libs/shortlinks/fetchUserLinks.server.ts
export async function fetchUserLinksQuery(input, userId) { /* DB logic */ }

// libs/shortlinks/fetchUserLinks.functions.ts
export const fetchUserLinks = createServerFn({ method: "GET" })
    .inputValidator(paginationSchema)
    .handler(async ({ data }) => { /* auth, call server fn */ });

// routes/dashboard/links/index.tsx
const result = await fetchUserLinks({ data: { page: 1, limit: 10 } });
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
- Use prepared statements for queries (env.DB.prepare)
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
- Consistent type imports (error on `import type` violations)
- Space before anonymous function parens

## Testing

No test framework configured. For integration checks, use manual scripts in `src/libs/**/test*.ts`.

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
