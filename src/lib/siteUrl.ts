/**
 * Resolves the canonical base URL of the website.
 * Follows environment configuration in production (e.g. Netlify URL, NEXT_PUBLIC_SITE_URL),
 * preventing localhost URLs from leaking into production sitemaps or metadata.
 */
export function getBaseUrl(): string {
  // Check explicit site URL environment variables
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL;

  if (envUrl && envUrl.trim()) {
    let clean = envUrl.trim();
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = `https://${clean}`;
    }
    return clean.replace(/\/+$/, "");
  }

  // Check NEXTAUTH_URL if it is not localhost
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  if (
    nextAuthUrl &&
    nextAuthUrl.trim() &&
    !nextAuthUrl.includes("localhost") &&
    !nextAuthUrl.includes("127.0.0.1")
  ) {
    return nextAuthUrl.trim().replace(/\/+$/, "");
  }

  // In production, fallback to production brand domain
  if (process.env.NODE_ENV === "production") {
    return "https://najjarfurniture.com";
  }

  // Development fallback
  return (nextAuthUrl || "http://localhost:3000").replace(/\/+$/, "");
}

/**
 * Returns a clean canonical absolute URL for a given route/path.
 * Strips query parameters, trailing slashes, and duplicate slashes.
 */
export function getCanonicalUrl(path: string = "/"): string {
  const base = getBaseUrl();
  const cleanPath = path.split("?")[0].split("#")[0].trim();

  if (!cleanPath || cleanPath === "/") {
    return base;
  }

  const formattedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  return `${base}${formattedPath.replace(/\/+$/, "")}`;
}

