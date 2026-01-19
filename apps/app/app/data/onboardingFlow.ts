/**
 * Onboarding Flow Configuration - Positive Affirmations App
 *
 * This file defines the complete onboarding flow with ~16 screens,
 * focused on aspirational goals and positive affirmations.
 *
 * Based on Harry JMG's 3-phase onboarding strategy:
 * 1. "Petit Biscuit" - Immediate reward/value
 * 2. Questions Ciblées - Clarity + empathy + understanding
 * 3. Paywall - Transparent trial offer
 *
 * Key: Disseminate "petit sucre" (small rewards) throughout the flow
 */

import type { TxKeyPath } from "@/i18n"

// =============================================================================
// TYPES
// =============================================================================

export type OnboardingStepType =
  | "splash"
  | "affirmation_splash"
  | "question_single"
  | "question_multi"
  | "input_text"
  | "input_textarea"
  | "info"
  | "loading"
  | "notifications_config"
  | "theme_grid"
  | "paywall"
  | "success"
  | "redirect"

export interface LocalizedString {
  fr: string
  en: string
}

export interface OnboardingOption {
  id: string
  label: LocalizedString
  labelTx?: TxKeyPath
  icon?: string
  recommended?: boolean
}

export interface OnboardingStep {
  id: string
  type: OnboardingStepType
  content: {
    title?: LocalizedString
    titleTx?: TxKeyPath
    subtitle?: LocalizedString
    subtitleTx?: TxKeyPath
    options?: OnboardingOption[]
    placeholder?: LocalizedString
    animation?: string
    affirmation?: LocalizedString
    stat?: {
      number: string
      text: LocalizedString
    }
    rating?: number
    review?: LocalizedString
    benefits?: Array<{ icon: string; text: LocalizedString }>
    steps?: LocalizedString[]
    timelineSteps?: Array<{
      day: LocalizedString
      title: LocalizedString
      subtitle: LocalizedString
      icon: string
    }>
    dynamicContent?: (answers: OnboardingAnswers) => { title: LocalizedString; subtitle: LocalizedString }
    minSelection?: number
    maxSelection?: number
  }
  // Navigation
  next: string | ((answers: OnboardingAnswers) => string)
  // Options
  skippable?: boolean
  skipLabel?: LocalizedString
  cta?: LocalizedString
  ctaTx?: TxKeyPath
  autoAdvance?: number // milliseconds
  duration?: number // for loading screens
}

export type OnboardingAnswers = Record<string, string | string[]>

// =============================================================================
// AFFIRMATION CATEGORIES (used for personalization)
// =============================================================================

export const AFFIRMATION_CATEGORIES = {
  confidence: {
    id: "confidence",
    name: { fr: "Confiance en soi", en: "Self-confidence" },
    icon: "💪",
    color: "#FF6B6B",
  },
  self_love: {
    id: "self_love",
    name: { fr: "Amour propre", en: "Self-love" },
    icon: "💖",
    color: "#FF85A2",
  },
  success: {
    id: "success",
    name: { fr: "Succès & Abondance", en: "Success & Abundance" },
    icon: "🌟",
    color: "#FFD93D",
  },
  peace: {
    id: "peace",
    name: { fr: "Paix intérieure", en: "Inner peace" },
    icon: "🧘",
    color: "#6BCB77",
  },
  relationships: {
    id: "relationships",
    name: { fr: "Relations", en: "Relationships" },
    icon: "💕",
    color: "#9B59B6",
  },
  abundance: {
    id: "abundance",
    name: { fr: "Abondance", en: "Abundance" },
    icon: "✨",
    color: "#F39C12",
  },
} as const

// =============================================================================
// FLOW CONFIGURATION (~16 screens)
// =============================================================================

export const ONBOARDING_STEPS: OnboardingStep[] = [
  // =========================================================================
  // PHASE 1: "PETIT BISCUIT" - Immediate Value (2 screens)
  // =========================================================================
  {
    id: "affirmation_welcome",
    type: "affirmation_splash",
    content: {
      affirmation: {
        fr: "Tu mérites le meilleur.\nEt c'est aujourd'hui que ça commence.",
        en: "You deserve the best.\nAnd today is the day it begins.",
      },
      animation: "fade_in_elegant",
    },
    autoAdvance: 4000,
    next: "social_proof",
  },
  {
    id: "social_proof",
    type: "splash",
    content: {
      stat: {
        number: "+2M",
        text: {
          fr: "de personnes transforment leur mindset",
          en: "people are transforming their mindset",
        },
      },
      rating: 5,
      review: {
        fr: "Cette app a changé ma façon de voir la vie. Je me sens plus confiante chaque jour.",
        en: "This app changed my outlook on life. I feel more confident every day.",
      },
    },
    autoAdvance: 3500,
    next: "transform_domain",
  },

  // =========================================================================
  // PHASE 2: QUESTIONS CIBLÉES - Clarity + Empathy (10 screens)
  // =========================================================================
  {
    id: "transform_domain",
    type: "question_single",
    content: {
      title: {
        fr: "Quel domaine veux-tu transformer ?",
        en: "What area do you want to transform?",
      },
      subtitle: {
        fr: "Choisis celui qui résonne le plus avec toi",
        en: "Choose the one that resonates most with you",
      },
      options: [
        {
          id: "confidence",
          label: { fr: "Confiance en soi", en: "Self-confidence" },
          icon: "💪",
        },
        {
          id: "self_love",
          label: { fr: "Amour propre", en: "Self-love" },
          icon: "💖",
        },
        {
          id: "success",
          label: { fr: "Succès & Réussite", en: "Success & Achievement" },
          icon: "🌟",
        },
        {
          id: "peace",
          label: { fr: "Paix intérieure", en: "Inner peace" },
          icon: "🧘",
        },
        {
          id: "relationships",
          label: { fr: "Relations harmonieuses", en: "Harmonious relationships" },
          icon: "💕",
        },
        {
          id: "abundance",
          label: { fr: "Abondance & Prospérité", en: "Abundance & Prosperity" },
          icon: "✨",
        },
      ],
    },
    next: "emotional_state",
  },

  // NEW: Emotional state (Harry's "T'es comment dans ta tête en ce moment ?")
  {
    id: "emotional_state",
    type: "question_single",
    content: {
      title: {
        fr: "Comment tu te sens en ce moment ?",
        en: "How are you feeling right now?",
      },
      subtitle: {
        fr: "Sois honnête, c'est entre nous",
        en: "Be honest, it's between us",
      },
      options: [
        {
          id: "lost",
          label: { fr: "Un peu perdu(e)", en: "A bit lost" },
          icon: "🌫️",
        },
        {
          id: "stressed",
          label: { fr: "Stressé(e) / Anxieux(se)", en: "Stressed / Anxious" },
          icon: "😰",
        },
        {
          id: "stuck",
          label: { fr: "Bloqué(e)", en: "Stuck" },
          icon: "🔒",
        },
        {
          id: "searching",
          label: { fr: "En quête de sens", en: "Searching for meaning" },
          icon: "🔍",
        },
        {
          id: "motivated",
          label: { fr: "Motivé(e) mais j'ai besoin d'un boost", en: "Motivated but need a boost" },
          icon: "🔥",
        },
        {
          id: "good",
          label: { fr: "Plutôt bien, je veux aller plus loin", en: "Pretty good, want to go further" },
          icon: "✨",
        },
      ],
    },
    next: "petit_sucre_1",
  },

  // PETIT SUCRE #1: Encouragement after emotional sharing
  {
    id: "petit_sucre_1",
    type: "info",
    content: {
      title: {
        fr: "Merci pour ta confiance",
        en: "Thank you for your trust",
      },
      subtitle: {
        fr: "Tu viens de faire le premier pas. C'est déjà énorme. On va construire ton programme ensemble.",
        en: "You just took the first step. That's already huge. We'll build your program together.",
      },
      animation: "sparkle",
    },
    cta: { fr: "Continuer", en: "Continue" },
    next: "current_state",
  },

  {
    id: "current_state",
    type: "question_single",
    content: {
      dynamicContent: (answers: OnboardingAnswers) => {
        const domain = answers.transform_domain as string
        const domainLabels: Record<string, LocalizedString> = {
          confidence: { fr: "la confiance en toi", en: "your self-confidence" },
          self_love: { fr: "l'amour de toi", en: "your self-love" },
          success: { fr: "ta réussite", en: "your success" },
          peace: { fr: "ta paix intérieure", en: "your inner peace" },
          relationships: { fr: "tes relations", en: "your relationships" },
          abundance: { fr: "l'abondance", en: "abundance" },
        }
        const label = domainLabels[domain] || { fr: "ce domaine", en: "this area" }
        return {
          title: {
            fr: `Où en es-tu avec ${label.fr} ?`,
            en: `Where are you with ${label.en}?`,
          },
          subtitle: {
            fr: "Il n'y a pas de mauvaise réponse",
            en: "There's no wrong answer",
          },
        }
      },
      options: [
        {
          id: "beginning",
          label: { fr: "Je commence à peine", en: "Just starting" },
          icon: "🌱",
        },
        {
          id: "growing",
          label: { fr: "J'y travaille", en: "Working on it" },
          icon: "🌿",
        },
        {
          id: "almost_there",
          label: { fr: "J'ai fait du chemin", en: "Made progress" },
          icon: "🌸",
        },
        {
          id: "ready_to_shine",
          label: { fr: "Prêt(e) à passer au niveau supérieur", en: "Ready for the next level" },
          icon: "🌟",
        },
      ],
    },
    next: "obstacles",
  },

  // NEW: Obstacles (Harry's "Qu'est-ce qui te bloque ?")
  {
    id: "obstacles",
    type: "question_multi",
    content: {
      title: {
        fr: "Qu'est-ce qui t'empêche d'avancer ?",
        en: "What's holding you back?",
      },
      subtitle: {
        fr: "Sélectionne tout ce qui te parle",
        en: "Select everything that resonates",
      },
      options: [
        {
          id: "self_doubt",
          label: { fr: "Le doute de moi-même", en: "Self-doubt" },
          icon: "🤔",
        },
        {
          id: "negative_thoughts",
          label: { fr: "Les pensées négatives", en: "Negative thoughts" },
          icon: "💭",
        },
        {
          id: "fear_failure",
          label: { fr: "La peur d'échouer", en: "Fear of failure" },
          icon: "😨",
        },
        {
          id: "procrastination",
          label: { fr: "La procrastination", en: "Procrastination" },
          icon: "⏰",
        },
        {
          id: "others_opinion",
          label: { fr: "Le regard des autres", en: "Others' opinions" },
          icon: "👀",
        },
        {
          id: "lack_motivation",
          label: { fr: "Le manque de motivation", en: "Lack of motivation" },
          icon: "😔",
        },
        {
          id: "past_trauma",
          label: { fr: "Des blessures du passé", en: "Past wounds" },
          icon: "💔",
        },
        {
          id: "dont_know",
          label: { fr: "Je ne sais pas trop", en: "Not sure" },
          icon: "❓",
        },
      ],
      minSelection: 1,
    },
    next: "motivation",
  },

  {
    id: "motivation",
    type: "question_multi",
    content: {
      title: {
        fr: "Qu'est-ce qui te motive le plus ?",
        en: "What motivates you the most?",
      },
      subtitle: {
        fr: "Sélectionne tout ce qui t'inspire",
        en: "Select everything that inspires you",
      },
      options: [
        {
          id: "be_best_version",
          label: { fr: "Devenir la meilleure version de moi", en: "Become the best version of myself" },
          icon: "🦋",
        },
        {
          id: "positive_mindset",
          label: { fr: "Adopter un état d'esprit positif", en: "Adopt a positive mindset" },
          icon: "🧠",
        },
        {
          id: "achieve_goals",
          label: { fr: "Atteindre mes objectifs", en: "Achieve my goals" },
          icon: "🎯",
        },
        {
          id: "feel_good",
          label: { fr: "Me sentir bien au quotidien", en: "Feel good every day" },
          icon: "☀️",
        },
        {
          id: "overcome_doubts",
          label: { fr: "Dépasser mes doutes", en: "Overcome my doubts" },
          icon: "💫",
        },
        {
          id: "inspire_others",
          label: { fr: "Inspirer les autres", en: "Inspire others" },
          icon: "🔥",
        },
      ],
      minSelection: 1,
    },
    next: "name_input",
  },

  {
    id: "name_input",
    type: "input_text",
    content: {
      title: {
        fr: "Comment tu t'appelles ?",
        en: "What's your name?",
      },
      subtitle: {
        fr: "Pour personnaliser tes affirmations",
        en: "To personalize your affirmations",
      },
      placeholder: { fr: "Ton prénom", en: "Your first name" },
    },
    skippable: true,
    skipLabel: { fr: "Passer", en: "Skip" },
    next: "objective_free",
  },

  // NEW: Free objective input (Harry's open question for data)
  {
    id: "objective_free",
    type: "input_textarea",
    content: {
      title: {
        fr: "Si tu pouvais changer une chose dans ta vie, ce serait quoi ?",
        en: "If you could change one thing in your life, what would it be?",
      },
      subtitle: {
        fr: "Dis-moi tout, en quelques mots",
        en: "Tell me everything, in a few words",
      },
      placeholder: {
        fr: "Ex: Avoir plus confiance quand je parle en public...",
        en: "E.g., Be more confident when speaking in public...",
      },
    },
    skippable: true,
    skipLabel: { fr: "Passer", en: "Skip" },
    next: "petit_sucre_2",
  },

  // PETIT SUCRE #2: Personalized encouragement
  {
    id: "petit_sucre_2",
    type: "info",
    content: {
      dynamicContent: (answers: OnboardingAnswers) => {
        const name = answers.name_input as string
        const greeting = name ? name : ""
        return {
          title: {
            fr: name ? `${greeting}, tu es au bon endroit` : "Tu es au bon endroit",
            en: name ? `${greeting}, you're in the right place` : "You're in the right place",
          },
          subtitle: {
            fr: "On a aidé des milliers de personnes comme toi à transformer leur mindset. Ton tour arrive.",
            en: "We've helped thousands of people like you transform their mindset. Your turn is coming.",
          },
        }
      },
      animation: "heart",
    },
    cta: { fr: "C'est parti", en: "Let's go" },
    next: "notification_time",
  },

  {
    id: "notification_time",
    type: "question_single",
    content: {
      title: {
        fr: "Quand veux-tu recevoir tes affirmations ?",
        en: "When do you want to receive your affirmations?",
      },
      subtitle: {
        fr: "Choisis le moment idéal pour toi",
        en: "Choose the ideal time for you",
      },
      options: [
        {
          id: "morning",
          label: { fr: "Le matin au réveil", en: "Morning when waking up" },
          icon: "🌅",
          recommended: true,
        },
        {
          id: "midday",
          label: { fr: "Pendant la journée", en: "During the day" },
          icon: "☀️",
        },
        {
          id: "evening",
          label: { fr: "Le soir", en: "In the evening" },
          icon: "🌙",
        },
        {
          id: "multiple",
          label: { fr: "Plusieurs fois par jour", en: "Multiple times a day" },
          icon: "✨",
        },
      ],
    },
    next: "notifications_permission",
  },

  {
    id: "notifications_permission",
    type: "notifications_config",
    content: {
      title: {
        fr: "Active tes rappels quotidiens",
        en: "Enable your daily reminders",
      },
      subtitle: {
        fr: "Reçois chaque jour une affirmation pour transformer ton mindset",
        en: "Receive a daily affirmation to transform your mindset",
      },
    },
    cta: { fr: "Activer les notifications", en: "Enable notifications" },
    skipLabel: { fr: "Plus tard", en: "Later" },
    skippable: true,
    next: "ready_to_change",
  },

  // NEW: Engagement/Hype screen (Harry's "Es-tu prêt à changer ?")
  {
    id: "ready_to_change",
    type: "question_single",
    content: {
      title: {
        fr: "Es-tu prêt(e) à transformer ta vie ?",
        en: "Are you ready to transform your life?",
      },
      subtitle: {
        fr: "C'est maintenant que tout commence",
        en: "This is where it all begins",
      },
      options: [
        {
          id: "yes_now",
          label: { fr: "OUI, c'est maintenant !", en: "YES, it's now!" },
          icon: "🚀",
        },
        {
          id: "yes_ready",
          label: { fr: "Oui, je suis prêt(e)", en: "Yes, I'm ready" },
          icon: "✨",
        },
        {
          id: "lets_try",
          label: { fr: "On essaie !", en: "Let's try!" },
          icon: "💪",
        },
      ],
    },
    next: "loading_program",
  },

  // Loading with anticipation
  {
    id: "loading_program",
    type: "loading",
    content: {
      title: {
        fr: "Création de ton programme personnalisé...",
        en: "Creating your personalized program...",
      },
    },
    duration: 2500,
    next: "program_preview",
  },

  // =========================================================================
  // PHASE 3: PAYWALL TRANSPARENT (4 screens)
  // =========================================================================
  {
    id: "program_preview",
    type: "info",
    content: {
      dynamicContent: (answers: OnboardingAnswers) => {
        const domain = answers.transform_domain as string
        const name = answers.name_input as string
        const programNames: Record<string, LocalizedString> = {
          confidence: { fr: "Confiance en soi", en: "Self-confidence" },
          self_love: { fr: "Amour propre", en: "Self-love" },
          success: { fr: "Succès & Réussite", en: "Success" },
          peace: { fr: "Paix intérieure", en: "Inner peace" },
          relationships: { fr: "Relations", en: "Relationships" },
          abundance: { fr: "Abondance", en: "Abundance" },
        }
        const programName = programNames[domain] || { fr: "Transformation", en: "Transformation" }
        return {
          title: {
            fr: name
              ? `${name}, ton programme ${programName.fr} est prêt !`
              : `Ton programme ${programName.fr} est prêt !`,
            en: name
              ? `${name}, your ${programName.en} program is ready!`
              : `Your ${programName.en} program is ready!`,
          },
          subtitle: {
            fr: "21 jours pour transformer ton mindset",
            en: "21 days to transform your mindset",
          },
        }
      },
      benefits: [
        {
          icon: "✨",
          text: { fr: "Affirmations personnalisées chaque jour", en: "Personalized affirmations every day" },
        },
        {
          icon: "🔔",
          text: { fr: "Rappels aux moments que tu choisis", en: "Reminders at the times you choose" },
        },
        {
          icon: "📱",
          text: { fr: "Widget sur ton écran d'accueil", en: "Widget on your home screen" },
        },
        {
          icon: "📊",
          text: { fr: "Suivi de ta progression", en: "Track your progress" },
        },
        {
          icon: "🎯",
          text: { fr: "Contenu adapté à tes objectifs", en: "Content adapted to your goals" },
        },
      ],
    },
    cta: { fr: "Découvrir mon programme", en: "Discover my program" },
    next: "paywall_timeline",
  },

  {
    id: "paywall_timeline",
    type: "paywall",
    content: {
      title: {
        fr: "Essaie gratuitement, sans engagement",
        en: "Try for free, no commitment",
      },
      subtitle: {
        fr: "Tu ne seras pas facturé(e) aujourd'hui",
        en: "You won't be charged today",
      },
      timelineSteps: [
        {
          day: { fr: "Aujourd'hui", en: "Today" },
          title: { fr: "Accès complet gratuit", en: "Full free access" },
          subtitle: { fr: "Découvre toutes les fonctionnalités", en: "Discover all features" },
          icon: "🎁",
        },
        {
          day: { fr: "Jour 3", en: "Day 3" },
          title: { fr: "Rappel avant facturation", en: "Reminder before billing" },
          subtitle: { fr: "Annule à tout moment, zéro frais", en: "Cancel anytime, zero fees" },
          icon: "🔔",
        },
        {
          day: { fr: "Jour 4", en: "Day 4" },
          title: { fr: "Abonnement actif", en: "Subscription active" },
          subtitle: { fr: "Continue ta transformation", en: "Continue your transformation" },
          icon: "✨",
        },
      ],
    },
    cta: { fr: "Commencer gratuitement", en: "Start for free" },
    next: "payment_processing",
  },

  {
    id: "payment_processing",
    type: "loading",
    content: {
      title: {
        fr: "Activation de ton essai gratuit...",
        en: "Activating your free trial...",
      },
    },
    duration: 2000,
    next: "welcome_success",
  },

  {
    id: "welcome_success",
    type: "success",
    content: {
      dynamicContent: (answers: OnboardingAnswers) => {
        const name = answers.name_input as string
        return {
          title: {
            fr: name ? `Bienvenue ${name} !` : "Bienvenue !",
            en: name ? `Welcome ${name}!` : "Welcome!",
          },
          subtitle: {
            fr: "Ta transformation commence maintenant",
            en: "Your transformation starts now",
          },
        }
      },
      affirmation: {
        fr: "Je suis prêt(e) à créer la vie de mes rêves.",
        en: "I am ready to create the life of my dreams.",
      },
      animation: "confetti",
    },
    cta: { fr: "Voir ma première affirmation", en: "See my first affirmation" },
    next: "app_home",
  },

  // =========================================================================
  // REDIRECT
  // =========================================================================
  {
    id: "app_home",
    type: "redirect",
    content: {},
    next: "HomeScreen",
  },
]

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export const getStepById = (id: string): OnboardingStep | undefined => {
  return ONBOARDING_STEPS.find((step) => step.id === id)
}

export const getNextStepId = (currentStepId: string, answers: OnboardingAnswers): string => {
  const currentStep = getStepById(currentStepId)
  if (!currentStep) return "app_home"

  if (typeof currentStep.next === "function") {
    return currentStep.next(answers)
  }
  return currentStep.next
}

export const getTotalSteps = (): number => {
  return ONBOARDING_STEPS.length
}

export const getStepIndex = (stepId: string): number => {
  return ONBOARDING_STEPS.findIndex((step) => step.id === stepId)
}

export const getUserDomain = (answers: OnboardingAnswers): string => {
  return (answers.transform_domain as string) || "confidence"
}
