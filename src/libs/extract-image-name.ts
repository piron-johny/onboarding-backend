export const extractFileName = (url: string): string => {
  const match = url.match(/\/([^\/]+)$/);
  if (match && match[1]) {
    return match[1];
  }
  throw new Error('Invalid URL format');
};
