export const config = {
  // Site URL (used for credits QR code)
  siteUrl: 'https://danilosanchi.net/qriddle',

  // Default QR text (easter egg)
  defaultQrText: 'My precioussss!!!',

  // Maze generation
  biasStraight: 0.7,

  // Puzzle render
  puzzle: {
    cellSize: 6,
    backgroundColor: '#f8f5ed',
    borderColor: '#c0c0c0',
    dotColor: '#a0a0a0',
    dotRadius: 0.3,
  },

  // QR image render
  qr: {
    cellSize: 6,
    blackColor: '#1a1a1a',
    whiteColor: '#ffffff',
  },

  // Ko-fi support link
  kofi: {
    url: 'https://ko-fi.com/danielsan80',
  },

  // Credits QR (bottom of back face, in outer.svg mm coordinates)
  creditsQr: {
    sizeMm: 15,
    centerX: 52.5,
    bottomY: 282,
    textY: 287,
  },

  // Preview (canvas on screen)
  preview: {
    cellSize: 12,
  },

  // PDF render
  pdf: {
    cellSize: 12,
    dotRadius: 0.15,
    textColor: '#523c1b',
  },
} as const;
