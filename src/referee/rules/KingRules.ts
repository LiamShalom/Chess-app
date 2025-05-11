import { TeamType } from "../../Types";
import { Piece, Position } from "../../models";
import { tileIsEmptyOrOccupiedByOpponnent, tileIsOccupied, tileIsOccupiedByOpponenet } from "./GeneralRules";

export const kingMove = (inititalPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (desiredPosition.y - inititalPosition.y === i) {
                if (desiredPosition.x - inititalPosition.x === j) {
                    if (tileIsEmptyOrOccupiedByOpponnent(desiredPosition, boardState, team)) {
                        return true;
                    }

                }
            }
        }
    }
    return false;
}

export const getPossibleKingMoves = (king: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = [];

    for(let i = -1; i < 2; i++){
        for(let j = -1; j < 2; j++){
            if(i === 0 && j === 0) continue;
            
            const destination = new Position(king.position.x + i, king.position.y + j);

            if(destination.x < 0 || destination.x > 7 || destination.y < 0 || destination.y > 7) continue;
            if (!tileIsOccupied(destination, boardState) || tileIsOccupiedByOpponenet(destination, boardState, king.team)) {
                possibleMoves.push(destination);
            }
        }
    }
    return possibleMoves;
}

export const getCastlingMoves = (king: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = [];

    if(king.hasMoved){
        return possibleMoves;
    }

    const rooks = boardState.filter(p => p.isRook && p.team === king.team && !p.hasMoved);
    
    // Loop through the rooks

    for(const rook of rooks){
        const direction = (rook.position.x - king.position.x > 0) ? 1 : -1;

        const adjacentPosition = king.position.clone();
        adjacentPosition.x += direction;

        if(!rook.possibleMoves?.some(m => m.samePosition(adjacentPosition))) continue;

        const concerningTiles = rook.possibleMoves.filter(m => m.y === king.position.y);

        const enemyPieces = boardState.filter(p => p.team !== king.team)

        //Checking if any enemy pieces can attack castling squares
        let valid = true;

        for(const enemy of enemyPieces){
            if(enemy.possibleMoves === undefined) continue;
            for(const move of enemy.possibleMoves){
                if(concerningTiles.some(t => t.samePosition(move))){
                    valid = false;
                }
                
                if(!valid){
                    break;
                }
            }
            if(!valid){
                break;
            }
        }

        if(!valid) continue;

        const castlingMove = king.position.clone();
        castlingMove.x += direction * 2;
        possibleMoves.push(castlingMove);
        
    }
    
    return possibleMoves;
}