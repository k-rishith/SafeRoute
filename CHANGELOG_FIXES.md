# 🔧 SafeRoute – Latest Updates & Fixes

This section highlights the latest improvements, bug fixes, feature enhancements, and backend integration updates implemented in the SafeRoute project.

---

## 🗺️ 1. Navigation and Home Map

- Removed the **Report Hazard** item from the generated navigation bar links.
- Added a responsive Leaflet road-hazard map to the home page.
- Changed the default map location and demo report data from Delhi to Hyderabad, Telangana.
- Added interactive hazard category filters:
  - All Hazards
  - Potholes
  - Streetlights
  - Waterlogging
  - Critical Only
- Added a manual map refresh button.
- Implemented automatic map refresh every 60 seconds.
- Integrated Supabase Realtime subscription when Supabase mode is enabled.
- Shared the same Leaflet map module between the home page and the full Map page.

## 🤖 2. Reporting and AI Suggestions

- Reworked the photo-upload step in the hazard reporting workflow.
- Made hazard category choices clickable before and after image selection.
- Added photo preview functionality.
- Implemented image type and file-size validation.
- Updated the suggestion confirmation workflow:
  - **Confirm Suggestion:** Changes the card status to `Suggestion Submitted`.
  - **Change Suggestion:** Reopens the category choices for modification.
- Clearly marked the current AI output as a demo suggestion.

**Note:** A trained AI image-classification model is not included in this build.

## 🛣️ 3. Route Management

- Added an interactive Leaflet route map.
- Introduced two selectable illustrative Hyderabad routes: Route A and Route B.
- Implemented dynamic route selection.
- Selecting Route A or Route B updates:
  - Selected route state.
  - Map route line.
  - Estimated travel time (ETA).
  - Route distance.
  - Hazard metrics.
- Added a **Review Hazards** feature.
- Implemented a details modal displaying sample hazard reports associated with the selected route.
- Added a disclaimer explaining that route geometry and ETA values are illustrative demo data.

**Note:** Actual road routing and live travel-time calculations require integration with a routing provider.

## 👥 4. Community and Civic Resolution

- Updated community response functionality.
- Added `Response Submitted` status after submitting a response.
- Introduced a **Change Response** option.
- Implemented browser local-storage persistence for demo community responses.
- Added before-and-after evidence upload controls to the maintenance page.
- Implemented image preview functionality.
- Added image compression for demo evidence uploads.
- Demo evidence is compressed and stored locally in the browser.
- Supabase mode uploads evidence to the `hazard-evidence` Storage bucket.
- Added corresponding records to the `report_images` database table.
- Added local before-and-after illustration assets.
- Introduced a **Civic Resolution Preview** section on the home page.

## 🗄️ 5. Data and Backend Integration Fixes

- Replaced randomly generated Delhi mock hazards with stable Hyderabad demo records.
- Fixed a duplicate top-level `const SR` declaration between the original application and API scripts.
- Introduced a separate namespace variable for the API layer.
- Added local demo report persistence.
- Implemented local photo evidence retrieval.
- Added Supabase Row Level Security (RLS) policies.
- Added an Auth-to-profile database trigger to support updated evidence-upload and verification workflows.

---

## ⚠️ 6. Important Limitations

### Demo Mode

- Browser demo mode remains enabled by default.
- Reports created in demo mode are stored only in the current browser's local storage.
- Demo data is not shared between users.
- Demo reports are not synchronized with Supabase.

### Supabase Integration

For shared live reports and backend functionality:

1. Configure Supabase credentials in `js/config.js`.
2. Execute `supabase/schema.sql` in the Supabase SQL Editor.
3. Enable Realtime for `hazard_reports`.
4. Configure the `hazard-evidence` Storage bucket.
5. Verify the required Row Level Security (RLS) policies and authentication permissions.

### Route Calculation

- Route A and Route B use illustrative route geometry.
- Distance and travel-time estimates are demo values.
- Integrate OSRM, GraphHopper, or another routing provider for actual routes and ETAs.

### AI Image Classification

- AI image classification is not connected to a trained model.
- Current AI suggestions are demonstration functionality.
- A trained image-classification model and backend integration are required for actual pothole detection.

---

## 📊 7. Development Status

| Module | Implementation Status |
|---|---|
| Navigation | Updated |
| Home Page Map | Implemented |
| Hyderabad Demo Data | Implemented |
| Hazard Category Filters | Implemented |
| Automatic Map Refresh | Implemented |
| Supabase Realtime | Integration Supported |
| Hazard Reporting | Updated |
| AI Category Suggestions | Demo Functionality |
| Route A / Route B | Demo Functionality |
| Community Responses | Implemented |
| Before-and-After Evidence | Implemented |
| Local Data Persistence | Implemented |
| Supabase Backend | Configuration Required |
| AI Image Classification | Not Yet Integrated |
| Live Road Routing | Not Yet Integrated |

---

## 🎯 Project Improvement Summary

These updates improve the SafeRoute platform by introducing interactive road-hazard mapping, improved reporting workflows, route visualization, community participation, evidence management, and better backend integration.

The platform provides a foundation for future integration of real-time road data, trained AI models, and actual routing services.

---

> **SafeRoute – Know the Road Before You Take It.** 🚦
