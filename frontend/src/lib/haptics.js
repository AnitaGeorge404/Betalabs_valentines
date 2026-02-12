/**
 * Haptic feedback utilities for enhanced UX
 * Works on mobile devices with vibration API support
 */

// Check if vibration is supported
const isSupported = 'vibrate' in navigator

/**
 * Light tap - for taps, selections
 */
export const lightHaptic = () => {
  if (isSupported) {
    navigator.vibrate(10)
  }
}

/**
 * Medium tap - for button presses
 */
export const mediumHaptic = () => {
  if (isSupported) {
    navigator.vibrate(20)
  }
}

/**
 * Success pattern - double tap for successful actions
 */
export const successHaptic = () => {
  if (isSupported) {
    navigator.vibrate([30, 50, 30])
  }
}

/**
 * Error pattern - single heavy for errors
 */
export const errorHaptic = () => {
  if (isSupported) {
    navigator.vibrate(50)
  }
}

/**
 * Heart beat pattern - for romantic interactions
 */
export const heartbeatHaptic = () => {
  if (isSupported) {
    navigator.vibrate([40, 80, 60, 80, 40])
  }
}

/**
 * Selection change - subtle feedback
 */
export const selectionHaptic = () => {
  if (isSupported) {
    navigator.vibrate(15)
  }
}

/**
 * Match celebration - exciting pattern
 */
export const celebrationHaptic = () => {
  if (isSupported) {
    navigator.vibrate([50, 100, 50, 100, 100, 100, 50])
  }
}
