const DEFAULT_API_URL = "http://localhost:5000/api";

function getApiOrigin(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

  try {
    return new URL(configuredUrl).origin;
  } catch {
    return "http://localhost:5000";
  }
}

export function resolveMediaUrl(path?: string | null): string {
  if (!path) return "/globe.svg";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }

  if (path.startsWith("/") && !path.startsWith("/uploads/")) {
    return path;
  }

  return `${getApiOrigin()}${path.startsWith("/") ? path : `/${path}`}`;
}
