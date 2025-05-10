import { PieceType, TeamType } from "../Types";
import { Position } from "./Position";

export class Move {
    columns: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"]
    team: TeamType;
    piece: PieceType;
    fromPosition: Position;
    toPosition: Position;
    turn: number;
    capture: boolean;
    check: boolean;
    checkmate: boolean;
    ambiguity?: "row" | "column";
    castle?: string;

    constructor(team: TeamType, piece: PieceType, fromPosition: Position, toPosition: Position,
        turn: number, capture: boolean, check: boolean, checkmate: boolean, ambiguity?: "row" | "column", castle?: string) {
        this.team = team;
        this.piece = piece;
        this.fromPosition = fromPosition;
        this.toPosition = toPosition;
        this.turn = turn;
        this.capture = capture;
        this.check = check;
        this.checkmate = checkmate;
        this.ambiguity = ambiguity;
        this.castle = castle;
    }

    toMessage(): string {
        if (this.castle !== undefined) {
            return this.castle;
        } else {
            let captureMessage = "";
            if (this.capture) {
                if (this.piece === PieceType.PAWN) {
                    captureMessage = `${this.columns[this.fromPosition.x]}x`
                } else {
                    captureMessage = "x";
                }
            }
            let checkMessage = "";
            if (this.check) {
                if (this.checkmate) {
                    checkMessage = "#";
                } else {
                    checkMessage = "+";
                }
            }
            let ambiguityMessage: string | number = "";
            if(this.ambiguity !== undefined){
                ambiguityMessage = this.ambiguity === "column" ? this.columns[this.fromPosition.x] : (this.fromPosition.y + 1);
            }

            return captureMessage + ambiguityMessage + this.columns[this.toPosition.x] + (this.toPosition.y + 1) + checkMessage;
        }

    }

    toImage(): string | undefined {
        return this.piece === PieceType.PAWN || this.castle !== undefined ? undefined : `./assets/${this.piece}_${this.team}.png`;
    }

    clone(): Move {
        return new Move(this.team, this.piece, this.fromPosition.clone(), this.toPosition.clone(), this.turn, this.capture, this.check, this.checkmate, this.ambiguity, this.castle);
    }
}

