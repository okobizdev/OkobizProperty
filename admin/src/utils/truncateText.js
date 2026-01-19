export const truncateText = (text, length = 100) => {
  if (text && text.length > length) {
    return `${text.substring(0, length)}...`;
  }
  return text;
};
