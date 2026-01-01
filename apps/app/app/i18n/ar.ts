import demoAr from "./demo-ar" // @demo remove-current-line
import { Translations } from "./en"

const ar: Translations = {
  common: {
    ok: "نعم",
    cancel: "حذف",
    back: "خلف",
    logOut: "تسجيل خروج", // @demo remove-current-line
  },
  welcomeScreen: {
    postscript:
      "ربما لا يكون هذا هو الشكل الذي يبدو عليه تطبيقك مالم يمنحك المصمم هذه الشاشات وشحنها في هذه الحالة",
    readyForLaunch: "تطبيقك تقريبا جاهز للتشغيل",
    exciting: "اوه هذا مثير",
    letsGo: "لنذهب", // @demo remove-current-line
  },
  errorScreen: {
    title: "هناك خطأ ما",
    friendlySubtitle:
      "هذه هي الشاشة التي سيشاهدها المستخدمون في عملية الانتاج عند حدوث خطأ. سترغب في تخصيص هذه الرسالة ( الموجودة في 'ts.en/i18n/app') وربما التخطيط ايضاً ('app/screens/ErrorScreen'). إذا كنت تريد إزالة هذا بالكامل، تحقق من 'app/app.tsp' من اجل عنصر <ErrorBoundary>.",
    reset: "اعادة تعيين التطبيق",
    traceTitle: "خطأ من مجموعة %{name}", // @demo remove-current-line
  },
  emptyStateComponent: {
    generic: {
      heading: "فارغة جداً....حزين",
      content: "لا توجد بيانات حتى الآن. حاول النقر فوق الزر لتحديث التطبيق او اعادة تحميله.",
      button: "لنحاول هذا مرّة أخرى",
    },
  },
  deleteAccountModal: {
    title: "حذف الحساب",
    subtitle: "لا يمكن التراجع عن هذا الإجراء.",
    infoProfile: "سنقوم بإزالة بيانات ملفك الشخصي والتفضيلات والإعدادات المحفوظة.",
    infoSubscriptions: "سيتم قطع الاتصال بالاشتراكات النشطة من حسابك.",
    infoSignOut: "سيتم تسجيل الخروج من جميع الأجهزة.",
    confirmLabel: "أفهم أن هذا دائم",
    confirmHint: "ستحتاج إلى إنشاء حساب جديد للعودة.",
    cancelButton: "إلغاء",
    deleteButton: "حذف حسابي",
    errorGeneric: "تعذر حذف حسابك الآن.",
  },
  editProfileModal: {
    title: "تعديل الملف الشخصي",
    firstNameLabel: "الاسم الأول",
    firstNamePlaceholder: "أدخل اسمك الأول",
    lastNameLabel: "اسم العائلة",
    lastNamePlaceholder: "أدخل اسم عائلتك",
    cancelButton: "إلغاء",
    saveButton: "حفظ",
    errorGeneric: "فشل تحديث الملف الشخصي",
  },
  pricingCard: {
    mostPopular: "الأكثر شعبية",
    processing: "جاري المعالجة...",
    subscribeNow: "اشترك الآن",
  },
  subscriptionStatus: {
    freePlan: "الخطة المجانية",
    upgradeMessage: "قم بالترقية إلى Pro لفتح جميع الميزات",
    proMember: "عضو Pro",
    subscribedVia: "مشترك عبر {{platform}}",
    renews: "يتجدد",
    expires: "ينتهي",
    on: "في",
    manage: "إدارة",
    platformAppStore: "متجر التطبيقات",
    platformGooglePlay: "Google Play",
    platformWebBilling: "الفوترة على الويب",
    platformMock: "وهمي (التطوير)",
    platformUnknown: "غير معروف",
  },
  homeScreen: {
    goodMorning: "Good morning,",
    dailyChallenge: "Daily Challenge",
    featuredTitle: "Meditate for 10 mins",
    featuredSubtitle: "Clear your mind and start fresh.",
    startNow: "Start Now",
    statStreak: "Streak",
    statCompleted: "Completed",
    statRating: "Rating",
    explore: "Explore",
    uiComponents: "UI Components",
    uiComponentsDescription: "View all pre-built components",
    myProfile: "My Profile",
    myProfileDescription: "Manage account and settings",
    premiumFeatures: "Premium Features",
    premiumFeaturesDescription: "Upgrade to unlock more",
  },
  paywallScreen: {
    welcomeTitle: "Welcome to Pro! 🎉",
    welcomeDescription: "You're all set. Enjoy all premium features!",
    loadingPaywall: "Loading paywall...",
    upgradeTitle: "Upgrade to Pro",
    upgradeDescription: "Unlock all features and remove limits.",
    mockWebDescription:
      "Mock checkout is enabled because no RevenueCat Web key is set. Add a key to use real billing.",
    mockNativeDescription:
      "Mock mode is enabled because no RevenueCat API keys are set. Add keys to use real billing.",
    secureCheckoutDescription: "Secure checkout is handled by RevenueCat.",
    noWebOfferingError:
      "No web offering found. Add a Web Billing offering in RevenueCat and try again.",
    noPackagesError: "No packages available. Configure RevenueCat or add API keys.",
    sdkUnavailableError: "RevenueCat SDK not available on this platform.",
    noOfferingError: "No offering available. Please configure an offering in RevenueCat dashboard.",
    loadFailed: "Failed to load paywall. Please try again.",
    purchaseFailed: "Payment failed. Please try again.",
    processing: "Processing...",
    selectPlan: "Select plan",
    continueWithFree: "Continue with Free",
    unableToLoadTitle: "Unable to Load Paywall",
    tryAgain: "Try Again",
    viewPlans: "View Plans",
  },
  authScreenLayout: {
    closeButton: "إغلاق",
    backButton: "رجوع",
  },
  authCallbackScreen: {
    invalidParams: "Invalid auth callback parameters.",
    loadingMessage: "Signing you in...",
    loadingStatus: "Finalizing your session.",
    errorTitle: "We couldn't finish signing you in",
    backToLogin: "Back to Login",
  },
  resetPasswordScreen: {
    missingToken: "Missing reset token. Please request a new reset link.",
    verifyingTitle: "Securing your reset link...",
    verifyingSubtitle: "One moment while we verify your request.",
    successTitle: "Password updated",
    successSubtitle: "You can now sign in with your new password.",
    backToLogin: "Back to Login",
    title: "Reset your password",
    subtitle: "Choose a new password for your account.",
    passwordLabel: "New password",
    passwordPlaceholder: "Create a new password",
    confirmLabel: "Confirm password",
    confirmPlaceholder: "Re-enter your password",
    submit: "Update Password",
  },
  settings: {
    language: "اللغة",
    languageAutoDetect: "يتم اكتشاف اللغة تلقائياً من إعدادات جهازك",
  },
  badge: {},
  tabs: {},
  onboardingScreenLayout: {},
  // @demo remove-block-start
  errors: {
    invalidEmail: "عنوان البريد الالكتروني غير صالح",
  },
  loginScreen: {
    title: "تسجيل الدخول",
    subtitle:
      ".ادخل التفاصيل الخاصة بك ادناه لفتح معلومات سرية للغاية. لن تخمن ابداً ما الذي ننتظره. او ربما ستفعل انها انها ليست علم الصواريخ",
    emailLabel: "البريد الالكتروني",
    emailPlaceholder: "ادخل بريدك الالكتروني",
    passwordLabel: "كلمة السر",
    passwordPlaceholder: "كلمة السر هنا فائقة السر",
    signIn: "انقر لتسجيل الدخول!",
    forgotPassword: "Forgot Password?",
    orContinueWith: "أو المتابعة باستخدام",
    apple: "Apple",
    google: "Google",
    noAccount: "Don't have an account?",
    signUp: "Sign Up",
    appleSignInFailed: "Failed to sign in with Apple",
    googleSignInFailed: "Failed to sign in with Google",
  },
  demoNavigator: {
    componentsTab: "عناصر",
    debugTab: "تصحيح",
    communityTab: "واصل اجتماعي",
    podcastListTab: "البودكاست",
  },
  demoCommunityScreen: {
    title: "تواصل مع المجتمع",
    tagLine:
      "قم بالتوصيل لمنتدى Infinite Red الذي يضم تفاعل المهندسين المحلّيين ورفع مستوى تطوير تطبيقك معنا",
    joinUsOnSlackTitle: "انضم الينا على Slack",
    joinUsOnSlack:
      "هل ترغب في وجود مكان للتواصل مع مهندسي React Native حول العالم؟ الانضمام الى المحادثة في سلاك المجتمع الاحمر اللانهائي! مجتمعناالمتنامي هو مساحةآمنة لطرح الاسئلة والتعلم من الآخرين وتنمية شبكتك.",
    joinSlackLink: "انضم الي مجتمع Slack",
    makeShipnativeEvenBetterTitle: "اجعل Shipnative افضل",
    makeShipnativeEvenBetter:
      "هل لديك فكرة لجعل Shipnative افضل؟ نحن سعداء لسماع ذلك! نحن نبحث دائماً عن الآخرين الذين يرغبون في مساعدتنا في بناء افضل الادوات المحلية التفاعلية المتوفرة هناك. انضم الينا عبر GitHub للانضمام الينا في بناء مستقبل Shipnative",
    contributeToShipnativeLink: "ساهم في Shipnative",
    theLatestInReactNativeTitle: "الاحدث في React Native",
    theLatestInReactNative: "نخن هنا لنبقيك محدثاً على جميع React Native التي تعرضها",
    reactNativeRadioLink: "راديو React Native",
    reactNativeNewsletterLink: "نشرة اخبار React Native",
    reactNativeLiveLink: "مباشر React Native",
    chainReactConferenceLink: "مؤتمر Chain React",
    hireUsTitle: "قم بتوظيف Infinite Red لمشروعك القادم",
    hireUs:
      "سواء كان الامر يتعلّق بتشغيل مشروع كامل او اعداد الفرق بسرعة من خلال التدريب العلمي لدينا، يمكن ان يساعد Infinite Red اللامتناهي في اي مشروع محلي يتفاعل معه.",
    hireUsLink: "ارسل لنا رسالة",
  },
  demoShowroomScreen: {
    jumpStart: "مكونات او عناصر لبدء مشروعك",
    lorem2Sentences:
      "عامل الناس بأخلاقك لا بأخلاقهم. عامل الناس بأخلاقك لا بأخلاقهم. عامل الناس بأخلاقك لا بأخلاقهم",
    demoHeaderTxExample: "ياي",
    demoViaTxProp: "عبر `tx` Prop",
    demoViaSpecifiedTxProp: "Prop `{{prop}}Tx` عبر",
  },
  demoDebugScreen: {
    howTo: "كيف",
    title: "التصحيح",
    tagLine: "مبروك، لديك نموذج اصلي متقدم للغاية للتفاعل هنا. الاستفادة من هذه النمذجة",
    reactotron: "Reactotron ارسل إلى",
    reportBugs: "الابلاغ عن اخطاء",
    demoList: "قائمة تجريبية",
    demoPodcastList: "قائمة البودكاست التجريبي",
    androidReactotronHint:
      "اذا لم ينجح ذللك، فتأكد من تشغيل تطبيق الحاسوب الخاص Reactotron، وقم بتشغيل عكس adb tcp:9090 \ntcp:9090 من جهازك الطرفي ، واعد تحميل التطبيق",
    iosReactotronHint:
      "اذا لم ينجح ذلك، فتأكد من تشغيل تطبيق الحاسوب الخاص ب Reactotron وأعد تحميل التطبيق",
    macosReactotronHint: "اذا لم ينجح ذلك، فتأكد من تشغيل الحاسوب ب Reactotron وأعد تحميل التطبيق",
    webReactotronHint: "اذا لم ينجح ذلك، فتأكد من تشغيل الحاسوب ب Reactotron وأعد تحميل التطبيق",
    windowsReactotronHint:
      "اذا لم ينجح ذلك، فتأكد من تشغيل الحاسوب ب Reactotron وأعد تحميل التطبيق",
  },
  demoPodcastListScreen: {
    title: "حلقات إذاعية React Native",
    onlyFavorites: "المفضلة فقط",
    favoriteButton: "المفضل",
    unfavoriteButton: "غير مفضل",
    accessibility: {
      cardHint: "انقر مرّتين للاستماع على الحلقة. انقر مرّتين وانتظر لتفعيل {{action}} هذه الحلقة.",
      switch: "قم بالتبديل لاظهار المفضّلة فقط.",
      favoriteAction: "تبديل المفضلة",
      favoriteIcon: "الحلقة الغير مفضّلة",
      unfavoriteIcon: "الحلقة المفضّلة",
      publishLabel: "نشرت {{date}}",
      durationLabel: "المدّة: {{hours}} ساعات {{minutes}} دقائق {{seconds}} ثواني",
    },
    noFavoritesEmptyState: {
      heading: "هذا يبدو فارغاً بعض الشيء.",
      content:
        "لم تتم اضافة اي مفضلات حتى الان. اضغط على القلب في إحدى الحلقات لإضافته الى المفضلة.",
    },
  },
  // @demo remove-block-start
  ...demoAr,
  // @demo remove-block-end
}

export default ar
