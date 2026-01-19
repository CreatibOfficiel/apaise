/**
 * Onboarding Flow Configuration
 *
 * This file defines the complete onboarding flow with 24 screens,
 * including branching logic based on user responses.
 *
 * Reduced from 48 screens (-50%) for better conversion.
 */

import type { TxKeyPath } from "@/i18n"

// =============================================================================
// TYPES
// =============================================================================

export type OnboardingStepType =
  | "splash"
  | "question_single"
  | "question_multi"
  | "input_text"
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
    stat?: {
      number: string
      text: LocalizedString
    }
    rating?: number
    review?: LocalizedString
    benefits?: Array<{ icon: string; text: LocalizedString }>
    steps?: LocalizedString[]
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
// FLOW CONFIGURATION (24 screens)
// =============================================================================

export const ONBOARDING_STEPS: OnboardingStep[] = [
  // =========================================================================
  // PHASE 1: INTRO (1-2)
  // =========================================================================
  {
    id: "splash_combined",
    type: "splash",
    content: {
      title: { fr: "Retrouvez votre calme intérieur", en: "Find your inner calm" },
      subtitle: {
        fr: "grâce à la méditation et la respiration guidée",
        en: "through guided meditation and breathing",
      },
      animation: "breathing_circle",
      stat: {
        number: "+2 millions",
        text: { fr: "de personnes plus sereines", en: "calmer people" },
      },
    },
    autoAdvance: 3000,
    next: "splash_review_1",
  },
  {
    id: "splash_review_1",
    type: "splash",
    content: {
      rating: 5,
      review: {
        fr: "Cette app m'a aidé à gérer mes crises d'anxiété. Je la recommande à tous.",
        en: "This app helped me manage my anxiety attacks. I recommend it to everyone.",
      },
    },
    autoAdvance: 3000,
    next: "name_input",
  },

  // =========================================================================
  // PHASE 2: PROFIL DE BASE (3-5)
  // =========================================================================
  {
    id: "name_input",
    type: "input_text",
    content: {
      title: { fr: "Comment souhaitez-vous être appelé ?", en: "What would you like to be called?" },
      subtitle: {
        fr: "Votre prénom sera utilisé pour personnaliser votre expérience",
        en: "Your name will be used to personalize your experience",
      },
      placeholder: { fr: "Votre prénom", en: "Your first name" },
    },
    skippable: true,
    skipLabel: { fr: "Ignorer", en: "Skip" },
    next: "stat_anxiety",
  },
  {
    id: "stat_anxiety",
    type: "info",
    content: {
      stat: {
        number: "73%",
        text: {
          fr: "des utilisateurs Serein ressentent une réduction de leur anxiété dès la première semaine",
          en: "of Serein users feel a reduction in anxiety within the first week",
        },
      },
    },
    cta: { fr: "Continuer", en: "Continue" },
    next: "main_goal",
  },
  {
    id: "main_goal",
    type: "question_single",
    content: {
      title: { fr: "Quel est votre objectif principal ?", en: "What is your main goal?" },
      subtitle: {
        fr: "Choisissez celui qui vous parle le plus",
        en: "Choose the one that speaks to you most",
      },
      options: [
        {
          id: "reduce_anxiety",
          label: { fr: "Réduire mon anxiété", en: "Reduce my anxiety" },
          icon: "😰",
        },
        { id: "sleep_better", label: { fr: "Mieux dormir", en: "Sleep better" }, icon: "😴" },
        { id: "manage_stress", label: { fr: "Gérer mon stress", en: "Manage my stress" }, icon: "😤" },
        {
          id: "focus",
          label: { fr: "Améliorer ma concentration", en: "Improve my focus" },
          icon: "🎯",
        },
        {
          id: "self_confidence",
          label: { fr: "Gagner en confiance", en: "Build confidence" },
          icon: "💪",
        },
        {
          id: "inner_peace",
          label: { fr: "Trouver la paix intérieure", en: "Find inner peace" },
          icon: "🧘",
        },
      ],
    },
    skippable: false,
    next: "current_feeling",
  },

  // =========================================================================
  // PHASE 3: ÉTAT ÉMOTIONNEL (6-9)
  // =========================================================================
  {
    id: "current_feeling",
    type: "question_single",
    content: {
      title: { fr: "Comment vous sentez-vous en ce moment ?", en: "How are you feeling right now?" },
      options: [
        { id: "great", label: { fr: "Très bien", en: "Great" }, icon: "😊" },
        { id: "good", label: { fr: "Bien", en: "Good" }, icon: "🙂" },
        { id: "okay", label: { fr: "Correct", en: "Okay" }, icon: "😐" },
        { id: "stressed", label: { fr: "Stressé", en: "Stressed" }, icon: "😰" },
        { id: "anxious", label: { fr: "Anxieux", en: "Anxious" }, icon: "😟" },
        { id: "overwhelmed", label: { fr: "Submergé", en: "Overwhelmed" }, icon: "😵" },
      ],
    },
    next: "anxiety_frequency",
  },
  {
    id: "anxiety_frequency",
    type: "question_single",
    content: {
      title: {
        fr: "À quelle fréquence ressentez-vous de l'anxiété ou du stress ?",
        en: "How often do you feel anxiety or stress?",
      },
      options: [
        { id: "rarely", label: { fr: "Rarement", en: "Rarely" } },
        { id: "sometimes", label: { fr: "Parfois", en: "Sometimes" } },
        { id: "often", label: { fr: "Souvent", en: "Often" } },
        { id: "daily", label: { fr: "Tous les jours", en: "Every day" } },
        { id: "constant", label: { fr: "Presque constamment", en: "Almost constantly" } },
      ],
    },
    next: "anxiety_triggers",
  },
  {
    id: "anxiety_triggers",
    type: "question_multi",
    content: {
      title: {
        fr: "Qu'est-ce qui déclenche votre stress ou anxiété ?",
        en: "What triggers your stress or anxiety?",
      },
      subtitle: { fr: "Sélectionnez tout ce qui s'applique", en: "Select all that apply" },
      options: [
        { id: "work", label: { fr: "Le travail", en: "Work" }, icon: "💼" },
        { id: "relationships", label: { fr: "Les relations", en: "Relationships" }, icon: "💑" },
        { id: "health", label: { fr: "Ma santé", en: "My health" }, icon: "🏥" },
        { id: "finances", label: { fr: "L'argent", en: "Money" }, icon: "💰" },
        { id: "future", label: { fr: "L'avenir", en: "The future" }, icon: "🔮" },
        { id: "social", label: { fr: "Les situations sociales", en: "Social situations" }, icon: "👥" },
        { id: "family", label: { fr: "La famille", en: "Family" }, icon: "👨‍👩‍👧" },
        { id: "unknown", label: { fr: "Je ne sais pas", en: "I don't know" }, icon: "❓" },
      ],
      minSelection: 1,
    },
    next: "anxiety_symptoms",
  },
  {
    id: "anxiety_symptoms",
    type: "question_multi",
    content: {
      title: { fr: "Quels symptômes ressentez-vous ?", en: "What symptoms do you experience?" },
      subtitle: { fr: "Sélectionnez tout ce qui s'applique", en: "Select all that apply" },
      options: [
        { id: "racing_thoughts", label: { fr: "Pensées qui s'emballent", en: "Racing thoughts" } },
        { id: "trouble_sleeping", label: { fr: "Difficultés à dormir", en: "Trouble sleeping" } },
        { id: "tension", label: { fr: "Tensions musculaires", en: "Muscle tension" } },
        { id: "breathing", label: { fr: "Difficultés à respirer", en: "Difficulty breathing" } },
        { id: "heart", label: { fr: "Cœur qui s'emballe", en: "Racing heart" } },
        { id: "fatigue", label: { fr: "Fatigue constante", en: "Constant fatigue" } },
        { id: "focus", label: { fr: "Difficultés à me concentrer", en: "Difficulty focusing" } },
      ],
      minSelection: 1,
    },
    next: "education_combined",
  },

  // =========================================================================
  // PHASE 4: ÉDUCATION & ENGAGEMENT (10-16)
  // =========================================================================
  {
    id: "education_combined",
    type: "info",
    content: {
      title: { fr: "La science derrière Serein", en: "The science behind Serein" },
      subtitle: {
        fr: "La respiration consciente active votre système nerveux parasympathique, réduisant instantanément le stress. Avec seulement 5 minutes par jour :",
        en: "Conscious breathing activates your parasympathetic nervous system, instantly reducing stress. With just 5 minutes a day:",
      },
      animation: "breathing_wave",
      benefits: [
        {
          icon: "🧠",
          text: { fr: "Réduction du cortisol (hormone du stress)", en: "Reduced cortisol (stress hormone)" },
        },
        {
          icon: "❤️",
          text: { fr: "Amélioration de la variabilité cardiaque", en: "Improved heart rate variability" },
        },
        { icon: "😴", text: { fr: "Meilleure qualité de sommeil", en: "Better sleep quality" } },
        { icon: "🎯", text: { fr: "Concentration accrue", en: "Increased focus" } },
      ],
    },
    cta: { fr: "Continuer", en: "Continue" },
    next: "experience_meditation",
  },
  {
    id: "experience_meditation",
    type: "question_single",
    content: {
      title: { fr: "Avez-vous déjà essayé la méditation ?", en: "Have you tried meditation before?" },
      options: [
        { id: "never", label: { fr: "Jamais", en: "Never" } },
        { id: "tried", label: { fr: "J'ai essayé mais abandonné", en: "I tried but gave up" } },
        { id: "sometimes", label: { fr: "De temps en temps", en: "Sometimes" } },
        { id: "regular", label: { fr: "Je pratique régulièrement", en: "I practice regularly" } },
      ],
    },
    next: (answers: OnboardingAnswers) => {
      if (answers.experience_meditation === "tried") {
        return "objection_handler"
      }
      return "barriers"
    },
  },
  {
    id: "objection_handler",
    type: "info",
    content: {
      title: { fr: "Vous n'êtes pas seul", en: "You're not alone" },
      subtitle: {
        fr: "68% des gens abandonnent la méditation traditionnelle. Serein est différent : nos exercices durent 3-5 minutes et sont guidés pas à pas.",
        en: "68% of people give up traditional meditation. Serein is different: our exercises last 3-5 minutes and are guided step by step.",
      },
    },
    cta: { fr: "Découvrir", en: "Discover" },
    next: "barriers",
  },
  {
    id: "barriers",
    type: "question_multi",
    content: {
      title: {
        fr: "Qu'est-ce qui vous empêche de prendre soin de vous ?",
        en: "What prevents you from taking care of yourself?",
      },
      options: [
        { id: "no_time", label: { fr: "Je n'ai pas le temps", en: "I don't have time" } },
        { id: "forget", label: { fr: "J'oublie de le faire", en: "I forget to do it" } },
        { id: "no_results", label: { fr: "Je ne vois pas de résultats", en: "I don't see results" } },
        { id: "dont_know_how", label: { fr: "Je ne sais pas comment faire", en: "I don't know how" } },
        {
          id: "hard_to_focus",
          label: { fr: "J'ai du mal à me concentrer", en: "I have trouble focusing" },
        },
        {
          id: "nothing",
          label: { fr: "Rien, je le fais régulièrement", en: "Nothing, I do it regularly" },
        },
      ],
      minSelection: 1,
    },
    next: "barrier_response",
  },
  {
    id: "barrier_response",
    type: "info",
    content: {
      dynamicContent: (answers: OnboardingAnswers) => {
        const barriers = (answers.barriers as string[]) || []

        if (barriers.includes("no_time")) {
          return {
            title: { fr: "Bonne nouvelle !", en: "Good news!" },
            subtitle: {
              fr: "Nos exercices les plus efficaces durent seulement 3 minutes. C'est moins que le temps de faire un café.",
              en: "Our most effective exercises last only 3 minutes. That's less than making a coffee.",
            },
          }
        }
        if (barriers.includes("no_results")) {
          return {
            title: { fr: "Les résultats arrivent vite", en: "Results come quickly" },
            subtitle: {
              fr: "85% de nos utilisateurs ressentent une différence dès la première séance. La clé : la régularité.",
              en: "85% of our users feel a difference from the first session. The key: consistency.",
            },
          }
        }
        if (barriers.includes("forget")) {
          return {
            title: { fr: "On s'occupe de tout", en: "We've got you covered" },
            subtitle: {
              fr: "Nos rappels intelligents s'adaptent à votre routine. Vous n'oublierez plus jamais.",
              en: "Our smart reminders adapt to your routine. You'll never forget again.",
            },
          }
        }
        return {
          title: { fr: "Parfait !", en: "Perfect!" },
          subtitle: {
            fr: "Serein s'adapte à votre rythme et vos besoins.",
            en: "Serein adapts to your pace and needs.",
          },
        }
      },
    },
    cta: { fr: "Continuer", en: "Continue" },
    next: "time_commitment",
  },
  {
    id: "time_commitment",
    type: "question_single",
    content: {
      title: {
        fr: "Combien de temps pouvez-vous consacrer par jour ?",
        en: "How much time can you commit per day?",
      },
      subtitle: { fr: "Vous pourrez toujours ajuster plus tard", en: "You can always adjust later" },
      options: [
        { id: "3min", label: { fr: "3 minutes", en: "3 minutes" } },
        { id: "5min", label: { fr: "5 minutes", en: "5 minutes" }, recommended: true },
        { id: "10min", label: { fr: "10 minutes", en: "10 minutes" } },
        { id: "15min+", label: { fr: "15 minutes ou plus", en: "15 minutes or more" } },
      ],
    },
    next: "worst_time",
  },
  {
    id: "worst_time",
    type: "question_single",
    content: {
      title: {
        fr: "À quel moment de la journée est-ce le plus difficile ?",
        en: "When is it hardest during the day?",
      },
      subtitle: {
        fr: "Nous programmerons vos rappels en conséquence",
        en: "We'll schedule your reminders accordingly",
      },
      options: [
        { id: "morning", label: { fr: "Le matin au réveil", en: "Morning when waking up" } },
        { id: "workday", label: { fr: "Pendant la journée de travail", en: "During the workday" } },
        { id: "evening", label: { fr: "Le soir après le travail", en: "Evening after work" } },
        { id: "night", label: { fr: "La nuit avant de dormir", en: "At night before sleep" } },
        { id: "varies", label: { fr: "Ça varie", en: "It varies" } },
      ],
    },
    next: "notifications_ask",
  },
  {
    id: "notifications_ask",
    type: "notifications_config",
    content: {
      title: { fr: "Recevez vos rappels quotidiens", en: "Get your daily reminders" },
      subtitle: {
        fr: "Un rappel doux pour ne jamais oublier votre moment de calme",
        en: "A gentle reminder to never forget your moment of calm",
      },
    },
    cta: { fr: "Autoriser les notifications", en: "Allow notifications" },
    skipLabel: { fr: "Plus tard", en: "Later" },
    skippable: true,
    next: "content_preferences",
  },

  // =========================================================================
  // PHASE 5: PERSONNALISATION (17-19)
  // =========================================================================
  {
    id: "content_preferences",
    type: "question_multi",
    content: {
      title: {
        fr: "Quels types de contenus vous intéressent ?",
        en: "What types of content interest you?",
      },
      options: [
        {
          id: "breathing",
          label: { fr: "Exercices de respiration", en: "Breathing exercises" },
          icon: "🌬️",
        },
        { id: "meditation", label: { fr: "Méditations guidées", en: "Guided meditations" }, icon: "🧘" },
        { id: "sleep", label: { fr: "Histoires pour dormir", en: "Sleep stories" }, icon: "🌙" },
        { id: "emergency", label: { fr: "SOS anti-anxiété", en: "Anti-anxiety SOS" }, icon: "🆘" },
        { id: "music", label: { fr: "Musique relaxante", en: "Relaxing music" }, icon: "🎵" },
        { id: "nature", label: { fr: "Sons de la nature", en: "Nature sounds" }, icon: "🌿" },
      ],
      minSelection: 2,
    },
    next: "theme_selection",
  },
  {
    id: "theme_selection",
    type: "theme_grid",
    content: {
      title: { fr: "Choisissez votre ambiance", en: "Choose your ambiance" },
      subtitle: {
        fr: "Vous pourrez la changer à tout moment",
        en: "You can change it anytime",
      },
    },
    next: "program_preview",
  },
  {
    id: "program_preview",
    type: "info",
    content: {
      title: { fr: "Votre programme est prêt !", en: "Your program is ready!" },
      benefits: [
        {
          icon: "🌬️",
          text: { fr: "Exercices de respiration quotidiens", en: "Daily breathing exercises" },
        },
        { icon: "🧘", text: { fr: "Méditations personnalisées", en: "Personalized meditations" } },
        { icon: "📊", text: { fr: "Suivi de vos progrès", en: "Progress tracking" } },
        { icon: "🔔", text: { fr: "Rappels intelligents", en: "Smart reminders" } },
      ],
    },
    cta: { fr: "Découvrir mon programme", en: "Discover my program" },
    next: "paywall_timeline",
  },

  // =========================================================================
  // PHASE 6: PAYWALL (20-22)
  // =========================================================================
  {
    id: "paywall_timeline",
    type: "paywall",
    content: {
      title: { fr: "Comment fonctionne l'essai gratuit ?", en: "How does the free trial work?" },
      subtitle: {
        fr: "Aucun frais ne vous sera facturé aujourd'hui",
        en: "You won't be charged today",
      },
    },
    cta: { fr: "Commencer l'essai gratuit", en: "Start free trial" },
    next: "payment_processing",
  },
  {
    id: "payment_processing",
    type: "loading",
    content: {
      title: { fr: "Activation de votre essai...", en: "Activating your trial..." },
    },
    duration: 2000,
    next: "welcome_success",
  },
  {
    id: "welcome_success",
    type: "success",
    content: {
      title: { fr: "Bienvenue dans Serein !", en: "Welcome to Serein!" },
      subtitle: {
        fr: "Votre voyage vers la sérénité commence maintenant",
        en: "Your journey to serenity starts now",
      },
      animation: "confetti",
    },
    cta: { fr: "Commencer", en: "Get started" },
    next: "app_home",
  },

  // =========================================================================
  // PHASE 7: REDIRECT (23)
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
