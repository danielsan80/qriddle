export const config = {
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

  // Preview (canvas on screen)
  preview: {
    cellSize: 12,
  },

  // PDF render
  pdf: {
    cellSize: 12,
    dotRadius: 0.15,
  },
} as const;
