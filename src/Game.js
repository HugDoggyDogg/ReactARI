import React from 'react';
import Board from "./Board";

/**
 * Composant désignant le jeu.
 */
class Game extends React.Component {
  render() {
    return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
        </div>
    );
  }
}
export default Game;