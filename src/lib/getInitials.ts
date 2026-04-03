/**
 * Extracts 2-letter uppercase initials from a participant name.
 * Two-word names: first letter of each word ("Alice Johnson" → "AJ").
 * Single-word names: first two letters ("Bob" → "BO").
 */
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export default getInitials;
