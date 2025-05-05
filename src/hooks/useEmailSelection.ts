import { useState } from "react";
import { Enroll } from "../types/indes";

export const useEmailSelection = () => {
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  const handleCheckboxChange = (email: string | null, checked: boolean) => {
    if (!email) return;

    setSelectedEmails((prev) => {
      if (checked) {
        return [...prev, email];
      } else {
        return prev.filter((e) => e !== email);
      }
    });
  };

  const handleSelectAll = (enrolls: Enroll[]) => {
    const validEmails = enrolls
      .map((enroll) => enroll.EMAIL_ADDR)
      .filter((email): email is string => email !== null);

    setSelectedEmails((prev) => {
      const newEmails = new Set([...prev, ...validEmails]);
      return Array.from(newEmails);
    });
  };

  const handleDeselectAll = () => {
    setSelectedEmails([]);
  };

  const getMailtoLink = (title: string) => {
    if (selectedEmails.length === 0) return "#";
    const subject = title || "";
    const body = "";
    const link = `mailto:${selectedEmails.join(
      ","
    )}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return link;
  };

  return {
    selectedEmails,
    handleCheckboxChange,
    handleSelectAll,
    handleDeselectAll,
    getMailtoLink,
  };
};
