import { formatInTimeZone } from "date-fns-tz";

export const getDateTime = (rawDate: string) => {
  // date is in the format like this 2024-09-07T07:00:00Z
  const date = new Date(rawDate);
  const userDatePattern = window.preferences.datePattern;
  const userTimeZone = window.preferences.timeZone;
  const userTimePattern = window.preferences.timePattern;

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
  } catch (error) {
    console.error("Error formatting date:", error);
    return date.toISOString();
  }
};

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
