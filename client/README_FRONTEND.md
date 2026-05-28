# ResQNet Frontend - Command Center Dashboard

A futuristic real-time geospatial emergency response platform UI built with React, Vite, and TypeScript.

## Project Status
✅ **Project Setup Complete** - Development server running on `http://localhost:5173/`

## Technology Stack

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Map Engine**: Mapbox GL JS (ready for integration)
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP**: Axios

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── map/          # Map viewport & visualization
│   │   ├── sidebar/      # Event feed & rescue activity log
│   │   ├── analytics/    # Timeline charts & analytics
│   │   ├── alerts/       # Real-time alert notifications
│   │   ├── building/     # Building visualization & info panel
│   │   └── ui/           # Navigation, controls, shared UI
│   │
│   ├── pages/
│   │   └── DashboardPage.jsx  # Main dashboard layout
│   │
│   ├── store/
│   │   └── index.js       # Zustand state management
│   │
│   ├── services/
│   │   ├── api.js         # Mock API service
│   │   └── simulation.js  # Simulation logic service
│   │
│   ├── hooks/             # Custom React hooks
│   ├── types/             # Data type definitions
│   ├── utils/             # Utility functions
│   │
│   ├── App.jsx            # Root component
│   ├── App.css            # App styles
│   ├── index.css          # Global Tailwind styles
│   └── main.jsx           # React entry point
│
├── public/                # Static assets
├── tailwind.config.js     # Tailwind CSS config
├── postcss.config.js      # PostCSS config
├── vite.config.js         # Vite config
├── package.json           # Dependencies & scripts
└── index.html             # HTML entry point
```

## State Management Architecture

### Zustand Stores

#### `useMapStore`
- `zoom`, `pitch`, `bearing` - Map view controls
- `selectedBuilding`, `selectedZone` - Selection state
- `mapCenter` - Camera position

#### `useSimulationStore`
- `currentPhase`, `simulationTime`, `isRunning`
- `playbackSpeed`, `totalDuration`
- Controls real-time simulation playback

#### `useZonesStore`
- `zones` - Array of affected zones
- `heatmapData` - Heatmap visualization data
- `rescueScores` - Priority scores per zone

#### `useAlertsStore`
- `activeAlerts`, `criticalAlerts`, `dismissedAlerts`
- Real-time alert management

#### `useUIStore`
- `sidebarOpen`, `analyticsVisible`, `breakGlassEnabled`
- UI state for visibility toggles

#### `useRealtimeStore`
- `websocketConnected` - Connection status
- `latestUpdate`, `liveEvents` - Real-time data stream

## Core Components

### TopNavigation
- Tab navigation (Overview, Real-Time Activity, Prediction, History, Comparison)
- Live stats display (Total Incidents, Active Rescue Zones, Avg Signal Loss, Max Priority)
- Live status indicator

### Sidebar
- Event feed with zone cards
- Severity badges (green/yellow/orange/red)
- Signal status indicators
- Zone statistics footer

### MapViewport
- 3D map placeholder (ready for Mapbox GL JS)
- Map control indicators (zoom, pitch, bearing)

### AlertsPanel
- Floating animated notifications
- Severity-based styling
- Auto-dismiss logic

### AnalyticsPanel
- Recharts integration
- Incident histogram
- Priority score area chart
- Timeline analytics

### SimulationControls
- Play/Pause/Reset/Skip controls
- Playback speed selector (0.5x, 1x, 2x, 4x)
- Progress bar with time display

### InfoPanel
- Zone details when selected
- Priority score & risk level
- Evidence section (signals, phones, WiFi, electricity)
- Coordinates & timestamp

## Services

### Mock API (`services/api.js`)
Simulates backend responses with realistic simulation phases:
- **Phase 0 (0-10s)**: Normal building state
- **Phase 1 (10-20s)**: Minor seismic activity
- **Phase 2 (20-30s)**: Structural damage
- **Phase 3 (30-40s)**: Multiple signals lost
- **Phase 4 (40-70s)**: Escalating crisis

### Simulation Service (`services/simulation.js`)
- Manages simulation flow
- Calculates heatmaps from zone scores
- Generates contextual alerts
- Handles color coding by severity

## Running the Project

### Development Server
```bash
cd client
npm run dev
```
Server runs on `http://localhost:5173/`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Design System

### Color Palette
```
Background:     #0B0F19 (dark-bg)
Cards:          #0F1524 (dark-card)
Borders:        #111827 (dark-border)
Text:           #E5E7EB (dark-text)

Severity Colors:
Green:          #10B981 (low)
Yellow:         #FBBF24 (medium)
Orange:         #F97316 (high)
Red:            #EF4444 (critical)
Cyan:           #06B6D4 (highlight)
```

### Typography
- UI Font: System sans-serif
- Data Font: Monospace (Courier New)

## Key Features

✅ **Real-Time Dashboard** - Live zone monitoring
✅ **Interactive Map** - Placeholder for Mapbox GL JS
✅ **Heatmap Visualization** - Priority-based intensity
✅ **Alert System** - Severity-based notifications
✅ **Simulation Engine** - Demo timeline with realistic phases
✅ **Analytics Charts** - Timeline data visualization
✅ **Responsive Layout** - Sidebar, Map, Analytics panels
✅ **State Management** - Zustand for global state
✅ **Dark Theme** - Cyberpunk command center aesthetic

## Next Steps

1. **Mapbox GL JS Integration** - Replace map placeholder with real 3D map
2. **Websocket Connection** - Connect to real backend API
3. **Building Visualization** - 3D building floor layouts
4. **Advanced Animations** - Particle effects, smooth transitions
5. **Break Glass Mode** - Emergency escalation UI
6. **Voice Alerts** - Audio notifications (optional)

## Notes

- All styling uses Tailwind CSS utility classes
- Component hierarchy is shallow and composable
- Zustand stores are singleton patterns
- Mock data follows realistic emergency scenarios
- Simulation runs client-side for demo purposes

## Development Tips

- HMR (Hot Module Reload) enabled - save files to see changes instantly
- Open DevTools to inspect component props and state
- Check browser console for simulation data updates
- Use Zustand DevTools extension for state debugging

---

**Built for ResQNet Emergency Response Platform**
