import type { SyntheticEvent } from "react";

export const EMPTY_IMG_SVG = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">' +
    '<rect width="300" height="400" fill="#ececec"/>' +
    '<circle cx="120" cy="135" r="30" fill="#d5d5d5"/>' +
    '<path d="M45 330 L115 240 L170 300 L215 260 L275 330 Z" fill="#d5d5d5"/>' +
    "</svg>",
)}`;

export const listenerImgError = (event: SyntheticEvent<HTMLImageElement>) => {
  const img = event.currentTarget;
  if (img.src.startsWith("data:image/svg+xml")) return;
  img.src = EMPTY_IMG_SVG;
};
