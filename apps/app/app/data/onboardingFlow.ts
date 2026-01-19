/**
 * Onboarding Flow Configuration
 *
 * This file defines the complete onboarding flow with 48 screens,
 * including branching logic based on user responses.
 *
 * Based on analysis of I AM Daily Affirmations ($400K/month revenue)
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
// FLOW CONFIGURATION
// =============================================================================

export const ONBOARDING_STEPS: OnboardingStep[] = [
  // =========================================================================
  // PHASE 1: INTRO & SOCIAL PROOF (1-5)
  // =========================================================================
  {
    id: "splash_logo",
    type: "splash",
    content: {
      animation: "breathing_circle",
      stat: {
        number: "+2 millions",
        text: { fr: "de personnes plus sereines", en: "calmer people" },
      },
    },
    autoAdvance: 2000,
    next: "splash_tagline",
  },
  {
    id: "splash_tagline",
    type: "splash",
    content: {
      title: { fr: "Retrouvez votre calme intérieur", en: "Find your inner calm" },
      subtitle: {
        fr: "grâce à la méditation et la respiration guidée",
        en: "through guided meditation and breathing",
      },
    },
    autoAdvance: 2000,
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
    next: "splash_review_2",
  },
  {
    id: "splash_review_2",
    type: "splash",
    content: {
      rating: 5,
      review: {
        fr: "Enfin une app qui m'aide vraiment à dormir. Les exercices de respiration sont incroyables.",
        en: "Finally an app that really helps me sleep. The breathing exercises are incredible.",
      },
    },
    autoAdvance: 3000,
    next: "splash_cta",
  },
  {
    id: "splash_cta",
    type: "splash",
    content: {
      title: {
        fr: "Prêt à commencer votre transformation ?",
        en: "Ready to start your transformation?",
      },
    },
    cta: { fr: "Commencer", en: "Get Started" },
    next: "attribution",
  },

  // =========================================================================
  // PHASE 2: PROFIL DE BASE (6-13)
  // =========================================================================
  {
    id: "attribution",
    type: "question_single",
    content: {
      title: { fr: "Comment avez-vous découvert Serein ?", en: "How did you discover Serein?" },
      subtitle: {
        fr: "Sélectionnez une option pour continuer",
        en: "Select an option to continue",
      },
      options: [
        { id: "tiktok", label: { fr: "TikTok", en: "TikTok" } },
        { id: "instagram", label: { fr: "Instagram", en: "Instagram" } },
        { id: "facebook", label: { fr: "Facebook", en: "Facebook" } },
        { id: "appstore", label: { fr: "App Store", en: "App Store" } },
        { id: "friend", label: { fr: "Ami ou famille", en: "Friend or family" } },
        { id: "therapist", label: { fr: "Mon thérapeute", en: "My therapist" } },
        { id: "other", label: { fr: "Autre", en: "Other" } },
      ],
    },
    skippable: false,
    next: "name_input",
  },
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
    next: "age",
  },
  {
    id: "age",
    type: "question_single",
    content: {
      title: { fr: "Quel âge avez-vous ?", en: "How old are you?" },
      subtitle: { fr: "Pour personnaliser votre contenu", en: "To personalize your content" },
      options: [
        { id: "13-17", label: { fr: "13 à 17 ans", en: "13 to 17 years" } },
        { id: "18-24", label: { fr: "18 à 24 ans", en: "18 to 24 years" } },
        { id: "25-34", label: { fr: "25 à 34 ans", en: "25 to 34 years" } },
        { id: "35-44", label: { fr: "35 à 44 ans", en: "35 to 44 years" } },
        { id: "45-54", label: { fr: "45 à 54 ans", en: "45 to 54 years" } },
        { id: "55+", label: { fr: "55 ans et plus", en: "55 years and older" } },
      ],
    },
    skippable: true,
    next: "gender",
  },
  {
    id: "gender",
    type: "question_single",
    content: {
      title: { fr: "Comment vous identifiez-vous ?", en: "How do you identify?" },
      subtitle: {
        fr: "Pour adapter les méditations guidées",
        en: "To adapt guided meditations",
      },
      options: [
        { id: "female", label: { fr: "Femme", en: "Female" } },
        { id: "male", label: { fr: "Homme", en: "Male" } },
        { id: "other", label: { fr: "Autre", en: "Other" } },
        { id: "prefer_not", label: { fr: "Je préfère ne pas le dire", en: "Prefer not to say" } },
      ],
    },
    skippable: true,
    next: "occupation",
  },
  {
    id: "occupation",
    type: "question_single",
    content: {
      title: { fr: "Quelle est votre situation ?", en: "What is your situation?" },
      options: [
        { id: "student", label: { fr: "Étudiant", en: "Student" } },
        { id: "employed", label: { fr: "Employé", en: "Employed" } },
        { id: "entrepreneur", label: { fr: "Entrepreneur", en: "Entrepreneur" } },
        { id: "job_search", label: { fr: "En recherche d'emploi", en: "Job searching" } },
        { id: "parent", label: { fr: "Parent au foyer", en: "Stay-at-home parent" } },
        { id: "retired", label: { fr: "Retraité", en: "Retired" } },
        { id: "other", label: { fr: "Autre", en: "Other" } },
      ],
    },
    skippable: true,
    next: "loading_profile",
  },
  {
    id: "loading_profile",
    type: "loading",
    content: {
      title: { fr: "Création de votre profil...", en: "Creating your profile..." },
      animation: "breathing_dots",
    },
    duration: 2000,
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
    next: "loading_goal",
  },

  // =========================================================================
  // PHASE 3: ÉTAT ÉMOTIONNEL (14-21)
  // =========================================================================
  {
    id: "loading_goal",
    type: "loading",
    content: {
      title: { fr: "Excellent choix !", en: "Excellent choice!" },
      subtitle: {
        fr: "Nous avons des exercices parfaits pour cet objectif",
        en: "We have perfect exercises for this goal",
      },
    },
    duration: 1500,
    next: "current_feeling",
  },
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
      options: [
        { id: "morning", label: { fr: "Le matin au réveil", en: "Morning when waking up" } },
        { id: "workday", label: { fr: "Pendant la journée de travail", en: "During the workday" } },
        { id: "evening", label: { fr: "Le soir après le travail", en: "Evening after work" } },
        { id: "night", label: { fr: "La nuit avant de dormir", en: "At night before sleep" } },
        { id: "varies", label: { fr: "Ça varie", en: "It varies" } },
      ],
    },
    next: "loading_analysis",
  },
  {
    id: "loading_analysis",
    type: "loading",
    content: {
      title: { fr: "Analyse de votre profil...", en: "Analyzing your profile..." },
      steps: [
        { fr: "Analyse de vos réponses", en: "Analyzing your responses" },
        { fr: "Identification de vos besoins", en: "Identifying your needs" },
        { fr: "Création de votre programme personnalisé", en: "Creating your personalized program" },
      ],
    },
    duration: 3000,
    next: "personalized_insight",
  },
  {
    id: "personalized_insight",
    type: "info",
    content: {
      title: { fr: "Nous avons compris vos besoins", en: "We understand your needs" },
      dynamicContent: (answers: OnboardingAnswers) => {
        const anxietyFreq = answers.anxiety_frequency as string
        const worstTime = answers.worst_time as string

        if (anxietyFreq === "constant" || anxietyFreq === "daily") {
          return {
            title: { fr: "Nous avons compris vos besoins", en: "We understand your needs" },
            subtitle: {
              fr: "Vous vivez avec un stress intense. Nos exercices de respiration d'urgence et nos méditations courtes sont conçus exactement pour cela.",
              en: "You're living with intense stress. Our emergency breathing exercises and short meditations are designed exactly for this.",
            },
          }
        }
        if (worstTime === "night") {
          return {
            title: { fr: "Nous avons compris vos besoins", en: "We understand your needs" },
            subtitle: {
              fr: "Les nuits difficiles peuvent être transformées. Nos histoires pour dormir et méditations nocturnes ont aidé des milliers de personnes.",
              en: "Difficult nights can be transformed. Our sleep stories and nighttime meditations have helped thousands.",
            },
          }
        }
        return {
          title: { fr: "Nous avons compris vos besoins", en: "We understand your needs" },
          subtitle: {
            fr: "Serein va vous accompagner pas à pas vers plus de calme et de sérénité au quotidien.",
            en: "Serein will guide you step by step towards more calm and serenity in your daily life.",
          },
        }
      },
    },
    cta: { fr: "Continuer", en: "Continue" },
    next: "education_intro",
  },

  // =========================================================================
  // PHASE 4: ÉDUCATION & ENGAGEMENT (22-31)
  // =========================================================================
  {
    id: "education_intro",
    type: "info",
    content: {
      title: { fr: "La science derrière Serein", en: "The science behind Serein" },
      subtitle: {
        fr: "La respiration consciente active votre système nerveux parasympathique, réduisant instantanément le stress.",
        en: "Conscious breathing activates your parasympathetic nervous system, instantly reducing stress.",
      },
      animation: "breathing_wave",
    },
    cta: { fr: "En savoir plus", en: "Learn more" },
    next: "education_benefits",
  },
  {
    id: "education_benefits",
    type: "info",
    content: {
      title: { fr: "Avec seulement 5 minutes par jour", en: "With just 5 minutes a day" },
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
    next: "streak_goal",
  },
  {
    id: "streak_goal",
    type: "question_single",
    content: {
      title: { fr: "Quel est votre premier objectif ?", en: "What is your first goal?" },
      options: [
        { id: "3days", label: { fr: "3 jours consécutifs", en: "3 consecutive days" } },
        { id: "7days", label: { fr: "7 jours consécutifs", en: "7 consecutive days" }, recommended: true },
        { id: "21days", label: { fr: "21 jours consécutifs", en: "21 consecutive days" } },
      ],
    },
    next: "streak_preview",
  },
  {
    id: "streak_preview",
    type: "info",
    content: {
      title: { fr: "Créez une habitude durable", en: "Build a lasting habit" },
      subtitle: {
        fr: "Construisez votre série jour après jour",
        en: "Build your streak day by day",
      },
      stat: {
        number: "21",
        text: { fr: "jours pour créer une habitude", en: "days to build a habit" },
      },
    },
    cta: { fr: "Continuer", en: "Continue" },
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
    next: "personalization_intro",
  },

  // =========================================================================
  // PHASE 5: PERSONNALISATION (32-41)
  // =========================================================================
  {
    id: "personalization_intro",
    type: "info",
    content: {
      title: { fr: "Personnalisons votre expérience", en: "Let's personalize your experience" },
      subtitle: {
        fr: "Quelques questions pour créer votre programme sur mesure",
        en: "A few questions to create your custom program",
      },
    },
    cta: { fr: "Continuer", en: "Continue" },
    next: "content_preferences",
  },
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
    next: "voice_preference",
  },
  {
    id: "voice_preference",
    type: "question_single",
    content: {
      title: {
        fr: "Quelle voix préférez-vous pour les méditations ?",
        en: "What voice do you prefer for meditations?",
      },
      options: [
        { id: "female", label: { fr: "Voix féminine", en: "Female voice" } },
        { id: "male", label: { fr: "Voix masculine", en: "Male voice" } },
        { id: "no_preference", label: { fr: "Pas de préférence", en: "No preference" } },
      ],
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
    next: "specific_goals",
  },
  {
    id: "specific_goals",
    type: "question_multi",
    content: {
      title: { fr: "Que souhaitez-vous améliorer ?", en: "What do you want to improve?" },
      subtitle: { fr: "Choisissez au moins un objectif", en: "Choose at least one goal" },
      options: [
        { id: "anxiety", label: { fr: "Gérer l'anxiété", en: "Manage anxiety" } },
        { id: "sleep", label: { fr: "Améliorer mon sommeil", en: "Improve my sleep" } },
        { id: "stress_work", label: { fr: "Stress au travail", en: "Work stress" } },
        { id: "confidence", label: { fr: "Confiance en moi", en: "Self-confidence" } },
        { id: "relationships", label: { fr: "Relations plus sereines", en: "More peaceful relationships" } },
        { id: "focus", label: { fr: "Concentration", en: "Focus" } },
        { id: "emotions", label: { fr: "Gérer mes émotions", en: "Manage my emotions" } },
        { id: "present", label: { fr: "Vivre le moment présent", en: "Live in the moment" } },
      ],
      minSelection: 1,
    },
    next: "challenges",
  },
  {
    id: "challenges",
    type: "question_multi",
    content: {
      title: { fr: "Qu'est-ce qui vous pèse en ce moment ?", en: "What's weighing on you right now?" },
      options: [
        { id: "past", label: { fr: "Ruminations sur le passé", en: "Dwelling on the past" } },
        { id: "future", label: { fr: "Inquiétudes pour l'avenir", en: "Worries about the future" } },
        { id: "self_criticism", label: { fr: "Auto-critique sévère", en: "Harsh self-criticism" } },
        { id: "comparison", label: { fr: "Comparaison aux autres", en: "Comparing to others" } },
        { id: "perfectionism", label: { fr: "Perfectionnisme", en: "Perfectionism" } },
        { id: "loneliness", label: { fr: "Sentiment de solitude", en: "Feeling of loneliness" } },
        { id: "overwhelm", label: { fr: "Sensation d'être débordé", en: "Feeling overwhelmed" } },
      ],
      minSelection: 1,
    },
    next: "loading_program",
  },
  {
    id: "loading_program",
    type: "loading",
    content: {
      title: {
        fr: "Création de votre programme personnalisé...",
        en: "Creating your personalized program...",
      },
      steps: [
        { fr: "Analyse de vos objectifs", en: "Analyzing your goals" },
        { fr: "Sélection des exercices adaptés", en: "Selecting adapted exercises" },
        { fr: "Préparation de votre parcours", en: "Preparing your journey" },
      ],
    },
    duration: 3000,
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
    next: "social_proof_final",
  },
  {
    id: "social_proof_final",
    type: "info",
    content: {
      title: { fr: "Rejoignez notre communauté", en: "Join our community" },
      stat: {
        number: "2M+",
        text: { fr: "Utilisateurs actifs", en: "Active users" },
      },
    },
    cta: { fr: "Continuer", en: "Continue" },
    next: "free_trial_intro",
  },
  {
    id: "free_trial_intro",
    type: "info",
    content: {
      title: { fr: "Essayez Serein gratuitement", en: "Try Serein for free" },
      subtitle: {
        fr: "Nous vous offrons 7 jours d'accès complet, sans engagement",
        en: "We offer you 7 days of full access, no commitment",
      },
      benefits: [
        {
          icon: "✓",
          text: { fr: "Accès illimité à tous les exercices", en: "Unlimited access to all exercises" },
        },
        { icon: "✓", text: { fr: "Méditations personnalisées", en: "Personalized meditations" } },
        { icon: "✓", text: { fr: "Suivi de progression", en: "Progress tracking" } },
        { icon: "✓", text: { fr: "Annulation à tout moment", en: "Cancel anytime" } },
      ],
    },
    cta: { fr: "Commencer mon essai gratuit", en: "Start my free trial" },
    next: "paywall_timeline",
  },

  // =========================================================================
  // PHASE 6: PRÉ-PAYWALL & PAYWALL (42-45)
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
    next: "widget_promo",
  },
  {
    id: "widget_promo",
    type: "info",
    content: {
      title: { fr: "Ajoutez le widget Serein", en: "Add the Serein widget" },
      subtitle: {
        fr: "Accédez à un exercice de respiration rapide directement depuis votre écran d'accueil",
        en: "Access a quick breathing exercise directly from your home screen",
      },
    },
    cta: { fr: "Ajouter le widget", en: "Add widget" },
    skipLabel: { fr: "Plus tard", en: "Later" },
    skippable: true,
    next: "onboarding_complete",
  },

  // =========================================================================
  // PHASE 7: POST-PAYWALL (46-48)
  // =========================================================================
  {
    id: "onboarding_complete",
    type: "loading",
    content: {
      title: { fr: "Tout est prêt !", en: "All set!" },
      subtitle: {
        fr: "Commençons par votre premier exercice",
        en: "Let's start with your first exercise",
      },
    },
    duration: 2000,
    next: "first_exercise",
  },
  {
    id: "first_exercise",
    type: "info",
    content: {
      title: { fr: "Votre premier exercice", en: "Your first exercise" },
      subtitle: {
        fr: "Un exercice simple et puissant pour calmer instantanément votre système nerveux",
        en: "A simple and powerful exercise to instantly calm your nervous system",
      },
    },
    cta: { fr: "Commencer l'exercice", en: "Start exercise" },
    skipLabel: { fr: "Explorer l'app d'abord", en: "Explore app first" },
    skippable: true,
    next: "app_home",
  },
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
