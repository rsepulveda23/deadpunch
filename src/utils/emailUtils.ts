
/**
 * Email Utilities
 * 
 * This file provides common email-related functions used across the application,
 * including validation, formatting, and other helper functions.
 */

/**
 * Validates email format using regex
 * 
 * @param {string} email - Email to validate
 * @returns {boolean} True if email format is valid
 */
export const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Formats user-entered email to remove leading/trailing whitespace
 * 
 * @param {string} email - Raw email input from user
 * @returns {string} Cleaned email string
 */
export const formatEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

/**
 * Obscures part of the email for privacy in UI displays
 * Example: j***@example.com
 * 
 * @param {string} email - Email address to obscure
 * @returns {string} Obscured email
 */
export const obscureEmail = (email: string): string => {
  if (!email || !email.includes('@')) return '';
  
  const [username, domain] = email.split('@');
  if (username.length <= 2) return email; // Don't obscure very short usernames
  
  const firstChar = username.charAt(0);
  const obscuredUsername = `${firstChar}${'*'.repeat(username.length - 1)}`;
  
  return `${obscuredUsername}@${domain}`;
};
