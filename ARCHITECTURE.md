# Commons Youth Platform - Architecture Documentation

## 1. Project Overview
**Commons Youth** is a digital platform for Thai youth to connect, organize, and drive social change. The application is built as a Single Page Application (SPA) using modern React ecosystem tools.

- **Stack**: React 19, TypeScript, Vite, Tailwind CSS.
- **Backend Services**: Firebase (Authentication, Firestore, Storage).
- **Design System**: Custom branding (Linen/Obsidian/Bud/Orange) with "Anuphan" and "PT Mono" fonts.

---

## 2. Directory Structure

```
/
├── components/         # Reusable UI components (Layout, MapComponent, etc.)
├── pages/              # Route views (Home, Dashboard, MapPage, etc.)
├── services/           # Business logic and external API communication
│   ├── api.ts          # Central data fetching service (Data Access Layer)
│   ├── authContext.tsx # Authentication state management
│   └── firebase.ts     # Firebase SDK initialization
├── public/             # Static assets (images, icons)
├── types.ts            # TypeScript interfaces (Domain Models)
├── App.tsx             # Main Application Component & Routing Config
└── tailwind.config.js  # Design System Tokens definition
```

---

## 3. Data Architecture

### Domain Models (`types.ts`)
The application is built around four core entities:
1.  **User**: Represents a platform member (`uid`, `email`, `profileImage`).
2.  **Group**: A youth organization or collective (`id`, `coordinates`, `issues`).
3.  **Activity**: Event or workshop hosted by a group (`date`, `location`, `status`).
4.  **Project**: Long-term initiative or case study (`stats`, `fullContent`).

### Data Access Layer (`services/api.ts`)
- **Pattern**: Service Module Pattern.
- **Implementation**: The system currently uses a **Hybrid/Mock** approach. 
    - It contains static `MOCK_DATA` arrays for development and fallback purposes.
    - It imports Firebase Firestore functions (`getDocs`, `collection`) for production data flow.
    - *Note for Developers*: When adding new features, check `api.ts` to see if you should be reading from the mock array or the real database.

---

## 4. Authentication Flow (`services/authContext.tsx`)
1.  **Provider**: `AuthProvider` wraps the entire application in `App.tsx`.
2.  **Mechanism**: Uses Firebase Authentication (Google Provider).
3.  **Persistence**:
    - Listens to `onAuthStateChanged`.
    - On login, checks Firestore `users/{uid}`.
    - If user exists, loads profile. If not, creates a new user document.

---

## 5. Design System Implementation
The design system is codified in `tailwind.config.js` and applied via utility classes.

- **Colors**:
    - Primary Background: `bg-brand-linen` (#FAF6E2)
    - Primary Text: `text-brand-obsidian` (#161716)
    - Brands/Accents: `text-brand-bud`, `text-brand-orange`.
- **Typography**:
    - Primary: `font-sans` (Anuphan)
    - Technical/Accent: `font-mono` (PT Mono)

---

## 6. Key Components
- **Layout.tsx**: Main wrapper containing the Navbar (responsive) and Footer. Handles navigation state.
- **MapComponent.tsx**: Interactive Leaflet map. Renders `Group` entities as markers.
- **Dashboard.tsx**: Protected route. Allows users to View Profile, Edit Profile, and Manage their Groups (CRUD operations).

## 7. Routing
- **Library**: `react-router-dom` (HashRouter approach used in `App.tsx`).
- **Guards**: `ProtectedRoute` component blocks access to `/dashboard` if not authenticated.
