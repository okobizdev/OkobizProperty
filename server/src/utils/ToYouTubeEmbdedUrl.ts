function toYouTubeEmbedUrl(url: string): string | null {
    try {
        const input = url.trim();
        const ytWatch = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
        const m = input.match(ytWatch);
        if (m && m[1]) {
            return `https://www.youtube.com/embed/${m[1]}`;
        }
        return null;
    } catch (err) {
        return null;
    }
}
export default toYouTubeEmbedUrl;