# AI Context - Single Source of Truth

> **⚠️ IMPORTANT**: This is the SINGLE SOURCE OF TRUTH for all AI assistants working on this project. All AI instruction files (CLAUDE.md, GEMINI.md, .cursorrules) should reference this file.

**Last Updated**: 2025-01-XX  
**Version**: 2.0.0

---

## 🎯 Project Overview

**ShipNative** is a production-ready React Native (Expo) boilerplate optimized for AI-assisted development ("Vibecoding"). It includes authentication, payments, analytics, and a complete UI component system.

### Repository Structure

```
PROJECT_shipnativeapp/
├── shipnativeapp/              # Main boilerplate repository
│   ├── apps/
│   │   ├── app/                # React Native application (Expo) - FULL web support
│   │   │   ├── app/            # Screens, components, navigation
│   │   │   ├── vibe/           # AI context files (detailed)
│   │   │   └── theme/          # Unistyles theme configuration
│   │   └── web/                # Marketing site (Vite/React, separate from RN app)
│   ├── vibe/                   # Project-wide AI context
│   ├── docs/                   # Feature documentation
│   └── mintlify_docs/          # User-facing documentation
│
├── landing_page/               # Marketing site (Next.js, separate repo - legacy)
└── mintlify_docs/              # Documentation site (Mintlify, separate repo)
```

**Note**: Each top-level directory is a separate git repository.

---

## 🎨 Technology Stack (CRITICAL - DO NOT DEVIATE)

### ✅ ALWAYS USE

#### Core Framework
- **React Native** (Expo SDK 54)
- **TypeScript** (strict mode, no `any` types)
- **Functional components only** (no class components)

#### Styling
- **React Native Unistyles 3.0** - THE ONLY styling solution
  - Use `StyleSheet.create((theme) => ({ ... }))` pattern
  - Always access theme values: `theme.colors.*`, `theme.spacing.*`, etc.
  - Support variants for component states
  - Single source of truth: `app/theme/unistyles.ts` (relative to `apps/app/`)
  - **Docs**: https://unistyl.es

#### Navigation
- **React Navigation** - THE ONLY navigation solution
  - Type-safe navigation with `navigationTypes.ts`
  - Use `navigation.navigate()`, `navigation.goBack()`, etc.

#### State Management
- **Zustand** - For global state (auth, subscriptions, preferences)
- **React Query** - For server state (API calls, data fetching, caching)
- **React Hook Form + Zod** - For forms and validation

#### Backend Services
- **Supabase** - Authentication & database
- **RevenueCat** - Subscriptions (iOS, Android, Web)
- **PostHog** - Analytics & feature flags
- **Sentry** - Error tracking

### ❌ NEVER USE

- ❌ **NativeWind/Tailwind** - Removed, use Unistyles 3.0
- ❌ **Expo Router** - Use React Navigation instead
- ❌ **Redux/MobX/Context API** - Use Zustand for global state
- ❌ **Inline styles** - Use StyleSheet.create with theme
- ❌ **useEffect for data fetching** - Use React Query
- ❌ **Class components** - Functional only
- ❌ **Any types** - TypeScript strict mode

---

## 📱 Platform Support

- ✅ **iOS** - Fully supported
- ✅ **Android** - Fully supported
- ✅ **Web** - Fully supported via Expo Web

### Web Support Details

**React Native App (`apps/app`)**:
- ✅ Full web support via Expo Web and `react-native-web`
- ✅ Run: `cd apps/app && yarn web` or `yarn app:web` (from root)
- ✅ Build: `cd apps/app && yarn bundle:web` or `yarn app:web:build` (from root)
- ✅ All features work on web (auth, payments via RevenueCat Web, analytics, etc.)
- ✅ Unistyles 3.0 fully supports web
- ✅ Responsive design with web-specific optimizations

**Marketing Page (`apps/web`)**:
- Separate Vite/React app (not React Native)
- Run: `yarn web:dev` or `yarn marketing:dev` (from root)
- Build: `yarn web:build` or `yarn marketing:build` (from root)
- Uses Tailwind CSS (not Unistyles)

---

## 🎨 Styling Patterns (Unistyles 3.0)

### Basic Pattern

```typescript
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

const MyComponent = () => {
  const { theme } = useUnistyles()
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.sizes['2xl'],
    fontFamily: theme.typography.fonts.bold,
    color: theme.colors.foreground,
  },
}))
```

### Variants Pattern

```typescript
const styles = StyleSheet.create((theme) => ({
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    variants: {
      variant: {
        filled: { backgroundColor: theme.colors.primary },
        outlined: { borderWidth: 1, borderColor: theme.colors.border },
      },
      size: {
        sm: { height: 36 },
        md: { height: 44 },
        lg: { height: 56 },
      },
    },
  },
}))

// Usage
styles.useVariants({ variant: 'filled', size: 'md' })
```

### Theme Values Reference

```typescript
// Colors (semantic)
theme.colors.primary          // Primary action
theme.colors.background       // Main background
theme.colors.foreground       // Main text
theme.colors.card             // Card backgrounds
theme.colors.border           // Borders
theme.colors.error            // Error states

// Spacing (8px grid)
theme.spacing.xs              // 8px
theme.spacing.sm              // 12px
theme.spacing.md              // 16px
theme.spacing.lg              // 24px
theme.spacing.xl              // 32px

// Typography
theme.typography.fonts.regular
theme.typography.fonts.bold
theme.typography.sizes.base   // 16px
theme.typography.sizes['2xl'] // 24px

// Border Radius
theme.radius.sm               // 8px
theme.radius.md               // 12px
theme.radius.lg               // 16px
theme.radius.full             // 9999px

// Shadows
theme.shadows.sm
theme.shadows.md
theme.shadows.lg
```

**Complete theme**: `app/theme/unistyles.ts` (relative to `apps/app/`)

---

## 🏗️ Architecture Patterns

### Component Structure

```typescript
// 1. Imports (React → Third-party → Stores/Hooks → Components → Utils/Types)
// 2. Types/Interfaces
// 3. Component function
//    - Hooks (theme, stores, queries, state)
//    - Derived state
//    - Event handlers
//    - Effects
//    - Early returns
//    - Render
// 4. Styles (StyleSheet.create at bottom)
```

### State Management

```typescript
// Global state - Zustand
const user = useAuthStore((state) => state.user)
const signOut = useAuthStore((state) => state.signOut)

// Server state - React Query
const { data, isLoading, error } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
})
```

### Screen Templates

**Always use screen layout templates for consistency:**

```typescript
// Auth screens (Login, Register, etc.)
// Both patterns work - codebase uses direct import for clarity
import { AuthScreenLayout } from "@/components/layouts/AuthScreenLayout"
// Alternative: Also works via index.ts export
// import { AuthScreenLayout } from "@/components"

export const LoginScreen = () => (
  <AuthScreenLayout
    title="Welcome Back"
    subtitle="Sign in to continue"
    showCloseButton
    onClose={() => navigation.goBack()}
  >
    {/* Form content */}
  </AuthScreenLayout>
)

// Onboarding screens
// Both patterns work - codebase uses direct import for clarity
import { OnboardingScreenLayout } from "@/components/layouts/OnboardingScreenLayout"
// Alternative: Also works via index.ts export
// import { OnboardingScreenLayout } from "@/components"

export const OnboardingScreen = () => (
  <OnboardingScreenLayout
    currentStep={0}
    totalSteps={3}
    headerIcon="👋"
    title="Welcome!"
  >
    {/* Content */}
  </OnboardingScreenLayout>
)
```

---

## 🔄 Development Workflow

### Before Writing Code

1. **Read context files**:
   - `apps/app/vibe/CONTEXT.md` - App structure and features
   - `apps/app/vibe/TECH_STACK.md` - Technology decisions
   - `apps/app/vibe/STYLE_GUIDE.md` - Code patterns
   - `vibe/SERVICES.md` - Service architecture
   - `vibe/MOCK_SERVICES.md` - Mock mode guide

2. **Check existing code**:
   - Browse `app/components` or `@/components` for reusable UI
   - Look at `app/screens` or `@/screens` for screen patterns
   - Check `app/stores` or `@/stores` for state patterns

3. **Follow patterns**:
   - Use Unistyles with theme (never hardcode)
   - Use screen templates for auth/onboarding
   - Use Zustand for global state
   - Use React Query for data fetching

### Mock Mode

All services have mock implementations that activate automatically when API keys are missing:
- ✅ Supabase (auth, database, storage, realtime)
- ✅ RevenueCat (purchases, subscriptions)
- ✅ PostHog (analytics, feature flags)
- ✅ Sentry (error tracking)

**No API keys needed for development!**

---

## 📚 Key Files Reference

### Context Files (Read First)
- `apps/app/vibe/CONTEXT.md` - App features & architecture
- `apps/app/vibe/TECH_STACK.md` - Technology decisions
- `apps/app/vibe/STYLE_GUIDE.md` - Code patterns
- `apps/app/vibe/SCREEN_TEMPLATES.md` - Screen layout templates
- `vibe/SERVICES.md` - Service architecture
- `vibe/MOCK_SERVICES.md` - Mock mode guide

### Documentation
- `README.md` - Main overview
- `SUPABASE.md` - Auth & database guide
- `MONETIZATION.md` - Payments guide
- `ANALYTICS.md` - Analytics guide
- `DEPLOYMENT.md` - Deployment guide
- `TROUBLESHOOTING.md` - Common issues

---

## 🚨 Common Mistakes to Avoid

```typescript
// ❌ DON'T: Use NativeWind
<View className="flex-1 bg-white">

// ✅ DO: Use Unistyles with theme
const styles = StyleSheet.create((theme) => ({
  container: { flex: 1, backgroundColor: theme.colors.background }
}))

// ❌ DON'T: Hardcode values
padding: 16, color: '#000000'

// ✅ DO: Use theme values
padding: theme.spacing.md, color: theme.colors.foreground

// ❌ DON'T: Use Expo Router
import { useRouter } from 'expo-router'

// ✅ DO: Use React Navigation
import { useNavigation } from '@react-navigation/native'

// ❌ DON'T: Use useEffect for data fetching
useEffect(() => { fetch('/api/data') }, [])

// ✅ DO: Use React Query
const { data } = useQuery({ queryKey: ['data'], queryFn: fetchData })
```

---

## 🔄 Documentation Sync

When modifying features, update:
- `apps/app/vibe/CONTEXT.md` - Major app changes
- `vibe/SERVICES.md` - Service changes
- Relevant feature docs (`SUPABASE.md`, `MONETIZATION.md`, etc.)
- `mintlify_docs/docs/` - User-facing docs
- `apps/web/` - Marketing site (if showcasing)

---

## 📝 Version History

- **v2.0.0** (2025-01-XX): Consolidated from multiple AI instruction files
- **v1.0.0**: Initial version

---

## 🔗 Related Files

For detailed information, see:
- **Tech Stack Details**: `apps/app/vibe/TECH_STACK.md`
- **Style Guide**: `apps/app/vibe/STYLE_GUIDE.md`
- **App Context**: `apps/app/vibe/CONTEXT.md`
- **Services**: `vibe/SERVICES.md`
- **Mock Services**: `vibe/MOCK_SERVICES.md`

---

**This file is the single source of truth. All AI instruction files should reference this file and defer to it for any conflicts.**

