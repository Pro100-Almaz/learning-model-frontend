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
    profile: 'Профиль',
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
    stepScores: 'Чего ждёшь от других предметов?',
    stepGoal: 'Какой балл считаешь грантовым?',
    next: 'Дальше',
    back: 'Назад',
    finish: 'Готово',
  },

  dashboard: {
    greeting: (name: string) => `Привет, ${name}`,
    keepLearning: 'Продолжить обучение',
    weakSpotHeading: 'Что подтянуть',
    noTargetCta: 'Установи цель и пройди пробный тест — нарисуем траекторию.',
  },

  catalog: {
    title: 'Темы',
    empty: 'Тут пока пусто — модули скоро появятся.',
  },

  lesson: {
    ctaTakeTest: 'Пройти тест по теме',
    ctaDisabled: 'Тест ещё не подготовлен',
  },

  test: {
    questionProgress: (i: number, n: number) => `Вопрос ${i} из ${n}`,
    submit: 'Ответить',
    next: 'Дальше',
    finish: 'Завершить',
    timeLeft: (s: string) => `Осталось ${s}`,
    warningSoon: 'Меньше минуты!',
  },

  results: {
    score: 'Твой балл',
    review: 'Разбор ошибок',
    correctAnswer: 'Правильный ответ',
    explanation: 'Объяснение',
  },

  analytics: {
    title: 'Аналитика',
    radar: 'Карта тем',
    recommendations: 'Что подтянуть',
    empty: 'Пройди первый тест — здесь появится твоя карта сильных и слабых тем.',
  },

  grant: {
    title: 'Калькулятор гранта',
    cta: 'Рассчитать',
    blockedNoMock: 'Сначала пройди пробный тест по математике — без него не рассчитать прогноз.',
    predictedHeading: 'Твой прогноз',
    qualifyingHeading: 'Проходишь на грант',
    goalHeading: 'До цели',
    advice: (gap: number, tag: string) => `До цели не хватает ${gap} — упор на ${tag}.`,
  },

  profile: {
    title: 'Профиль',
    level: 'Уровень',
    xp: 'Очки опыта',
    streak: 'Серия дней',
    longestStreak: 'Самая длинная серия',
  },

  states: {
    loading: 'Загружаем…',
    retry: 'Попробовать ещё раз',
    emptyDefault: 'Пока пусто.',
    errorDefault: 'Что-то пошло не так.',
  },

  validation: {
    required: 'Это поле обязательно',
    intRange: (min: number, max: number) => `Введи число от ${min} до ${max}`,
  },
} as const

export type Dict = typeof ru
