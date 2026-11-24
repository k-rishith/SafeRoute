# SafeRoute

Community-driven road hazard reporting and mapping platform.

## Stack
HTML5 + CSS3 + Vanilla JavaScript + Leaflet.js + OpenStreetMap + Supabase (PostgreSQL + PostGIS).

## Run locally
Serve the `SafeRoute` folder with a local static server rather than opening files directly:

```bash
python -m http.server 8100
```

Open `http://localhost:8100`.

## Hyderabad demo map
The map defaults to Hyderabad, Telangana (`17.3850, 78.4867`). The supplied hazard records and route lines are illustrative demo data. They are not official or verified live road conditions.

The home page and full Map page share the same Leaflet map module. Category filters update markers immediately. Refresh re-fetches the latest available reports, the map auto-refreshes every 60 seconds, and Supabase Realtime is subscribed to `hazard_reports` when mock mode is disabled. Community verification triggers update the hazard row and its counters, so individual verification records do not need to be exposed to the public feed.

## Demo mode vs Supabase mode
The project defaults to browser demo mode in `js/config.js`:

```js
useMockData: true
```

Demo reports, community responses and evidence previews are stored in the current browser's local storage. They are not shared with other users or synced to Supabase.

To enable Supabase mode:-

1. Set `supabaseUrl` and `supabaseAnonKey` in `js/config.js` (use the publishable/anon key only).
2. Set `useMockData: false`.
3. Run `supabase/schema.sql` in the Supabase SQL Editor.
4. Enable Realtime for `public.hazard_reports` in the Supabase publication. The schema adds it to the standard `supabase_realtime` publication when it is available.
5. Confirm Row Level Security policies and the `hazard-evidence` Storage bucket are configured.
6. Add the user-profile creation trigger/policies required by your authentication flow before enabling public signups.

Never put the Supabase service-role key in frontend code.

## Feature notes
- The Add / Check Route tool accepts multiple coordinate stops or map-picked locations and finds active reports within 300 metres of the straight-line segments. It is a hazard proximity check, not turn-by-turn road routing.
- The Route A / Route B geometry, distance and time are demo examples. Connect a routing provider such as OSRM or GraphHopper for actual route calculations and live travel-time estimates.
- The report form's verified-user option requires a signed-in Supabase Auth account. Authentication is unavailable while browser demo mode is enabled.
- AI category output in the report wizard is explicitly a demo suggestion unless a real model endpoint is connected.
- Before/after photos in demo mode are saved locally in this browser. Supabase mode uploads them to the `hazard-evidence` bucket and records them in `report_images`.
- The included AI microservice currently returns a placeholder prediction and is not a trained pothole classifier.

## Structure
- `index.html` — landing page and responsive Hyderabad live-feed map
- `pages/` — map, report, routes, community, maintenance, dashboard and detail pages
- `css/` — design tokens and shared responsive components
- `js/` — app helpers, mock data, Supabase API and shared Leaflet map
- `supabase/schema.sql` — PostgreSQL/PostGIS schema and supporting policies
- `assets/images/` — local before/after visual placeholders
