# AI Context - Single Source of Truth

> **⚠️ IMPORTANT**: This is the SINGLE SOURCE OF TRUTH for all AI assistants working on this project. All AI instruction files (CLAUDE.md, GEMINI.md, .cursorrules) should reference this file.

**Last Updated**: 2025-01-XX  
**Version**: 3.0.0 (Modular Structure)

---

## 📖 Modular Documentation Structure

This file contains **critical information only**. For detailed guides, see:

- **Styling Patterns**: `vibe/STYLING.md` - Unistyles patterns, theme values, examples
- **Architecture Patterns**: `vibe/ARCHITECTURE.md` - Component structure, state management, screen templates
- **Development Workflow**: `vibe/DEVELOPMENT_WORKFLOW.md` - Workflow, mock mode, common mistakes
- **App Context**: `apps/app/vibe/CONTEXT.md` - App features & architecture
- **Tech Stack**: `apps/app/vibe/TECH_STACK.md` - Technology decisions
- **Style Guide**: `apps/app/vibe/STYLE_GUIDE.md` - Code patterns
- **Services**: `vibe/SERVICES.md` - Service architecture
- **Mock Services**: `vibe/MOCK_SERVICES.md` - Mock mode guide

**Read this file first for critical decisions, then reference specific files as needed.**

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

## 🎨 Styling Quick Reference

**CRITICAL**: Always use Unistyles 3.0 with theme function. Never hardcode values.

```typescript
// ✅ DO THIS
const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
}))
```

**For detailed styling patterns, theme values, and examples**: See `vibe/STYLING.md`

---

## 🏗️ Architecture Quick Reference

**Component Structure**: Imports → Types → Component (Hooks → State → Handlers → Render) → Styles

**State Management**:
- Global state → Zustand
- Server state → React Query
- Local state → useState

**For detailed architecture patterns and screen templates**: See `vibe/ARCHITECTURE.md`

---

## 🔄 Development Workflow Quick Reference

**Before coding**: Read context files, check existing code, follow patterns.

**Mock Mode**: All services work without API keys automatically.

**For detailed workflow and common mistakes**: See `vibe/DEVELOPMENT_WORKFLOW.md`

---

## 📚 Key Files Reference

### Context Files (Read First)
- `apps/app/vibe/CONTEXT.md` - App features & architecture
- `apps/app/vibe/TECH_STACK.md` - Technology decisions
- `apps/app/vibe/STYLE_GUIDE.md` - Code patterns
- `apps/app/vibe/SCREEN_TEMPLATES.md` - Screen layout templates
- `vibe/SERVICES.md` - Service architecture
- `vibe/MOCK_SERVICES.md` - Mock mode guide

### Detailed Guides (Reference as Needed)
- `vibe/STYLING.md` - Detailed styling patterns and theme values
- `vibe/ARCHITECTURE.md` - Component structure and state management patterns
- `vibe/DEVELOPMENT_WORKFLOW.md` - Development workflow and common mistakes

### Documentation
- `README.md` - Main overview
- `SUPABASE.md` - Auth & database guide
- `MONETIZATION.md` - Payments guide
- `ANALYTICS.md` - Analytics guide
- `DEPLOYMENT.md` - Deployment guide
- `TROUBLESHOOTING.md` - Common issues

---

## 🔄 Documentation System

### 📁 Allowed Root-Level Documentation Files

**ONLY these .md files are allowed in the root directory (`shipnativeapp/`):**

| File | Purpose | When to Update |
|------|---------|----------------|
| `README.md` | Main overview, quick start, features list | Feature additions, setup changes |
| `CHANGELOG.md` | Version history and user-facing changes | Every release, major changes |
| `ROADMAP.md` | Future features and plans | When roadmap items change |
| `LICENSE.md` | License information | Only if license changes |
| `SUPABASE.md` | Supabase/auth feature guide | Auth/database changes |
| `MONETIZATION.md` | Payment/subscription guide | Payment changes |
| `ANALYTICS.md` | Analytics guide | Analytics changes |
| `NOTIFICATIONS.md` | Push notifications guide | Notification changes |
| `DEPLOYMENT.md` | Deployment guide | Deployment changes |
| `TROUBLESHOOTING.md` | Common issues and solutions | New issues discovered |
| `DESIGN_SYSTEM.md` | Design tokens and patterns | Design system changes |
| `BACKEND.md` | Backend setup and schemas | Backend changes |
| `AI_CONTEXT.md` | AI instruction file (single source of truth) | Tech stack/patterns change |
| `CLAUDE.md` | Claude-specific AI instructions | AI workflow changes |
| `GEMINI.md` | Gemini-specific AI instructions | AI workflow changes |
| `AGENTS.md` | Agent guidelines | Agent workflow changes |
| `LANDING_PAGE_CONTENT.md` | Landing page content reference | Landing page content changes |

### ❌ DO NOT Create Random Files in Root

**CRITICAL**: Do NOT create any other .md files in the root directory unless explicitly requested.

- ❌ Do NOT create `SUMMARY.md`, `ANALYSIS.md`, `REVIEW.md`, `CHANGES.md`
- ❌ Do NOT create `IMPLEMENTATION_NOTES.md`, `CODE_REVIEW.md`, `PROGRESS.md`
- ❌ Do NOT create any temporary or summary documentation files
- ❌ Do NOT create feature documentation in root (use `docs/` folder instead)

### 📂 Documentation Location System

**Where to document different types of changes:**

#### 1. Feature Documentation → `docs/` folder

**New features get documented in `docs/` folder, NOT root:**

| Feature Type | Documentation Location |
|--------------|----------------------|
| Authentication | `docs/SUPABASE.md` (already exists) |
| Payments | `docs/MONETIZATION.md` (already exists) |
| Analytics | `docs/ANALYTICS.md` (already exists) |
| Notifications | `docs/NOTIFICATIONS.md` (already exists) |
| Deployment | `docs/DEPLOYMENT.md` (already exists) |
| **New major feature** | Create `docs/[FEATURE_NAME].md` (e.g., `docs/OFFLINE.md`) |
| Architecture decisions | `docs/ADR/[number]-[name].md` (Architecture Decision Records) |

#### 2. AI Context Documentation → `vibe/` folders

| Context Type | Location |
|--------------|----------|
| App features & architecture | `apps/app/vibe/CONTEXT.md` |
| Technology decisions | `apps/app/vibe/TECH_STACK.md` |
| Code patterns | `apps/app/vibe/STYLE_GUIDE.md` |
| Screen templates | `apps/app/vibe/SCREEN_TEMPLATES.md` |
| App architecture | `apps/app/vibe/ARCHITECTURE.md` |
| Service architecture | `vibe/SERVICES.md` |
| Mock services | `vibe/MOCK_SERVICES.md` |

#### 3. User-Facing Documentation → `mintlify_docs/docs/`

| Documentation Type | Location |
|-------------------|----------|
| Feature guides | `mintlify_docs/docs/core-features/[feature].mdx` |
| Getting started | `mintlify_docs/docs/getting-started/*.mdx` |
| Development guides | `mintlify_docs/docs/development/*.mdx` |
| Architecture docs | `mintlify_docs/docs/architecture/*.mdx` |
| Troubleshooting | `mintlify_docs/docs/troubleshooting.mdx` |

### 📋 Documentation Decision Tree

**When adding/modifying features, follow this system:**

```
New Feature Added?
├─ Is it a major new feature?
│  ├─ YES → Create `docs/[FEATURE_NAME].md` (e.g., `docs/OFFLINE.md`)
│  └─ NO → Update existing feature doc in `docs/` folder
│
├─ Does it change app architecture?
│  └─ YES → Update `apps/app/vibe/CONTEXT.md`
│
├─ Does it change services?
│  └─ YES → Update `vibe/SERVICES.md`
│
├─ Does it change tech stack?
│  └─ YES → Update `apps/app/vibe/TECH_STACK.md`
│
├─ Does it change code patterns?
│  └─ YES → Update `apps/app/vibe/STYLE_GUIDE.md`
│
├─ Should users know about it?
│  └─ YES → Update `mintlify_docs/docs/core-features/[feature].mdx`
│
└─ Should it be showcased?
   └─ YES → Update `landing_page/src/components/landing/BentoGrid.tsx`
```

### ✅ Documentation Update Rules

1. **New major feature** → Create `docs/[FEATURE_NAME].md` (NOT in root)
2. **Feature changes** → Update existing `docs/[FEATURE].md` file
3. **App changes** → Update `apps/app/vibe/CONTEXT.md`
4. **Service changes** → Update `vibe/SERVICES.md`
5. **Tech changes** → Update `apps/app/vibe/TECH_STACK.md`
6. **Pattern changes** → Update `apps/app/vibe/STYLE_GUIDE.md`
7. **User-facing changes** → Update `mintlify_docs/docs/`
8. **Breaking changes** → Update `docs/TROUBLESHOOTING.md`
9. **Root-level files** → Only update existing allowed files (see table above)
10. **Never create** → Random .md files in root directory

---

## 📝 Version History

- **v3.0.0** (2025-01-XX): Modular structure - split detailed guides into separate files
- **v2.0.0** (2025-01-XX): Consolidated from multiple AI instruction files
- **v1.0.0**: Initial version

---

## 🔗 Quick Reference Map

**Critical Info** (this file):
- Technology stack (ALWAYS USE / NEVER USE)
- Platform support
- Documentation system

**Detailed Guides** (reference as needed):
- `vibe/STYLING.md` - Styling patterns, theme values, examples
- `vibe/ARCHITECTURE.md` - Component structure, state management, templates
- `vibe/DEVELOPMENT_WORKFLOW.md` - Workflow, mock mode, mistakes

**App Context**:
- `apps/app/vibe/CONTEXT.md` - App features & architecture
- `apps/app/vibe/TECH_STACK.md` - Technology decisions
- `apps/app/vibe/STYLE_GUIDE.md` - Code patterns
- `apps/app/vibe/SCREEN_TEMPLATES.md` - Screen templates

**Services**:
- `vibe/SERVICES.md` - Service architecture
- `vibe/MOCK_SERVICES.md` - Mock mode guide

---

**This file is the single source of truth. All AI instruction files should reference this file and defer to it for any conflicts. Read this file first, then reference specific guides as needed.**

