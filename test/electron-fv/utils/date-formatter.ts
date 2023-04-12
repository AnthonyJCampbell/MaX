// Copyright 2021 Metaswitch Networks - Highly Confidential Material

interface DateTimeFormatOptions {
  dateStyle?: "long" | "short" | "full" | "medium";
  timeStyle?: "long" | "short" | "full" | "medium";
  weekday?: "long" | "short" | "narrow";
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day?: "numeric" | "2-digit";
}

export const formatDateTime = (date: Date, options: DateTimeFormatOptions): string => {
  const dateTimeFormat = new Intl.DateTimeFormat("en-US", options);
  return dateTimeFormat.format(date);
};

/**
 * Converts a timestamp to local time string, adjusting it to the timezone.
 *
 * @param timestamp A date timestamp as string, example: "2020-06-19T17:31:10Z"
 * @returns Localised time string, example: "2:05pm"
 */
export const toLocalTimeString = (timestamp: string): string => {
  const date = new Date(timestamp);
  return formatDateTime(date, { timeStyle: "short" });
};

/**
 * Convert a timestamp to local date and time string, adjusting it to the timezone.
 *
 * @param timestamp A date timestamp as string, example: "2020-06-19T17:31:10Z"
 * @returns Localised date and time string, example: "5:31 PM, 19/6/20"
 */
export const toLocalDateTimeString = (timestamp: string): string => {
  const date = new Date(timestamp);

  return formatDateTime(date, { timeStyle: "short", dateStyle: "short" });
};
