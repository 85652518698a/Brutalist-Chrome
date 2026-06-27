/**
 * BRUTALIST CHROME — Color System
 * Single source of truth for all color values.
 * Used by both the extension JS and build scripts.
 */

export const COLORS = {
  // Core Palette
  void:       '#0D0D0D',
  obsidian:   '#121212',
  concrete:   '#1A1A1A',
  graphite:   '#2A2A2A',
  ash:        '#3D3D3D',
  smoke:      '#6B6B6B',
  fog:        '#9A9A9A',
  bone:       '#C8C4BC',
  chalk:      '#E8E4DC',
  white:      '#F2EFE8',
  pure:       '#FFFFFF',

  // Accent
  red:        '#DC2626',
  redDim:     '#991B1B',
  redBright:  '#EF4444',

  // Semantic aliases
  bg:         '#0D0D0D',
  bgElevated: '#1A1A1A',
  bgCard:     '#121212',
  border:     '#2A2A2A',
  text:       '#F2EFE8',
  textMuted:  '#9A9A9A',
  accent:     '#DC2626',
};

/** Chrome theme colors mapping */
export const CHROME_THEME_COLORS = {
  // Toolbar & frame
  frame:                 COLORS.void,
  frameInactive:         COLORS.obsidian,
  toolbarColor:          COLORS.concrete,

  // Tabs
  tabBackgroundInactive: COLORS.void,
  tabBackgroundActive:   COLORS.concrete,
  tabText:               COLORS.fog,
  tabTextSelected:       COLORS.white,

  // Omnibox
  omniboxBackground:     COLORS.graphite,
  omniboxText:           COLORS.white,

  // Bookmarks
  bookmarkText:          COLORS.fog,

  // NTP
  ntpBackground:         COLORS.void,
  ntpText:               COLORS.white,
  ntpLink:               COLORS.red,
};

export default COLORS;
