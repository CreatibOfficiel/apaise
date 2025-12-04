# ShipNative Project - Gemini Instructions

> **⚠️ IMPORTANT**: This file references `AI_CONTEXT.md` (in this same directory) as the **single source of truth** for all technology decisions, patterns, and guidelines. When in doubt, refer to `AI_CONTEXT.md` first.

## 🏗️ Project Overview

This is **ShipNative**, a monorepo containing three interconnected git repositories that work together to provide a complete React Native starter kit with documentation and marketing.

### Repository Structure

```
PROJECT_shipnativeapp/
│
├── shipnativeapp/              # Main boilerplate repository
│   ├── apps/app/               # React Native application (Expo)
│   ├── vibe/                   # AI context files for vibecoding
│   ├── *.md                    # Feature documentation
│   └── AI_CONTEXT.md           # ⭐ SINGLE SOURCE OF TRUTH
│
├── mintlify_docs/              # Documentation site repository
│   └── docs/                   # Mintlify documentation files (.mdx)
│
└── landing_page/               # Landing page repository
    └── src/                    # Next.js landing page
```

**Each directory is a separate git repository** - changes must be committed separately.

## 🎯 Project Philosophy: "Vibecoding"

**"Vibecoding"** = Build production-ready apps by describing what you want to AI, not by manually wiring boilerplate.

This project is optimized for AI-assisted development:
- Comprehensive context files (`vibe/` folder)
- Clear patterns and conventions
- Extensive documentation
- Mock mode for development without API keys

## ⚠️ SINGLE SOURCE OF TRUTH

**CRITICAL**: All technology decisions, styling patterns, and code conventions are defined in `AI_CONTEXT.md` (in this directory). This file provides a summary - refer to `AI_CONTEXT.md` for complete details.

## 🎨 Technology Stack

**See `AI_CONTEXT.md` for complete details. Summary:**

### Core Framework
- **React Native** (Expo SDK 54)
- **React Native Unistyles 3.0** - Styling system (NOT NativeWind/Tailwind)
- **React Navigation** - Navigation (NOT Expo Router)
- **TypeScript** (strict mode)

### State & Data
- **Zustand** - Global state management
- **React Query** - Server state and data fetching
- **React Hook Form + Zod** - Forms and validation

### Backend Services
- **Supabase** - Authentication & database
- **RevenueCat** - iOS & Android subscriptions (also Web)
- **PostHog** - Analytics & feature flags
- **Sentry** - Error tracking

### Platform Support
- ✅ **iOS** - Fully supported
- ✅ **Android** - Fully supported
- ✅ **Web** - Fully supported via Expo Web

**Web Support Details**:
- React Native app: Run `cd apps/app && yarn web` or `yarn app:web` (from root)
- Build: `cd apps/app && yarn bundle:web` or `yarn app:web:build` (from root)
- All features work on web (auth, payments, analytics, etc.)
- Unistyles 3.0 fully supports web

**Important**: The React Native app uses **Unistyles 3.0** for styling, NOT NativeWind or Tailwind. The separate marketing page (`apps/web`) uses Tailwind CSS.

## 🧠 AI Development Workflow

### Step 1: Read Context Files

Before writing any code, read:
1. **`AI_CONTEXT.md`** - ⭐ SINGLE SOURCE OF TRUTH (this directory)
2. `apps/app/vibe/CONTEXT.md` - App structure and features
3. `apps/app/vibe/TECH_STACK.md` - Technology decisions
4. `apps/app/vibe/STYLE_GUIDE.md` - Code patterns
5. `vibe/SERVICES.md` - Service architecture
6. `vibe/MOCK_SERVICES.md` - Mock mode guide

### Step 2: Check Existing Code

- Browse `apps/app/app/components/` for reusable components
- Look at `apps/app/app/screens/` for screen patterns
- Check `apps/app/app/stores/` for state management patterns
- Review `apps/app/app/services/` for service patterns

### Step 3: Implement Feature

Follow established patterns (see `AI_CONTEXT.md` for details):
- Use **Unistyles 3.0** with theme (NOT NativeWind/Tailwind)
- Use **React Navigation** (NOT Expo Router)
- Use Zustand for global state
- Use React Query for data fetching
- Support dark mode via semantic theme colors
- Add accessibility labels
- Handle errors gracefully
- Use screen templates for auth/onboarding screens

### Step 4: Update Documentation

### 📁 Documentation System

**Allowed root files**: Only existing feature docs (`SUPABASE.md`, `MONETIZATION.md`, etc.), AI instruction files, and standard files (`README.md`, `CHANGELOG.md`, etc.)

**❌ DO NOT create random .md files in root** (no `SUMMARY.md`, `ANALYSIS.md`, `REVIEW.md`, etc.)

### 📂 Where to Document Changes

| Change Type | Location |
|-------------|----------|
| **New major feature** | Create `docs/[FEATURE_NAME].md` (NOT root) |
| **Feature changes** | Update existing `docs/[FEATURE].md` or root feature doc |
| **App architecture** | Update `apps/app/vibe/CONTEXT.md` |
| **Service changes** | Update `vibe/SERVICES.md` |
| **Tech stack** | Update `apps/app/vibe/TECH_STACK.md` |
| **Code patterns** | Update `apps/app/vibe/STYLE_GUIDE.md` |
| **User-facing docs** | Update `mintlify_docs/docs/core-features/[feature].mdx` |
| **Breaking changes** | Update `docs/TROUBLESHOOTING.md` |

**Key Rule**: New features → `docs/` folder, NOT root directory.

### Step 5: Commit in Each Repo

```bash
# Boilerplate changes
cd shipnativeapp
git add -A
git commit -m "feat: Add [feature name]"

# Documentation changes
cd mintlify_docs
git add -A
git commit -m "docs: Update [feature] documentation"

# Landing page changes
cd ../landing_page
git add -A
git commit -m "docs: Add [feature] to landing page"
```

## 🎨 Code Style

**See `AI_CONTEXT.md` for complete styling patterns. Summary:**

### Styling: Unistyles 3.0 Only

```typescript
// ✅ DO THIS - Unistyles with theme
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

const { theme } = useUnistyles()

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

// Usage
<View style={styles.container}>
  <Text style={styles.title}>Hello World</Text>
</View>

// ❌ DON'T DO THIS - NativeWind/Tailwind
<View className="flex-1 bg-white">

// ❌ DON'T DO THIS - Hardcoded values
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 }
})
```

### Dark Mode

Dark mode is automatic via Unistyles semantic theme colors:
```typescript
// ✅ DO THIS - Theme automatically handles dark mode
const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background, // Auto-switches
  },
  text: {
    color: theme.colors.foreground, // Auto-switches
  },
}))
```

## 🔄 CRITICAL: Repository Synchronization

**When you modify the boilerplate (`shipnativeapp/`), you MUST update documentation and landing page to stay in sync.**

### Sync Checklist

**When adding/modifying features:**

```
[ ] Implement feature in apps/app/
[ ] Update apps/app/vibe/CONTEXT.md
[ ] Update README.md (if features list changes)
[ ] Update relevant *.md file (SUPABASE.md, MONETIZATION.md, etc.)
[ ] Update mintlify_docs/docs/features/[feature].mdx
[ ] Update mintlify_docs/docs/index.mdx (if adding to features)
[ ] Update landing_page/src/components/landing/BentoGrid.tsx (if showcasing)
[ ] Update landing_page/src/app/comparison/page.tsx (if comparison changes)
[ ] Update landing_page/CHANGELOG.md
[ ] Update landing_page/ROADMAP.md (if applicable)
[ ] Commit changes in each repository separately
```

## 🚨 Common Mistakes

1. ❌ **Using NativeWind/Tailwind** - Use Unistyles 3.0 instead
2. ❌ **Using Expo Router** - Use React Navigation instead
3. ❌ **Hardcoding colors/spacing** - Use theme values
4. ❌ **Adding feature but not updating docs** - Docs become outdated
5. ❌ **Forgetting to commit in all repos** - Repos get out of sync

## ✅ Quality Checklist

**Before committing boilerplate changes:**
- [ ] Code works and is tested
- [ ] Uses Unistyles 3.0 with theme (not NativeWind)
- [ ] Uses React Navigation (not Expo Router)
- [ ] Supports dark mode via semantic theme colors
- [ ] Has accessibility labels
- [ ] Handles errors gracefully
- [ ] Updated `apps/app/vibe/CONTEXT.md` if major feature
- [ ] Updated relevant `*.md` files
- [ ] Updated Mintlify docs
- [ ] Updated landing page if showcasing
- [ ] Updated CHANGELOG.md

## 🧪 Mock Services

Mock services simulate the entire backend when API keys are missing. This enables **frontend-first development**.

### What's Mocked
- **Supabase**: Auth, Database, Storage, Realtime, OAuth
- **RevenueCat**: Purchases, subscriptions, entitlements
- **PostHog**: Events, screens, feature flags
- **Sentry**: Error tracking, breadcrumbs

**See `vibe/MOCK_SERVICES.md` for complete details.**

## 📖 Key Files Reference

**Context Files** (read first):
- **`AI_CONTEXT.md`** - ⭐ SINGLE SOURCE OF TRUTH (this directory)
- `apps/app/vibe/CONTEXT.md` - App features & architecture
- `apps/app/vibe/TECH_STACK.md` - Technology decisions
- `apps/app/vibe/STYLE_GUIDE.md` - Code patterns

**Documentation**:
- `README.md` - Main overview
- `mintlify_docs/docs/` - User-facing docs
- `landing_page/CHANGELOG.md` - Version history
- `landing_page/ROADMAP.md` - Future plans

## 💡 Remember

- **Single source of truth** - Always refer to `AI_CONTEXT.md` first
- **Three repos, one project** - Keep documentation synced
- **Vibecoding** - Make it easy for AI to understand and extend
- **Documentation is part of the product** - Update it with code
- **Mock services enable frontend-first** - Build without API keys
- **Landing page must be accurate** - Reflects current capabilities

When in doubt, ask: "If I add this feature, what docs need updating?" Then check `AI_CONTEXT.md` for the definitive answer.
