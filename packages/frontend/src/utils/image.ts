export function optimizeImage(url: string, width = 800): string {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/fetch/f_auto,q_auto,w_${width}/${url}`;
}