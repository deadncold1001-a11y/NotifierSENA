# Forum Monitor - SENA Zajuna Notification System

## Overview
A self-healing web-based forum monitoring system that automatically checks SENA Zajuna forums for new posts and sends Telegram notifications. Built with React, Express, and Node.js with full auto-restart capabilities and health monitoring.

## Purpose
This application replaces the original Python monitoring scripts with a modern web dashboard that provides:
- Real-time monitoring of SENA Zajuna forum discussions
- Automatic Telegram notifications when new posts are detected
- Self-healing service with auto-restart watchdog
- Beautiful, professional dashboard UI for configuration and monitoring
- Complete service lifecycle management (start/stop/restart)

## Current State
**Status:** Production Ready ✅

**Implemented Features:**
- ✅ Web scraping service monitoring forum posts (cheerio)
- ✅ Telegram bot integration for notifications
- ✅ Background polling scheduler (node-cron)
- ✅ Auto-restart watchdog mechanism
- ✅ Health check system with Telegram status reports
- ✅ Configuration dashboard with form validation
- ✅ Service control panel (start/stop/restart)
- ✅ Real-time status indicators with live updates
- ✅ Notification history with different message types
- ✅ Manual forum check trigger
- ✅ Beautiful, responsive UI following Material Design 3 principles

## Recent Changes
**October 27, 2025 - v1.1**
- ✅ Added PostgreSQL database persistence - data now survives server restarts
- ✅ Migrated from in-memory storage to Drizzle ORM
- ✅ Configuration, status, and notification history now persisted in database

**October 27, 2025 - v1.0**
- ✅ Initial MVP implementation completed
- ✅ Fixed critical form persistence bug in ConfigurationPanel
- ✅ Added backend validation to prevent empty configuration saves
- ✅ Comprehensive e2e testing passed for all core features
- ✅ UI implements design guidelines with status-first visibility

## Project Architecture

### Frontend Stack
- **Framework:** React 18 with TypeScript
- **Routing:** Wouter
- **State Management:** TanStack Query v5 (polling: 5s status, 10s notifications)
- **UI Library:** Shadcn UI + Tailwind CSS
- **Forms:** React Hook Form + Zod validation
- **Date Utilities:** date-fns

### Backend Stack
- **Runtime:** Node.js 20 with TypeScript
- **Framework:** Express.js
- **Web Scraping:** Cheerio (HTML parsing) + Axios (HTTP)
- **Scheduling:** node-cron (background polling)
- **Telegram:** node-telegram-bot-api
- **Database:** PostgreSQL (Neon) with Drizzle ORM
- **Storage:** Persistent database storage - data survives server restarts

### Key Design Patterns
- **Schema-First Development:** Shared TypeScript types between frontend/backend
- **Horizontal Architecture:** Complete layers built together (all schemas → all components → all APIs)
- **Status-First UI:** Critical service health immediately visible in header and hero card
- **Real-time Updates:** Automatic polling for live status without manual refresh

## File Structure

### Core Application Files
```
shared/
  schema.ts           # Data models & validation schemas (MonitoringConfig, ServiceStatus, Notification)

server/
  routes.ts           # API endpoints (status, config, service control, health check)
  storage.ts          # In-memory storage implementation
  services/
    monitor.ts        # Service lifecycle & watchdog
    scraper.ts        # Forum scraping logic
    telegram.ts       # Telegram notification service

client/src/
  pages/
    Dashboard.tsx     # Main dashboard page
  components/
    Header.tsx        # App header with status badge
    HeroStatusCard.tsx      # Large status display
    MetricsGrid.tsx         # Three metric cards
    ConfigurationPanel.tsx  # Settings form
    NotificationHistory.tsx # Event log
    ServiceControlPanel.tsx # Start/stop buttons
```

### Configuration Files
- `design_guidelines.md` - UI/UX design system and component specifications
- `tailwind.config.ts` - Design tokens and theme
- `client/index.html` - SEO meta tags and title

## API Endpoints

### Status & Monitoring
- `GET /api/status` - Current service status (isRunning, uptime, last check, errors)
- `GET /api/notifications` - Recent notification history (limit 50, reverse chronological)

### Configuration
- `GET /api/config` - Current monitoring configuration
- `POST /api/config` - Update settings (validates & auto-restarts if running)

### Service Control
- `POST /api/service/start` - Start monitoring service
- `POST /api/service/stop` - Stop monitoring service
- `POST /api/service/restart` - Restart monitoring service

### Actions
- `POST /api/manual-check` - Trigger immediate forum check
- `POST /api/test-telegram` - Send test notification
- `POST /api/health-check` - Send health status to Telegram

## Environment Variables
**Required Secrets:**
- `TELEGRAM_BOT_TOKEN` - Bot authentication token from @BotFather
- `TELEGRAM_CHAT_ID` - Target chat/group ID for notifications
- `SESSION_SECRET` - Express session secret (auto-generated)

**System Variables:**
- `NODE_ENV` - Set to "development" by npm run dev

## How It Works

### Service Lifecycle
1. **Start Service:** Initializes cron job based on check interval, sends startup notification
2. **Background Polling:** Checks forum at configured intervals (5, 10, 15, 30, or 60 minutes)
3. **Post Detection:** Compares current first post with stored title, sends notification if changed
4. **Watchdog Monitoring:** Checks every 5 minutes if service is stalled, auto-restarts if needed
5. **Stop Service:** Cancels cron job, clears watchdog, sends shutdown notification

### Web Scraping Process
1. Fetches forum page HTML via axios (SSL verification disabled for zajuna.sena.edu.co)
2. Parses HTML with cheerio to find `tr.discussion` elements
3. Extracts text from first post
4. Compares with stored `lastPostTitle`
5. If different and non-empty, sends Telegram notification and updates stored title

### Notification Types
- **success** - Service started, test messages, successful operations
- **error** - Scraping failures, Telegram send failures, validation errors
- **info** - Service stopped, health checks, manual checks with no new posts
- **new_post** - New forum post detected

## User Preferences
- **Design System:** Material Design 3 with modern monitoring dashboard aesthetics (Vercel/Railway/Linear inspired)
- **Color Scheme:** Blue primary (#3B9EFF), green for active states, red for inactive/errors
- **Typography:** Inter for UI, JetBrains Mono for technical data
- **Status Visibility:** Always show service status in header badge with pulsing dot animation
- **Real-time Updates:** Auto-refresh status every 5 seconds, notifications every 10 seconds

## Known Limitations
1. **Single Instance:** Only one monitoring service can run at a time
2. **SSL Verification:** Disabled for zajuna.sena.edu.co due to certificate issues
3. **Single Monitor:** Currently supports monitoring one forum URL at a time

## Future Enhancements (Not in MVP)
- PostgreSQL database for persistent storage
- Support for monitoring multiple forum URLs simultaneously
- Email notifications as backup to Telegram
- Notification filters based on keywords/categories
- Detailed error logs with retry policies
- Custom check schedules (e.g., business hours only)
- User authentication for multi-user access

## Development Notes
- Use `npm run dev` to start both backend and frontend (workflow already configured)
- Frontend auto-refreshes on file changes (Vite HMR)
- Backend restarts automatically via tsx watch mode
- Form validation prevents empty configuration saves (fixed in v1.0)
- ConfigurationPanel properly resets form when backend data loads (fixed Oct 27)

## Testing
**Last Tested:** October 27, 2025
**Test Coverage:** Full e2e testing completed
- ✅ Initial UI load and default state
- ✅ Configuration form pre-population from environment
- ✅ Telegram test message
- ✅ Service start/stop/restart lifecycle
- ✅ Manual forum check
- ✅ Health check reporting
- ✅ Notification history updates
- ✅ Real-time status badge updates
- ✅ Responsive layout and visual design

## Support & Troubleshooting
- If Telegram messages don't send, verify bot token and chat ID in configuration
- If service appears stalled, watchdog should auto-restart within 5 minutes
- Manual restart always available via Service Control Panel
- Check notification history for detailed error messages
- All backend errors logged to console during development
