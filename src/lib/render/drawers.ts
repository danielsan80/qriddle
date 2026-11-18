import { config } from '../config';
import { ImageDrawer } from './imageDrawer';
import { PuzzleDrawer } from './puzzleDrawer';

export const qrDrawer = new ImageDrawer(config.qr);
export const puzzleDrawer = new PuzzleDrawer(config.puzzle);
