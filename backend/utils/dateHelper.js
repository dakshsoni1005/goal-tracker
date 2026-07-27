/**
 * Helper utilities for handling dates and streaks without timezone shifting issues.
 */

/**
 * Get date string in format YYYY-MM-DD
 */
export const getFormattedDate = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get date object from YYYY-MM-DD string
 */
export const parseDateString = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  // Using local timezone constructor to avoid timezone shifting
  return new Date(year, month - 1, day);
};

/**
 * Check if two dates are consecutive days
 */
export const isConsecutiveDay = (olderDateStr, newerDateStr) => {
  const d1 = parseDateString(olderDateStr);
  const d2 = parseDateString(newerDateStr);
  
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays === 1;
};

/**
 * Get dates for past N days
 */
export const getPastDaysList = (daysCount = 7) => {
  const dates = [];
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(getFormattedDate(d));
  }
  return dates;
};

/**
 * Get start and end dates of current week
 */
export const getWeekRange = () => {
  const now = new Date();
  const day = now.getDay();
  // Set to Monday of current week
  const start = new Date(now);
  start.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  start.setHours(0, 0, 0, 0);

  // Set to Sunday of current week
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

/**
 * Get start and end dates of current month
 */
export const getMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
};

/**
 * Get start and end dates of current year
 */
export const getYearRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
  return { start, end };
};
