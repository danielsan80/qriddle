export const config = {
  // Site URL (used for credits QR code)
  siteUrl: 'https://qriddle.app',

  // How long "link copied" stays on the button
  linkCopiedConfirmationMs: 5000,

  // Default QR text (easter egg)
  defaultQrText: 'My precioussss!!!',

  // Maze generation
  biasStraight: 0.7,

  // Puzzle render
  puzzle: {
    cellSize: 12,
    backgroundColor: '#f8f5ed',
    borderColor: '#444444',
    dotColor: '#000000',
    dotRadius: 0.15,
  },

  // QR image render
  qr: {
    cellSize: 12,
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

  // PDF render
  pdf: {
    textColor: '#523c1b',
  },
} as const;
