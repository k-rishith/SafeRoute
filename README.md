# 🚦 SafeRoute — Community-Driven Road Intelligence Platform

> **"Know the Road Before You Take It."**

A community-driven road hazard reporting and mapping platform that helps users report road hazards, verify road conditions, and identify routes with lower reported hazard exposure.

---

## 📌 Project Overview

SafeRoute is a web-based platform designed to improve road safety through community participation. Users can report road hazards, view reported incidents on an interactive map, verify existing reports, and check routes for nearby hazards.

The platform uses interactive mapping and community-driven information to help people make more informed travel decisions.

## 🛠️ Technology Stack

| Technology    | Purpose                       |
| ------------- | ----------------------------- |
| HTML5         | Web page structure            |
| CSS3          | Styling and responsive design |
| JavaScript    | Frontend functionality        |
| Leaflet.js    | Interactive maps              |
| OpenStreetMap | Map data and visualization    |
| Supabase      | Backend and database services |
| PostgreSQL    | Relational database           |
| PostGIS       | Geospatial data management    |

---

## ✨ Key Features

- **Road Hazard Reporting:** Report potholes and other road hazards.
- **Interactive Map:** View reported hazards using Leaflet.js and OpenStreetMap.
- **Category Filters:** Filter road hazards by category.
- **Community Verification:** Allow users to verify existing hazard reports.
- **Route Hazard Checking:** Check routes for reported hazards within 300 metres of route segments.
- **Evidence Uploads:** Attach before-and-after photos to hazard reports.
- **Live Updates:** Refresh reports automatically and receive Supabase Realtime updates.
- **Responsive Design:** Access the platform across different screen sizes.

---

## 🗺️ Hyderabad Demo Map

The platform uses Hyderabad, Telangana, as its default map location.

**Default Coordinates:**

- Latitude: `17.3850`
- Longitude: `78.4867`

The supplied hazard records and route lines are illustrative demo data. They do not represent official or verified live road conditions.

### Map Functionality

- The home page and full Map page share the same Leaflet map module.
- Category filters update map markers immediately.
- Users can manually refresh the latest available reports.
- The map automatically refreshes every 60 seconds.
- Supabase Realtime listens to changes in `hazard_reports` when mock mode is disabled.
- Community verification updates the corresponding hazard record and its verification counters.

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

### 2. Navigate to the Project Folder

```bash
cd SafeRoute
```

### 3. Start the Local Development Server

Run the following command:

```bash
python -m http.server 8100
```

### 4. Open the Application

Open your browser and visit:

```text
http://localhost:8100
```

**Note:** Serve the project using a local development server instead of opening HTML files directly.

---

## 🔥 Demo Mode vs Supabase Mode

The project initially runs in browser demo mode.

Configuration file: `js/config.js`

```javascript
useMockData: true
```

### Demo Mode

In demo mode:

- Sample hazard reports are displayed.
- Community responses are stored in browser local storage.
- Evidence previews are saved locally.
- Data is not shared between users.
- Information is not synchronized with Supabase.

### Supabase Mode

To enable the actual backend integration:

**Step 1:** Configure your Supabase credentials in `js/config.js`.

```javascript
supabaseUrl: "YOUR_SUPABASE_URL",
supabaseAnonKey: "YOUR_SUPABASE_ANON_KEY"
```

Use only the publishable/anon key in frontend code.

**Step 2:** Disable mock mode.

```javascript
useMockData: false
```

**Step 3:** Execute the database schema.

Open the Supabase SQL Editor and run:

```text
supabase/schema.sql
```

**Step 4:** Enable Supabase Realtime for:

```text
public.hazard_reports
```

The schema adds this table to the standard `supabase_realtime` publication when available.

**Step 5:** Verify the following configurations:

- Row Level Security (RLS) policies.
- `hazard-evidence` Storage bucket.
- Database permissions.
- Authentication configuration.
- User-profile creation trigger and policies required by your authentication flow.

**Security Note:** Never expose your Supabase service-role key in frontend JavaScript or public repositories.

---

## 🧭 Feature Details and Limitations

### 1. Add / Check Route

The route-checking tool allows users to:

- Add multiple coordinate stops.
- Select locations directly from the map.
- Find active hazard reports within 300 metres of straight-line route segments.

**Limitation:** This feature checks hazard proximity. It does not provide turn-by-turn navigation or actual road routing.

### 2. Route A / Route B

The Route A and Route B geometry, distance, and travel time are illustrative demo examples.

For actual route calculations and live travel-time estimates, integrate a routing provider such as OSRM or GraphHopper.

### 3. Verified User Reports

The verified-user option requires users to sign in through Supabase Authentication.

Authentication is unavailable while browser demo mode is enabled.

### 4. AI-Based Category Suggestions

The report wizard provides AI category suggestions as demo functionality.

A real AI model endpoint must be connected to enable actual model-based predictions.

### 5. Before-and-After Evidence

- In demo mode, uploaded images are stored locally in the browser.
- In Supabase mode, images are uploaded to the `hazard-evidence` Storage bucket.
- Image information is recorded in the `report_images` table.

### 6. AI Microservice

The included AI microservice currently returns a placeholder prediction.

It is not a trained pothole detection or classification model.

---

## 📂 Project Structure

```text
SafeRoute/
│
├── index.html
│
├── pages/
│   ├── map.html
│   ├── report.html
│   ├── routes.html
│   ├── community.html
│   ├── maintenance.html
│   ├── dashboard.html
│   └── ...
│
├── css/
│   ├── styles.css
│   └── ...
│
├── js/
│   ├── config.js
│   ├── mock-data.js
│   ├── supabase-api.js
│   ├── map.js
│   └── ...
│
├── supabase/
│   └── schema.sql
│
├── assets/
│   └── images/
│
└── README.md
```

### Folder Description

| Folder / File         | Description                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| `index.html`          | Landing page and responsive Hyderabad live-feed map                     |
| `pages/`              | Map, report, routes, community, maintenance, dashboard and detail pages |
| `css/`                | Design tokens and shared responsive components                          |
| `js/`                 | Application helpers, mock data, Supabase API and shared Leaflet map     |
| `supabase/schema.sql` | PostgreSQL/PostGIS schema and supporting policies                       |
| `assets/images/`      | Local before-and-after visual placeholders                              |

---

## 🔐 Security Considerations

- Use only the Supabase publishable/anon key in frontend code.
- Never expose the Supabase service-role key.
- Configure appropriate Row Level Security policies.
- Protect user authentication and profile information.
- Configure Storage permissions for evidence uploads.

---

## 🚀 Future Enhancements

- Real-time road hazard detection using trained AI models.
- Integration with actual road-routing services.
- Accurate travel-time and distance calculations.
- Improved community verification mechanisms.
- Advanced road safety analytics.
- Mobile application integration.
- Push notifications for nearby road hazards.

---

## 🎯 Project Objective

The primary objective of SafeRK\:L
oute is to create a community-driven road intelligence platform that improves road awareness and supports safer travel decisions.

By combining interactive maps, community reporting, verification mechanisms, and geospatial technology, SafeRoute aims to make road hazard information more accessible and useful to everyone.

---

## 👨‍💻 Project Information

**Project Name:** SafeRoute
**Category:** Web Development / Community-Based Road Safety Platform
**Frontend:** HTML, CSS, JavaScript
**Mapping:** Leaflet.js, OpenStreetMap
**Backend:** Supabase
**Database:** PostgreSQL with PostGIS

---

> **SafeRoute — Know the Road Before You Take It.** 🚦
