import { TeamType } from "../../Types";
import { Piece, Position } from "../../models";

export const tileIsOccupied = (position: Position, boardState: Piece[]): boolean => {
    const piece = boardState.find(p => p.position.samePosition(position));
    if (piece) {
        return true;
    } else {
        return false;
    }
}

export const tileIsOccupiedByOpponenet = (position: Position, boardState: Piece[], team: TeamType): boolean => {
    const piece = boardState.find(p => p.position.samePosition(position) && p.team !== team);

    if (piece) {
        return true;
    } else {
        return false;
    }
}

export const tileIsEmptyOrOccupiedByOpponnent = (position: Position, boardState: Piece[], team: TeamType): boolean => {
    return !tileIsOccupied(position, boardState) || tileIsOccupiedByOpponenet(position, boardState, team);
}