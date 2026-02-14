import { range } from './helpers.js'

const MAX_GAMES_TO_PLAY = 40_000;
const BOARD_SIZE = 8;
const cols = range(BOARD_SIZE, "a");
const rows = range(BOARD_SIZE, 1);
const MOVE_ANIMATION_DURATION_MS = 1;

export {MAX_GAMES_TO_PLAY, BOARD_SIZE, cols, rows, MOVE_ANIMATION_DURATION_MS}