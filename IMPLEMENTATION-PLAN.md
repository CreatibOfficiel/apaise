# Plan d'Implémentation Complet - App "Serein"

> Document créé le 18 janvier 2026
> Basé sur l'analyse de 66 vidéos YouTube (Harry, Samuel, Connor, Stephen) + 4 apps concurrentes
> **Mis à jour** : Onboarding long (15 écrans) basé sur recherches Noom/Flo/Lose It!

---

## Règles d'Or (à ne JAMAIS oublier)

### 1. Copier ce qui marche
> "Ne jamais construire quelque chose qui n'existe pas déjà et n'est pas déjà rentable." — Samuel ($35K/mois)

- ✅ Le marché des affirmations est validé (I AM fait $400K/mois)
- ✅ Notre différenciation : Focus anxiété + Design Moonly-like + Bilingue FR/EN

### 2. L'onboarding LONG fait 90% du travail
> "We just make onboarding longer. And we found huge success: our trial start rates went up double digits." — Lose It! (via RevenueCat)

> "Noom's onboarding includes 96+ screens, generating $750m+ a year." — Paddle

- ✅ Flow en **15 écrans** (pas 8) — plus c'est long, mieux ça convertit
- ✅ **Sunk Cost Fallacy** : plus l'utilisateur investit de temps, plus il est engagé
- ✅ Loading bars entre questions = +10-20% conversion
- ✅ Social proof intercalé pour maintenir l'engagement

### 3. Hard Paywall obligatoire
> "Soft paywall = conversion faible. Hard paywall = 20-25% conversion." — Connor

- ✅ Paywall après onboarding, AVANT l'app
- ✅ Trial 3 jours avec timeline visuelle
- ✅ Option "continuer gratuit" = accès limité

### 4. Le marketing est 95% du succès
> "Building it is just the first step. Distribution is everything." — Stephen ($40K/mois)

- ✅ Prévoir budget pub dès le départ (€500-2000)
- ✅ TikTok Ads = canal principal
- ✅ Contenu organique = peu efficace seul

### 5. Attribution = Priorité technique
> "Le plus gros défi technique post-lancement : configurer correctement l'attribution." — Harry

- ✅ RevenueCat bien configuré dès le début
- ✅ SKAN events pour iOS 14+
- ✅ Tester le tracking avant de dépenser en pub

---

## Phase 1 : Onboarding (15 écrans)

### Pourquoi un onboarding LONG ?

**Données clés** :
- **Noom** : 96+ écrans → $750M+/an de revenus
- **Flo** : jusqu'à 400 écrans (selon branches)
- **Lose It!** : "trial start rates went up double digits as onboarding got longer"

**Principe psychologique** : **Sunk Cost Fallacy**
> Plus l'utilisateur investit de temps, plus il est engagé et moins il veut "perdre" cet investissement.

**Sources** :
- [RevenueCat - Why your onboarding might be too short](https://www.revenuecat.com/blog/growth/why-your-onboarding-experience-might-be-too-short/)
- [Paddle - Noom's Lean Web2App Strategy](https://www.paddle.com/studios/shows/fix-that-funnel/noom)
- [Retention Blog - The Longest Onboarding Ever](https://www.retention.blog/p/the-longest-onboarding-ever)

### Flow Psychologique
```
Calme → Valeur → Questions (sunk cost) → Loading personnalisé → Paywall
```

### Vue d'ensemble des 15 écrans

| # | Type | Contenu | Objectif |
|---|------|---------|----------|
| 1 | Animation | Breathing + affirmation | Calmer, créer l'ambiance |
| 2 | Welcome | "Tu mérites la paix" | Émotion, promesse |
| 3 | Value Slide 1 | Features (470+ affirmations) | Montrer la valeur |
| 4 | Value Slide 2 | Social proof | Crédibilité |
| 5 | Value Slide 3 | Science-backed | Légitimité |
| 6 | Question 1 | "Quel est ton objectif ?" | Segmentation principale |
| 7 | Loading 1 | "Analyse en cours..." | Sunk cost + anticipation |
| 8 | Question 2 | "Quand ressens-tu le plus d'anxiété ?" | Personnalisation |
| 9 | Question 3 | "Niveau de stress (1-10)" | Engagement slider |
| 10 | Loading 2 | Stat personnalisée | Crédibilité + reward |
| 11 | Question 4 | "Temps disponible par jour ?" | Commitment |
| 12 | Question 5 | "Déjà essayé méditation/affirmations ?" | Qualification |
| 13 | Loading 3 | "Création de ton programme..." | Anticipation finale |
| 14 | Résultat | "Ton plan Serein personnalisé" | Reward, valeur perçue |
| 15 | Paywall | Timeline + pricing | Conversion |

---

### Détail Écran par Écran

#### Écran 1 : Breathing Animation (4 secondes, auto)
**Objectif** : Mettre l'utilisateur dans un état calme AVANT de demander quoi que ce soit

**Contenu** :
- Fond bleu nuit (#0D0D1A)
- Cercle qui pulse (breathing animation)
- Affirmation qui apparaît en fade-in au centre
- Auto-transition après 4 secondes

**Référence** : Headspace écrans 1-4

**Composant** : `components/onboarding/BreathingAnimation.tsx`

---

#### Écran 2 : Welcome
**Objectif** : Premier contact émotionnel, établir la promesse

| Élément | FR | EN |
|---------|----|----|
| Titre | "Bienvenue" | "Welcome" |
| Sous-titre | "Tu mérites la paix intérieure." | "You deserve inner peace." |
| CTA | "Commencer" | "Get Started" |

**Design** : Illustration sereine (style Moonly) + texte centré + 1 CTA

---

#### Écrans 3-5 : Value Slides (swipeable)
**Objectif** : Montrer la valeur, créer l'envie

| Slide | Titre FR | Titre EN | Sous-titre FR | Sous-titre EN |
|-------|----------|----------|---------------|---------------|
| 3 | "Des mots qui apaisent" | "Words that heal" | "470+ affirmations pour t'aider à gérer l'anxiété, mieux dormir et retrouver confiance." | "470+ affirmations to help you manage anxiety, sleep better, and regain confidence." |
| 4 | "Tu n'es pas seul(e)" | "You're not alone" | "Des milliers de personnes utilisent Serein chaque jour pour trouver le calme." | "Thousands use Serein daily to find calm." |
| 5 | "Prouvé par la science" | "Science-backed" | "Les affirmations positives réduisent le stress et améliorent le bien-être mental." | "Positive affirmations reduce stress and improve mental wellbeing." |

**Navigation** : Swipe horizontal + dots pagination + bouton "Suivant"

---

#### Écran 6 : Question 1 - Objectif Principal
**Objectif** : Segmentation + début du sunk cost

| Élément | FR | EN |
|---------|----|----|
| Titre | "Quel est ton objectif principal ?" | "What's your main goal?" |
| Sous-titre | "On personnalise ton expérience" | "We'll personalize your experience" |

**Options (pills, sélection unique)** :
| ID | FR | EN |
|----|----|----|
| anxiety | Réduire mon anxiété | Reduce my anxiety |
| sleep | Mieux dormir | Sleep better |
| confidence | Gagner en confiance | Build confidence |
| stress | Gérer mon stress | Manage stress |
| calm | Me sentir plus calme | Feel calmer |
| other | Autre chose | Something else |

**Stockage** : `selectedGoal` dans AsyncStorage

---

#### Écran 7 : Loading 1 - Analyse
**Objectif** : Sunk cost + anticipation

| Élément | FR | EN |
|---------|----|----|
| Texte | "Analyse de ton profil..." | "Analyzing your profile..." |

**Animation** :
- Progress bar animée (0% → 100%)
- Durée : 2-3 secondes
- Icônes qui apparaissent : ✓ Objectif identifié, ✓ Catégories sélectionnées...

**Technique** : Les loading screens augmentent la conversion de 10-20% (source: Noom analysis)

---

#### Écran 8 : Question 2 - Moment d'anxiété
**Objectif** : Personnalisation + engagement

| Élément | FR | EN |
|---------|----|----|
| Titre | "Quand ressens-tu le plus d'anxiété ?" | "When do you feel most anxious?" |

**Options** :
| ID | FR | EN |
|----|----|----|
| morning | Le matin au réveil | In the morning |
| work | Pendant le travail | During work |
| evening | Le soir avant de dormir | Before sleep |
| social | En situation sociale | In social situations |
| random | À des moments aléatoires | At random times |

**Stockage** : `anxietyTiming` → personnalise les notifications

---

#### Écran 9 : Question 3 - Niveau de stress (Slider)
**Objectif** : Engagement interactif + data

| Élément | FR | EN |
|---------|----|----|
| Titre | "Comment évalues-tu ton niveau de stress actuel ?" | "How would you rate your current stress level?" |

**Input** : Slider 1-10 avec emojis
- 1-3 : 😌 Léger
- 4-6 : 😐 Modéré
- 7-10 : 😰 Élevé

**Stockage** : `stressLevel` → adapte l'intensité des affirmations suggérées

---

#### Écran 10 : Loading 2 - Stat personnalisée
**Objectif** : Reward + crédibilité

**Contenu dynamique basé sur les réponses** :

Si stress > 7 :
- FR: "85% des personnes avec un stress élevé voient une amélioration en 7 jours avec Serein"
- EN: "85% of people with high stress see improvement in 7 days with Serein"

Si objectif = sleep :
- FR: "Les utilisateurs dorment en moyenne 45 min de plus après 2 semaines"
- EN: "Users sleep 45 min longer on average after 2 weeks"

**Animation** : Fade-in du stat + petite illustration

---

#### Écran 11 : Question 4 - Temps disponible
**Objectif** : Commitment + gestion des attentes

| Élément | FR | EN |
|---------|----|----|
| Titre | "Combien de temps peux-tu consacrer par jour ?" | "How much time can you dedicate daily?" |

**Options** :
| ID | FR | EN |
|----|----|----|
| 1min | 1 minute | 1 minute |
| 5min | 5 minutes | 5 minutes |
| 10min | 10 minutes | 10 minutes |
| more | Plus de 10 min | More than 10 min |

**Message de réassurance** :
- FR: "Même 1 minute peut faire la différence ✨"
- EN: "Even 1 minute can make a difference ✨"

---

#### Écran 12 : Question 5 - Expérience passée
**Objectif** : Qualification + adaptation du ton

| Élément | FR | EN |
|---------|----|----|
| Titre | "As-tu déjà essayé la méditation ou les affirmations ?" | "Have you tried meditation or affirmations before?" |

**Options** :
| ID | FR | EN |
|----|----|----|
| never | Jamais | Never |
| few_times | Quelques fois | A few times |
| regular | Régulièrement | Regularly |
| expert | Je suis pratiquant(e) | I'm a practitioner |

**Utilité** : Adapte le niveau de guidance dans l'app

---

#### Écran 13 : Loading 3 - Création du programme
**Objectif** : Anticipation finale avant le paywall

| Élément | FR | EN |
|---------|----|----|
| Titre | "Création de ton programme personnalisé..." | "Creating your personalized program..." |

**Animation** (séquentielle, 3-4 secondes) :
1. ✓ Analyse de tes réponses
2. ✓ Sélection des affirmations
3. ✓ Personnalisation du parcours
4. ✓ Programme prêt !

---

#### Écran 14 : Résultat personnalisé
**Objectif** : Reward + valeur perçue maximale avant paywall

| Élément | FR | EN |
|---------|----|----|
| Titre | "Ton plan Serein est prêt ✨" | "Your Serein plan is ready ✨" |

**Contenu dynamique** :
```
┌─────────────────────────────────────────┐
│  🎯 Objectif : [Réduire l'anxiété]      │
│  ⏱️ Durée : [5 min/jour]                │
│  📚 Affirmations : [127 sélectionnées]  │
│  🔔 Rappel : [Le soir]                  │
└─────────────────────────────────────────┘
```

**CTA** : "Découvrir mon programme" → Paywall

---

#### Écran 15 : Paywall (Hard paywall avec timeline)
**Objectif** : Convertir avec transparence

**Structure** (de haut en bas) :

```
┌─────────────────────────────────────────────────┐
│  [X bouton close - top right]                   │
│                                                 │
│  [Illustration calme - style Moonly]            │
│                                                 │
│  "Commence ton essai gratuit"                   │
│  "Start your free trial"                        │
│                                                 │
├─────────────────────────────────────────────────┤
│  TIMELINE VISUELLE                              │
│                                                 │
│  ● Aujourd'hui          Accès complet           │
│  │                                              │
│  ○ Jour 2               Rappel par email        │
│  │                                              │
│  ○ Jour 3               Facturation             │
│                         (annulable avant)       │
│                                                 │
├─────────────────────────────────────────────────┤
│  TOGGLE : [Annuel ✓] [Hebdo]                    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ ⭐ ANNUEL - MEILLEURE OFFRE             │    │
│  │                                         │    │
│  │  €49.99  →  €29.99/an                   │    │
│  │  (soit €2.50/mois)                      │    │
│  │                                         │    │
│  │  🔥 -40% pour les nouveaux membres      │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ HEBDOMADAIRE                            │    │
│  │                                         │    │
│  │  €4.99/semaine                          │    │
│  │  Sans engagement                        │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
├─────────────────────────────────────────────────┤
│  [  Essayer 3 jours gratuitement  ] ← Primary   │
│                                                 │
│  Annule quand tu veux • Paiement sécurisé      │
│                                                 │
│  [Continuer avec la version limitée] ← Ghost    │
│                                                 │
│  [Restaurer mes achats] ← Link                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Pricing (décision finale)** :
| Plan | Prix | Équivalent |
|------|------|------------|
| Annuel promo | €29.99/an | €2.50/mois |
| Annuel "plein" | €49.99 (barré) | - |
| Hebdo | €4.99/sem | €259.48/an |
| Trial | 3 jours | Gratuit |

**Version limitée (si skip paywall)** :
- 90 affirmations gratuites (sur 470)
- Catégories de base uniquement
- Pas de widget
- Pas de favoris illimités

---

## Phase 2 : Design System

### Couleurs (Style Moonly, pas Headspace)

```typescript
// theme/colors.ts - Palette Serein
const palette = {
  // Fond principal - bleu nuit profond
  night900: "#0D0D1A",
  night800: "#14142B",
  night700: "#1A1A2E",
  night600: "#16213E",

  // Violet principal
  purple500: "#7C3AED",
  purple400: "#8B5CF6",
  purple300: "#A78BFA",
  purple200: "#C4B5FD",
  purple100: "#EDE9FE",

  // Rose accent
  rose500: "#EC4899",
  rose400: "#F472B6",
  rose300: "#F9A8D4",
  rose200: "#FBCFE8",
  rose100: "#FCE7F3",

  // Texte
  white: "#FFFFFF",
  whiteAlpha80: "rgba(255,255,255,0.8)",
  whiteAlpha60: "rgba(255,255,255,0.6)",
  whiteAlpha40: "rgba(255,255,255,0.4)",

  // Succès/Erreur
  success500: "#10B981",
  error500: "#EF4444",
}

export const colors = {
  // Semantic colors
  background: palette.night900,
  backgroundSecondary: palette.night800,
  card: palette.night700,

  foreground: palette.white,
  foregroundSecondary: palette.whiteAlpha80,
  foregroundTertiary: palette.whiteAlpha60,

  primary: palette.purple500,
  primaryForeground: palette.white,

  accent: palette.rose500,
  accentForeground: palette.white,

  border: "rgba(255,255,255,0.1)",

  tint: palette.purple500,
  error: palette.error500,
  success: palette.success500,
}
```

### Typographie

```typescript
const typography = {
  // Affirmations - Serif élégant
  affirmation: {
    fontFamily: "Playfair Display", // ou Georgia fallback
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "400",
  },

  // Titres - Sans-serif bold
  heading: {
    fontFamily: "Inter", // ou System default
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
  },

  // Sous-titres
  subheading: {
    fontFamily: "Inter",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "500",
  },

  // Body
  body: {
    fontFamily: "Inter",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
  },

  // CTAs
  button: {
    fontFamily: "Inter",
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
  },
}
```

### Composants clés

**Bouton primaire** :
```typescript
{
  backgroundColor: colors.primary,
  paddingVertical: 16,
  paddingHorizontal: 24,
  borderRadius: 16,
  alignItems: "center",
  // Shadow subtle
  shadowColor: colors.primary,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
}
```

**Pill de sélection** :
```typescript
// Non sélectionné
{
  backgroundColor: "rgba(255,255,255,0.05)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.1)",
  borderRadius: 12,
  padding: 16,
}

// Sélectionné
{
  backgroundColor: "rgba(124,58,237,0.2)", // purple avec alpha
  borderWidth: 1,
  borderColor: colors.primary,
  borderRadius: 12,
  padding: 16,
}
```

---

## Phase 3 : Structure des Données

### Affirmations (déjà créé)
Fichier : `apps/app/app/data/affirmations.ts`
- 470 affirmations bilingues
- 7 catégories
- 90 gratuites, 380 premium

### User Preferences (AsyncStorage/Zustand)
```typescript
interface UserPreferences {
  // Onboarding data (15 écrans)
  hasCompletedOnboarding: boolean
  onboardingStep: number // Pour reprendre si abandon

  // Réponses aux questions
  selectedGoal: Category | null        // Écran 6
  anxietyTiming: string | null         // Écran 8: "morning" | "work" | "evening" | "social" | "random"
  stressLevel: number | null           // Écran 9: 1-10
  dailyTime: string | null             // Écran 11: "1min" | "5min" | "10min" | "more"
  previousExperience: string | null    // Écran 12: "never" | "few_times" | "regular" | "expert"

  // App usage
  favorites: string[]                  // IDs des affirmations favorites
  lastSeenAffirmation: string | null
  affirmationsViewed: number           // Compteur total

  // Settings
  language: "fr" | "en"
  notificationsEnabled: boolean
  dailyReminderTime: string | null     // "08:00" - basé sur anxietyTiming
}
```

### Subscription State (RevenueCat)
```typescript
interface SubscriptionState {
  isPro: boolean
  expirationDate: Date | null
  willRenew: boolean
  productIdentifier: string | null // "serein_yearly_2999" | "serein_weekly_499"
}
```

---

## Phase 4 : Fichiers à Modifier

### 1. OnboardingScreen.tsx
**Chemin** : `apps/app/app/screens/OnboardingScreen.tsx`

**Changements** :
- Passer de 3 steps à **15 steps**
- Ajouter BreathingAnimation au step 0
- Ajouter ValueSlides (3 slides swipeable)
- Ajouter 5 écrans de questions
- Ajouter 3 écrans de loading avec progress bars
- Ajouter écran de résultat personnalisé
- Modifier la navigation vers Paywall
- Stocker toutes les réponses dans AsyncStorage/Zustand

### 2. PaywallScreen.tsx
**Chemin** : `apps/app/app/screens/PaywallScreen.tsx`

**Changements** :
- Remplacer le layout "features list" par timeline
- Ajouter le toggle Annual/Weekly
- Ajouter le prix barré + promo
- Mettre à jour les textes FR/EN
- Ajouter l'option "Continuer gratuit"

### 3. Theme files
**Chemins** :
- `apps/app/app/theme/colors.ts`
- `apps/app/app/theme/colorsDark.ts`

**Changements** :
- Remplacer la palette actuelle par la palette Serein (bleu nuit/violet)

### 4. Traductions i18n
**Chemin** : `apps/app/app/i18n/`

**Ajouter les clés** :
- Tous les textes d'onboarding FR/EN
- Tous les textes de paywall FR/EN
- Messages d'erreur

### 5. Navigation
**Chemin** : `apps/app/app/navigators/`

**Vérifier** :
- Flow Onboarding → Paywall → Main
- Gestion du "skip paywall" (accès limité)

---

## Phase 5 : Composants à Créer

### Onboarding Components (`components/onboarding/`)

| Composant | Usage |
|-----------|-------|
| `BreathingAnimation.tsx` | Écran 1 - Animation respiration + affirmation |
| `ValueSlide.tsx` | Écrans 3-5 - Slide de value proposition |
| `OnboardingQuestion.tsx` | Écrans 6,8,9,11,12 - Layout question avec options |
| `OptionPill.tsx` | Pill sélectionnable pour les questions |
| `StressSlider.tsx` | Écran 9 - Slider 1-10 avec emojis |
| `LoadingProgress.tsx` | Écrans 7,10,13 - Progress bar animée avec étapes |
| `PersonalizedResult.tsx` | Écran 14 - Affichage du résultat personnalisé |

### Paywall Components (`components/paywall/`)

| Composant | Usage |
|-----------|-------|
| `PaywallTimeline.tsx` | Timeline visuelle du trial (3 étapes) |
| `PricingToggle.tsx` | Toggle Annuel/Hebdo |
| `PricingCard.tsx` | Card de prix avec badge promo |

### Main App Components (`components/`)

| Composant | Usage |
|-----------|-------|
| `AffirmationCard.tsx` | Card principale pour afficher une affirmation |
| `CategoryPill.tsx` | Pill de catégorie dans le feed |
| `FavoriteButton.tsx` | Bouton favoris avec animation cœur |

---

## Phase 6 : RevenueCat Setup

### Produits à créer dans App Store Connect

| Product ID | Type | Prix | Trial |
|------------|------|------|-------|
| serein_weekly_499 | Auto-renewable | €4.99/sem | 3 jours |
| serein_yearly_2999 | Auto-renewable | €29.99/an | 3 jours |

### Configuration RevenueCat

```
App: Serein
├── Entitlement: premium
│   └── Grants: All premium content
│
└── Offering: default
    ├── Package: $rc_weekly
    │   └── Product: serein_weekly_499
    └── Package: $rc_annual
        └── Product: serein_yearly_2999
```

### Events à tracker

| Event | Quand | Données |
|-------|-------|---------|
| onboarding_started | Écran 1 affiché | - |
| onboarding_step_completed | Chaque écran complété | step_number, step_name |
| onboarding_question_answered | Réponse à une question | question_id, answer |
| onboarding_abandoned | Fermeture avant fin | last_step, time_spent |
| onboarding_completed | Écran 14 (résultat) | all_answers, duration |
| paywall_viewed | Paywall affiché | from_onboarding |
| paywall_plan_selected | Toggle annuel/hebdo | plan_type |
| trial_started | Début trial | plan_type, price |
| subscription_purchased | Conversion payante | plan_type, price |
| subscription_cancelled | Annulation | days_before_end |

**Pourquoi tracker chaque step ?**
- Identifier où les users abandonnent
- A/B tester différentes questions
- Optimiser le flow au fil du temps

---

## Phase 7 : Marketing (Post-Launch)

### Semaine 1-2 : Contenu Organique TikTok

**Formats à tester** :
1. Screen recording de l'app avec musique calme
2. POV anxiété + affirmation qui aide
3. "Read this if you have anxiety" + affirmation plein écran
4. Before/After : "My brain at 3am" vs "After 5 min on Serein"

**Fréquence** : 2-3 vidéos/jour

**Règle** : Entertainment first, CTA de 2 secondes à la fin

### Semaine 3+ : TikTok Ads

**Budget initial** : €30-50/jour

**Process** :
1. Prendre les vidéos organiques qui marchent
2. Les mettre en pub
3. Optimiser sur Trial Start
4. Scaler de 20% tous les 3 jours si ROAS > 1.5x

### Attribution

**Priorité absolue** : Configurer AVANT de dépenser

- RevenueCat attribution
- TikTok Events API
- SKAN 4.0 pour iOS

---

## Phase 8 : Métriques à Suivre

### Funnel Conversion

| Étape | Cible |
|-------|-------|
| Install → Onboarding Start | >95% |
| Onboarding Start → Complete | >70% |
| Onboarding Complete → Paywall View | 100% (hard paywall) |
| Paywall View → Trial Start | >15% |
| Trial Start → Paid | >20% |
| **Overall: Install → Paid** | **>3%** |

### Business Metrics

| Métrique | Cible Mois 1 |
|----------|--------------|
| Downloads | 1,000+ |
| Trial Starts | 150+ (15%) |
| Paid Conversions | 30+ (20% des trials) |
| MRR | €500+ |
| ROAS | >1.5x |

### Formule Rentabilité

```
Revenue = Conversions × Prix × (1 - 30% Apple)
Profit = Revenue - Ad Spend

Exemple :
- 1000 installs à €0.50 CPI = €500 pub
- 3% conversion = 30 users
- 30 × €29.99 × 70% = €629.79
- ROAS = €629.79 / €500 = 1.26x ✓
```

---

## Checklist Avant Launch

### Technique
- [ ] Onboarding 15 écrans fonctionnel
- [ ] Paywall timeline intégré
- [ ] RevenueCat configuré et testé
- [ ] Affirmations chargées (470)
- [ ] Theme bleu nuit/violet appliqué
- [ ] Traductions FR/EN complètes
- [ ] Deep linking fonctionnel
- [ ] Analytics events trackés

### App Store
- [ ] Screenshots (6.5" + 5.5")
- [ ] App Preview video (optionnel)
- [ ] Description FR/EN
- [ ] Keywords optimisés
- [ ] In-app purchases soumis
- [ ] Privacy policy URL
- [ ] Support URL

### Marketing
- [ ] Compte TikTok créé
- [ ] 10 vidéos préparées
- [ ] TikTok Ads account ready
- [ ] Attribution testée

---

## Erreurs à Éviter (Leçons des Analyses)

| Erreur | Ce qui arrive | Solution |
|--------|---------------|----------|
| Onboarding trop court | Conversion faible | 15 écrans avec sunk cost effect |
| Soft paywall | Users skip, ne payent jamais | Hard paywall obligatoire |
| Pas de timeline | Anxiété "je vais oublier d'annuler" | Timeline visuelle transparente |
| Contenu "commercial" | 0 engagement organique | Entertainment first |
| Attribution mal configurée | Pubs non optimisées, argent perdu | Tester avant de scaler |
| Scaling trop agressif | Perte de rentabilité | +20% tous les 3 jours max |
| Variables prod non testées | Crash sur TestFlight (Harry) | Tester le build prod régulièrement |

---

## Ordre d'Implémentation

### Sprint 1 : Setup + Theme
1. ✅ Créer affirmations.ts (470 affirmations)
2. ✅ Créer ce plan d'implémentation
3. [ ] Modifier theme/colors.ts (palette Serein bleu nuit/violet)
4. [ ] Modifier theme/colorsDark.ts
5. [ ] Setup du store Zustand pour onboarding data

### Sprint 2 : Onboarding Part 1 (Écrans 1-7)
6. [ ] Créer BreathingAnimation.tsx (écran 1)
7. [ ] Créer WelcomeScreen (écran 2)
8. [ ] Créer ValueSlides (écrans 3-5)
9. [ ] Créer OnboardingQuestion + OptionPill (écran 6)
10. [ ] Créer LoadingProgress (écran 7)

### Sprint 3 : Onboarding Part 2 (Écrans 8-14)
11. [ ] Créer les questions 2-5 (écrans 8,9,11,12)
12. [ ] Créer StressSlider (écran 9)
13. [ ] Créer les loadings avec stats (écrans 10,13)
14. [ ] Créer PersonalizedResult (écran 14)
15. [ ] Intégrer tout dans OnboardingScreen.tsx

### Sprint 4 : Paywall + Traductions
16. [ ] Modifier PaywallScreen.tsx (timeline)
17. [ ] Créer PaywallTimeline.tsx
18. [ ] Créer PricingCard.tsx + PricingToggle.tsx
19. [ ] Ajouter toutes les traductions i18n (FR/EN)

### Sprint 5 : Main App
20. [ ] Configurer RevenueCat (produits, offerings)
21. [ ] Créer le feed d'affirmations principal
22. [ ] Ajouter les favoris + AffirmationCard
23. [ ] Tester le flow complet

### Sprint 6 : Polish + Launch
24. [ ] Polish UI/animations
25. [ ] Screenshots App Store
26. [ ] Soumettre TestFlight
27. [ ] Préparer contenu TikTok

---

## Ressources

### Fichiers d'analyse
- `/Users/thibaud/Documents/development/viral_app/harry-analysis.md`
- `/Users/thibaud/Documents/development/viral_app/combined-insights.md`
- `/Users/thibaud/Documents/development/viral_app/PRICING-STRATEGY.md`
- `/Users/thibaud/Documents/development/viral_app/ONBOARDING-ANALYSIS.md`
- `/Users/thibaud/Documents/development/viral_app/onboarding/*/ANALYSIS.md`

### Code
- Template Shipnative : `/Users/thibaud/Documents/development/serein-app/`
- Affirmations : `/Users/thibaud/Documents/development/serein-app/apps/app/app/data/affirmations.ts`

### Citations clés

> "Les achats sont émotionnels, pas logiques. Invoke l'émotion d'abord." — Connor

> "Marketing is 95% of the success of a mobile app." — Stephen

> "Créer une app, c'est pas le défi. Le vrai défi, c'est de gagner de l'argent avec." — Harry

> "Start now and ship fast." — Marc Lou (après 30 échecs)

---

*Plan créé le 18 janvier 2026 - À suivre rigoureusement*
