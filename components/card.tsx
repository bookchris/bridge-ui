import { Paper, PaperProps, styled } from "@mui/material";
import { useBoardContext } from "./board";

const IMAGES = [
    "https://upload.wikimedia.org/wikipedia/commons/6/67/Cards-Reverse.svg",
    "https://upload.wikimedia.org/wikipedia/commons/b/b0/Cards-2-Club.svg",
    "https://upload.wikimedia.org/wikipedia/commons/e/e0/Cards-3-Club.svg",
    "https://upload.wikimedia.org/wikipedia/commons/6/69/Cards-4-Club.svg",
    "https://upload.wikimedia.org/wikipedia/commons/7/7e/Cards-5-Club.svg",
    "https://upload.wikimedia.org/wikipedia/commons/a/af/Cards-6-Club.svg",
    "https://upload.wikimedia.org/wikipedia/commons/8/8e/Cards-7-Club.svg",
    "https://upload.wikimedia.org/wikipedia/commons/f/fd/Cards-8-Club.svg",
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Cards-9-Club.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/25/Cards-10-Club.svg",
    "https://upload.wikimedia.org/wikipedia/commons/c/c7/Cards-J-Club.svg",
    "https://upload.wikimedia.org/wikipedia/commons/3/37/Cards-Q-Club.svg",
    "https://upload.wikimedia.org/wikipedia/commons/9/9e/Cards-K-Club.svg",
    "https://upload.wikimedia.org/wikipedia/commons/c/c4/Cards-A-Club.svg",
    "https://upload.wikimedia.org/wikipedia/commons/9/99/Cards-2-Diamond.svg",
    "https://upload.wikimedia.org/wikipedia/commons/4/44/Cards-3-Diamond.svg",
    "https://upload.wikimedia.org/wikipedia/commons/a/af/Cards-4-Diamond.svg",
    "https://upload.wikimedia.org/wikipedia/commons/d/dd/Cards-5-Diamond.svg",
    "https://upload.wikimedia.org/wikipedia/commons/4/44/Cards-6-Diamond.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/2b/Cards-7-Diamond.svg",
    "https://upload.wikimedia.org/wikipedia/commons/9/90/Cards-8-Diamond.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/25/Cards-9-Diamond.svg",
    "https://upload.wikimedia.org/wikipedia/commons/c/c2/Cards-10-Diamond.svg",
    "https://upload.wikimedia.org/wikipedia/commons/7/78/Cards-J-Diamond.svg",
    "https://upload.wikimedia.org/wikipedia/commons/c/c3/Cards-Q-Diamond.svg",
    "https://upload.wikimedia.org/wikipedia/commons/5/55/Cards-K-Diamond.svg",
    "https://upload.wikimedia.org/wikipedia/commons/e/e9/Cards-A-Diamond.svg",
    "https://upload.wikimedia.org/wikipedia/commons/6/6e/Cards-2-Heart.svg",
    "https://upload.wikimedia.org/wikipedia/commons/5/57/Cards-3-Heart.svg",
    "https://upload.wikimedia.org/wikipedia/commons/3/39/Cards-4-Heart.svg",
    "https://upload.wikimedia.org/wikipedia/commons/9/91/Cards-5-Heart.svg",
    "https://upload.wikimedia.org/wikipedia/commons/5/55/Cards-6-Heart.svg",
    "https://upload.wikimedia.org/wikipedia/commons/d/d4/Cards-7-Heart.svg",
    "https://upload.wikimedia.org/wikipedia/commons/5/55/Cards-8-Heart.svg",
    "https://upload.wikimedia.org/wikipedia/commons/d/d2/Cards-9-Heart.svg",
    "https://upload.wikimedia.org/wikipedia/commons/7/76/Cards-10-Heart.svg",
    "https://upload.wikimedia.org/wikipedia/commons/e/e7/Cards-J-Heart.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/28/Cards-Q-Heart.svg",
    "https://upload.wikimedia.org/wikipedia/commons/b/bf/Cards-K-Heart.svg",
    "https://upload.wikimedia.org/wikipedia/commons/6/60/Cards-A-Heart.svg",
    "https://upload.wikimedia.org/wikipedia/commons/e/e7/Cards-2-Spade.svg",
    "https://upload.wikimedia.org/wikipedia/commons/d/d0/Cards-3-Spade.svg",
    "https://upload.wikimedia.org/wikipedia/commons/4/4e/Cards-4-Spade.svg",
    "https://upload.wikimedia.org/wikipedia/commons/b/b1/Cards-5-Spade.svg",
    "https://upload.wikimedia.org/wikipedia/commons/6/68/Cards-6-Spade.svg",
    "https://upload.wikimedia.org/wikipedia/commons/c/c6/Cards-7-Spade.svg",
    "https://upload.wikimedia.org/wikipedia/commons/7/7e/Cards-8-Spade.svg",
    "https://upload.wikimedia.org/wikipedia/commons/0/0a/Cards-9-Spade.svg",
    "https://upload.wikimedia.org/wikipedia/commons/6/67/Cards-10-Spade.svg",
    "https://upload.wikimedia.org/wikipedia/commons/e/ea/Cards-J-Spade.svg",
    "https://upload.wikimedia.org/wikipedia/commons/e/ef/Cards-Q-Spade.svg",
    "https://upload.wikimedia.org/wikipedia/commons/1/18/Cards-K-Spade.svg",
    "https://upload.wikimedia.org/wikipedia/commons/9/9d/Cards-A-Spade.svg",
]

export const useCardSize = () => {
    const { width } = useBoardContext();
    return {
        width: width / 7.5,
        height: width / 5.36,
    }
}
//const WIDTH = "min(15vmin, 120px)" 
//const HEIGHT = "min(21vmin, 168px)"; 

export enum Orientation {
    None = 0,
    Left = 1,
    Right = 2,
}

export interface CardProps extends PaperProps {
    card: number;
    orientation?: Orientation;
}

const CardImage = styled('img')({
    display: "block",
});

export function Card2({ card, orientation = Orientation.None, ...paperProps }: CardProps) {
    const { width, height } = useCardSize();
    const paperSxProps = {
        [Orientation.None]: { width: width, height: height },
        [Orientation.Left]: { width: height, height: width },
        [Orientation.Right]: { width: height, height: width },
    }
    const imageSxProps = {
        [Orientation.None]: {},
        [Orientation.Left]: { transform: "rotate(270deg)" },
        [Orientation.Right]: { transform: "rotate(90deg)" },
    }
    return (
        <Paper {...paperProps} sx={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "white", boxShadow: 1, ...paperSxProps[orientation], ...paperProps?.sx }}>
            <CardImage src={IMAGES[card + 1]} sx={{ width: width, height: height, ...imageSxProps[orientation] }} />
        </Paper >
    )
}