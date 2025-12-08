# Architecture Documentation

## Overview

This application follows **Clean Architecture** principles with **Domain-Driven Design (DDD)** patterns, leveraging Angular's modern features including standalone components, signals, and reactive programming.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│                      (Components)                            │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                         │
│                      (Services)                              │
├─────────────────────────────────────────────────────────────┤
│                      Domain Layer                            │
│                   (Models & Ports)                           │
├─────────────────────────────────────────────────────────────┤
│                  Infrastructure Layer                        │
│              (Adapters & External Services)                  │
└─────────────────────────────────────────────────────────────┘
```

## 1. Presentation Layer (Components)

### Purpose

Responsible for UI rendering, user interactions, and presentation logic.

### Key Characteristics

- **Standalone Components**: No NgModule dependencies
- **OnPush Change Detection**: Performance optimization
- **Signals for State**: Reactive, fine-grained updates
- **Smart vs Presentational**: Clear separation of concerns

### Component Structure

```typescript
@Component({
  selector: 'app-component',
  standalone: true,
  imports: [CommonModule, ...],
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### Components Hierarchy

```
DashboardComponent (Smart)
├── WorkflowMetricsComponent (Presentational)
├── EventTimelineComponent (Smart + Presentational)
├── AnomalyHeatmapComponent (Smart + Presentational)
├── WorkflowVolumeComponent (Smart + Presentational)
├── ThemeToggleComponent (Presentational)
├── RefreshControlComponent (Presentational)
├── PauseToggleComponent (Presentational)
└── ToastContainerComponent (Smart + Presentational)
```

### Component Types

#### Smart Components (Container)

- Inject services
- Manage state
- Handle business logic
- Coordinate child components
- Examples: `DashboardComponent`, `EventTimelineComponent`

#### Presentational Components (Dumb)

- Receive data via inputs
- Emit events via outputs
- Pure presentation logic
- Reusable across contexts
- Examples: `ThemeToggleComponent`, `RefreshControlComponent`

---

## 2. Application Layer (Services)

### Purpose

Contains business logic, orchestration, and application-specific operations.

### Key Services

#### EventsService

**Responsibility**: Manages SSE connection and event streaming

```typescript
@Injectable({ providedIn: 'root' })
export class EventsService {
  - connectToEventStream(): void
  - disconnectFromEventStream(): void
  - pause(): void
  - resume(): void
  - showEventNotification(event): void
}
```

**Flow:**

```
SSE Stream → EventsService → EventsStateService → Components
                ↓
          ToastService (notifications)
```

#### PollingService

**Responsibility**: Generic polling mechanism for REST endpoints

```typescript
@Injectable({ providedIn: 'root' })
export class PollingService {
  - createPoller<T>(endpoint, interval): Poller<T>

  Poller<T> {
    data: Signal<T | null>
    start(): void
    stop(): void
    updateInterval(ms): void
    refresh(): void
  }
}
```

**Features:**

- Generic type support
- Dynamic interval updates
- Manual refresh capability
- Automatic error handling
- Signal-based reactive state

#### WorkflowMetricsService

**Responsibility**: Manages workflow metrics polling

```typescript
@Injectable({ providedIn: 'root' })
export class WorkflowMetricsService {
  - overview: Signal<WorkflowOverview | null>
  - startPolling(intervalMs?): void
  - stopPolling(): void
  - refresh(): void
}
```

#### AnomalyService

**Responsibility**: Manages anomaly data polling

```typescript
@Injectable({ providedIn: 'root' })
export class AnomalyService {
  - anomalies: Signal<AnomalyData | null>
  - startPolling(intervalMs?): void
  - stopPolling(): void
  - refresh(): void
  - updateInterval(intervalMs): void
}
```

#### WorkflowVolumeService

**Responsibility**: Manages workflow volume data polling

```typescript
@Injectable({ providedIn: 'root' })
export class WorkflowVolumeService {
  - volumeData: Signal<VolumeData | null>
  - startPolling(intervalMs?): void
  - stopPolling(): void
  - refresh(): void
  - updateInterval(intervalMs): void
}
```

#### ToastService

**Responsibility**: Centralized notification management

```typescript
@Injectable({ providedIn: 'root' })
export class ToastService {
  - show(message, type, duration): void
  - success(message, duration?): void
  - error(message, duration?): void
  - warning(message, duration?): void
  - info(message, duration?): void
  - remove(id): void
  - clear(): void
}
```

#### ThemeService

**Responsibility**: Manages dark/light theme switching

```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  - isDarkMode: Signal<boolean>
  - toggleTheme(): void
  - setTheme(isDark): void
}
```

**Features:**

- localStorage persistence
- CSS variable updates
- Document body class management

---

## 3. Domain Layer (Models & Ports)

### Purpose

Contains business entities, domain logic, and interface definitions (ports).

### Domain Models

#### WorkflowEvent

```typescript
interface WorkflowEvent {
  id: string;
  workflowId: string;
  workflowName: string;
  timestamp: string;
  duration: number;
  category: EventStatus;
  severity?: AnomalySeverity;
  type: string;
}

type EventStatus = 'completed' | 'pending' | 'anomaly';
type AnomalySeverity = 'low' | 'medium' | 'critical';
```

#### WorkflowOverview

```typescript
interface WorkflowOverview {
  slaCompliance: number;
  averageCycleTime: number;
  activeAnomalies: number;
  totalWorkflows: number;
}
```

#### Toast

```typescript
interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  timestamp: Date;
}

type ToastType = 'success' | 'error' | 'warning' | 'info';
```

### Ports (Interfaces)

#### ApiPort

```typescript
interface ApiPort {
  get<T>(endpoint: string): Observable<T>;
  post<T>(endpoint: string, body: any): Observable<T>;
}
```

#### EventStreamPort

```typescript
interface EventStreamPort {
  connect(url: string): Observable<WorkflowEvent>;
  disconnect(): void;
}
```

#### StatePort

```typescript
interface StatePort<T> {
  get(): Signal<T>;
  set(value: T): void;
  update(fn: (current: T) => T): void;
}
```

---

## 4. Infrastructure Layer (Adapters)

### Purpose

Implements technical details and external integrations (databases, APIs, external services).

### Key Adapters

#### ApiService (Implements ApiPort)

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService implements ApiPort {
  - get<T>(endpoint): Observable<T>
  - post<T>(endpoint, body): Observable<T>
}
```

**Responsibilities:**

- HTTP communication
- Error handling
- Request/response transformation
- Base URL configuration

#### SseEventStreamAdapter (Implements EventStreamPort)

```typescript
@Injectable({ providedIn: 'root' })
export class SseEventStreamAdapter implements EventStreamPort {
  - connect(url): Observable<WorkflowEvent>
  - disconnect(): void
}
```

**Features:**

- EventSource management
- Auto-reconnection
- Error handling
- Event parsing
- Observable stream conversion

#### EventsStateService (Implements StatePort)

```typescript
@Injectable({ providedIn: 'root' })
export class EventsStateService {
  - events: Signal<WorkflowEvent[]>
  - addEvent(event): void
  - clearEvents(): void
  - getEvents(): Signal<WorkflowEvent[]>
}
```

**Responsibilities:**

- Centralized event state
- Signal-based reactivity
- State mutations
- Event collection management

---

## Data Flow Patterns

### 1. Real-time Event Stream (SSE)

```
Backend SSE Endpoint
        ↓
SseEventStreamAdapter (Infrastructure)
        ↓
EventsService (Application)
        ↓
   ┌────┴────┐
   ↓         ↓
EventsStateService    ToastService
   ↓                      ↓
EventTimelineComponent   ToastContainerComponent
```

### 2. Polling Data Flow

```
Backend REST API
        ↓
ApiService (Infrastructure)
        ↓
PollingService (Application)
        ↓
   ┌────┴────┬────────────┐
   ↓         ↓            ↓
WorkflowMetrics  Anomaly  Volume
Service          Service  Service
   ↓            ↓         ↓
Components   Components  Components
```

### 3. User Interaction Flow

```
User Action (Component)
        ↓
Event Emission (@Output)
        ↓
Parent Component Handler
        ↓
Application Service Method
        ↓
Infrastructure Adapter
        ↓
Backend API / State Update
        ↓
Signal Update
        ↓
Component Re-render (OnPush)
```

---

## State Management Strategy

### Angular Signals

**Why Signals?**

- Fine-grained reactivity
- Automatic dependency tracking
- Better performance than Zone.js
- Type-safe
- Explicit updates

### Signal Patterns

#### Computed Signals

```typescript
readonly filteredEvents = computed(() => {
  const events = this.eventsState.events();
  const filter = this.activeFilter();
  return events.filter(e => e.category === filter);
});
```

#### Signal Effects

```typescript
constructor() {
  effect(() => {
    const events = this.eventsState.events();
    this.updateChart(events);
  });
}
```

#### Writable Signals

```typescript
readonly isPaused = signal<boolean>(false);

togglePause(): void {
  this.isPaused.update(current => !current);
}
```

---

## Communication Patterns

### 1. Parent → Child Communication

**Using Inputs:**

```typescript
@Component({...})
export class ChildComponent {
  @Input() data: Data;
}

// Parent template
<app-child [data]="parentData"></app-child>
```

### 2. Child → Parent Communication

**Using Outputs:**

```typescript
@Component({...})
export class ChildComponent {
  readonly dataChange = output<Data>();

  emitChange(data: Data): void {
    this.dataChange.emit(data);
  }
}

// Parent template
<app-child (dataChange)="onDataChange($event)"></app-child>
```

### 3. Service-Based Communication

**Shared Service:**

```typescript
@Injectable({ providedIn: 'root' })
export class SharedService {
  private dataSubject = new BehaviorSubject<Data>(null);
  data$ = this.dataSubject.asObservable();

  updateData(data: Data): void {
    this.dataSubject.next(data);
  }
}
```

---

## Dependency Injection

### Service Injection Patterns

#### Constructor Injection (Traditional)

```typescript
export class Component {
  constructor(private service: Service) {}
}
```

#### Inject Function (Modern)

```typescript
export class Component {
  private readonly service = inject(Service);
}
```

**Benefits of inject():**

- Works outside constructors
- More flexible
- Better for functional composition
- Cleaner for multiple dependencies

---

## Performance Optimizations

### 1. OnPush Change Detection

- Only checks when inputs change or events fire
- Manual change detection with signals
- Reduces unnecessary renders

### 2. Signal-Based Reactivity

- Bypasses Zone.js overhead
- Fine-grained updates
- Automatic dependency tracking

### 3. Lazy Loading (Potential)

```typescript
const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
];
```

### 4. Caching Strategies

- HTTP interceptors for caching
- Service-level data caching
- localStorage for persistent data

### 5. Bundle Optimization

- Tree-shaking
- Code splitting
- Lazy loading
- Build optimization flags

---

## Error Handling Strategy

### HTTP Errors

```typescript
this.apiService.get<Data>(endpoint).pipe(
  catchError((error) => {
    this.toastService.error('Failed to load data');
    return of(null);
  }),
);
```

### SSE Connection Errors

```typescript
this.eventStream.connect(url).subscribe({
  error: (error) => {
    console.error('SSE error:', error);
    this.toastService.error('Connection lost');
    // Auto-reconnect logic
  },
});
```

### Global Error Handler

```typescript
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error): void {
    // Log to monitoring service
    // Show user-friendly message
    // Track error metrics
  }
}
```

---

## Testing Strategy

### Unit Testing

- **Services**: Mock dependencies, test business logic
- **Components**: Shallow rendering, test interactions
- **Pipes**: Pure function testing
- **Utilities**: Isolated function testing

### Integration Testing

- Test service + adapter integration
- Test component + service integration
- Mock HTTP responses

### E2E Testing

- User flow testing
- Critical path coverage
- Cross-browser testing

---

## Security Considerations

### 1. Content Security Policy (CSP)

- Implemented via Nginx headers
- Restricts script sources
- Prevents XSS attacks

### 2. XSS Protection

- Angular sanitization
- Safe HTML pipe for trusted content
- Input validation

### 3. CORS Configuration

- Backend CORS headers
- Credential handling
- Origin validation

### 4. Environment Variables

- Sensitive data in environment files
- Not committed to version control
- Build-time injection

---

## Build & Deployment

### Development Build

```bash
ng serve
# - Fast rebuild
# - Source maps
# - No optimization
```

### Production Build

```bash
ng build
# - Tree shaking
# - Minification
# - AOT compilation
# - Bundle optimization
```

### Docker Build Process

```
1. npm ci (install dependencies)
2. ng build (production build)
3. Copy dist to Nginx
4. Serve with Nginx
```

---

## Scalability Considerations

### Horizontal Scaling

- Stateless architecture
- Can run multiple instances
- Load balancer friendly

### Vertical Scaling

- OnPush change detection
- Lazy loading
- Virtual scrolling for large lists

### Code Organization

- Feature-based folder structure
- Shared utilities
- Reusable components
- Service abstraction

---

## Future Enhancements

### Potential Improvements

1. **State Management Library** - NgRx/Akita for complex state
2. **Advanced Caching** - Service Worker for offline support
3. **Real-time Collaboration** - WebSocket for multi-user features
4. **Advanced Analytics** - User behavior tracking
5. **Accessibility** - WCAG 2.1 AA compliance
6. **Internationalization** - Multi-language support
7. **Progressive Web App** - Installable application
8. **Advanced Error Tracking** - Sentry/LogRocket integration

---

## Architecture Benefits

### Clean Architecture Advantages

✅ **Separation of Concerns** - Each layer has clear responsibility  
✅ **Testability** - Easy to mock dependencies  
✅ **Maintainability** - Changes isolated to specific layers  
✅ **Scalability** - Easy to add features without breaking existing code  
✅ **Flexibility** - Can swap implementations without affecting business logic

### DDD Advantages

✅ **Business-Focused** - Code reflects domain concepts  
✅ **Ubiquitous Language** - Same terminology across team  
✅ **Bounded Contexts** - Clear boundaries between features  
✅ **Domain Models** - Rich, behavior-focused entities

---

## Conclusion

This architecture provides a solid foundation for building scalable, maintainable, and testable Angular applications. The combination of Clean Architecture, DDD principles, and Angular's modern features (signals, standalone components) creates a robust and efficient system.

**Key Takeaways:**

- Clear separation between presentation, business, and infrastructure layers
- Signal-based reactivity for performance
- Domain-driven design for business alignment
- Testable and maintainable codebase
- Ready for future enhancements
