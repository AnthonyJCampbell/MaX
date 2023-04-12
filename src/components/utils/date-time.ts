// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Helper file, containing functions that implement date and time formatting.
 */
import i18n from "i18next";
import log from "src/renderer-logging";

const defaultLocale = "en-US";

/** Locale used to format any date & time in the app. */
let locale = defaultLocale;

/**
 * Get the language that's used by i18next (translation library). It doesn't have a built-in API to
 * do this directly, so we need this rather roundabout way of getting it.
 */
const getAppLanguage = (): string => {
  // Get an array of languages that i18next uses to look for translations, in order of preference.
  // This includes any fallback languages.
  const languages = i18n.languages;

  for (const language of languages) {
    // If we have resource files for a language, that means we can use that language in the app.
    // Since allLanguages is in order of preference, the first match should be the actual language
    // used in the app.
    // Note: "common" is the namespace that we use for all our translation files
    if (i18n.hasResourceBundle(language, "common")) return language;
  }

  return defaultLocale;
};

/**
 * Initialise the locale for date time formatting, according to the app language and the OS region.
 */
export const initDateTimeFormat = (): void => {
  if (window.process.env.FVFramework) {
    // FVs are always run in the default locale for consistency
    locale = defaultLocale;
    return;
  }

  const appLanguage = getAppLanguage();
  const osRegion = window.require("@electron/remote").app.getLocaleCountryCode();

  log.debug(`Got app language "${appLanguage}" and OS region "${osRegion}"`);

  locale = appLanguage;
  if (osRegion && appLanguage) {
    locale = appLanguage.substring(0, 2) + "-" + osRegion;
  }

  log.info(`Time/Date formatting according to locale: ${locale}`);
};

/**
 * dateStyle and timeStyle are preferred to avoid over-specification
 * see Intl.DateTimeFormat docs at
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 */
interface DateTimeFormatOptions {
  dateStyle?: "long" | "short" | "full" | "medium";
  timeStyle?: "long" | "short" | "full" | "medium";
  weekday?: "long" | "short" | "narrow";
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day?: "numeric" | "2-digit";
}

export const formatDateTime = (date: Date, options: DateTimeFormatOptions): string => {
  const dateTimeFormat = new Intl.DateTimeFormat(locale, options);
  return dateTimeFormat.format(date);
};

/**
 * Convert an ISO-8601 timestamp to relative distance from now, in sensible jumps
 * @param timestamp - ISO-8601 formatted timestamp to convert to relative time
 * @param timeAndDate - Whether to show the full date and time
 */
export const convertToRelativeTime = (timestamp: string, timeAndDate = false): string => {
  const date = new Date(timestamp);
  const now = new Date(Date.now());
  const delta = now.getTime() - date.getTime();

  if (delta < 0) {
    log.error(`Timestamp "${timestamp}" seems to be from the future`);
    return formatDateTime(date, { timeStyle: "short" });
  }

  if (timeAndDate) {
    return formatDateTime(date, { timeStyle: "short", dateStyle: "short" });
  }

  // If more than five days ago, display the full date
  if (delta > 5 * 24 * 60 * 60 * 1000) {
    return formatDateTime(date, { dateStyle: "short" });
  }

  // If more than a day ago, display the day of the week
  if (date.getDate() !== now.getDate()) {
    return formatDateTime(date, { weekday: "long" });
  }

  // If more than a minute ago, display time of the day, otherwise display "Just now"
  if (delta > 60 * 1000) {
    return formatDateTime(date, { timeStyle: "short" });
  } else {
    return i18n.t("justNow");
  }
};

/**
 * Convert date to relative distance from now, in sensible jumps
 * @param timestamp - ISO-8601 formatted timestamp (but time of day is ignored)
 */
export const convertToRelativeDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date(Date.now());
  const delta = now.getTime() - date.getTime();

  // If we have a different year, display day, month, year.
  if (now.getFullYear() !== date.getFullYear()) {
    return formatDateTime(date, { dateStyle: "long" });
  }
  // If more than five days ago, display day, month.
  if (delta > 5 * 24 * 60 * 60 * 1000) {
    return formatDateTime(date, { month: "short", day: "numeric" });
  }
  // If we're equal to the day, display "Today". If not, display the day of the week.
  return now.toDateString() === date.toDateString()
    ? i18n.t("today")
    : formatDateTime(date, { weekday: "long" });
};
