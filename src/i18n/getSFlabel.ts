export const getSFlabel = (label: string) => {
  // Check if key exists in labels
  if (!window.labels[label]) {
    return label;
  }

  return window.labels[label];
};
