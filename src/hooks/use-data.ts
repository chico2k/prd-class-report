import { useState, useEffect } from "react";
import { Data, Preferences } from "../types/indes";
import { isDevelopment } from "../utils/dev-utils";

export const useData = () => {
  const [data, setData] = useState<Data | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Use window.data if it exists
        if (window.data) {
          setData(window.data);
        }
        // Otherwise load mock data in development only
        else if (isDevelopment) {
          const { mookData } = await import("../mockData/data");
          setData(mookData);
          window.data = mookData;
        }
        // Use window.preferences if it exists
        if (window.preferences) {
          setPreferences(window.preferences);
        }
        // Otherwise load mock preferences in development only
        else if (isDevelopment) {
          const { preferencesMock } = await import("../mockData/preferences");
          setPreferences(preferencesMock);
          window.preferences = preferencesMock;
        }

        // Otherwise load mock labels in development only
        if (isDevelopment) {
          const { labels } = await import("../mockData/labels");
          window.labels = labels;
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, preferences, isLoading };
};
