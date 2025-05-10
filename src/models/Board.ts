import { getPossibleBishopMoves, getPossibleKingMoves, getCastlingMoves, getPossibleKnightMoves, getPossiblePawnMoves, getPossibleQueenMoves, getPossibleRookMoves } from "../referee/rules";
import { PieceType, TeamType } from "../Types";
import { Pawn } from "./Pawn";
import { Piece } from "./Piece";
import { Position } from "./Position";
import { Move } from "./Move";
import { SimplifiedPiece } from "./SimplifiedPiece";

export class Board {
    pieces: Piece[];
    totalTurns: number
    winningTeam?: TeamType;
    stalemate: boolean;
    draw: boolean;
    moves: Move[];
    boardHistory: {[key: string]: number};
    turnsWithNoCaptureOrPawnMove: number;
    ambiguity?: "row" | "column";
    castle?: string;

    constructor(pieces: Piece[], totalTurns: number, moves: Move[], boardHistory: {[key: string]: number}, turnsWithNoCaptureOrPawnMove: number) {
        this.pieces = pieces;
        this.totalTurns = totalTurns;
        this.stalemate = false;
        this.draw = false;
        this.moves = moves;
        this.boardHistory = boardHistory
        this.turnsWithNoCaptureOrPawnMove = turnsWithNoCaptureOrPawnMove;
    }

    calculateAllMoves() {
        // Calculate the moves of all the pieces
        for(const piece of this.pieces){
            piece.possibleMoves = this.getValidMoves(piece, this.pieces);
        }

        //Calculate Castling Moves
        for(const king of this.pieces.filter(p => p.isKing)){
            if(king.possibleMoves === undefined) continue;
            king.possibleMoves = [...getPossibleKingMoves(king, this.pieces),...getCastlingMoves(king, this.pieces)];
        } 

        // Check if current team moves are valid
        this.checkCurrentTeamMoves();

        const enemyMoves = this.pieces.filter(p => p.team !== this.currentTeam).map(p => p.possibleMoves).flat();

        for(const piece of this.pieces.filter(p => p.team !== this.currentTeam)){
            piece.possibleMoves = [];
        }

        this.checkForDraw();
        this.checkForThreefoldRepetition(); 
        this.checkForFiftyMove(); 

        if(this.pieces.filter(p => p.team === this.currentTeam).some(p => p.possibleMoves !== undefined && p.possibleMoves.length > 0)) return;


        this.checkForStalemate(enemyMoves);

    }

    get currentTeam() : TeamType{
        return this.totalTurns % 2 === 0 ? TeamType.OPPONENT : TeamType.OUR;
    }

    checkCurrentTeamMoves(){
        for(const piece of this.pieces.filter(p => p.team === this.currentTeam)){
            if(piece.possibleMoves === undefined) continue;

            for(const move of piece.possibleMoves){
                const simulatedBoard = this.clone();

                // Remove the piece at the destination position
                simulatedBoard.pieces = simulatedBoard.pieces.filter(p => !p.samePosition(move));

                // Get the piece of the cloned board
                const clonedPiece = simulatedBoard.pieces.find(p => p.samePiecePosition(piece))!
                clonedPiece.position = move.clone();

                // Get the king of the cloned board
                const clonedKing = simulatedBoard.pieces.find(p => p.isKing && p.team === simulatedBoard.currentTeam)!

                // Loop through all enemy piece, update their possible moves
                // And check if the current team's king will be in danger
                for(const enemy of simulatedBoard.pieces.filter(p => p.team !== simulatedBoard.currentTeam)){
                    enemy.possibleMoves = simulatedBoard.getValidMoves(enemy, simulatedBoard.pieces);

                    if(enemy.isPawn){
                        if(enemy.possibleMoves.some(m => m.x !== enemy.position.x && m.samePosition(clonedKing?.position))){
                            piece.possibleMoves = piece.possibleMoves?.filter(m => !m.samePosition(move))
                            
                        }
                    }else{
                        if(enemy.possibleMoves.some(m => m.samePosition(clonedKing.position))){
                            piece.possibleMoves = piece.possibleMoves?.filter(m => !m.samePosition(move))
                        }
                    }
                }
            }
        }
    }

    getValidMoves(piece: Piece, boardState: Piece[]): Position[] {
        switch (piece.type) {
            case PieceType.PAWN:
                return getPossiblePawnMoves(piece, boardState);
            case PieceType.KNIGHT:
                return getPossibleKnightMoves(piece, boardState);
            case PieceType.BISHOP:
                return getPossibleBishopMoves(piece, boardState);
            case PieceType.ROOK:
                return getPossibleRookMoves(piece, boardState);
            case PieceType.QUEEN:
                return getPossibleQueenMoves(piece, boardState);
            case PieceType.KING:
                return getPossibleKingMoves(piece, boardState);
            default:
                return [];
        }
    }

    playMove(enPassantMove: boolean, validMove: boolean, playedPiece: Piece, destination: Position): boolean {
        const pawnDirection = (playedPiece.team === TeamType.OUR) ? 1 : -1;
        const piecesBeforeMove = this.pieces.length;
        this.checkForAmbiguity(playedPiece, destination);
        // If the move is a castling move
        const destinationPiece = this.pieces.find(p => p.samePosition(destination));
        if(playedPiece.isKing && destinationPiece?.isRook && destinationPiece.team === playedPiece.team){
            const direction = (destinationPiece.position.x - playedPiece.position.x > 0) ? 1 : -1;
            const newKingXPosition = playedPiece.position.x + direction * 2
            this.pieces = this.pieces.map((piece) => {
                if(piece.samePiecePosition(playedPiece)){
                    piece.position.x = newKingXPosition;
                }else if(piece.samePiecePosition(destinationPiece)){
                    piece.position.x = newKingXPosition - direction;
                }
                return piece;
            });
            this.castle = direction === 1 ? "0-0" : "0-0-0";
        }else if (enPassantMove) {
            this.pieces = this.pieces.reduce((results, piece) => {
                if (piece.samePiecePosition(playedPiece)) {
                    if(piece.isPawn)
                        (piece as Pawn).enPassant = false;
                    piece.position.x = destination.x;
                    piece.position.y = destination.y;
                    piece.hasMoved = true;
                    results.push(piece);
                } else if (!piece.samePosition(new Position(destination.x, destination.y - pawnDirection))) {
                    if (piece.isPawn) {
                            (piece as Pawn).enPassant = false;
                    }
                    results.push(piece)
                }
                return results;
            }, [] as Piece[]);

        } else if (validMove) {
            // Updates Piece Position
            this.pieces = this.pieces.reduce((results, piece) => {
                if (piece.samePosition(destination) && piece.team !== playedPiece.team) {
                    return results; // don't push — it's captured
                }
                if (piece.samePiecePosition(playedPiece)) {
                    // Special Move
                    if(piece.isPawn)
                        (piece as Pawn).enPassant = (Math.abs(playedPiece.position.y - destination.y) === 2 && piece.type === PieceType.PAWN)
                    piece.position.x = destination.x;
                    piece.position.y = destination.y;
                    piece.hasMoved = true;
                    results.push(piece);

                } else if (!piece.samePosition(destination)) {
                    if (piece.isPawn) {
                        (piece as Pawn).enPassant = false;
                    }
                    results.push(piece)
                }
                return results;
            }, [] as Piece[]);
        } else {
            return false;
        }
        this.turnsWithNoCaptureOrPawnMove++;
        if(playedPiece.isPawn || this.pieces.length < piecesBeforeMove) this.turnsWithNoCaptureOrPawnMove = 0;
        const capture = this.pieces.length < piecesBeforeMove ? true : false;

        this.calculateAllMoves();
        this.moves.push(new Move(playedPiece.team, playedPiece.type, playedPiece.position.clone(), destination.clone(),
         this.totalTurns, capture, this.checkForCheck(), this.winningTeam !== undefined, this.ambiguity, this.castle));
        return true;
    }

    checkForDraw(): void {
        if(this.pieces.filter(p => p.team === TeamType.OUR).length <= 2 && 
            this.pieces.filter(p => p.team === TeamType.OUR && (p.isBishop || p.isKnight)).length <= 1 &&
            (this.pieces.filter(p => p.team === TeamType.OPPONENT).length <= 2 && 
            this.pieces.filter(p => p.team === TeamType.OPPONENT && (p.isBishop || p.isKnight)).length <= 1)){

            this.draw = true;
        }   
    }

    checkForThreefoldRepetition(): void {
        const simplifiedPieces = this.pieces.map(p => new SimplifiedPiece(p));
        const simplifiedPiecesStringify = JSON.stringify(simplifiedPieces);

        if(this.boardHistory[simplifiedPiecesStringify] === undefined){
            this.boardHistory[simplifiedPiecesStringify] = 1;
        
        }else{
            this.boardHistory[simplifiedPiecesStringify] += 1;
        }

        if(this.boardHistory[simplifiedPiecesStringify] === 3){
            this.draw = true;
        }
    }

    checkForStalemate(enemyMoves: (Position | undefined)[]): void {
        const kingPosition = this.pieces.find(p => p.isKing && p.team === this.currentTeam)!.position;

        if(enemyMoves.find(m => m?.samePosition(kingPosition))){
            this.winningTeam = (this.currentTeam === TeamType.OUR) ? TeamType.OPPONENT : TeamType.OUR;
        }else{
            this.stalemate = true;
        }  
    }

    checkForFiftyMove(): void {
        if(this.turnsWithNoCaptureOrPawnMove >= 50){
            this.draw = true;
        }
    }

    checkForCheck(): boolean {
        const king = this.pieces.find(p => p.isKing && p.team === this.currentTeam)!;

        // Loop through all enemy piece, update their possible moves
        // And check if the current team's king will be in danger

        const simulatedBoard = this.clone();

        for(const enemy of simulatedBoard.pieces.filter(p => p.team !== this.currentTeam)){
            enemy.possibleMoves = this.getValidMoves(enemy, this.pieces);

            if(enemy.isPawn){
                if(enemy.possibleMoves.some(m => m.x !== enemy.position.x && m.samePosition(king.position))){
                    return true;
                }
            }else{
                if(enemy.possibleMoves.some(m => m.samePosition(king.position))){
                    return true;
                }
            }
        }
        return false;
    }

    checkForAmbiguity(playedPiece: Piece, destination: Position): void {

       const simulatedBoard = this.clone();
        for(const piece of simulatedBoard.pieces.filter(p => p.team === playedPiece.team && p.type === playedPiece.type && !p.samePiecePosition(playedPiece))){
            piece.possibleMoves = this.getValidMoves(piece, this.pieces);

            if(piece.possibleMoves.some(m => m.samePosition(destination))){
                this.ambiguity = piece.position.x === playedPiece.position.x ? "row" : "column";
            }
        }
    }

    clone(): Board {
        return new Board(this.pieces.map(p => p.clone()), this.totalTurns, this.moves.map(m => m.clone()), this.boardHistory, this.turnsWithNoCaptureOrPawnMove);
    }
}