# Fine-ride App (Frontend Prototype)

## Overview
This is a modern web-based frontend prototype for a ride-sharing application. It focuses on delivering a smooth, responsive interface for booking rides.

## Tech Stack
- React 18
- TailwindCSS
- Lucide Icons
- Pure Browser-based execution (No build steps)

## Features
- **Responsive Layout:** Works seamlessly on mobile (bottom sheet design) and desktop (sidebar layout).
- **Map Interface:** Simulated map environment with floating UI elements.
- **Search & Booking Flow:** 
  - Recent/saved locations shortcuts.
  - Destination search input.
  - Ride category selection (X, Comfort, XL, Black).
  - Confirm ride CTA.

## New Feature: Admin Dashboard
We have added a dedicated Admin Dashboard accessible via `admin.html`. Features include:
- Analytics Overview with Chart.js integration.
- User Management for both Riders and Drivers.
- Ride Tracking and live monitoring list.
- Sidebar navigation layout for admin portal.

## Additional Pages Implemented
- **Landing Page (`index.html`)**: Modern, responsive homepage with feature sections, safety info, and download links.
- **Booking App (`book.html`)**: The core ride booking interface (moved from index.html).
- **Authentication (`auth.html`)**: Login and Signup flow with Email/Phone toggle.
- **Driver Dashboard (`driver.html`)**: Driver status control, live map interface, ride request management.
- **User Profile (`profile.html`)**: Manage user info, view ride history, and payment methods.

## Next Steps
- Implement backend data integration (Database).
- Add real-time mapping integrations (Google Maps API).
- Add payment processing gateway (Stripe).
