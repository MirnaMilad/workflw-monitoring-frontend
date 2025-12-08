# Workflow Monitoring Dashboard - Frontend

A real-time workflow monitoring dashboard built with Angular 18+ and ECharts, featuring live event streaming, anomaly detection, and comprehensive workflow metrics visualization.

## 🚀 Features

### Core Functionality

- **Real-time Event Timeline** - Live SSE (Server-Sent Events) streaming of workflow events with interactive scatter plot
- **Workflow Health Metrics** - Key performance indicators: SLA Compliance, Cycle Time, Active Anomalies, Total Workflows
- **Anomaly Heatmap** - Visual representation of anomalies by hour and severity (Low/Medium/Critical)
- **Workflow Volume Chart** - Hybrid bar/line chart with time filters (6h/12h/24h)

### Interactive Features

- **Category Filters** - Filter events by status: All, Completed, Pending, Anomaly
- **Severity Toggles** - Filter anomalies by severity level: Low, Medium, Critical
- **Auto-Refresh Controls** - Configurable auto-refresh with intervals: 5s, 10s, 30s, 1m
- **Manual Refresh** - On-demand data refresh across all components
- **Dark/Light Mode** - Theme toggle with persistent user preference
- **Real-time Toast Notifications** - Live notifications for workflow events with auto-dismiss

### UI/UX Enhancements

- **Responsive Design** - Mobile-friendly layouts with breakpoints at 1024px, 768px, 480px
- **Smooth Animations** - Bounce-in toasts, icon animations, hover effects
- **Progress Indicators** - Visual countdown for auto-dismissing toasts
- **Clean Architecture** - Domain-driven design with separation of concerns

## 🛠️ Tech Stack

- **Framework:** Angular 18+ (Standalone Components, Signals)
- **Visualization:** ECharts 5.x
- **Styling:** SCSS with CSS Custom Properties
- **State Management:** Angular Signals with Reactive Effects
- **Real-time:** Server-Sent Events (SSE) + Polling
- **Build Tool:** Angular CLI with esbuild
- **HTTP Client:** Angular HttpClient
- **Change Detection:** OnPush Strategy

## 📋 Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Docker (optional, for containerized deployment)

## 🔧 Installation

### Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd workflw-monitoring-frontend

# Install dependencies
npm install

# Start development server
npm start

# The app will be available at http://localhost:4200
```

### Docker Deployment

```bash
# Build and run with Docker
docker build -t workflow-monitoring-frontend .
docker run -d -p 8080:80 --name workflow-frontend workflow-monitoring-frontend

# Or use Docker Compose
docker compose up -d

# Access the app at http://localhost:8080
```

## 📁 Project Structure

```
src/
├── app/
│   ├── application/          # Application services
│   │   └── services/         # Business logic services
│   │       ├── events.service.ts
│   │       ├── polling.service.ts
│   │       ├── toast.service.ts
│   │       ├── theme.service.ts
│   │       ├── workflow-metrics.service.ts
│   │       ├── anomaly.service.ts
│   │       └── workflow-volume.service.ts
│   ├── components/           # UI components
│   │   ├── dashboard/        # Main dashboard container
│   │   ├── event-timeline/   # Real-time event scatter plot
│   │   ├── workflow-metrics/ # KPI cards
│   │   ├── anomaly-heatmap/  # Anomaly visualization
│   │   ├── workflow-volume/  # Volume bar/line chart
│   │   ├── theme-toggle/     # Dark/light mode toggle
│   │   ├── refresh-button/   # Auto-refresh controls
│   │   ├── pause-toggle/     # Pause/resume controls
│   │   └── toast-container/  # Notification system
│   ├── domain/               # Domain models
│   │   ├── models/           # Entity definitions
│   │   └── ports/            # Port interfaces
│   ├── infrastructure/       # Infrastructure adapters
│   │   ├── adapters/         # External service adapters
│   │   │   ├── api.service.ts
│   │   │   └── sse-event-stream.adapter.ts
│   │   └── services/         # State management
│   │       └── events-state.service.ts
│   └── environments/         # Environment configurations
├── public/                   # Static assets
└── styles.scss              # Global styles
```

## 🎨 Configuration

### API Endpoint

Update the base URL in `src/environments/environment.ts`:

```typescript
export const environment = {
  baseUrl: 'http://localhost:3000', // Your backend API URL
};
```

### Build Budgets

Bundle size limits are configured in `angular.json`:

```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "2MB",
      "maximumError": "3MB"
    }
  ]
}
```

## 🔌 Backend API Requirements

The frontend expects the following endpoints:

### REST Endpoints

- `GET /stats/overview` - Workflow metrics (SLA, cycle time, anomalies, total)
- `GET /stats/timeline` - Event timeline data
- `GET /stats/anomalies` - Anomaly heatmap data

### SSE Endpoint

- `GET /events` - Server-Sent Events stream for real-time workflow events

### Event Model

```typescript
{
  id: string;
  workflowId: string;
  workflowName: string;
  timestamp: string;
  duration: number;
  category: 'completed' | 'pending' | 'anomaly';
  severity?: 'low' | 'medium' | 'critical';
  type: string;
}
```

## 📜 Available Scripts

```bash
# Development
npm start              # Start dev server with hot reload
npm run watch          # Build in watch mode

# Production
npm run build          # Build for production

# Testing
npm test              # Run unit tests with Karma

# Code Quality
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
```

## 🐳 Docker

### Dockerfile

Multi-stage build optimized for production:

- **Stage 1:** Build Angular app with Node 20
- **Stage 2:** Serve with Nginx Alpine (~50MB final image)

### Nginx Configuration

- SPA routing support
- Gzip compression
- Static asset caching (1 year)
- Security headers
- Health check endpoint at `/health`

### Build & Run

```bash
# Build image
docker build -t workflow-monitoring-frontend .

# Run container
docker run -d \
  -p 8080:80 \
  --name workflow-frontend \
  workflow-monitoring-frontend

# View logs
docker logs -f workflow-frontend

# Stop container
docker stop workflow-frontend
```

## 🎯 Key Features Details

### Real-time Updates

- **SSE Streaming:** Live event updates without polling
- **Auto-Refresh:** Configurable polling intervals for metrics/anomalies/volume
- **Manual Refresh:** Instant data refresh across all components

### Toast Notifications

- **Auto-dismiss:** Configurable duration per toast type
- **Progress bar:** Visual countdown indicator
- **Animations:** Bounce-in, pulse, shake effects
- **Color-coded:** Success (green), Error (red), Warning (yellow), Info (blue)

### Responsive Design

- **Desktop:** Full feature set with optimal layouts
- **Tablet:** Adjusted grid layouts and spacing
- **Mobile:** Stacked components, touch-friendly controls

### Theme Support

- **Dark Mode:** Default theme with dark backgrounds
- **Light Mode:** High contrast light theme
- **Persistence:** Theme preference saved in localStorage
- **CSS Variables:** Dynamic color switching

## 🔒 Security

- **Content Security Policy** headers via Nginx
- **XSS Protection** enabled
- **Frame Options** set to SAMEORIGIN
- **HTTPS Ready** - Configure SSL certificates in Nginx

## 🚧 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

[Your License Here]

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Known Issues

- None currently reported

## 📞 Support

For issues, questions, or contributions, please open an issue in the repository.

---

**Built with ❤️ using Angular and ECharts**
