// Regular expression for validating email addresses
export const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

/**
 * Validates if the given email address matches the email regex pattern.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if the email address is valid, false otherwise.
 */
export const validateEmail = (email) => {
  return emailRegex.test(email);
};
