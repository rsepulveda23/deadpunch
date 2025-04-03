
/**
 * Validates an email address format
 * 
 * Uses a regular expression to check if the email format is valid
 * 
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid, false otherwise
 */
export function validateEmailFormat(email: string): boolean {
  if (!email) return false;

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Formats an email address by trimming and converting to lowercase
 * 
 * @param {string} email - Email address to format 
 * @returns {string} Formatted email address
 */
export function formatEmail(email: string): string {
  return email ? email.trim().toLowerCase() : '';
}
