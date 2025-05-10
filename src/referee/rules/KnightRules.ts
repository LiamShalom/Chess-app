import { TeamType } from "../../Types";
import { Piece, Position } from "../../models";
import { tileIsEmptyOrOccupiedByOpponnent } from "./GeneralRules";

export const knightMove = (inititalPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
    //Movement and Attack Logic
    for (let i = -1; i < 2; i += 2) {
        for (let j = -1; j < 2; j += 2) {
            //Top and Bottom side movement
            if (desiredPosition.y - inititalPosition.y === 2 * i) {
                if (desiredPosition.x - inititalPosition.x === j) {
                    if (tileIsEmptyOrOccupiedByOpponnent(desiredPosition, boardState, team)) {
                        return true;
                    }

                }
            }
            // Right and Left side movement
            if (desiredPosition.x - inititalPosition.x === 2 * i) {
                if (desiredPosition.y - inititalPosition.y === j) {
                    if (tileIsEmptyOrOccupiedByOpponnent(desiredPosition, boardState, team)) {
                        return true;
                    }
                }
            }
        }

    }
    return false;
}

export const getPossibleKnightMoves = (knight: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = [];
    for (let i = -1; i < 2; i += 2) {
        for (let j = -1; j < 2; j += 2) {
            const verticalMove = new Position(knight.position.x + j, knight.position.y + i*2)
            const horizontalMove= new Position(knight.position.x + j*2, knight.position.y + i)
            if(tileIsEmptyOrOccupiedByOpponnent(verticalMove, boardState, knight.team)){
                possibleMoves.push(verticalMove);
            }
            if(tileIsEmptyOrOccupiedByOpponnent(horizontalMove, boardState, knight.team)){
                possibleMoves.push(horizontalMove);
            }
        }

    }
    return possibleMoves;
}