// this is lib/colors.js
// Color tokens for FixCVNow
export const COLORS = {
  blue: '#1E3A5F',
  green: '#2BB673',
  white: '#FFFFFF',
  buttonGrey: '#7D9287',
  bgLight: '#F8FAFC',
  textDark: '#1E293B',
  textMuted: '#64748B',
  border: '#E2E8F0',
}

export const getColorClasses = (colorName) => {
  switch (colorName) {
    case 'blue':
      return 'from-blue-900 to-blue-800'
    case 'green':
      return 'from-emerald-500 to-emerald-600'
    default:
      return ''
  }
}
