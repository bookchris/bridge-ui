import { Box } from "@mui/material";
import { Seat } from "../lib/seat";
import { usePlay } from "../lib/table";
import { Card2, Orientation } from "./card";

export interface HoldingProps {
    seat: Seat;
    cards: number[];
    orientation?: Orientation;
}

export function Holding({ seat, cards, orientation = Orientation.None }: HoldingProps) {
    let direction: string | undefined
    let marginLeft: string | undefined
    let marginTop: string | undefined
    let marginBottom: string | undefined
    switch (orientation) {
        case Orientation.None:
            direction = "row"
            marginLeft = "max(-8vw, -64px)"
            break;
        case Orientation.Left:
            direction = "column-reverse"
            marginBottom = "max(-8vw, -64px)";
            break;
        case Orientation.Right:
            direction = "column"
            marginTop = "max(-8vw, -64px)";
    }
    const play = usePlay();
    return (
        <Box display="flex" sx={{ flexDirection: direction }} justifyContent="center">
            {cards?.map((card, index) => (
                <Card2 key={card} card={card} orientation={orientation} onClick={() => play(card, seat)} sx={{
                    ml: index ? marginLeft : 0,
                    mt: index ? marginTop : 0,
                    mb: index ? marginBottom : 0
                }} />
            ))}
        </Box >
    );
}