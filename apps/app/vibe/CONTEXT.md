# App Context

## What This Is
Production-ready React Native (Expo) starter kit with auth, subscriptions, analytics, and UI components. Optimized for AI-assisted development ("Vibecoding").

## Current Features

### Authentication (Supabase)
- Email/password + social (Google, Apple)
- Email verification, password reset
- Session management + profile sync

### Subscriptions (RevenueCat)
- Freemium model (Free/Pro tiers)
- In-app purchases (iOS/Android)
- Trial periods, restore purchases

### Analytics (PostHog)
- Event tracking, feature flags, A/B testing

### Widgets (iOS & Android)
- Native home screen widgets with Supabase integration
- Feature flag controlled (enable via EXPO_PUBLIC_ENABLE_WIDGETS=true)
- Easy styling with theme support
- Secure data fetching with session management

### UI/UX
- Unified design system via Unistyles 3.0
- Screen layout templates (`AuthScreenLayout`, `OnboardingScreenLayout`)
- Modern dashboard with stats and quick actions
- 3-step onboarding (Intro → Goal → Notifications)
- Component showcase for UI testing
- Dark mode (automatic)
- **Full multilingual support** (7 languages) with automatic detection

## Screens
- Onboarding (3 steps), Login, Register, Forgot Password
- Home/Dashboard, Profile, Settings
- Component Showcase (UI Kit)
- Paywall, Subscription Management

## Architecture
```
/app
  /app           # Screen files
  /components    # Reusable UI
    /layouts     # Screen layout templates
  /config        # Env, features, constants
  /hooks         # Custom hooks, React Query hooks
  /services      # Supabase, RevenueCat, PostHog, Sentry, Widgets
    /api         # API client with interceptors
  /stores        # Zustand stores
  /utils         # Helpers
  /theme         # Unistyles config
  /vibe          # AI context docs
  /widgets       # Native widget implementations
```

## User Flows

### New User
1. Onboarding → Register (email/social)
2. Home dashboard with quick actions
3. Explore components or upgrade to Pro

### Returning User
1. Login → Home screen with greeting
2. Continue using app

## Pro vs Free

**Free**: Basic functionality, limited usage
**Pro**: Unlimited usage, no ads, premium features, priority support

## AI Guidelines

1. **Check `/components`** to reuse existing UI
2. **Use screen layout templates** for auth/onboarding screens (see `SCREEN_TEMPLATES.md`)
3. **Follow patterns** from `STYLE_GUIDE.md`
4. **Use Zustand stores** for global state
5. **Use React Query** for API calls
6. **Support multilingual text** (see `STYLE_GUIDE.md` -> Internationalization)

### Adding a New Screens/Features
1. Determine state needs (Zustand vs local)
2. Create API hooks with React Query if needed
3. Build UI with existing components + screen templates
4. Add analytics tracking
5. Update this file

**For coding patterns, see `STYLE_GUIDE.md`.**
**For tech stack details, see `TECH_STACK.md`.**
