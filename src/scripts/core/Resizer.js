/**
 * Resizer — responsive helper utilities.
 */

/**
 * @returns {boolean} true if the device is touch-capable or the viewport is
 *   narrower than the mobile breakpoint.
 */
export function isMobile() {
  const touch =
    'ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0;
  return touch || window.innerWidth < 768;
}

/**
 * @returns {'mobile' | 'tablet' | 'desktop'} the current breakpoint.
 */
export function getBreakpoint() {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}
