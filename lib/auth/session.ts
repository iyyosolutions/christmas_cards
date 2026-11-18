export const REMEMBER_COOKIE = "hh-remember";

type CookieOptions = {
  maxAge?: number;
  expires?: Date;
  [key: string]: unknown;
};

export function withRemember(options: CookieOptions, remember: boolean): CookieOptions {
  if (remember) return options;
  const sessionOptions = { ...options };
  delete sessionOptions.maxAge;
  delete sessionOptions.expires;
  return sessionOptions;
}
