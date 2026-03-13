# Sentra Dashboard - Real-Time Fraud Detection UI

> Modern, responsive web dashboard for real-time fraud detection and analytics

[![React](https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Latest-purple?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-blue?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Components](#components)
- [Development](#development)
- [Deployment](#deployment)

---

## Overview

Sentra Dashboard is a modern, real-time web application for monitoring and managing fraud detection operations. Built with React and Vite, it provides:

- **Real-time Dashboards**: Live fraud metrics and alerts
- **Admin Console**: System management and configuration
- **Client Portal**: Transaction monitoring and analytics
- **WebSocket Integration**: Live updates and notifications
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode Support**: Eye-friendly interface

### Key Capabilities
- Real-time fraud alerts via WebSocket
- Interactive analytics and reporting
- Multi-role access (Admin, Analyst, Client)
- Transaction history and search
- Fraud ring visualization
- Subscription management
- OTP-based authentication  

---

## Features

### Admin Dashboard
- **System Health**: Real-time system metrics
- **Daily Metrics**: Transaction volume, fraud rate, processing time
- **Fraud Analytics**: Risk distribution, top merchants, patterns
- **Client Management**: User accounts, subscriptions, activity
- **Revenue & Billing**: Subscription tiers, payment tracking
- **Real-time Monitoring**: Live transaction stream
- **System Settings**: Configuration management
- **Support Tickets**: Customer support management

### Client Portal
- **Dashboard**: Personal fraud metrics
- **Transactions**: View and filter transaction history
- **Analytics**: Fraud patterns specific to account
- **Alerts**: Real-time fraud notifications
- **Billing**: Subscription and payment information
- **Security**: Account settings and security options
- **Support**: Help and support tickets

### Authentication
- **OTP Login**: Email/SMS-based one-time passwords
- **JWT Tokens**: Secure session management
- **Role-Based Access**: Admin, Analyst, Client roles
- **Session Management**: Auto-logout on inactivity

### Real-Time Features
- **WebSocket Connection**: Live data streaming
- **Live Alerts Feed**: Real-time fraud notifications
- **Auto-refresh**: Automatic dashboard updates
- **Push Notifications**: Browser notifications for alerts

### UI/UX
- **Modern Design**: Clean, professional interface
- **Dark Mode**: Eye-friendly dark theme
- **Responsive Layout**: Mobile-first design
- **Accessibility**: WCAG 2.1 compliant
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

---

## Architecture

### Component Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                    App.jsx                              │
│              (Main Router & Layout)                     │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   ┌─────────┐  ┌─────────┐  ┌─────────┐
   │ Admin   │  │ Client  │  │ Public  │
   │ Layout  │  │ Layout  │  │ Pages   │
   └────┬────┘  └────┬────┘  └────┬────┘
        │            │            │
        │      ┌─────┴─────┐      │
        │      │           │      │
        ▼      ▼           ▼      ▼
    ┌──────────────────────────────────┐
    │      Shared Components           │
    │  • Navbar                        │
    │  • Footer                        │
    │  • Loading Spinner               │
    │  • Error Boundary                │
    └──────────────────────────────────┘
```

### Data Flow

```
┌──────────────────┐
│   User Action    │
│  (Click, Input)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────┐
│   React Component                │
│  • Update local state            │
│  • Validate input                │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│   API Call                       │
│  • Add JWT token to header       │
│  • Send request to backend       │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│   Backend Processing             │
│  • Validate JWT                  │
│  • Process request               │
│  • Return response               │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│   Update UI                      │
│  • Update component state        │
│  • Re-render with new data       │
│  • Show success/error message    │
└──────────────────────────────────┘
```

### WebSocket Connection Flow

```
┌─────────────────────────────────────────────────────────┐
│                  Client Browser                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ WebSocket Connect
                     │ ws://localhost:8000/ws
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              WebSocket Server                           │
│  (Node.js + Socket.io)                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Subscribe to channels
                     │ • fraud-alerts
                     │ • system-metrics
                     │ • live-transactions
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Kafka Stream                               │
│  (Real-time event processing)                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Emit events
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Client Browser                             │
│  • Receive real-time updates                           │
│  • Update dashboard                                    │
│  • Show notifications                                  │
└─────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
┌──────────────────┐
│   Login Page     │
│  (Email/Phone)   │
└────────┬─────────┘
         │
         │ Enter email/phone
         │
         ▼
┌──────────────────────────────────┐
│   OTP Service                    │
│  • Generate OTP                  │
│  • Send via Email/SMS            │
└────────┬─────────────────────────┘
         │
         │ OTP sent
         │
         ▼
┌──────────────────────────────────┐
│   OTP Verification Page          │
│  • Enter OTP code                │
│  • Validate OTP                  │
└────────┬─────────────────────────┘
         │
         │ OTP valid
         │
         ▼
┌──────────────────────────────────┐
│   JWT Token Generation           │
│  • Create JWT token              │
│  • Set expiration (1 hour)       │
│  • Return token to client        │
└────────┬─────────────────────────┘
         │
         │ Token received
         │
         ▼
┌──────────────────────────────────┐
│   Store Token                    │
│  • localStorage                  │
│  • sessionStorage                │
└────────┬─────────────────────────┘
         │
         │ Token stored
         │
         ▼
┌──────────────────────────────────┐
│   Redirect to Dashboard          │
│  • Load user data                │
│  • Initialize WebSocket          │
│  • Display dashboard             │
└──────────────────────────────────┘
```

---

## Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Backend API running (http://localhost:8000)
- Modern web browser

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/sentra.git
cd sentra/SentraFE
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your API URL
```

4. **Start development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open in browser**
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
SentraFE/
├── src/
│   ├── pages/                    # Page components
│   │   ├── AdminDashboard.jsx    # Admin main dashboard
│   │   ├── ClientDashboard.jsx   # Client main dashboard
│   │   ├── ClientTransactions.jsx # Transaction history
│   │   ├── ClientAnalytics.jsx   # Client analytics
│   │   ├── ClientBilling.jsx     # Billing & subscription
│   │   ├── ClientSecurity.jsx    # Security settings
│   │   ├── ClientSettings.jsx    # Account settings
│   │   ├── ClientSupport.jsx     # Support tickets
│   │   ├── ClientLogin.jsx       # Login page
│   │   ├── Hero.jsx              # Landing page hero
│   │   └── Features.jsx          # Features page
│   │
│   ├── components/               # Reusable components
│   │   ├── admin/                # Admin-specific components
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminDailyMetrics.jsx
│   │   │   ├── AdminFraudAnalytics.jsx
│   │   │   ├── AdminClientManagement.jsx
│   │   │   ├── AdminRealTimeMonitoring.jsx
│   │   │   ├── AdminRevenueBilling.jsx
│   │   │   ├── AdminSettings.jsx
│   │   │   ├── AdminSupport.jsx
│   │   │   ├── AdminSystemHealth.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   └── PasswordVerificationModal.jsx
│   │   │
│   │   ├── ui/                   # UI components
│   │   │   ├── button.jsx
│   │   │   ├── pricing-table.jsx
│   │   │   └── hover-footer.jsx
│   │   │
│   │   ├── ClientLayout.jsx      # Client layout wrapper
│   │   ├── Navbar.jsx            # Navigation bar
│   │   ├── Footer.jsx            # Footer
│   │   ├── Hero.jsx              # Hero section
│   │   ├── Features.jsx          # Features section
│   │   ├── HowItWorks.jsx        # How it works section
│   │   ├── Pricing.jsx           # Pricing section
│   │   ├── Contact.jsx           # Contact section
│   │   ├── FeedbackSummary.jsx   # Feedback display
│   │   ├── LiveAlertsFeed.jsx    # Real-time alerts
│   │   ├── FuturisticLoader.jsx  # Loading spinner
│   │   ├── AdminProtectedRoute.jsx # Route protection
│   │   └── Contact.jsx           # Contact form
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAdminAuth.js       # Admin authentication
│   │   └── useWebSocket.js       # WebSocket connection
│   │
│   ├── lib/                      # Utility functions
│   │   └── utils.js              # Helper functions
│   │
│   ├── App.jsx                   # Main app component
│   ├── index.css                 # Global styles
│   └── main.jsx                  # Entry point
│
├── public/                       # Static assets
│   ├── favicon.svg
│   └── logo.svg
│
├── .env.example                  # Environment template
├── package.json                  # Dependencies
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.js             # PostCSS configuration
└── README.md                     # This file
```

---

## Components

### Admin Components

#### AdminLayout
Main layout wrapper for admin pages with sidebar navigation.

```jsx
<AdminLayout>
  <AdminDashboard />
</AdminLayout>
```

#### AdminDailyMetrics
Displays daily transaction metrics and KPIs.

```jsx
<AdminDailyMetrics 
  transactions={1250}
  fraudDetected={45}
  avgProcessingTime={87}
/>
```

#### AdminFraudAnalytics
Shows fraud patterns and risk distribution.

```jsx
<AdminFraudAnalytics 
  riskDistribution={data}
  topMerchants={merchants}
/>
```

#### AdminRealTimeMonitoring
Live transaction stream with real-time updates.

```jsx
<AdminRealTimeMonitoring 
  transactions={liveTransactions}
/>
```

### Client Components

#### ClientLayout
Main layout wrapper for client pages.

```jsx
<ClientLayout>
  <ClientDashboard />
</ClientLayout>
```

#### LiveAlertsFeed
Real-time fraud alerts via WebSocket.

```jsx
<LiveAlertsFeed 
  alerts={fraudAlerts}
  onAlertClick={handleAlertClick}
/>
```

#### FeedbackSummary
Displays model feedback and improvement metrics.

```jsx
<FeedbackSummary 
  accuracy={0.95}
  feedback={feedbackData}
/>
```

### Shared Components

#### Navbar
Navigation bar with authentication status.

```jsx
<Navbar 
  isAuthenticated={true}
  userRole="admin"
  onLogout={handleLogout}
/>
```

#### FuturisticLoader
Animated loading spinner.

```jsx
<FuturisticLoader 
  message="Loading transactions..."
/>
```

---

## Development

### Code Style

We use Prettier for code formatting:

```bash
npm run format
```

### Linting

```bash
npm run lint
```

### Type Checking (if using TypeScript)

```bash
npm run type-check
```

### Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` with hot module replacement.

---

## Configuration

### Environment Variables

```bash
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000

# Feature Flags
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=true

# Analytics
VITE_ANALYTICS_ID=your-analytics-id
```

### Tailwind CSS

Customization in `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        danger: '#EF4444',
      },
    },
  },
}
```

---

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Docker Deployment

```bash
docker build -t sentra-dashboard:latest .
docker run -d \
  -p 3000:80 \
  -e VITE_API_URL=http://api.example.com \
  sentra-dashboard:latest
```

### Environment Configuration for Production

```bash
VITE_API_URL=https://api.sentra.io
VITE_WS_URL=wss://api.sentra.io
VITE_ENABLE_ANALYTICS=true
```

---

## Security

### JWT Token Management

Tokens are stored securely:
- Stored in `localStorage` for persistence
- Sent in `Authorization` header for API requests
- Automatically refreshed before expiration
- Cleared on logout

### CORS Configuration

Backend CORS settings allow requests from:
```
http://localhost:5173 (development)
https://dashboard.sentra.io (production)
```

### Content Security Policy

CSP headers prevent XSS attacks:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
```

---

## Performance

### Optimization Techniques

- **Code Splitting**: Lazy loading of routes
- **Image Optimization**: Compressed and responsive images
- **Bundle Analysis**: Monitor bundle size
- **Caching**: Service worker for offline support

### Lighthouse Scores

Target metrics:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

- **Documentation**: [Full Docs](./docs)
- **Issues**: [GitHub Issues](https://github.com/yourusername/sentra/issues)
- **Email**: support@sentra.io
- **Slack**: [Join Community](https://sentra-community.slack.com)

---

## Acknowledgments

- React team for the amazing framework
- Vite for lightning-fast development
- Tailwind CSS for utility-first styling
- Socket.io for real-time communication

---

**Made by the Sentra Team**

Last Updated: March 2024 | Version: 1.0.0
