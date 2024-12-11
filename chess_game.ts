import _ from "lodash";

// Define types for Pieces and Board
enum PieceType {
  Pawn = "Pawn",
  Rook = "Rook",
  Knight = "Knight",
  Bishop = "Bishop",
  Queen = "Queen",
  King = "King",
}

enum Player {
  White = "White",
  Black = "Black",
}

type Piece = {
  type: PieceType;
  player: Player;
};

type Square = Piece | null;

type Board = Square[][];

type Move = {
  from: [number, number];
  to: [number, number];
};

// Initialize an empty 8x8 board
function createEmptyBoard(): Board {
  return Array.from({ length: 8 }, () => Array(8).fill(null));
}

// Initialize the starting board configuration
function initializeBoard(): Board {
  const board = createEmptyBoard();

  // Place pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: PieceType.Pawn, player: Player.Black };
    board[6][i] = { type: PieceType.Pawn, player: Player.White };
  }

  // Place other pieces for Black
  board[0][0] = board[0][7] = { type: PieceType.Rook, player: Player.Black };
  board[0][1] = board[0][6] = { type: PieceType.Knight, player: Player.Black };
  board[0][2] = board[0][5] = { type: PieceType.Bishop, player: Player.Black };
  board[0][3] = { type: PieceType.Queen, player: Player.Black };
  board[0][4] = { type: PieceType.King, player: Player.Black };

  // Place other pieces for White
  board[7][0] = board[7][7] = { type: PieceType.Rook, player: Player.White };
  board[7][1] = board[7][6] = { type: PieceType.Knight, player: Player.White };
  board[7][2] = board[7][5] = { type: PieceType.Bishop, player: Player.White };
  board[7][3] = { type: PieceType.Queen, player: Player.White };
  board[7][4] = { type: PieceType.King, player: Player.White };

  return board;
}

// Function to print the board
function printBoard(board: Board): void {
  for (const row of board) {
    console.log(
      row
        .map((square) =>
          square ? `${square.player[0]}${square.type[0]}` : "--"
        )
        .join(" ")
    );
  }
  console.log();
}

// Move a piece with basic validation
function movePiece(
  board: Board,
  move: Move,
  currentPlayer: Player
): boolean {
  const { from, to } = move;
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;

  const piece = board[fromRow][fromCol];
  if (!piece) {
    console.log("No piece at the source position.");
    return false;
  }

  if (piece.player !== currentPlayer) {
    console.log("It's not your turn.");
    return false;
  }

  // Example validation: Disallow moving to a square occupied by the same player
  const destination = board[toRow][toCol];
  if (destination && destination.player === currentPlayer) {
    console.log("Cannot move to a square occupied by your own piece.");
    return false;
  }

  // Perform the move
  board[toRow][toCol] = piece;
  board[fromRow][fromCol] = null;
  return true;
}

// Event-driven multiplayer game setup
class ChessGame {
  private board: Board;
  private currentPlayer: Player;
  private moveHistory: Move[];
  private listeners: ((board: Board) => void)[];

  constructor() {
    this.board = initializeBoard();
    this.currentPlayer = Player.White;
    this.moveHistory = [];
    this.listeners = [];
  }

  onUpdate(listener: (board: Board) => void) {
    this.listeners.push(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(_.cloneDeep(this.board)));
  }

  makeMove(move: Move): boolean {
    if (movePiece(this.board, move, this.currentPlayer)) {
      this.moveHistory.push(move);
      this.currentPlayer =
        this.currentPlayer === Player.White ? Player.Black : Player.White;
      this.notifyListeners();
      return true;
    }
    return false;
  }

  getBoard(): Board {
    return _.cloneDeep(this.board);
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }
}

// Exporting ChessGame class to make it accessible outside
export { ChessGame, Move, Player };
