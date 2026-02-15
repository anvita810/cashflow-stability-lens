/**
 * Local API client for running the app on localhost without Base44.
 * - Auth: single dev user, no real login/logout.
 * - Analytics: console.log with same semantics as Base44 appLogs.
 */

const DEV_USER = {
  id: 'local-dev-user',
  email: 'dev@localhost',
  name: 'Local Dev User',
  role: 'admin',
};

export const localClient = {
  auth: {
    me: () => Promise.resolve(DEV_USER),
    logout: (returnUrl) => {
      if (returnUrl) window.location.href = returnUrl;
    },
    redirectToLogin: (returnUrl) => {
      if (returnUrl) window.location.href = returnUrl;
    },
  },
  appLogs: {
    logUserInApp: (pageName) => {
      console.log('[AppLog]', 'logUserInApp', { pageName, timestamp: new Date().toISOString() });
      return Promise.resolve();
    },
  },
};
