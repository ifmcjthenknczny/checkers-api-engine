export type RulesSection = {
  title: string
  points: string[]
}

export const RULES_INTRO =
  'This app follows a Polish checkers-style ruleset implemented directly in the move, promotion, turn, board, and game-over helpers.'

export const RULES_SECTIONS: RulesSection[] = [
  {
    title: 'Board and Initial Setup',
    points: [
      'The game uses an 8x8 board with 32 playable dark squares.',
      'Only playable dark squares are used for movement and captures.',
      'Each player starts with 12 pieces.',
      'White pieces move first.',
    ],
  },
  {
    title: 'Piece Movement',
    points: [
      'Regular pieces move one square diagonally forward to an empty playable square.',
      'Queens move diagonally in any direction for any number of empty playable squares.',
    ],
  },
  {
    title: 'Capturing Rules',
    points: [
      'Capturing is mandatory. If at least one capture is available, non-capturing moves are illegal.',
      'Regular pieces capture by jumping over an adjacent enemy piece and landing on the next empty square.',
      'Queens capture by jumping over one enemy piece and may land on any empty square beyond it on the same diagonal.',
      'After a capture, if another capture is available from the landing square, the same piece must continue capturing in the same turn.',
      'During a capture chain, immediate reversal of the previous capture direction is forbidden.',
    ],
  },
  {
    title: 'Promotion',
    points: [
      'A regular piece that reaches the farthest rank is promoted to a queen.',
      'If the piece reaches the promotion rank during a capture chain, promotion is applied only after the turn ends.',
    ],
  },
  {
    title: 'Turn Flow and Game End',
    points: [
      'A turn ends after a legal non-capturing move or after the final capture in a forced chain.',
      'A player loses if they have no pieces left or no legal moves.',
      'The game is a draw after 30 consecutive queen moves without any capture.',
    ],
  },
]
