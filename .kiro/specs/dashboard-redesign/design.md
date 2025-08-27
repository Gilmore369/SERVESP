# Design Document

## Overview

El nuevo dashboard de ServesPlatform será una interfaz moderna y profesional que transformará la experiencia actual básica en una plataforma completa de gestión de construcción. El diseño se basa en el layout de referencia del Index.html, adaptándolo a React/Next.js con componentes reutilizables y datos dinámicos del backend.

## Architecture

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│                    Header (TopBar)                      │
├─────────────┬───────────────────────────────────────────┤
│             │                                           │
│   Sidebar   │            Main Content Area              │
│             │                                           │
│             │  ┌─────────────────────────────────────┐  │
│             │  │        KPI Cards (4x)               │  │
│             │  ├─────────────────────────────────────┤  │
│             │  │      Recent Projects Section        │  │
│             │  ├─────────────────────────────────────┤  │
│             │  │  Tasks │ Team │ Schedule (3 cols)   │  │
│             │  └─────────────────────────────────────┘  │
└─────────────┴───────────────────────────────────────────┘
```

### Component Hierarchy
- `DashboardLayout` (main container)
  - `Sidebar` (navigation menu)
  - `TopBar` (header with notifications)
  - `MainContent`
    - `KPICards` (metrics overview)
    - `RecentProjects` (project cards grid)
    - `BottomSection`
      - `PendingTasks` (task list)
      - `TeamAvailability` (staff status)
      - `Schedule` (calendar events)

## Components and Interfaces

### 1. Sidebar Component
**Purpose:** Navigation menu with user info and menu items
**Props:**
```typescript
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}
```
**Features:**
- Logo and branding
- User profile section with avatar
- Hierarchical navigation menu (Principal, Administración)
- Mobile responsive with overlay
- Active state highlighting

### 2. TopBar Component
**Purpose:** Header with page title, notifications, and user menu
**Props:**
```typescript
interface TopBarProps {
  title: string;
  onToggleSidebar: () => void;
  user: User;
  notifications: Notification[];
}
```
**Features:**
- Mobile hamburger menu
- Notification badges with counts
- User dropdown menu
- Responsive design

### 3. KPICards Component
**Purpose:** Display key metrics in card format
**Props:**
```typescript
interface KPICardsProps {
  metrics: {
    activeProjects: number;
    activePersonnel: number;
    pendingTasks: number;
    remainingBudget: number;
  };
}
```
**Features:**
- 4 metric cards with icons and colors
- Trend indicators (up/down arrows)
- Responsive grid layout
- Loading states

### 4. RecentProjects Component
**Purpose:** Display project cards with progress and team info
**Props:**
```typescript
interface RecentProjectsProps {
  projects: Project[];
  onViewDetails: (projectId: string) => void;
  onNewProject: () => void;
}
```
**Features:**
- Project cards with status badges
- Progress bars with percentages
- Team member avatars
- Hover animations
- "New Project" button### 5. 
PendingTasks Component
**Purpose:** List of tasks organized by priority
**Props:**
```typescript
interface PendingTasksProps {
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
  onAddTask: () => void;
}
```
**Features:**
- Priority color coding (blue=high, yellow=medium, green=low)
- Due date indicators
- Complete task functionality
- Add new task button

### 6. TeamAvailability Component
**Purpose:** Show staff status and availability
**Props:**
```typescript
interface TeamAvailabilityProps {
  teamMembers: TeamMember[];
  onViewAllPersonnel: () => void;
}
```
**Features:**
- Staff photos and roles
- Status indicators (available, busy, unavailable)
- Time-based availability info
- "View All Personnel" button

### 7. Schedule Component
**Purpose:** Calendar view with upcoming events
**Props:**
```typescript
interface ScheduleProps {
  events: CalendarEvent[];
  currentMonth: Date;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
}
```
**Features:**
- Monthly navigation
- Event icons by type
- Time and project information
- Responsive event list

## Data Models

### User Model
```typescript
interface User {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  avatar?: string;
}
```

### Project Model
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'En progreso' | 'Planificación' | 'Diseño' | 'Completado';
  progress: number;
  startDate: Date;
  endDate: Date;
  teamMembers: TeamMember[];
  statusColor: string;
}
```

### Task Model
```typescript
interface Task {
  id: string;
  title: string;
  project: string;
  priority: 'Alta' | 'Media' | 'Baja';
  dueDate: Date;
  status: 'Pendiente' | 'En progreso' | 'Completada';
  priorityColor: string;
}
```

### TeamMember Model
```typescript
interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'Disponible' | 'En reunión' | 'En obra' | 'No disponible';
  availableFrom?: string;
  statusColor: string;
}
```

### CalendarEvent Model
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  project: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'delivery' | 'inspection' | 'review';
  icon: string;
  iconColor: string;
}
```

## Error Handling

### Authentication Errors
- Redirect to login if JWT is invalid or expired
- Show loading states during authentication checks
- Handle network errors gracefully

### Data Loading Errors
- Show skeleton loaders while data is fetching
- Display error messages for failed API calls
- Implement retry mechanisms for critical data
- Fallback to cached data when possible

### User Interaction Errors
- Validate user inputs before API calls
- Show confirmation dialogs for destructive actions
- Provide clear feedback for successful operations
- Handle offline scenarios gracefully

## Testing Strategy

### Unit Testing
- Test individual components with Jest and React Testing Library
- Mock API calls and external dependencies
- Test component props and state management
- Verify responsive behavior with different screen sizes

### Integration Testing
- Test component interactions and data flow
- Verify navigation between dashboard sections
- Test authentication flow and protected routes
- Validate API integration with real backend calls

### Visual Testing
- Implement Storybook for component documentation
- Test responsive design across devices
- Verify color schemes and accessibility compliance
- Test animations and transitions

### Performance Testing
- Monitor component render times
- Test with large datasets (many projects, tasks, etc.)
- Verify memory usage and potential leaks
- Test loading states and perceived performance## 
Responsive Design Strategy

### Desktop (1024px+)
- Full sidebar visible
- 4-column KPI cards
- 3-column project grid
- 3-column bottom section (tasks, team, schedule)

### Tablet (768px - 1023px)
- Collapsible sidebar with overlay
- 2-column KPI cards
- 2-column project grid
- 2-column bottom section (tasks stacked, team + schedule)

### Mobile (< 768px)
- Hidden sidebar with hamburger menu
- Single column KPI cards
- Single column project grid
- Single column bottom section (stacked vertically)

## Styling Guidelines

### Color Palette
- Primary Blue: `#1e40af` (blue-800)
- Secondary Blue: `#3b82f6` (blue-600)
- Success Green: `#10b981` (emerald-500)
- Warning Yellow: `#f59e0b` (amber-500)
- Danger Red: `#ef4444` (red-500)
- Gray Scale: `#f3f4f6` (gray-100) to `#1f2937` (gray-800)

### Typography
- Headers: `font-bold` with appropriate text sizes
- Body text: `font-medium` or `font-normal`
- Small text: `text-sm` or `text-xs`
- Consistent line heights and spacing

### Spacing and Layout
- Use Tailwind's spacing scale (4, 6, 8, 12, 16, 24px)
- Consistent padding and margins
- Proper use of flexbox and grid
- Adequate white space for readability

### Interactive Elements
- Hover states for all clickable elements
- Smooth transitions (300ms ease)
- Focus states for accessibility
- Loading states for async operations

## Implementation Notes

### State Management
- Use React hooks for local component state
- Consider Context API for shared state (user, theme)
- Implement proper loading and error states
- Cache frequently accessed data

### Performance Optimizations
- Lazy load components when possible
- Implement virtual scrolling for large lists
- Optimize images and icons
- Use React.memo for expensive components

### Accessibility
- Proper ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance (WCAG 2.1)
- Screen reader compatibility

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers
- Progressive enhancement approach