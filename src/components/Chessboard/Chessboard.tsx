import './Chessboard.css';
import Tile from '../Tile/Tile'
import { useRef, useState } from 'react';
import { HORIZONTAL_AXIS, VERTICAL_AXIS, GRID_SIZE} from '../../Constants';
import { Piece, Position } from '../../models';


interface Props{
    playMove:(piece: Piece, position: Position) => boolean;
    pieces: Piece[];
}

export default function Chessboard({playMove, pieces}: Props) {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [grabPositon, setGrabPosition] = useState<Position>(new Position(-1, -1)); 
    const chessboardRef = useRef<HTMLDivElement>(null);


    function grabPiece(e: React.MouseEvent) {
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        if (element.classList.contains("chess-piece") && chessboard) {
            const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE)
            const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - GRID_SIZE * 8) / GRID_SIZE))
            setGrabPosition(new Position(grabX, grabY))
            const x = e.clientX - GRID_SIZE / 2;
            const y = e.clientY - GRID_SIZE / 2;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            setActivePiece(element);
        }
    }

    function movePiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const minX = chessboard.offsetLeft - 10;
            const minY = chessboard.offsetTop - 10;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 70;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 70;

            const x = e.clientX - 40;
            const y = e.clientY - 40;
            activePiece.style.position = "absolute";

            if (x < minX) {
                activePiece.style.left = `${minX}px`;
            } else if (x > maxX) {
                activePiece.style.left = `${maxX}px`;
            } else {
                activePiece.style.left = `${x}px`;
            }

            if (y < minY) {
                activePiece.style.top = `${minY}px`;
            } else if (y > maxY) {
                activePiece.style.top = `${maxY}px`;
            } else {
                activePiece.style.top = `${y}px`;
            }

        }
    }

    function dropPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - GRID_SIZE * 8) / GRID_SIZE));

            const currentPiece = pieces.find(p => p.samePosition(grabPositon));

            if (currentPiece) {
                var success = playMove(currentPiece.clone(), new Position(x, y))
                if(!success){
                    // Resets Piece Position
                    activePiece.style.position = "relative";
                    activePiece.style.removeProperty("top");
                    activePiece.style.removeProperty("left");
                }
            }

            setActivePiece(null);
        }
    }

    let board: JSX.Element[] = [];

    for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
        for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
            const square = i + j;
            const piece = pieces.find(p => p.samePosition(new Position(i, j)));
            let image = piece ? piece.image : undefined;

            let currentPiece = activePiece !== null ? pieces.find(p => p.samePosition(grabPositon)) : undefined;
            let highlight = currentPiece?.possibleMoves ? currentPiece.possibleMoves.some(p => p.samePosition(new Position(i, j))) : false;

            board.push(<Tile key={`${j}, ${i}`} square={square} image={image} highlight={highlight}/>);
        }
    }

    return (
        <>
            <div
                onMouseMove={(e) => movePiece(e)}
                onMouseDown={(e) => grabPiece(e)}
                onMouseUp={(e) => dropPiece(e)}
                id="chessboard"
                ref={chessboardRef}
            >
                {board}
            </div>
        </>

    )
}