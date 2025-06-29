/**
 * Format date to readable string
 * @param {string | Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Date(date).toLocaleDateString('en-US', options);
}

/**
 * Get excerpt from HTML content
 * @param {string} content - HTML content
 * @param {number} length - Maximum length of excerpt
 * @returns {string} Plain text excerpt
 */
export function getExcerpt(content, length = 150) {
  if (!content) return '';
  
  // Strip HTML tags
  const textContent = content.replace(/<[^>]*>/g, '');
  
  // Return truncated text
  return textContent.length > length 
    ? textContent.substring(0, length).trim() + '...'
    : textContent;
}

/**
 * Calculate reading time estimate
 * @param {string} content - HTML content
 * @returns {number} Estimated reading time in minutes
 */
export function getReadingTime(content) {
  if (!content) return 0;
  
  const textContent = content.replace(/<[^>]*>/g, '');
  const wordsPerMinute = 200;
  const wordCount = textContent.split(/\s+/).length;
  
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, length) {
  if (!text || text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}
