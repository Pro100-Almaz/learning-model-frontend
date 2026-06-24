/**
 * Russian dictionary — single source of truth for every visible string.
 * Kazakh added later by adding a sibling file and a locale switch.
 *
 * Key convention: <feature>.<screen>.<role>  (e.g. auth.login.cta.google)
 * Use sentence case; active voice; no filler.
 */
export const ru = {
  app: {
    name: 'Qadam',
    tagline: 'Готовься к ЕНТ. Считай грант. Карабкайся к цели.',
  },

  nav: {
    home: 'Главная',
    topics: 'Темы',
    tests: 'Тесты',
    analytics: 'Аналитика',
    grant: 'Калькулятор гранта',
    profile: 'Профиль',
  },

  header: {
    menu: 'Меню',
    openMenu: 'Открыть меню',
    closeMenu: 'Закрыть меню',
    search: 'Поиск',
    searchPlaceholder: 'Найти тему или урок',
    searchOpen: 'Открыть поиск',
    searchClose: 'Закрыть поиск',
    searchEmpty: 'Ничего не найдено.',
    searchGroupModules: 'Темы',
    searchGroupLessons: 'Уроки',
  },

  auth: {
    login: {
      heading: 'Войди и начни подъём',
      subheading: 'Поступление на грант — это не загадка, а траектория.',
      ctaGoogle: 'Войти через Google',
      error: 'Не получилось войти. Попробуй ещё раз.',
    },
    logout: 'Выйти',
  },

  onboarding: {
    stepTarget: 'Куда ты целишься?',
    stepTargetBody: 'Выбери ВУЗ и специальность — мы покажем, какой балл нужен.',
    stepScores: 'Чего ждёшь от других предметов?',
    stepScoresBody: 'Это нужно, чтобы посчитать прогноз ЕНТ.',
    stepGoal: 'Какой балл считаешь грантовым?',
    stepGoalBody: 'Можно пропустить — ты всегда сможешь установить цель позже.',
    stepperLabel: (step: number, total: number) => `Шаг ${step} из ${total}`,
    next: 'Дальше',
    back: 'Назад',
    finish: 'Готово',
    finishPending: 'Сохраняем…',
    skip: 'Пропустить',
    uniPlaceholder: 'Найди свой ВУЗ',
    specPlaceholder: 'Выбери специальность',
    specEmpty: 'Сначала выбери ВУЗ',
    selectEmpty: 'Ничего не найдено',
    targetScoreLabel: 'Целевой балл',
    targetScorePlaceholder: 'Например, 115',
    minScore: (n: number | null | undefined) => (n == null ? '—' : `Проходной: ${n}`),
    submitError: 'Не получилось сохранить. Попробуй ещё раз.',
    scoreMaxHint: (n: number) => `макс. ${n}`,
    scoreOutOfRange: (max: number) => `Введи число от 0 до ${max}`,
    scoresStructureNote:
      'ЕНТ — 140 баллов: 3 предмета по 20 + 2 профильных по 40.',
    subjectsUnavailable: 'Не удалось загрузить список предметов.',
  },

  dashboard: {
    greeting: (name: string) => `Привет, ${name}`,
    keepLearning: 'Продолжить обучение',
    weakSpotHeading: 'Что подтянуть',
    noTargetCta: 'Установи цель и пройди пробный тест — нарисуем траекторию.',
    continueWith: (tag: string) => `Подтяни «${tag}»`,
    browseAll: 'Все темы',
    firstMockCta: 'Пройди пробный тест — посчитаем грант',
    firstMockBody: 'Сдашь пробный — увидишь свой прогноз и проходные на грант.',
    trajectoryCta: 'Посмотреть прогноз →',
  },

  catalog: {
    title: 'Темы',
    empty: 'Модули скоро появятся.',
    emptyBody: 'Преподаватель уже добавляет материалы — загляни чуть позже.',
  },

  module: {
    backToTopics: '← Все темы',
    lessonsEmpty: 'Уроки скоро появятся',
    lessonsEmptyBody: 'Когда преподаватель добавит уроки, они окажутся здесь.',
    lessonCompleted: 'Пройдено',
    lessonNotCompleted: 'Урок не пройден',
  },

  lesson: {
    ctaTakeTest: 'Пройти тест',
    ctaDisabled: 'Тест ещё не готов',
    videoUnavailable: 'Видео временно недоступно.',
  },

  test: {
    questionProgress: (i: number, n: number) => `Вопрос ${i} из ${n}`,
    submit: 'Ответить',
    next: 'Дальше',
    finish: 'Завершить',
    timeLeft: (s: string) => `Осталось ${s}`,
    warningSoon: 'Меньше минуты!',
    selectAnswer: 'Выбери вариант ответа',
    correct: 'Верно',
    incorrect: 'Неправильно',
    xpGained: (n: number) => `+${n} XP`,
    startError: 'Не получилось начать тест. Попробуй ещё раз.',
    submitError: 'Не получилось отправить ответ. Попробуй ещё раз.',
  },

  mock: {
    title: 'Пробный тест',
    intro: 'Полная имитация: таймер, без подсказок, разбор только после сдачи.',
    introCta: 'Начать пробный',
    timerWarning: 'Меньше минуты!',
    exit: 'Выйти',
    exitConfirm: 'Уверен? Прогресс сохраняется на устройстве, но привычнее довести до конца.',
    prev: 'Назад',
    next: 'Дальше',
    finish: 'Сдать',
    finishConfirm: 'Сдать пробный?',
    navHeading: 'Вопросы',
    timeIsUp: 'Время вышло — сдаём.',
  },

  results: {
    score: 'Твой балл',
    review: 'Разбор ошибок',
    correctAnswer: 'Правильный ответ',
    explanation: 'Объяснение',
    hero: (pct: number) => `${pct}%`,
    correctCount: (correct: number, total: number) => `${correct} из ${total} правильно`,
    yourAnswer: 'Твой ответ',
    ctaContinue: 'Продолжить обучение',
    ctaRetry: 'Пройти ещё раз',
    notOwner: 'У тебя нет доступа к этому результату.',
    notFound: 'Этот результат не найден.',
  },

  analytics: {
    title: 'Аналитика',
    radar: 'Карта тем',
    recommendations: 'Что подтянуть',
    emptyTitle: 'Карта тем пока пуста',
    emptyBody: 'Пройди первый тест — и здесь появится твоя карта сильных и слабых тем.',
    emptyCta: 'Пройти пробный тест',
    tagsHeading: 'По темам',
    statCount: (correct: number, total: number) => `${correct} из ${total}`,
    noRecommendations: 'Слабых тем нет — продолжай в том же духе.',
  },

  mastery: {
    untouched: 'Не начато',
    familiar: 'Знакомо',
    confident: 'Уверенно',
    mastered: 'Освоено',
  },

  grant: {
    title: 'Калькулятор гранта',
    cta: 'Рассчитать',
    recalculate: 'Пересчитать',
    blockedNoMock: 'Сначала пройди пробный тест по математике — без него не рассчитать прогноз.',
    blockedCta: 'Пройти пробный тест',
    predictedHeading: 'Твой прогноз',
    qualifyingHeading: 'Проходишь на грант',
    goalHeading: 'До цели',
    targetLabel: 'Цель',
    advice: (gap: number, tag: string) => `До цели не хватает ${gap} — упор на ${tag}.`,
    equation: (math: number, other: number, total: number) =>
      `Математика ${math} + другие ${other} = прогноз ${total}`,
    gap: (n: number) => `До цели — ${n}`,
    atTarget: 'Ты прямо на цели',
    aboveTargetBy: (n: number) => `Запас от цели: +${n}`,
    passingBy: (n: number) => `+${n} к проходному`,
    atThreshold: 'Ровно на проходном',
    shortBy: (n: number) => `${n} до проходного`,
    notQualifying: 'Пока не проходишь ни на один грант. Подтяни слабые темы.',
    weakestTag: 'Слабее всего',
  },

  profile: {
    title: 'Профиль',
    level: 'Уровень',
    xp: 'Очки опыта',
    streak: 'Серия дней',
    longestStreak: 'Самая длинная серия',
    xpToNext: (n: number) => `${n} XP до следующего уровня`,
    streakActive: 'Сегодня в строю',
    streakInactive: 'Сегодня ещё не занимался',
    noLevel: 'Без уровня',
  },

  states: {
    loading: 'Загружаем…',
    retry: 'Попробовать ещё раз',
    emptyDefault: 'Пока пусто.',
    errorDefault: 'Что-то пошло не так — попробуй ещё раз.',
    errorBody: 'Проверь соединение или обнови страницу.',
  },

  validation: {
    required: 'Это поле обязательно',
    intRange: (min: number, max: number) => `Введи число от ${min} до ${max}`,
  },
} as const

export type Dict = typeof ru
