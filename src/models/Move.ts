import { PieceType, TeamType } from "../Types";
import { Position } from "./Position";

export class Move{
    columns: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"]
    team: TeamType;
    piece: PieceType;
    fromPosition: Position;
    toPosition: Position;
    turn: number;

    constructor(team: TeamType, piece: PieceType, fromPosition: Position, toPosition: Position,  turn: number){
        this.team = team;
        this.piece = piece;
        this.fromPosition = fromPosition;
        this.toPosition = toPosition;
        this.turn = turn;
    }

    toMessage(): string{
        return `${this.columns[this.toPosition.x]}${this.toPosition.y + 1}`; 
    }

    toImage(): string | undefined{
        return this.piece === PieceType.PAWN ? undefined: `./assets/${this.piece}_${this.team}.png`;
    }

    clone(): Move {
        return new Move(this.team, this.piece, this.fromPosition.clone(), this.toPosition.clone(),  this.turn);
    }
}

