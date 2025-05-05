import { getDateTime } from "./getDateTime";

describe("getDateTime", () => {
  test("formats the date according to user preferences", () => {
    // Default preferences are set in jest.setup.js

    // Test the specific case from requirements
    const rawDate = "2023-12-05T15:00:00Z";
    const result = getDateTime(rawDate);

    // Expected result should use the actual timezone name from preferences (CET)
    expect(result).toBe("12/05/2023 04:00 PM CET");
  });

  test("handles different time zones correctly", () => {
    // Set up test case with EST time zone
    Object.defineProperty(window, "preferences", {
      value: {
        ...window.preferences,
        timeZone: "America/New_York", // EST/EDT
      },
      writable: true,
    });

    const rawDate = "2023-12-05T15:00:00Z";
    const result = getDateTime(rawDate);

    // Reset time zone to CET for other tests
    Object.defineProperty(window, "preferences", {
      value: {
        ...window.preferences,
        timeZone: "CET",
      },
      writable: true,
    });

    // EST is UTC-5, so 15:00 UTC = 10:00 EST
    expect(result).toContain("10:00 AM");
    expect(result).toContain("America/New_York");
  });

  test("handles different date patterns correctly", () => {
    // Set up test case with MM/dd/yyyy pattern
    Object.defineProperty(window, "preferences", {
      value: {
        ...window.preferences,
        datePattern: "MM/dd/yyyy",
      },
      writable: true,
    });

    const rawDate = "2023-12-05T15:00:00Z";
    const result = getDateTime(rawDate);

    // Reset date pattern for other tests
    Object.defineProperty(window, "preferences", {
      value: {
        ...window.preferences,
        datePattern: "dd.MM.yyyy",
      },
      writable: true,
    });

    // Expected result with MM/dd/yyyy pattern
    expect(result).toContain("12/05/2023");
    expect(result).toContain("04:00 PM");
  });

  test("handles different time patterns correctly", () => {
    // Set up test case with 24-hour format
    Object.defineProperty(window, "preferences", {
      value: {
        ...window.preferences,
        timePattern: "HH:mm",
      },
      writable: true,
    });

    const rawDate = "2023-12-05T15:00:00Z";
    const result = getDateTime(rawDate);

    // Reset time pattern for other tests
    Object.defineProperty(window, "preferences", {
      value: {
        ...window.preferences,
        timePattern: "hh:mm aaa",
      },
      writable: true,
    });

    // Expected result with 24-hour format (16:00 in CET)
    expect(result).toContain("16:00");
    expect(result).not.toContain("AM");
    expect(result).not.toContain("PM");
  });
});
