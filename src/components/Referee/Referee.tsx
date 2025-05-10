import { useEffect, useRef, useState } from "react";
import { initialBoard } from "../../Constants";
import { Piece, Position } from "../../models";
import Chessboard from "../Chessboard/Chessboard";
import { PieceType, TeamType } from "../../Types";
import { Pawn } from "../../models/Pawn";
import { Board } from "../../models/Board";
import "./Referee.css";

export default function Referee() {
    const [board, setBoard] = useState<Board>(initialBoard.clone());
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const [modalMessage, setModalMessage] = useState("");
    const modalRef = useRef<HTMLDivElement>(null);
    const endgameModalRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [board.moves]);

    function playMove(playedPiece: Piece, destination: Position): boolean {
        // If the playing piece doesnt have any moves
        if(playedPiece.possibleMoves === undefined) return false;

        // Prevent inactive team from playing
        if(playedPiece.team === TeamType.OUR && board.totalTurns % 2 !== 1){
            return false;
        }
        if(playedPiece.team === TeamType.OPPONENT && board.totalTurns % 2 !== 0){
            return false;
        }
        let playedMoveIsValid = false;

        const validMove = playedPiece.possibleMoves?.some(m => m.samePosition(destination));

        if(!validMove) return false;

        const enPassantMove = isEnPassantMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);

        // playMove modifies the board thus we setBoard
        const clonedBoard = board.clone();
        clonedBoard.totalTurns += 1
        // Playing the move
        playedMoveIsValid = clonedBoard.playMove(enPassantMove, validMove, playedPiece, destination);

        checkForEndGame(clonedBoard);
        setBoard(clonedBoard);

        // This is for promoting a pawn
        let promotionRow = (playedPiece.team === TeamType.OUR) ? 7 : 0;
        if (destination.y === promotionRow && playedPiece.isPawn) {
            modalRef.current?.classList.remove("hidden");
            setPromotionPawn((previousPromotionPawn) => {
                const clonedPlayedPiece = playedPiece.clone();
                clonedPlayedPiece.position = destination.clone();
                return clonedPlayedPiece;
            });
        }
        return playedMoveIsValid;
    }

    function isEnPassantMove(inititalPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType): boolean {
        const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

        if (type === PieceType.PAWN) {
            if ((desiredPosition.x - inititalPosition.x === -1 || desiredPosition.x - inititalPosition.x === 1) && desiredPosition.y - inititalPosition.y === pawnDirection) {
                const piece = board.pieces.find(p => p.position.x === desiredPosition.x && p.position.y === desiredPosition.y - pawnDirection && p.isPawn && (p as Pawn).enPassant);
                if (piece) {
                    return true;
                }
            }
        }
        return false;
    }

    

    function promotePawn(pieceType: PieceType) {
        if (promotionPawn === undefined) {
            return;
        }

        setBoard((previousBoard) => {
            const clonedBoard = board.clone();
            clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
                if (piece.samePiecePosition(promotionPawn)) {
                    results.push(new Piece(piece.position.clone(), pieceType, piece.team, true))
                }else{
                    results.push(piece);
                } 
                return results;
    
            }, [] as Piece[]);

            clonedBoard.calculateAllMoves();

            checkForEndGame(clonedBoard);
            return clonedBoard;
        })

        

        modalRef.current?.classList.add("hidden");
    }

    function promtotionTeamType() {
        return (promotionPawn?.team === TeamType.OUR) ? "w" : "b"
    }

    function restartGame() {
        endgameModalRef.current?.classList.add("hidden");
        setBoard(initialBoard.clone());
    }

    function checkForEndGame(board: Board){
        if(board.draw){
            setModalMessage("It's a draw!")
            endgameModalRef.current?.classList.remove("hidden");
        }
        if(board.stalemate){
            setModalMessage("It's a stalemate!")
            endgameModalRef.current?.classList.remove("hidden");
        }else if(board.winningTeam !== undefined){
            setModalMessage(`The winning team is ${board.winningTeam === TeamType.OUR ? "white" : "black"}!`);
            endgameModalRef.current?.classList.remove("hidden");
        }
    }

    return (
        <>
            <div className="modal hidden" ref={modalRef}>
                <div className="modal-body">
                    <img alt="knight" onClick={() => promotePawn(PieceType.KNIGHT)} src={`./assets/Knight_${promtotionTeamType()}.png`} />
                    <img alt="bishop" onClick={() => promotePawn(PieceType.BISHOP)} src={`./assets/Bishop_${promtotionTeamType()}.png`} />
                    <img alt="rook" onClick={() => promotePawn(PieceType.ROOK)} src={`./assets/Rook_${promtotionTeamType()}.png`} />
                    <img alt="queen" onClick={() => promotePawn(PieceType.QUEEN)} src={`./assets/Queen_${promtotionTeamType()}.png`} />
                </div>
            </div>
            <div className="modal hidden" ref={endgameModalRef}>
                <div className="modal-body">
                    <div className="checkmate-body">
                        <span>{modalMessage}</span>
                        <button onClick={restartGame}>Play Again</button>
                    </div>  
                </div>
            </div>
            <main>
                <Chessboard playMove={playMove} pieces={board.pieces} />
                <div className="information">
                    <p>Current Team: {board.currentTeam === TeamType.OUR ? "White" : "Black"}</p>
                    <div className="moves" ref={containerRef}>
                        {board.moves.map((m, i) => 
                            <p key={i}>
                                {i % 2 === 0 ? `${Math.ceil((i+1)/2)}.` : ""}
                                &emsp;
                                <img src={m.toImage()} alt="" />
                                {m.toMessage()}
                            </p>
                        )}
                    </div>
                    
                </div>
            </main>
            
        </>
    )
}