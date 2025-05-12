import * as sanitizeHtml from 'sanitize-html';

/**
 * Returns the redirect URL based on the user's role.
 *
 * @param role - The role of the user, either 'user' or 'admin'.
 * @returns The redirect URL corresponding to the user's role.
 */
export const getRedirectUrl = (role: 'user' | 'admin'): string => {
  return `${process.env.FRONTEND_URL}/${role === 'admin' ? 'dashboard' : ''}`;
};

/**
 * Sanitizes a given input string by removing unwanted HTML tags and attributes.
 * @param value - The string to be sanitized.
 * @param options - Optional configuration for allowed HTML tags and attributes.
 * @returns The sanitized string with disallowed tags and attributes removed.
 */
export function sanitizeInput(
  value: string,
  options?: sanitizeHtml.IOptions,
): string {
  if (typeof value !== 'string') {
    return value;
  }

  const defaultOptions: sanitizeHtml.IOptions = {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'discard',
  };

  return sanitizeHtml(value, options || defaultOptions);
}
