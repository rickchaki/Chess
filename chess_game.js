"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = exports.ChessGame = void 0;
const lodash_1 = __importDefault(require("lodash"));
// Define types for Pieces and Board
var PieceType;
(function (PieceType) {
    PieceType["Pawn"] = "Pawn";
    PieceType["Rook"] = "Rook";
    PieceType["Knight"] = "Knight";
    PieceType["Bishop"] = "Bishop";
    PieceType["Queen"] = "Queen";
    PieceType["King"] = "King";
})(PieceType || (PieceType = {}));
var Player;
(function (Player) {
    Player["White"] = "White";
    Player["Black"] = "Black";
})(Player || (exports.Player = Player = {}));
// Initialize an empty 8x8 board
function createEmptyBoard() {
    return Array.from({ length: 8 }, () => Array(8).fill(null));
}
// Initialize the starting board configuration
function initializeBoard() {
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
function printBoard(board) {
    for (const row of board) {
        console.log(row
            .map((square) => square ? `${square.player[0]}${square.type[0]}` : "--")
            .join(" "));
    }
    console.log();
}
// Move a piece with basic validation
function movePiece(board, move, currentPlayer) {
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
    constructor() {
        this.board = initializeBoard();
        this.currentPlayer = Player.White;
        this.moveHistory = [];
        this.listeners = [];
    }
    onUpdate(listener) {
        this.listeners.push(listener);
    }
    notifyListeners() {
        this.listeners.forEach((listener) => listener(lodash_1.default.cloneDeep(this.board)));
    }
    makeMove(move) {
        if (movePiece(this.board, move, this.currentPlayer)) {
            this.moveHistory.push(move);
            this.currentPlayer =
                this.currentPlayer === Player.White ? Player.Black : Player.White;
            this.notifyListeners();
            return true;
        }
        return false;
    }
    getBoard() {
        return lodash_1.default.cloneDeep(this.board);
    }
    getCurrentPlayer() {
        return this.currentPlayer;
    }
}
exports.ChessGame = ChessGame;
