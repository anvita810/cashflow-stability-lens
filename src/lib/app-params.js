/**
 * App config for localhost. Optional: set VITE_API_URL in .env.local for a future backend.
 */
const isNode = typeof window === 'undefined';

export const appParams = {
  appId: 'local',
  token: null,
  fromUrl: isNode ? '' : window.location.href,
  functionsVersion: null,
  appBaseUrl: import.meta.env.VITE_API_URL || '',
};
