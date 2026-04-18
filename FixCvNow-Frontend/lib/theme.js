// lib/theme.js
// Single source of truth for all resume template styling.
// To change any color, font, or size — edit ONLY this file.
//
// Each template has its own `color` (rgba, for HTML+PDF),
// `colorWord` (hex, for Word/docx), `sizePdf`, and `sizeWord`
// blocks so every aspect is independently tunable per template.
//
// rgba(0,0,0,X) → Word hex: round((1-X)*255) as 6-digit hex
// rgba(255,255,255,X) on black → hex: round(X*255) as 6-digit hex

// ── Kept for any shared utility code outside templates ────────
export const C = {
  textPrimary:   'rgba(0,0,0,1.00)',
  textBody:      'rgba(0,0,0,0.85)',
  textSecondary: 'rgba(0,0,0,0.65)',
  textMuted:     'rgba(0,0,0,0.45)',
  textFaint:     'rgba(0,0,0,0.25)',
  white:         '#ffffff',
}
export const CW = {
  textPrimary:   '000000',
  textBody:      '262626',
  textSecondary: '595959',
  textMuted:     '8C8C8C',
  textFaint:     'BFBFBF',
  white:         'FFFFFF',
}
export const SZ_PDF  = { name: 18, sectionHead: 11, body: 10, small: 9, micro: 8 }
export const SZ_WORD = { name: 36, sectionHead: 24, body: 22, small: 20, muted: 18 }

// ── Per-template config ───────────────────────────────────────
// Templates import TEMPLATE and do: const T = TEMPLATE['id']
// They must NEVER use hardcoded style values.
export const TEMPLATE = {

  // ── Classic Professional ────────────────────────────────────
  'classic-professional': {
    font: {
      html:      'Arial, sans-serif',
      pdf:       'Helvetica',
      pdfBold:   'Helvetica-Bold',
      pdfItalic: 'Helvetica-Oblique',
      word:      'Arial',
    },
    // HTML + PDF colors (rgba)
    color: {
      textPrimary:   'rgba(0,0,0,1.00)',
      textBody:      'rgba(0,0,0,0.85)',
      textSecondary: 'rgba(0,0,0,0.65)',
      textMuted:     'rgba(0,0,0,0.45)',
      textFaint:     'rgba(0,0,0,0.25)',
      headerBg:      '',
      headerText:    '#000000',
      headerSub:     '#000000',  // contact / sub-labels in header
      accent:        '#000000',                  // section squares, table header bg
      accentText:    '#ffffff',                  // text on accent bg
      borderLight:   'rgba(0,0,0,0.12)',         // subtle interior borders
      panelBg:       'rgba(0,0,0,0.03)',         // alternate-row tint
    },
    // Word/docx colors (hex strings, no #, no rgba)
    colorWord: {
      textPrimary:   '000000',
      textBody:      '262626',
      textSecondary: '595959',
      textMuted:     '8C8C8C',
      textFaint:     'BFBFBF',
      headerBg:      'ffffff',
      headerText:    '000000',
      headerSub:     '000000',
      accent:        '000000',
      accentText:    'FFFFFF',
      panelBg:       'F9FAFB',
    },
    sizePdf:  { name: 18, sectionHead: 11, body: 10, small: 9, micro: 8 },
    sizeWord: { name: 36, sectionHead: 24, body: 22, small: 20, muted: 18 },
  },

  // ── Classic Early Career ─────────────────────────────────────
  // Same as Classic Professional with a light blue header background
  'classic-early-career': {
    font: {
      html:      'Arial, sans-serif',
      pdf:       'Helvetica',
      pdfBold:   'Helvetica-Bold',
      pdfItalic: 'Helvetica-Oblique',
      word:      'Arial',
    },
    color: {
      textPrimary:   'rgba(0,0,0,1.00)',
      textBody:      'rgba(0,0,0,0.85)',
      textSecondary: 'rgba(0,0,0,0.65)',
      textMuted:     'rgba(0,0,0,0.45)',
      textFaint:     'rgba(0,0,0,0.25)',
      headerBg:      '#EFF6FF',
      headerText:    '#000000',
      headerSub:     '#000000',
      accent:        '#000000',
      accentText:    '#ffffff',
      borderLight:   'rgba(0,0,0,0.12)',
      panelBg:       'rgba(0,0,0,0.03)',
    },
    colorWord: {
      textPrimary:   '000000',
      textBody:      '262626',
      textSecondary: '595959',
      textMuted:     '8C8C8C',
      textFaint:     'BFBFBF',
      headerBg:      'EFF6FF',
      headerText:    '000000',
      headerSub:     '000000',
      accent:        '000000',
      accentText:    'FFFFFF',
      panelBg:       'F9FAFB',
    },
    sizePdf:  { name: 18, sectionHead: 11, body: 10, small: 9, micro: 8 },
    sizeWord: { name: 36, sectionHead: 24, body: 22, small: 20, muted: 18 },
  },

  // ── Executive Navy ──────────────────────────────────────────
  'executive-navy': {
    font: {
      html:      'Arial, sans-serif',
      pdf:       'Helvetica',
      pdfBold:   'Helvetica-Bold',
      pdfItalic: 'Helvetica-Oblique',
      word:      'Arial',
    },
    color: {
      textPrimary:   'rgba(0,0,0,1.00)',
      textBody:      'rgba(0,0,0,0.85)',
      textSecondary: 'rgba(0,0,0,0.65)',
      textMuted:     'rgba(0,0,0,0.45)',
      textFaint:     'rgba(0,0,0,0.25)',
      headerBg:      '#000000',
      headerText:    '#ffffff',
      headerSub:     'rgba(255,255,255,0.70)',
      accent:        '#000000',
      accentText:    '#ffffff',
      borderLight:   'rgba(0,0,0,0.12)',
      panelBg:       'rgba(0,0,0,0.03)',
    },
    colorWord: {
      textPrimary:   '000000',
      textBody:      '262626',
      textSecondary: '595959',
      textMuted:     '8C8C8C',
      textFaint:     'BFBFBF',
      headerBg:      '000000',
      headerText:    'FFFFFF',
      headerSub:     'B3B3B3',
      accent:        '000000',
      accentText:    'FFFFFF',
      panelBg:       'F4F6F9',
    },
    sizePdf:  { name: 18, sectionHead: 11, body: 10, small: 9, micro: 8 },
    sizeWord: { name: 36, sectionHead: 24, body: 22, small: 20, muted: 18 },
  },

  // ── Minimal Serif ───────────────────────────────────────────
  'minimal-serif': {
    font: {
      html:      'Arial, sans-serif',
      pdf:       'Helvetica',
      pdfBold:   'Helvetica-Bold',
      pdfItalic: 'Helvetica-Oblique',
      word:      'Arial',
    },
    color: {
      textPrimary:   'rgba(0,0,0,1.00)',
      textBody:      'rgba(0,0,0,0.85)',
      textSecondary: 'rgba(0,0,0,0.65)',
      textMuted:     'rgba(0,0,0,0.45)',
      textFaint:     'rgba(0,0,0,0.25)',
      headerBg:      '#ffffff',
      headerText:    '#000000',
      headerSub:     'rgba(0,0,0,0.70)',
      accent:        '#000000',
      accentText:    '#ffffff',
      borderLight:   'rgba(0,0,0,0.12)',
      panelBg:       'rgba(0,0,0,0.03)',
    },
    colorWord: {
      textPrimary:   '000000',
      textBody:      '262626',
      textSecondary: '595959',
      textMuted:     '8C8C8C',
      textFaint:     'BFBFBF',
      headerBg:      'ffffff',
      headerText:    '000000',
      headerSub:     '000000',
      accent:        '000000',
      accentText:    'FFFFFF',
      panelBg:       'F5F5F5',
    },
    sizePdf:  { name: 18, sectionHead: 11, body: 10, small: 9, micro: 8 },
    sizeWord: { name: 36, sectionHead: 24, body: 22, small: 20, muted: 18 },
  },

  // ── Classic Bold ────────────────────────────────────────────
  'classic-bold': {
    font: {
      html:      'Arial, sans-serif',
      pdf:       'Helvetica',
      pdfBold:   'Helvetica-Bold',
      pdfItalic: 'Helvetica-Oblique',
      word:      'Arial',
    },
    color: {
      textPrimary:   '#000000',
      textBody:      '#1e293b',
      textSecondary: '#1a91f0',
      textMuted:     '#64748b',
      textFaint:     '#cbd5e1',
      headerBg:      '#ffffff',
      headerText:    '#000000',
      headerSub:     '#1a91f0',
      accent:        '#1a91f0',
      accentText:    '#ffffff',
      borderLight:   '#e2e8f0',
      panelBg:       '#f8fafc',
    },
    colorWord: {
      textPrimary:   '000000',
      textBody:      '1E293B',
      textSecondary: '1A91F0',
      textMuted:     '64748B',
      textFaint:     'CBD5E1',
      headerBg:      'FFFFFF',
      headerText:    '000000',
      headerSub:     '1A91F0',
      accent:        '1A91F0',
      accentText:    'FFFFFF',
      panelBg:       'F8FAFC',
    },
    sizePdf:  { name: 20, sectionHead: 11, body: 10, small: 9, micro: 8 },
    sizeWord: { name: 40, sectionHead: 24, body: 22, small: 20, muted: 18 },
  },

  // ── Modern Minimalist ───────────────────────────────────────
  'modern-minimalist': {
    font: {
      html: "'Inter', sans-serif",
      pdf: 'Helvetica',
      pdfBold: 'Helvetica-Bold',
      pdfItalic: 'Helvetica-Oblique',
      word: 'Arial',
    },
    color: {
      textPrimary:   'rgba(30, 41, 59, 1.00)', // Slate-900
      textBody:      'rgba(71, 85, 105, 1.00)', // Slate-600
      textSecondary: 'rgba(100, 116, 139, 1.00)', 
      textMuted:     'rgba(148, 163, 184, 1.00)',
      textFaint:     'rgba(203, 213, 225, 1.00)',
      headerBg:      '#334155', // Deep Sky Blue/Slate from your screenshot
      headerText:    '#ffffff',
      headerSub:     'rgba(255,255,255,0.80)',
      accent:        '#334155', // Diamond icons color
      accentText:    '#ffffff',
      borderLight:   'rgba(226, 232, 240, 1.00)',
      panelBg:       '#ffffff',
    },
    colorWord: {
      textPrimary:   '1E293B',
      textBody:      '475569',
      textSecondary: '64748B',
      textMuted:     '94A3B8',
      textFaint:     'CBD5E1',
      headerBg:      '334155',
      headerText:    'FFFFFF',
      headerSub:     'CCCCCC',
      accent:        '334155',
      accentText:    'FFFFFF',
      panelBg:       'FFFFFF',
    },
        sizePdf:  { name: 18, sectionHead: 11, body: 10, small: 9, micro: 8 },
    sizeWord: { name: 36, sectionHead: 24, body: 22, small: 20, muted: 18 },
  },




}
