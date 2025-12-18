/**
 * Lobbi Brand Colors
 * Extracted from the mobile app for consistency
 */

export const COLORS = {
  // Core colors
  background: '#0F1923',      // Deep dark navy
  card: '#1F2937',            // Slightly lighter dark
  primary: '#FF4655',         // Vivid Red/Pink (Valorant-like)
  secondary: '#00E5FF',       // Cyan accent for tech feel
  
  // Text colors
  text: '#ECE8E1',            // Off-white
  textSecondary: '#8B9BB4',   // Cool grey
  
  // Utility colors
  success: '#10B981',         // Bright green
  border: '#2A3647',
  premium: '#F4D03F',         // Gold
  
  // Card background variants
  cardVariants: {
    red: '#53212B',
    blue: '#2C3E50',
    orange: '#D35400',
    green: '#27AE60',
  }
};

// CSS custom properties string for easy injection
export const CSS_VARIABLES = `
  --color-background: ${COLORS.background};
  --color-card: ${COLORS.card};
  --color-primary: ${COLORS.primary};
  --color-secondary: ${COLORS.secondary};
  --color-text: ${COLORS.text};
  --color-text-secondary: ${COLORS.textSecondary};
  --color-success: ${COLORS.success};
  --color-border: ${COLORS.border};
  --color-premium: ${COLORS.premium};
`;

