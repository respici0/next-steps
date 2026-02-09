export function getBaseUrl() {
  if (process.env.VERCEL_ENV === 'production') {
    return process.env.BETTER_AUTH_BASE_URL;
  }

  if (process.env.VERCEL_ENV === 'preview') {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}
