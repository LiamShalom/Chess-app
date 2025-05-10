import './Tile.css';

interface Props {
    image?: string;
    square: number;
    highlight: boolean;
}

export default function Tile({square, image, highlight}: Props){
    const className: string = ["tile",
                            square % 2 === 0 && "black-tile",
                            square % 2 !== 0 && "white-tile",
                            highlight && "tile-highlight",
                            image && "chess-piece-tile"].filter(Boolean).join(' ')
    return(
        <div className={className}>
            {image && <div style= {{backgroundImage: `url(${image})`}} className="chess-piece"></div>}
        </div>
    ) 
    
}