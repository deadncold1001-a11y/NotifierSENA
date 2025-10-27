# Design Guidelines: Forum Monitoring Dashboard

## Design Approach

**Selected Framework:** Material Design 3 principles with inspiration from modern monitoring dashboards (Vercel, Railway, Linear)

**Core Philosophy:** Clean, data-focused interface that prioritizes information hierarchy and real-time status visibility. The design should feel professional and reliable - reinforcing the system's self-healing capabilities.

**Key Design Principles:**
- Status-first visibility: Critical system health should be immediately apparent
- Scannable information: Dense data presented in digestible chunks
- Purposeful whitespace: Breathing room around critical status indicators
- Subtle depth: Card-based layouts to organize functional groups

---

## Typography System

**Font Stack:**
- Primary: Inter (via Google Fonts CDN) - for UI elements, labels, body text
- Monospace: JetBrains Mono - for technical data (URLs, tokens, timestamps)

**Hierarchy:**
- **Display (Dashboard Title):** 3xl font size, bold weight - used once per page for main heading
- **Section Headers:** xl font size, semibold weight - configuration sections, status panels
- **Subsection Labels:** base font size, medium weight, uppercase tracking - form field labels, metric categories
- **Body Text:** base font size, regular weight - descriptions, helper text
- **Data Values:** lg font size, medium weight - status indicators, timestamps, counts
- **Technical Text:** sm font size, monospace - API tokens, URLs, error messages
- **Micro Labels:** xs font size, medium weight, uppercase - badges, timestamps

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **2, 4, 6, 8, 12, 16** (e.g., p-4, gap-8, mb-12)

**Container Structure:**
- Maximum width: max-w-7xl centered on large screens
- Page padding: px-6 on mobile, px-8 on desktop
- Vertical rhythm: py-8 between major sections

**Grid Patterns:**
- **Dashboard Overview:** 2-column grid (lg:grid-cols-2) - status cards side-by-side on desktop, stacked on mobile
- **Configuration Forms:** Single column, max-w-2xl - focused data entry
- **Notification History:** Single column list with dividers
- **Status Metrics:** 3-column grid (md:grid-cols-3) for key metrics row

---

## Component Library

### Navigation Header
- Fixed top bar with project title/logo on left
- Status indicator pill on right (green dot + "Active" or red dot + "Inactive")
- Height: h-16, shadow below for subtle depth
- Sticky positioning for persistent access

### Status Dashboard Cards
**Primary Status Card (Hero):**
- Large card spanning full width or prominent placement
- Contains: Large status icon (running/stopped), current state text, uptime counter, last check timestamp
- Prominent "Manual Check Now" action button
- Visual hierarchy: Icon (8x8), Status text (2xl semibold), Metrics (base regular)
- Card padding: p-8, rounded-xl

**Secondary Metrics Cards (Grid):**
- Three cards in row: "Last Successful Check" | "Total Notifications Sent" | "Service Uptime"
- Each contains: Icon, Label (xs uppercase), Value (2xl bold), Subtext (xs muted)
- Card padding: p-6, rounded-lg
- Consistent height for alignment

### Configuration Panel
- Sectioned card with clear visual separation
- **Telegram Configuration Section:**
  - Two input fields: Bot Token (with show/hide toggle), Chat ID
  - Helper text below each field explaining purpose
- **Forum Monitoring Section:**
  - URL input field (full width)
  - Polling interval dropdown (30 min default)
- **Actions Section:**
  - Primary button: "Save Configuration"
  - Secondary button: "Test Telegram Connection"
- Form spacing: gap-6 between fields, gap-4 between label and input

### Notification History List
- Reverse chronological list in card container
- Each item contains:
  - Timestamp (monospace, sm) aligned right
  - Message content with icon prefix based on type
  - Divider between items (subtle, not full width)
- Maximum height with scroll: max-h-96 overflow-y-auto
- Empty state: Centered icon + "No notifications yet" text

### Service Control Panel
- Horizontal button group with clear visual hierarchy
- **Start Service:** Primary style, green accent
- **Stop Service:** Secondary style, red accent
- **Restart Service:** Secondary style, amber accent
- **Force Check:** Tertiary style
- Button spacing: gap-3, responsive stack on mobile

### Status Indicators & Badges
- **Running State:** Pill badge with green dot, "Running" text
- **Stopped State:** Pill badge with red dot, "Stopped" text
- **Last Check:** Small badge with clock icon + relative time ("2 min ago")
- Badge design: px-3 py-1, rounded-full, inline-flex items-center, gap-2

### Input Fields
- Label above input (mb-2)
- Input padding: px-4 py-3
- Border radius: rounded-lg
- Monospace font for technical inputs (tokens, URLs)
- Show/hide toggle icon for sensitive fields (positioned absolute right)
- Focus state: ring offset for clear interaction feedback

### Buttons
**Primary Action:**
- px-6 py-3, rounded-lg, font-medium
- Used for: Save Configuration, Start Service

**Secondary Action:**
- px-4 py-2, rounded-lg, font-medium, border
- Used for: Test Connection, Stop Service

**Icon Buttons:**
- Square (h-10 w-10), rounded-lg
- Used for: Refresh, Settings toggle

### Alert/Toast Notifications
- Fixed position: top-right corner
- Slide-in animation from right
- Contains: Icon, Message text, Dismiss button
- Auto-dismiss after 5 seconds
- Types: Success (check icon), Error (X icon), Info (i icon)
- Padding: p-4, rounded-lg, shadow-lg

---

## Page Structure

**Main Dashboard View:**
1. Header with navigation (h-16)
2. Hero status card (full width, mb-8)
3. Metrics grid (3 columns, mb-12)
4. Two-column layout:
   - Left: Configuration panel
   - Right: Notification history
5. Service control panel at bottom (mb-8)

**Responsive Behavior:**
- Desktop (lg+): Two-column layout for config/history
- Tablet (md): Stack config above history
- Mobile: All single column, reduced padding

---

## Animations

**Minimal, Purposeful Only:**
- Status indicator pulse: Subtle breathing animation on active status dot (2s interval)
- Data refresh: Brief fade transition when metrics update (200ms)
- Toast notifications: Slide-in from right (300ms ease-out)
- NO scroll animations, parallax, or decorative motion

---

## Icons

**Icon Library:** Heroicons (via CDN)

**Icon Usage:**
- Status indicators: CheckCircle (success), XCircle (error), Clock (pending)
- Actions: Play, Stop, ArrowPath (restart), RefreshCw
- Configuration: Cog, Key, Link
- Navigation: Bell, ChartBar, Settings
- Size: Most icons h-5 w-5, hero section icons h-8 w-8

---

## Images

**Hero Section:** No large hero image needed - this is a utility dashboard, not a marketing page. Focus remains on functional status display.

**Decorative Elements:**
- Abstract circuit pattern or grid overlay (subtle, 5% opacity) as page background
- Telegram logo icon (small, 24x24) next to Telegram configuration section header