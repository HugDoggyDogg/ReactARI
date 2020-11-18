import React from 'react';
import Square from "./Square";

/**
 * Calcule le gagnant.
 * @param squares tableau des grilles.
 * @return Le gagnant de la partie, null si la partie est toujours en cours.
 */
function calculateWinner(squares) {
    const lines = [ // Combinaisons gagnantes
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    console.log("calculating... received squares:", squares);
    let winner = null;
    lines.forEach(validLine => {
        if(
            squares[validLine[0]] === squares[validLine[1]] &&
            squares[validLine[1]] === squares[validLine[2]]
        ) {
            winner = squares[validLine[0]];
            console.log("Winner: ", winner);
        }
    });
    return winner;
}

const initialState = {
    squares: Array(9).fill(null),
    redIsNext: true,
    redWins: 0,
    blueWins: 0,
    vsBot: false,
    gameOver: false,
    winner: null,
}

/**
 * Composant désignant la grille.
 */
class Board extends React.Component {
    /**
     * Constructeur du composant.
     * Doit eppeller le constructeur parent et initialiser l'état locale du composant avec 5 varibles:
     * *squares*: Tableau de 9 éléments initialisés à null.
     * *redIsNext*: Boolean définissant si c'est le tour du joueur "red", initialisé à true.
     * *redWins*: compteur définissant le nombre de victoire de "red", initialisé à 0.
     * *blueWins*: compteur définissant le nombre de victoire de "blue", initialisé à 0.
     * *vsBot*: Boolean définissant si le mode singleplayer est activé ou pas, initialisé à false.
     */


    constructor(){
        super();
        this.state = initialState;
    }

    /**
     * Réinitialise la grille et les scores des joueurs.
     */
    resetGame() {
        this.setState(initialState);
    }

    /**
     * Ajoute 1 point au gagnant et réinitialise la grille.
     * @param winner le gagnant de la partie. Valeur possible: "red" | "blue".
     */
    incrementScore(winner) {
        const {redWins, blueWins} = this.state;
        switch (winner) {
            case "red":
                this.setState({redWins: redWins + 1});
                break;
            case "blue":
                this.setState({blueWins: blueWins + 1});
                break;
            default:
                break;
        }
    }

    shuffle = (array) => {
        array.sort(() => Math.random() - 0.5);
        return array;
    }

    /**
     * Trouve et retourne l'indice d'une case vide au hasard.
     * @param squares tableau de cases.
     * @return indice d'une case vide du tableau squares.
     */
    random(squares){
        let available = [];
        squares.forEach((square, index) => {
           if(square === null){
               available.push(index);
           }
        });
        if(available.length === 0) {
            console.log("Aucune case vide pour jouer");
            return null;
        } else {
            available = this.shuffle(available);
            return available[0];
        }
    }

    /**
     * Fonction déclenché lors du clique sur une case de la grille.
     * Dans le cas ou la partie est finie ou i différent de null : ne fait rien, sinon dans le cas de
     * multiplayer, met à jour la case d'indice *i* avec la valeur du joueur actuel
     * et met à jour l'état de *squares* et *redIsNext*, sinon dans le cas de singleplayer
     * met à jour la case d'indice *i* à "red" et joue le tour de l'ordinateur.
     * @param i Indice de la case
     */
    handleClick(i) {
        const {redIsNext, squares, vsBot, gameOver} = this.state;
        if(gameOver) return null;
        let winner = calculateWinner(squares);
        if(!!winner || squares[i] !== null) return null;
        let newSquares = Array.from(squares);
        const currentPlayer = redIsNext ? "red" : "blue";

        if (vsBot) {
            newSquares[i] = currentPlayer;
            const winner2 = calculateWinner(newSquares);
            console.log("has winner2:", winner2);
            if(!!winner2) {
                this.setState({
                    gameOver: true,
                    winner: winner2,
                    squares: newSquares,
                })
            } else {
                this.setState({
                    squares: newSquares,
                    redIsNext: !redIsNext,
                });
            }
        } else {
            newSquares[i] = "red";
            const winner3 = calculateWinner(newSquares);
            if(!!winner3) {
                this.setState({
                    gameOver: true,
                    winner: winner3,
                    squares: newSquares,
                })
            } else {
                const AImove = this.random(newSquares);
                newSquares[AImove] = "blue";
                const winner4 = calculateWinner(newSquares);
                console.log("AI move: square ", AImove);
                if(!!winner4) {
                    this.setState({
                        gameOver: true,
                        winner: winner4,
                        squares: newSquares,
                    })
                } else {
                    this.setState({
                        squares: newSquares,
                    });
                }

            }
        }
    }

    /**
     * Réinitialise la grille et les scores des joueurs lors du clique sur le bouton reset.
     */
    handleReset = () => {
        this.resetGame();
    };

    switchGameMode = () => {
        const {vsBot} = this.state;
        this.setState({vsBot: !vsBot});
    };

    handleChangeGameMode = () => {
        this.resetGame();
        this.switchGameMode();
    };

    /**
     * Réinitialise la grille et les scores des joueurs et active le mode vsBot lors du clique sur le bouton singleplayer.
     */
    handleSinglePlayerButton = () => {}

    /**
     * Réinitialise la grille et les scores des joueurs et désactive le mode vsBot lors du clique sur le bouton multiplayer.
     */
    handleMultiPlayerButton = () => {}

    /**
     * Retourne la grille (*Square*) d'indice *i* en lui passant la valeur de la case correspondante comme prop.
     * @param i indice de la case.
     * @return un élément *<Square>*.
     */
    renderSquare(i) {
        const {squares} = this.state;
        const squareColor = squares[i];
        return (
          <Square
              bgColor={squareColor}
              onClick={this.handleClick.bind(this, i)}
          />
        );
    }

    /**
     * Représentation du Board.
     * @return un élément <div> représentant le jeu.
     */
    render() {
        const {redWins, blueWins, squares, vsBot, gameOver, winner} = this.state;
        const firstRow = squares.slice(0,3),
            secondRow = squares.slice(3,6),
            thirdRow = squares.slice(6,9);
        const modeText = vsBot ? "single player" : "multiplayer";
        return (
            <div>
                <div className="scoreboard">
                    <div className="red-score"><p>{redWins}</p></div>
                    <div className="blue-score"><p>{blueWins}</p></div>
                </div>
                <input
                    type="button"
                    className="reset"
                    onClick={this.handleReset}
                    value="Reset"
                >
                </input>
                <input
                    type="button"
                    className="handleSinglePlayerButton"
                    onClick={this.handleChangeGameMode}
                    value="singleplayer"
                >
                </input>
                <input
                    type="button"
                    className="handleMultiPlayerButton"
                    onClick={this.handleChangeGameMode}
                    value="multiplayer"
                >
                </input>
                <div>Mode: {modeText}</div>

                <div className="grid">
                    <div className="status">{/*TODO*/}</div>
                    {/*Chaque div de class board-row contient 3 éléments Square dans l'ordre.*/}
                    <div className="board-row">
                        {
                            firstRow.map((_, i) => this.renderSquare(i))
                        }
                    </div>
                    <div className="board-row">
                        {
                            secondRow.map((_, i) => this.renderSquare(i+3))
                        }
                    </div>
                    <div className="board-row">
                        {
                            thirdRow.map((_, i) => this.renderSquare(i+6))
                        }
                    </div>
                </div>
                <br/>
                {
                    gameOver && (
                        <div>Gagnant: {winner}</div>
                    )
                }
            </div>
        );
    }
}
export default Board;