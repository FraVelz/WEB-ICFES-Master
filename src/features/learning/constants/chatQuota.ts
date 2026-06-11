/** Anonymous chat assistant quota — server cookie is the source of truth. */
export const CHAT_ANON_COOKIE = 'icfes_chat_anon_used';
export const CHAT_ANON_LIMIT = 3;

/** Authenticated users — daily cap via httpOnly cookie (per browser). */
export const CHAT_AUTH_COOKIE = 'icfes_chat_auth_used';
export const CHAT_AUTH_DAILY_LIMIT = 50;
