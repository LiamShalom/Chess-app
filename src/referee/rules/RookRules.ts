import { TeamType } from "../../Types";
import { Piece, Position } from "../../models";
import { tileIsEmptyOrOccupiedByOpponnent, tileIsOccupied, tileIsOccupiedByOpponenet } from "./GeneralRules";

export const rookMove = (inititalPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
    //Vertical movement
    if (inititalPosition.x === desiredPosition.x) {
        let multiplier = (desiredPosition.y > inititalPosition.y) ? 1 : -1;
        for (let i = 1; i < 8; i++) {
            let passedPosition = new Position(inititalPosition.x, inititalPosition.y + (i * multiplier) );
            if (passedPosition.samePosition(desiredPosition)) {
                if (tileIsEmptyOrOccupiedByOpponnent(passedPosition, boardState, team)) {
                    return true;
                }
            } else {
                if (tileIsOccupied(passedPosition, boardState)) {
                    break;
                }
            }

        }
    }

    //Horizontal movement
    if (inititalPosition.y === desiredPosition.y) {
        let multiplier = (desiredPosition.x > inititalPosition.x) ? 1 : -1;
        for (let i = 1; i < 8; i++) {
            let passedPosition = new Position(inititalPosition.x + (i * multiplier), inititalPosition.y );
            if (passedPosition.samePosition(desiredPosition)) {
                if (tileIsEmptyOrOccupiedByOpponnent(passedPosition, boardState, team)) {
                    return true;
                }
            } else {
                if (tileIsOccupied(passedPosition, boardState)) {
                    break;
                }
            }

        }
    }
    return false;
}

export const getPossibleRookMoves = (rook: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = [];
    for (let i = 1; i < 8; i++) {
        if(rook.position.x + i > 7) break;
        const destination = new Position(rook.position.x + i, rook.position.y)
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination)
        }else if(tileIsOccupiedByOpponenet(destination, boardState, rook.team)){
            possibleMoves.push(destination)
            break;
        }else{
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        if(rook.position.x - i < 0) break;
        const destination = new Position(rook.position.x - i, rook.position.y)
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination)
        }else if(tileIsOccupiedByOpponenet(destination, boardState, rook.team)){
            possibleMoves.push(destination)
            break;
        }else{
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        if(rook.position.y + i > 7) break;
        const destination = new Position(rook.position.x, rook.position.y + i)
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination)
        }else if(tileIsOccupiedByOpponenet(destination, boardState, rook.team)){
            possibleMoves.push(destination)
            break;
        }else{
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        if(rook.position.y - i < 0) break;
        const destination = new Position(rook.position.x, rook.position.y - i)
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination)
        }else if(tileIsOccupiedByOpponenet(destination, boardState, rook.team)){
            possibleMoves.push(destination)
            break;
        }else{
            break;
        }
    }
    return possibleMoves;
}