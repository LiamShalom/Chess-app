import { TeamType } from "../../Types";
import { Piece, Position } from "../../models";
import { tileIsEmptyOrOccupiedByOpponnent, tileIsOccupied, tileIsOccupiedByOpponenet } from "./GeneralRules";

export const queenMove = (inititalPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
    for (let i = 1; i < 8; i++) {
        let multiplierX = (desiredPosition.x > inititalPosition.x) ? 1 : (desiredPosition.x < inititalPosition.x) ? -1 : 0;
        let multiplierY = (desiredPosition.y > inititalPosition.y) ? 1 : (desiredPosition.y < inititalPosition.y) ? -1 : 0;

        let passedPosition = new Position(inititalPosition.x + (i * multiplierX), inititalPosition.y + (i * multiplierY) );
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
    return false;
}

export const getPossibleQueenMoves = (queen: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = [];
    for (let i = 1; i < 8; i++) {
        const destination = new Position(queen.position.x + i, queen.position.y + i)

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination)
        }else if(tileIsOccupiedByOpponenet(destination, boardState, queen.team)){
            possibleMoves.push(destination)
            break;
        }else{
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        const destination = new Position(queen.position.x + i, queen.position.y - i)

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination)
        }else if(tileIsOccupiedByOpponenet(destination, boardState, queen.team)){
            possibleMoves.push(destination)
            break;
        }else{
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        const destination = new Position(queen.position.x - i, queen.position.y + i)

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination)
        }else if(tileIsOccupiedByOpponenet(destination, boardState, queen.team)){
            possibleMoves.push(destination)
            break;
        }else{
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        const destination = new Position(queen.position.x - i, queen.position.y - i)

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination)
        }else if(tileIsOccupiedByOpponenet(destination, boardState, queen.team)){
            possibleMoves.push(destination)
            break;
        }else{
            break;
        }
    }
    for (let i = 1; i < 8; i++) {
        const destination = new Position(queen.position.x + i, queen.position.y)
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination)
        }else if(tileIsOccupiedByOpponenet(destination, boardState, queen.team)){
            possibleMoves.push(destination)
            break;
        }else{
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        const destination = new Position(queen.position.x - i, queen.position.y)
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination)
        }else if(tileIsOccupiedByOpponenet(destination, boardState, queen.team)){
            possibleMoves.push(destination)
            break;
        }else{
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        const destination = new Position(queen.position.x, queen.position.y + i)
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination)
        }else if(tileIsOccupiedByOpponenet(destination, boardState, queen.team)){
            possibleMoves.push(destination)
            break;
        }else{
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        const destination = new Position(queen.position.x, queen.position.y - i)
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination)
        }else if(tileIsOccupiedByOpponenet(destination, boardState, queen.team)){
            possibleMoves.push(destination)
            break;
        }else{
            break;
        }
    }
    return possibleMoves;
}