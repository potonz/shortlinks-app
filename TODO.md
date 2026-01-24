# Dashboard Implementation Plan

## Overview
Build a professional dashboard with analytics, link management, and navigation capabilities.

## Features to Implement

### 1. Homepage Analytics (`/dashboard/`)

#### 1.1 Overview Cards
- Total links created
- Total clicks received
- Total unique visitors
- Last 7 days clicks trend

#### 1.2 Analytics Visualizations
- **Clicks by Time** - Line chart showing clicks over time (last 30 days)
- **Top Referrers** - Bar chart showing top 10 referrers

#### 1.3 Data Requirements
From `migrations/0002_add_request_table.sql`:
- `sl_link_request` table with click data
- Fields needed: `timestamp`, `referer`, `ip_address`

### 2. Navigation Sidebar

#### 2.1 Sidebar Component Structure
- Fixed left sidebar with navigation
- Logo/branding at top
- Navigation menu items:
  - Dashboard (current page)
  - Links (new page)
  - Settings (placeholder for future)
- Responsive design for mobile

#### 2.2 Navigation Routes
- `/dashboard/` - Dashboard homepage
- `/dashboard/links` - Links management page
- `/dashboard/links/$shortId` - Link detail page

### 3. Links Management Page (`/dashboard/links`)

#### 3.1 Links Table
Columns:
- Short link (clickable)
- Target URL (truncated)
- Total clicks
- Created date
- Actions (view, delete)

#### 3.2 Bulk Operations
- Checkbox column for selecting multiple links
- Bulk delete functionality
- "Select all" / "Deselect all" options
- Action bar with selected count and delete button

#### 3.3 Create New Link
- Form with URL input
- Captcha validation (reuse existing Turnstile)
- Success/error notifications
- Auto-add to table after creation

#### 3.4 Delete Operations
- Individual delete button per row
- Bulk delete for selected links
- Confirmation modal for bulk delete
- Toast notification after deletion

### 4. Link Detail Page (`/dashboard/links/$shortId`)

#### 4.1 Link Overview
- Short link display
- Target URL
- Total clicks
- Created date
- Last accessed date

#### 4.2 Detailed Analytics from `sl_link_request` table
- **Clicks by Country** - Bar chart
- **Clicks by Time** - Line chart (last 30 days)
- **Top Referrers** - Bar chart
- **User Agents** - List or breakdown
- **Geographic Data** - Latitude/longitude (map placeholder)
- **ASN Information** - Organization breakdown

#### 4.3 Request Data Table
- Paginated table showing individual requests
- Filters: Date range, country, referrer
- Sortable columns
- Export functionality (CSV/JSON)

## Implementation Steps

### Phase 1: Infrastructure Setup
- [x] Create TypeScript types for analytics data (`src/types/analytics.ts`)
  - [x] Define `TAnalyticsSummary` interface
  - [x] Define `TClicksByTimeData` interface
  - [x] Define `TReferrerData` interface
  - [x] Define `TCountryData` interface
  - [x] Define `TLink` interface
  - [x] Define `TLinkRequest` interface
- [x] Create database query utilities (`src/libs/analytics/*.ts`)
  - [x] Implement `buildSummaryQuery()` function
  - [x] Implement `buildClicksByTimeQuery()` function
  - [x] Implement `buildReferrersQuery()` function
  - [x] Implement `buildCountriesQuery()` function
  - [x] Implement `buildLinkRequestsQuery()` function
- [x] Create server functions for analytics data
  - [x] Create `src/routes/serverFns/analytics/summary.ts`
  - [x] Create `src/routes/serverFns/analytics/clicks-by-time.ts`
  - [x] Create `src/routes/serverFns/analytics/referrers.ts`
  - [x] Create `src/routes/serverFns/analytics/countries.ts`
  - [x] Create `src/routes/serverFns/analytics/requests.ts`

### Phase 2: Dashboard Homepage
- [x] Create analytics cards component (`src/components/dashboard/AnalyticsCards.tsx`)
  - [x] Create total links card
  - [x] Create total clicks card
  - [x] Create unique visitors card
  - [x] Create last 7 days clicks card
- [ ] Implement click-by-time chart
  - [ ] Create `src/components/dashboard/ClicksByTimeChart.tsx`
  - [ ] Integrate charting library
  - [ ] Add loading state
  - [ ] Add error state
- [ ] Implement top-referrers chart
  - [ ] Create `src/components/dashboard/TopReferrersChart.tsx`
  - [ ] Integrate charting library
  - [ ] Add loading state
  - [ ] Add error state
- [ ] Add loading and error states
  - [ ] Create loading component for charts
  - [ ] Create error message component
  - [ ] Handle network errors gracefully
- [ ] Integrate with existing auth middleware
  - [ ] Verify dashboard route uses existing auth middleware
  - [ ] Test protected route access

### Phase 3: Navigation & Layout
- [ ] Create sidebar component (`src/components/dashboard/Sidebar.tsx`)
  - [ ] Create logo component
  - [ ] Create navigation menu items
  - [ ] Add active state styling
  - [ ] Add mobile responsive toggle
- [ ] Create dashboard layout wrapper (`src/components/dashboard/Layout.tsx`)
  - [ ] Add sidebar integration
  - [ ] Add main content area
  - [ ] Add header with user info
  - [ ] Implement mobile responsive layout
- [ ] Implement route-based navigation
  - [ ] Create `src/routes/dashboard/index.tsx` layout
  - [ ] Add route guards for protected pages
  - [ ] Handle route transitions
- [ ] Add responsive design
  - [ ] Create mobile menu trigger
  - [ ] Implement sidebar collapse logic
  - [ ] Optimize for mobile screens
  - [ ] Test touch interactions

### Phase 4: Links Management
- [ ] Create links table component (`src/components/dashboard/LinksTable.tsx`)
  - [ ] Create table with short link column
  - [ ] Create target URL column with truncation
  - [ ] Create total clicks column
  - [ ] Create created date column
  - [ ] Create actions column with view and delete buttons
- [ ] Implement create link form (`src/components/dashboard/CreateLinkForm.tsx`)
  - [ ] Create URL input field
  - [ ] Add Turnstile captcha integration
  - [ ] Add form validation
  - [ ] Add error message display
  - [ ] Add success notification
- [ ] Implement delete operations
  - [ ] Create individual delete button handler
  - [ ] Add confirmation modal for delete
  - [ ] Implement API call to delete link
  - [ ] Add toast notification on success
- [ ] Add bulk delete functionality
  - [ ] Add checkbox column for selection
  - [ ] Implement select all functionality
  - [ ] Implement deselect all functionality
  - [ ] Create bulk delete action bar
  - [ ] Add confirmation modal for bulk delete
  - [ ] Handle batch delete API call
- [ ] Integrate with existing short links manager
  - [ ] Use existing `createShortLink` API
  - [ ] Use existing `getShortLinksManager`
  - [ ] Sync with existing link history store

### Phase 5: Link Detail Page
- [ ] Create link detail layout (`src/routes/dashboard/links/$shortId.tsx`)
  - [ ] Create route with dynamic `shortId` parameter
  - [ ] Add back navigation button
  - [ ] Implement loading state
  - [ ] Add error handling for missing links
- [ ] Implement summary cards (`src/components/dashboard/LinkDetail/SummaryCards.tsx`)
  - [ ] Create short link display card
  - [ ] Create target URL card
  - [ ] Create total clicks card
  - [ ] Create created date card
  - [ ] Create last accessed date card
- [ ] Create analytics charts
  - [ ] Create clicks by country chart (`src/components/dashboard/LinkDetail/CountryChart.tsx`)
  - [ ] Create clicks by time chart (`src/components/dashboard/LinkDetail/TimeChart.tsx`)
  - [ ] Create top referrers chart (`src/components/dashboard/LinkDetail/ReferrerChart.tsx`)
  - [ ] Add loading states for charts
  - [ ] Add error states for charts
- [ ] Implement request data table (`src/components/dashboard/LinkDetail/RequestsTable.tsx`)
  - [ ] Create paginated table
  - [ ] Add sortable columns (date, country, referrer, etc.)
  - [ ] Add filters (date range, country, referrer)
  - [ ] Implement pagination controls
  - [ ] Add export to CSV functionality
  - [ ] Add export to JSON functionality
- [ ] Add filters and sorting
  - [ ] Create filter dropdowns
  - [ ] Implement filter state management
  - [ ] Add sort indicator icons
  - [ ] Handle sort transitions

### Phase 6: API Development
- [ ] Create analytics aggregation endpoints
  - [ ] Create `src/routes/api/analytics/summary.ts`
    - [ ] Implement get total links query
    - [ ] Implement get total clicks query
    - [ ] Implement get unique visitors query
    - [ ] Implement last 7 days clicks query
  - [ ] Create `src/routes/api/analytics/clicks-by-time.ts`
    - [ ] Implement time-based aggregation query
    - [ ] Add date range filtering
    - [ ] Return formatted time series data
  - [ ] Create `src/routes/api/analytics/referrers.ts`
    - [ ] Implement referrer aggregation query
    - [ ] Add top N limit
    - [ ] Return sorted referrer data
  - [ ] Create `src/routes/api/analytics/countries.ts`
    - [ ] Implement country aggregation query
    - [ ] Add top N limit
    - [ ] Return sorted country data
  - [ ] Create `src/routes/api/analytics/requests.ts`
    - [ ] Implement request data query
    - [ ] Add pagination support
    - [ ] Add filters (date range, country, referrer)
    - [ ] Add sorting support
- [ ] Create links CRUD endpoints
  - [ ] Create `src/routes/api/links/list.ts`
    - [ ] Implement get all links query
    - [ ] Add pagination support
    - [ ] Add filtering by date
  - [ ] Create `src/routes/api/links/create.ts`
    - [ ] Implement create link API
    - [ ] Use existing `createShortLink` function
    - [ ] Add error handling
  - [ ] Create `src/routes/api/links/delete.ts`
    - [ ] Implement delete link API
    - [ ] Add bulk delete support
    - [ ] Add error handling
- [ ] Create request data endpoints
  - [ ] Create `src/routes/api/links/$shortId/requests.ts`
    - [ ] Implement get link specific requests
    - [ ] Add pagination support
    - [ ] Add filtering and sorting
    - [ ] Return formatted request data
- [ ] Optimize queries for performance
  - [ ] Add database indexes for analytics queries
  - [ ] Implement query result caching
  - [ ] Add query execution time logging
  - [ ] Test with large datasets

## Technical Decisions

### Charts & Visualizations
- Use Recharts (React-based) or Victory (Solid-compatible)
- Consider using a charting library that works with Solid.js
- Alternative: Build simple SVG charts manually

### State Management
- Use Solid's `createStore` for local component state
- Use TanStack Query (React Query) for server state if available
- Consider creating a custom hook for analytics data fetching

### Database Queries
- Aggregate data in SQL where possible
- Use indexes from migrations for performance
- Implement pagination for large datasets

### Error Handling
- Use existing notification system
- Add loading states for async operations
- Handle API errors gracefully

## Dependencies to Add

### Charting Library
- [ ] Choose charting library (Victory recommended for Solid.js compatibility)
  - [ ] Add Victory to package.json
  - [ ] Install dependencies: `bun add victory`
- [ ] Configure chart library for Solid.js
  - [ ] Set up chart components
  - [ ] Create reusable chart wrappers
  - [ ] Add theme configuration
- [ ] Alternative: Build simple SVG charts manually if chart library is not compatible
  - [ ] Create SVG line chart component
  - [ ] Create SVG bar chart component
  - [ ] Add basic animations

### UI Components
- [ ] Add modal/dialog component library
  - [ ] Consider using Dialog from Radix UI or similar
  - [ ] Create reusable Modal component
  - [ ] Create ConfirmationDialog component
- [ ] Add pagination component
  - [ ] Create Pagination component
  - [ ] Test with various page sizes
- [ ] Add toast notification component
  - [ ] Use existing notification system
  - [ ] Create toast component wrapper
  - [ ] Add toast position styles

## Files to Create

### Types
- `src/types/dashboard.ts` - Dashboard types
- `src/types/analytics.ts` - Analytics data structures

### Stores
- `src/stores/analyticsStore.ts` - Analytics state
- `src/stores/linksStore.ts` - Links management state

### API Endpoints
- `src/routes/api/analytics/summary.ts` - Homepage summary
- `src/routes/api/analytics/clicks-by-time.ts` - Time-based analytics
- `src/routes/api/analytics/referrers.ts` - Referrer analytics
- `src/routes/api/analytics/countries.ts` - Country analytics
- `src/routes/api/analytics/requests.ts` - Request data
- `src/routes/api/links/list.ts` - Links list
- `src/routes/api/links/create.ts` - Create link
- `src/routes/api/links/delete.ts` - Delete link
- `src/routes/api/links/$shortId/requests.ts` - Link specific requests

### Components
- `src/components/dashboard/Sidebar.tsx`
- `src/components/dashboard/Layout.tsx`
- `src/components/dashboard/AnalyticsCards.tsx`
- `src/components/dashboard/ClicksByTimeChart.tsx`
- `src/components/dashboard/TopReferrersChart.tsx`
- `src/components/dashboard/LinksTable.tsx`
- `src/components/dashboard/CreateLinkForm.tsx`
- `src/components/dashboard/LinkDetail.tsx`
- `src/components/dashboard/LinkRequestsTable.tsx`

### Pages
- `src/routes/dashboard/links.tsx`
- `src/routes/dashboard/links/$shortId.tsx`

### Utilities
- `src/libs/analytics/queryBuilder.ts` - SQL query builder for analytics
- `src/libs/analytics/aggregators.ts` - Data aggregation logic

## Migration Notes

No new database migrations needed as `sl_link_request` table already exists.

## Testing Strategy

### Manual Testing
- [ ] Verify all charts render correctly
  - [ ] Test line chart displays properly
  - [ ] Test bar chart displays properly
  - [ ] Verify chart labels and legends
  - [ ] Test responsive chart resizing
- [ ] Test bulk delete functionality
  - [ ] Test single link deletion
  - [ ] Test multiple link selection
  - [ ] Test bulk delete with confirmation
  - [ ] Verify table updates after deletion
- [ ] Verify analytics accuracy
  - [ ] Compare chart data with raw database queries
  - [ ] Test date range filtering accuracy
  - [ ] Verify click counts match request counts
- [ ] Test responsive design
  - [ ] Test mobile menu toggle
  - [ ] Test sidebar collapse/expand
  - [ ] Verify table horizontal scroll on mobile
  - [ ] Test touch interactions

### Performance Testing
- [ ] Check query performance with large datasets
  - [ ] Test with 1000+ requests
  - [ ] Test with 100+ links
  - [ ] Measure query execution time
  - [ ] Optimize slow queries if needed
- [ ] Test pagination with many links
  - [ ] Test page navigation
  - [ ] Test page size changes
  - [ ] Verify data integrity across pages
- [ ] Verify loading states
  - [ ] Test loading indicators for API calls
  - [ ] Test skeleton loading for charts
  - [ ] Test error states for failed requests

## Design Considerations

### Color Scheme
- Use existing zinc color palette from Tailwind
- Dark mode compatibility
- High contrast for accessibility

### User Experience
- Clear visual hierarchy
- Quick access to common actions
- Intuitive navigation
- Clear feedback for actions

### Mobile Responsiveness
- Collapsible sidebar on mobile
- Swipe-friendly table interactions
- Optimized chart rendering
- Touch-friendly buttons

## Dependencies Already Available

- Solid.js (already used)
- TanStack Router (already used)
- Tailwind CSS (already used)
- Turnstile captcha (already used)
- Existing auth system (already used)

## Potential Challenges

1. **Chart Library Selection**: Need a charting library compatible with Solid.js
2. **Large Dataset Performance**: Analytics queries may need optimization
3. **Real-time Updates**: Consider polling vs. websockets for real-time updates
4. **Export Functionality**: Implementing CSV/JSON export for request data

## Timeline Estimate

- Phase 1: 1-2 days
- Phase 2: 1-2 days
- Phase 3: 1 day
- Phase 4: 2-3 days
- Phase 5: 2-3 days
- Phase 6: 2-3 days

Total: 9-14 days depending on complexity

## Final Implementation Checklist

### Pre-Implementation
- [ ] Review all dependencies to add
- [ ] Verify existing code structure
- [ ] Check database schema compatibility
- [ ] Confirm chart library choice

### Phase 1 Complete
- [ ] All TypeScript types created
- [ ] All query builders implemented
- [ ] All API endpoints created and tested
- [ ] All stores created and integrated

### Phase 2 Complete
- [ ] All homepage components created
- [ ] All charts implemented and styled
- [ ] Loading and error states added
- [ ] Dashboard homepage functional

### Phase 3 Complete
- [ ] All navigation components created
- [ ] Layout wrapper implemented
- [ ] All routes configured
- [ ] Responsive design working

### Phase 4 Complete
- [ ] All links table features working
- [ ] Create link form functional
- [ ] Delete operations working
- [ ] Bulk delete working
- [ ] Links management page functional

### Phase 5 Complete
- [ ] Link detail page layout complete
- [ ] All summary cards implemented
- [ ] All analytics charts working
- [ ] Request data table functional
- [ ] Filters and sorting working

### Phase 6 Complete
- [ ] All API endpoints tested
- [ ] Query performance optimized
- [ ] Error handling improved
- [ ] Documentation updated

### Post-Implementation
- [ ] Run lint and typecheck commands
- [ ] Test all user flows end-to-end
- [ ] Verify analytics accuracy
- [ ] Check mobile responsiveness
- [ ] Test export functionality
- [ ] Verify bulk operations
- [ ] Add comments to complex code
- [ ] Update any documentation

### Quality Checks
- [ ] All TypeScript types defined
- [ ] No `any` types in production code
- [ ] All imports properly sorted
- [ ] ESLint passes with no errors
- [ ] Code follows project conventions
- [ ] No console.log statements in production
- [ ] Error messages are user-friendly
- [ ] Loading states are consistent
- [ ] Empty states are handled
- [ ] Accessibility features implemented (ARIA labels, keyboard navigation)
