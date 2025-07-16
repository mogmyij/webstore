/**
 * Shared Validation Utilities
 * 
 * This module provides centralized validation and sanitization utilities
 * for ensuring data consistency and security across the application.
 */

// Regular Expression Constants

/**
 * Regex for validating standard email formats.
 * Ensures email has non-whitespace characters before and after @ symbol,
 * and a valid domain structure with at least one dot.
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Regex for validating Singaporean phone numbers (8 digits starting with 8 or 9).
 * Allows for an optional '+65' prefix with or without a space.
 * e.g., +65 91234567, +6591234567, 91234567
 */
export const SG_PHONE_REGEX = /^(\+65\s?)?[89]\d{7}$/;

/**
 * Regex for validating general names.
 * Allows letters, spaces, apostrophes, and hyphens.
 * e.g., "John Doe", "O'Malley", "Tan-Lee"
 */
export const GENERAL_NAME_REGEX = /^[a-zA-Z'-\s]+$/;

/**
 * Regex for validating address fields.
 * Allows alphanumeric characters, spaces, and common punctuation (#, -, ., ,, /).
 * Prevents script tags and other potential attack vectors.
 */
export const ADDRESS_REGEX = /^[a-zA-Z0-9\s#\-.,/]+$/;

/**
 * Regex for validating 6-digit Singaporean postal codes.
 * Must be exactly 6 digits, no more, no less.
 */
export const POSTAL_CODE_REGEX = /^\d{6}$/;

/**
 * Regex for validating CUIDs (e.g., database IDs).
 * Starts with 'c' and is followed by 24 alphanumeric lowercase characters.
 * Total length of 25 characters.
 */
export const CUID_REGEX = /^c[a-z0-9]{24}$/;

/**
 * Regex to find characters commonly used in XSS or SQL injection attacks.
 * Used for sanitization. Global flag ensures all occurrences are matched.
 * Targets: < > ( ) ' ; &
 */
export const DANGEROUS_CHARS_REGEX = /[<>()';&]/g;

// Utility Functions

/**
 * Sanitizes a string by removing potentially harmful characters and trimming whitespace.
 * This is a basic sanitization function that removes characters commonly used in
 * XSS or SQL injection attacks as a first line of defense.
 * 
 * @param input - The string to sanitize
 * @returns The sanitized string with dangerous characters removed and whitespace trimmed
 */
export const sanitizeString = (input: string): string => {
  return input.trim().replace(DANGEROUS_CHARS_REGEX, '');
};

/**
 * A generic validation function that checks a string against a regex and an optional max length.
 * Provides a consistent interface for validating different types of input data.
 * 
 * @param value - The string value to validate
 * @param regex - The regular expression to test against
 * @param maxLength - Optional maximum length for the string
 * @returns `true` if the value is valid, `false` otherwise
 */
export const validate = (value: string, regex: RegExp, maxLength?: number): boolean => {
  if (maxLength && value.length > maxLength) {
    return false;
  }
  return regex.test(value);
};