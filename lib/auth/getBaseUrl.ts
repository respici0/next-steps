export function getBaseUrl() {
  if (process.env.VERCEL_ENV === 'production') {
    return process.env.AUTH_PROD_URL;
  }

  if (process.env.VERCEN_ENV === 'preview') {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}
