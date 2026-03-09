/**
 * Rate Limit Utility
 * 
 * Prevents users from spamming actions by tracking timestamps in localStorage.
 * 
 * @param {string} actionKey - Unique identifier for the action (e.g., 'booking_creation').
 * @param {number} limit - Maximum number of allowed actions within the time window.
 * @param {number} timeWindowMs - Time window in milliseconds (default: 1 minute).
 * @returns {boolean} - Returns true if action is allowed, false if limit exceeded.
 */
export const checkRateLimit = (actionKey, limit = 5, timeWindowMs = 60000) => {
    const storageKey = `rate_limit_${actionKey}`;
    const now = Date.now();

    // Get existing timestamps
    let timestamps = JSON.parse(localStorage.getItem(storageKey) || '[]');

    // Filter out timestamps older than the time window
    timestamps = timestamps.filter(timestamp => now - timestamp < timeWindowMs);

    if (timestamps.length >= limit) {
        return false;
    }

    // Add current timestamp and save
    timestamps.push(now);
    localStorage.setItem(storageKey, JSON.stringify(timestamps));

    return true;
};

/**
 * Get remaining time until rate limit resets (approximate).
 * @param {string} actionKey 
 * @param {number} timeWindowMs 
 * @returns {number} - Remaining milliseconds, or 0 if not limited.
 */
export const getRateLimitResetTime = (actionKey, timeWindowMs = 60000) => {
    const storageKey = `rate_limit_${actionKey}`;
    const now = Date.now();
    let timestamps = JSON.parse(localStorage.getItem(storageKey) || '[]');

    // We only care about the oldest relevant timestamp if we are at the limit
    // actually, if we are at limit, we need to wait until the *oldest* timestamp in the window expires.

    timestamps = timestamps.filter(timestamp => now - timestamp < timeWindowMs);

    if (timestamps.length === 0) return 0;

    // The checked function returns false if length >= limit.
    // So if we are currently rate limited, we need to wait for the oldest one to expire.
    // Oldest is at index 0 (sorted by push order).

    const oldest = timestamps[0];
    const timePassed = now - oldest;
    const remaining = timeWindowMs - timePassed;

    return remaining > 0 ? remaining : 0;
};
