import { PieceType, TeamType } from "../../Types";
import { Piece, Position } from "../../models";
import { Pawn } from "../../models/Pawn";
import { tileIsOccupied, tileIsOccupiedByOpponenet } from "./GeneralRules";

export const pawnMove = (inititalPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
    const specialRow = (team === TeamType.OUR) ? 1 : 6;
    const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

    // Movement Logic
    if (inititalPosition.x === desiredPosition.x) {
        if (inititalPosition.y === specialRow && desiredPosition.y - inititalPosition.y === 2 * pawnDirection) {
            if (!tileIsOccupied(desiredPosition, boardState) &&
                !tileIsOccupied(new Position(desiredPosition.x, desiredPosition.y - pawnDirection), boardState)) {
                return true;
            }
        } else if (desiredPosition.y - inititalPosition.y === pawnDirection) {
            if (!tileIsOccupied(desiredPosition, boardState)) {
                return true;
            }
        }
    }
    // Attcking Logic
    else if (desiredPosition.x - inititalPosition.x === -1 && desiredPosition.y - inititalPosition.y === pawnDirection) {
        if (tileIsOccupiedByOpponenet(desiredPosition, boardState, team)) {
            return true;
        }
    } else if (desiredPosition.x - inititalPosition.x === 1 && desiredPosition.y - inititalPosition.y === pawnDirection) {
        if (tileIsOccupiedByOpponenet(desiredPosition, boardState, team)) {
            return true;
        }
    }

    return false;
}

export const getPossiblePawnMoves = (pawn: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = [];
    const specialRow = (pawn.team === TeamType.OUR) ? 1 : 6;
    const pawnDirection = (pawn.team === TeamType.OUR) ? 1 : -1;

    const normalMove = new Position(pawn.position.x, pawn.position.y + pawnDirection)
    const specialMove = new Position(pawn.position.x, pawn.position.y + pawnDirection * 2 )
    const upperLeftAttack = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection )
    const upperRightAttack = new Position(pawn.position.x + 1, pawn.position.y + pawnDirection )
    const leftPosition = new Position(pawn.position.x - 1, pawn.position.y )
    const rightPosition = new Position(pawn.position.x + 1, pawn.position.y )

    if (!tileIsOccupied(normalMove, boardState)) {
        possibleMoves.push(normalMove);
        if (pawn.position.y === specialRow && !tileIsOccupied(specialMove, boardState)) {
            possibleMoves.push(specialMove)
        }
    }

    if (tileIsOccupiedByOpponenet(upperLeftAttack, boardState, pawn.team)) {
        possibleMoves.push(upperLeftAttack);
    }else if(!tileIsOccupied(upperLeftAttack, boardState)){
        const leftPiece = boardState.find(p => p.samePosition(leftPosition));
        if(leftPiece != null && (leftPiece as Pawn).enPassant){
            possibleMoves.push(upperLeftAttack);
        }
    }

    if (tileIsOccupiedByOpponenet(upperRightAttack, boardState, pawn.team)) {
        possibleMoves.push(upperRightAttack);
    }else if(!tileIsOccupied(upperRightAttack, boardState)){
        const rightPiece = boardState.find(p => p.samePosition(rightPosition));
        if(rightPiece != null && (rightPiece as Pawn).enPassant){
            possibleMoves.push(upperRightAttack);
        }
    }



    return possibleMoves;
}