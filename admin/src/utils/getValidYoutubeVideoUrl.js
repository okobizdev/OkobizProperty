export function getValidYouTubeUrl(url) {
    try {
      const regex =
        /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regex);
  
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
  
      return ""; // Not a valid YouTube link
    } catch (error) {
      console.error("Invalid YouTube URL:", error);
      return "";
    }
  }
  