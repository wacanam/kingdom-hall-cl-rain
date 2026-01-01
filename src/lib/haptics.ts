export const triggerHapticFeedback = (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30
    }
    
    navigator.vibrate(patterns[intensity])
  }
}

export const triggerSwipeHaptic = () => {
  triggerHapticFeedback('medium')
}
