export function getFirstLetters(str) {
  const words = str.trim().split(/\s+/); // Split by spaces and remove extra spaces
  if (words.length < 2) return ""; // Return empty if there are less than two words

  return words[0][0] + words[1][0]; // Get the first letter of the first two words
}
