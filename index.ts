import { ChessGame, Move, Player } from "./chess_game";

const game = new ChessGame();

function printInstructions() {
  console.log("\nHow to play:");
  console.log("1. Moves are entered in the format: fromRow,fromCol toRow,toCol");
  console.log("   Example: 6,0 5,0 to move a white pawn one step forward.");
  console.log("2. Row and column numbers start from 0.");
  console.log("3. Players take turns, starting with White.\n");
}

function printBoard(board: ReturnType<typeof game.getBoard>, currentPlayer: Player) {
  console.log("\nCurrent Board:");
  console.log(`Current Turn: ${currentPlayer}`);
  board.forEach((row, index) => {
    console.log(
      index,
      row.map((sq) => (sq ? `${sq.player[0]}${sq.type[0]}` : "--")).join(" ")
    );
  });
  console.log("\n");
}

function startGame() {
  printInstructions();
  printBoard(game.getBoard(), game.getCurrentPlayer()); 

  game.onUpdate((board) => {
    printBoard(board, game.getCurrentPlayer());
  });

  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function askMove() {
    readline.question(`Enter your move (${game.getCurrentPlayer()}): `, (input: string) => {
      const [from, to] = input.split(" ").map((pos) => pos.split(",").map(Number) as [number, number]);
      if (from && to && game.makeMove({ from, to })) {
        console.log("Move successful!");
      } else {
        console.log("Invalid move. Try again.");
      }
      askMove();
    });
  }

  askMove();
}

startGame();