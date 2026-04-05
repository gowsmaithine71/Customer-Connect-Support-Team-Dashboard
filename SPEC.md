# Support Team Dashboard - Emotion-Aware AI System

## Project Overview

**Project Name:** Emotion-Aware AI Support Team Dashboard  
**Project Type:** Enterprise Web Application (React SPA)  
**Core Functionality:** Operational dashboard for support teams to manage tickets with AI-calculated priority scores, SLA monitoring, and workflow execution  
**Target Users:** Support Agents, Team Leads, SLA Managers, Escalation Officers

---

## UI/UX Specification

### Layout Structure

**Overall Layout:**
- Fixed sidebar navigation (280px width)
- Main content area with scrollable content
- Top header bar with user info and role badge

**Page Sections:**
- Sidebar: Fixed left navigation with icons and labels
- Header: 64px height with breadcrumbs and user controls
- Content: Flexible grid-based layouts

**Responsive Breakpoints:**
- Desktop: 1280px+ (full sidebar)
- Tablet: 768px-1279px (collapsed sidebar icons only)
- Mobile: <768px (hamburger menu, hidden sidebar)

### Visual Design

**Color Palette:**
- Primary Background: #0F172A (Slate 900)
- Secondary Background: #1E293B (Slate 800)
- Card Background: #334155 (Slate 700)
- Primary Accent: #6366F1 (Indigo 500)
- Secondary Accent: #8B5CF6 (Violet 500)
- Success: #10B981 (Emerald 500)
- Warning: #F59E0B (Amber 500)
- Danger: #EF4444 (Red 500)
- Text Primary: #F8FAFC (Slate 50)
- Text Secondary: #94A3B8 (Slate 400)
- Border: #475569 (Slate 600)

**Typography:**
- Font Family: "JetBrains Mono" for data, "DM Sans" for UI
- Headings: DM Sans, 600 weight
  - H1: 32px
  - H2: 24px
  - H3: 18px
- Body: DM Sans, 400 weight, 14px
- Data/Tables: JetBrains Mono, 400 weight, 13px

**Spacing System:**
- Base unit: 4px
- Component padding: 16px (4 units)
- Card margins: 24px (6 units)
- Section gaps: 32px (8 units)

**Visual Effects:**
- Card shadows: 0 4px 6px -1px rgba(0, 0, 0, 0.3)
- Hover transitions: 200ms ease-out
- Page transitions: Framer Motion (fade + slide)
- Glassmorphism on modals: backdrop-blur-md
- Gradient accents on stat cards

### Components

**Sidebar Navigation:**
- Logo at top
- Nav items with icons and labels
- Active state: Indigo background highlight
- Hover: Subtle background change
- Role badge at bottom

**Stat Cards (Overview):**
- Icon with gradient background
- Large number display
- Label and trend indicator
- Animated count-up on load

**Ticket Table:**
- Sticky header
- Row hover highlight
- Sortable columns
- Status badges (colored pills)
- Action buttons on hover

**Priority Breakdown Panel:**
- Formula display
- Progress bars for each factor
- Color-coded influence indicators
- Risk flags with icons

**Kanban Board:**
- Columns with headers
- Drag-and-drop cards
- Workload indicators
- Quick actions menu

**SLA Monitor:**
- Countdown timers
- Alert banners (red for at-risk)
- Escalation buttons
- Time-based color coding

**Charts (Analytics):**
- Recharts library
- Dark theme with Indigo/Emerald colors
- Tooltips on hover
- Legend positioning

---

## Functionality Specification

### Core Features

**1. Overview Dashboard**
- Display total active tickets count
- Show80 high priority tickets (> score)
- SLA risk count (tickets approaching breach)
- Average resolution time
- Escalated tickets count
- Agent workload distribution (bar chart)
- Recent escalations panel

**2. Incoming Tickets Page**
- Table with all tickets
- Columns: ID, Customer, Emotion, Emotion Weight, Waiting Time Score, Business Priority, Predicted TTR, Final AI Priority, SLA Status, Assigned Agent, Status, Actions
- Sort by any column
- Filter by emotion type
- Filter by SLA risk level
- Highlight high-risk rows in red
- Badge indicators for priority levels

**3. AI Priority Engine View**
- Detailed breakdown panel when clicking a ticket
- Formula display:
  
```
  Final Priority = (Emotion Weight × α) + (Waiting Time Score × β) + (Business Priority × γ)
  
```
- Progress bars showing influence of each factor
- Predicted TTR display
- SLA limit comparison
- Risk flag indicators

**4. Assignment Board (Kanban)**
- Columns: Unassigned, Assigned, In Progress, Escalated, Resolved
- Drag and drop tickets between columns
- Auto-assignment logic based on:
  - Agent workload
  - Skill category
  - Priority level
- Manual override option

**5. SLA Monitor Page**
- List of tickets where Predicted TTR > SLA Limit
- Red alert banner
- Countdown timer
- Escalation options
- Reassign option
- Increase priority weight option

**6. Execution Workflow**
- Ticket detail panel with:
  - Emotion analysis
  - Customer history
  - Internal notes section
  - Communication templates
  - Status update buttons
- Resolution form:
  - Resolution summary
  - Root cause category
  - Resolution time
  - Satisfaction rating

**7. Priority Override System**
- Adjust α, β, γ weights (for leads/managers)
- Lock business priority
- Force escalate ticket
- Freeze priority
- Audit log of changes

**8. Performance Analytics Page**
- Emotion Distribution (pie chart)
- SLA Breach Trend (line chart)
- Agent Resolution Time (bar chart)
- Priority Distribution (bar chart)
- Satisfaction Score Trend (area chart)
- Top performing agents leaderboard

**9. Smart Execution Features**
- Auto-escalation logic (every 5 minutes check)
- Agent workload balancer
- Intelligent suggestions based on emotion
- SLA countdown timers (real-time)

### User Interactions

**Authentication Flow:**
- Login page with role selection
- Demo accounts for each role
- Session storage for auth state

**Ticket Interactions:**
- Click to view details
- Drag to reassign
- Double-click to edit priority
- Right-click context menu

**Navigation:**
- Sidebar click navigation
- Breadcrumb navigation
- Keyboard shortcuts (optional)

### Data Handling

- In-memory data store (no database)
- Mock data generation on load
- State management with React Context
- Local storage for preferences

### Edge Cases

- Empty states for no tickets
- Loading states for data fetch
- Error boundaries for component failures
- Offline indicator (demo mode)
- Session timeout handling

---

## Acceptance Criteria

### Visual Checkpoints

1. ✅ Dark professional UI with Navy/Indigo theme loads correctly
2. ✅ Sidebar navigation is functional with all 8 menu items
3. ✅ Stat cards animate on load with count-up effect
4. ✅ Ticket table displays with all specified columns
5. ✅ Priority breakdown shows formula and progress bars
6. ✅ Kanban board has 5 columns with drag-drop
7. ✅ SLA monitor shows countdown timers
8. ✅ Charts render with proper dark theme
9. ✅ Role badges display correctly
10. ✅ Responsive design works on tablet sizes

### Functional Checkpoints

1. ✅ Navigation between all pages works
2. ✅ Tickets can be sorted by priority
3. ✅ Filters work for emotion and SLA risk
4. ✅ Priority override controls are accessible
5. ✅ Auto-escalation simulation works
6. ✅ Agent workload bars update
7. ✅ Resolution workflow completes
8. ✅ Analytics charts display data
9. ✅ Role-based access restricts features appropriately

---

## Folder Structure

```
src/
├── components/
│   ├── TicketTable.jsx
│   ├── PriorityBreakdown.jsx
│   ├── KanbanBoard.jsx
│   ├── SLAMonitor.jsx
│   ├── AgentStats.jsx
│   ├── StatCard.jsx
│   ├── CountdownTimer.jsx
│   └── ResolutionForm.jsx
├── pages/
│   ├── Overview.jsx
│   ├── IncomingTickets.jsx
│   ├── PriorityEngine.jsx
│   ├── AssignmentBoard.jsx
│   ├── SLAMonitorPage.jsx
│   ├── Analytics.jsx
│   ├── Login.jsx
│   └── Settings.jsx
├── layout/
│   ├── SupportSidebar.jsx
│   └── DashboardLayout.jsx
├── context/
│   └── AuthContext.jsx
├── data/
│   └── mockData.js
├── utils/
│   └── priorityCalculator.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## Demo Execution Flow

1. User logs in as Agent
2. Dashboard shows overview metrics
3. Navigate to Incoming Tickets
4. Click ticket to see AI Priority breakdown
5. Navigate to Assignment Board
6. Drag ticket to "In Progress"
7. Navigate to SLA Monitor
8. See countdown timers
9. Execute resolution workflow
10. View Analytics for performance metrics
