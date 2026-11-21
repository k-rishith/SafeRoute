# SafeRoute fixes applied

## Navigation and home map
- Removed the Report Hazard item from the generated navbar links.
- Added a responsive Leaflet road-hazard map to the home page.
- Changed the default map centre and demo report data from Delhi to Hyderabad, Telangana.
- Added All Hazards, Potholes, Streetlights, Waterlogging and Critical Only filters.
- Added a manual refresh button, a 60-second refresh cycle and Supabase Realtime subscription when Supabase mode is enabled.
- Shared the map module with the full Map page.

## Reporting / AI suggestion
- Reworked the photo step so hazard category choices are clickable before and after image selection.
- Added a photo preview and image type / size validation.
- Confirm Suggestion now changes the card to Suggestion Submitted.
- Added Change Suggestion to reopen the category choices.
- Marked the current AI output as a demo suggestion; no trained classifier is included in this ZIP.

## Routes
- Added a Leaflet route map with two selectable illustrative Hyderabad corridors.
- Selecting Route A or Route B updates the selected state, map line, ETA, distance and hazard metrics.
- Review Hazards opens a details modal listing the sample reports associated with that route.
- Added a clear note that route geometry and ETA are demo values, not live routing-provider results.

## Community and civic resolution
- Community responses now change to Response Submitted and expose Change Response.
- Demo responses persist in browser local storage.
- Added before/after evidence upload and preview controls to the maintenance page.
- Demo evidence is image-compressed and saved locally; Supabase mode uploads it to the `hazard-evidence` bucket and inserts a `report_images` record.
- Added local before/after illustration assets and a Civic Resolution preview section on the home page.

## Data and integration fixes
- Replaced random Delhi mock hazards with stable Hyderabad demo records.
- Fixed a duplicate top-level `const SR` declaration between the original app and API scripts by giving the API layer its own namespace variable.
- Added local demo report persistence and local photo evidence retrieval.
- Added Supabase RLS policies and an Auth-to-profile trigger needed for the updated upload and verification paths.

## Important limitations
- Demo mode is still enabled by default. Data created in demo mode is stored only in the current browser and is not shared with other users.
- For shared live reports, configure Supabase credentials, run `supabase/schema.sql`, enable Realtime for `hazard_reports`, and configure Storage/RLS policies.
- Route paths and travel estimates are illustrative; connect OSRM, GraphHopper or another routing provider for actual routes and ETAs.
- AI image classification is not connected to a trained model in this build.
