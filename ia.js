class IIADifficultyStrategy {
  constructor(humanPlayer, iaPlayer, turn, getBoardWinner) {
    this.humanPlayer = humanPlayer;
    this.iaPlayer = iaPlayer;
    this.turn = turn;
    this.getBoardWinner = getBoardWinner;
  };

    nextMove = (move) => {
        return move;
    }

};

class EasyDifficultyStrategy extends IIADifficultyStrategy {
  nextMove = (board, depth, alpha, beta, isMaximizing) => {
      // Return a score when there is a winner
      const winner = this.getBoardWinner(board);
      if (winner === this.iaPlayer) {
          return 10 - depth;
      }
      if (winner === this.humanPlayer) {
          return -10;
      }
      if (winner === 'tie' && this.turn === 9) {
          return 0;
      }

      const getSimulatedScore = (x, y, player) => {
          board[y][x] = player;
          this.turn += 1;

          const score = this.nextMove(
              board,
              depth + 1,
              alpha,
              beta,
              player === this.humanPlayer
          );

          board[y][x] = null;
          this.turn -= 1;

          return score;
      };

      if (isMaximizing) {
          let bestIaScore = -Infinity;
          let optimalMove;
          for (const y of [0, 1, 2]) {
              for (const x of [0, 1, 2]) {
                  if (board[y][x]) {
                      continue;
                  }

                  const score = getSimulatedScore(x, y, this.iaPlayer);
                  if (score > bestIaScore) {
                      bestIaScore = score;
                      optimalMove = { x, y };
                  }

                  alpha = Math.max(alpha, score);
                  if (beta <= alpha) {
                      break;
                  }
              }
          }

          return (depth === 0) ? optimalMove : bestIaScore;
      }

      let bestHumanScore = Infinity;
      for (const y of [0, 1, 2]) {
          for (const x of [0, 1, 2]) {
              if (board[y][x]) {
                  continue;
              }

              const score = getSimulatedScore(x, y, this.humanPlayer);
              bestHumanScore = Math.min(bestHumanScore, score);

              beta = Math.min(beta, score);
              if (beta <= alpha) {
                  break;
              }
          }
      }

      return bestHumanScore;
  };
};

class MediumDifficultyStrategy extends IIADifficultyStrategy {
  nextMove = (board, depth, alpha, beta, isMaximizing) => {
      // Return a score when there is a winner
      const winner = this.getBoardWinner(board);
      if (winner === this.iaPlayer) {
          return 10;
      }
      if (winner === this.humanPlayer) {
          return depth - 10;
      }
      if (winner === 'tie' && this.turn === 9) {
          return 0;
      }

      const getSimulatedScore = (x, y, player) => {
          board[y][x] = player;
          this.turn += 1;

          const score = this.nextMove(
              board,
              depth + 1,
              alpha,
              beta,
              player === this.humanPlayer
          );

          board[y][x] = null;
          this.turn -= 1;

          return score;
      };

      if (isMaximizing) {
          let bestIaScore = -Infinity;
          let optimalMove;
          for (const y of [0, 1, 2]) {
              for (const x of [0, 1, 2]) {
                  if (board[y][x]) {
                      continue;
                  }

                  const score = getSimulatedScore(x, y, this.iaPlayer);
                  if (score > bestIaScore) {
                      bestIaScore = score;
                      optimalMove = { x, y };
                  }

                  alpha = Math.max(alpha, score);
                  if (beta <= alpha) {
                      break;
                  }
              }
          }

          return (depth === 0) ? optimalMove : bestIaScore;
      }

      let bestHumanScore = Infinity;
      for (const y of [0, 1, 2]) {
          for (const x of [0, 1, 2]) {
              if (board[y][x]) {
                  continue;
              }

              const score = getSimulatedScore(x, y, this.humanPlayer);
              bestHumanScore = Math.min(bestHumanScore, score);

              beta = Math.min(beta, score);
              if (beta <= alpha) {
                  break;
              }
          }
      }

      return bestHumanScore;
  };
}

class HardDifficultyStrategy extends IIADifficultyStrategy {

    nextMove = (board, depth, alpha, beta, isMaximizing) => {
        // Return a score when there is a winner
        const winner = this.getBoardWinner(board);
        if (winner === this.iaPlayer) {
            return 10 - depth;
        }
        if (winner === this.humanPlayer) {
            return depth - 10;
        }
        if (winner === 'tie' && this.turn === 9) {
            return 0;
        }

        const getSimulatedScore = (x, y, player) => {
            board[y][x] = player;
            this.turn += 1;

            const score = this.nextMove(
                board,
                depth + 1,
                alpha,
                beta,
                player === this.humanPlayer
            );

            board[y][x] = null;
            this.turn -= 1;

            return score;
        };

        if (isMaximizing) {
            let bestIaScore = -Infinity;
            let optimalMove;
            for (const y of [0, 1, 2]) {
                for (const x of [0, 1, 2]) {
                    if (board[y][x]) {
                        continue;
                    }

                    const score = getSimulatedScore(x, y, this.iaPlayer);
                    if (score > bestIaScore) {
                        bestIaScore = score;
                        optimalMove = { x, y };
                    }

                    alpha = Math.max(alpha, score);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }

            return (depth === 0) ? optimalMove : bestIaScore;
        }

        let bestHumanScore = Infinity;
        for (const y of [0, 1, 2]) {
            for (const x of [0, 1, 2]) {
                if (board[y][x]) {
                    continue;
                }

                const score = getSimulatedScore(x, y, this.humanPlayer);
                bestHumanScore = Math.min(bestHumanScore, score);

                beta = Math.min(beta, score);
                if (beta <= alpha) {
                    break;
                }
            }
        }

        return bestHumanScore;
    };
};
