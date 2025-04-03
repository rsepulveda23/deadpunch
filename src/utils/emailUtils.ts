
/**
 * Email Utilities Module
 * 
 * This module provides common email-related functions used across the application,
 * including validation, formatting, and other helper functions for email handling.
 * 
 * @module emailUtils
 */

/**
 * Validates email format using regex
 * 
 * Tests if the provided string matches a standard email format pattern
 * with a username, @ symbol, and domain with at least one period.
 * 
 * @param {string} email - Email string to validate
 * @returns {boolean} True if email format is valid
 */
export const validateEmailFormat = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Formats user-entered email to remove leading/trailing whitespace
 * 
 * Ensures consistent email format by trimming whitespace and converting to lowercase.
 * 
 * @param {string} email - Raw email input from user
 * @returns {string} Cleaned email string
 */
export const formatEmail = (email: string): string => {
  return email ? email.trim().toLowerCase() : '';
};

/**
 * Obscures part of the email for privacy in UI displays
 * 
 * Replaces most of the username portion with asterisks, keeping the first character
 * and the domain intact. For example: "john@example.com" becomes "j***@example.com"
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
