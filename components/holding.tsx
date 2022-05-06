import { Box } from "@mui/material";
import { Seat } from "../lib/seat";
import { usePlay } from "../lib/table";
import { useBoardContext } from "./board";
import { Card2 } from "./card";

export interface HoldingProps {
    seat: Seat;
    cards: number[];
}

export function Holding({ seat, cards }: HoldingProps) {
    const play = usePlay();
    const { width } = useBoardContext();
    const margin = width / 9.375;

    const paperSx = {
        [Seat.West]: { left: "5%", top: "50%", transform: "rotate(270deg) translate(-50%)", transformOrigin: "top left" },
        [Seat.North]: { top: "5%", left: "50%", transform: "translate(-50%)" },
        [Seat.East]: { right: "5%", top: "50%", transform: "rotate(90deg) translate(50%)", transformOrigin: "top right" },
        [Seat.South]: { bottom: "5%", left: "50%", transform: "translate(-50%)" },
    }[seat];

    return (
        <Box sx={{ display: "flex", position: "absolute", zIndex: 1, ...paperSx }}>
            <Box sx={{ mr: `${margin}px` }} />
            {cards?.map((card, index) => (
                <Card2
                    key={card}
                    card={card}
                    onClick={() => play(card, seat)}
                    sx={{ ml: `-${margin}px` }}
                />
            ))}
        </Box >
    );
}