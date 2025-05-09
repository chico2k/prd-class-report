import { formatInTimeZone } from "date-fns-tz";
import { Preferences } from "../../types/indes";

const formatWithUserPreferences = (
  date: Date,
  datePattern: string,
  timePattern: string | undefined,
  timeZone: string | undefined
): string => {
  // Use date-fns to format the base date and time
  let formatted = formatInTimeZone(date, timeZone || "UTC", datePattern);

  // If time pattern is provided, add it
  if (timePattern) {
    const formattedTime = formatInTimeZone(
      date,
      timeZone || "UTC",
      timePattern
    );

    // Handle capitalization of AM/PM
    const upperCaseTime = formattedTime
      .replace(/am/i, "AM")
      .replace(/pm/i, "PM");

    const tzDisplay = timeZone;

    formatted = `${formatted} ${upperCaseTime} ${tzDisplay}`;
  }

  return formatted;
};

export const getDateTime = (
  rawDate: string,
  preferences: Preferences | null
) => {
  if (!preferences) return rawDate;
  const date = new Date(rawDate);
  const userDatePattern = preferences?.datePattern;
  const userTimeZone = preferences?.timeZone;
  const userTimePattern = preferences?.timePattern;

  if (!userDatePattern) {
    return date.toISOString().split("T")[0]; // Default to ISO format if no pattern
  }

  try {
    // Format based on user preferences
    const formattedDate = formatWithUserPreferences(
      date,
      userDatePattern,
      userTimePattern,
      userTimeZone
    );
    return formattedDate;
  } catch {
    return date.toISOString();
  }
};
