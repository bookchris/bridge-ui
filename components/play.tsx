import { Box } from "@mui/material";
import { getCurrentTrick, getLastTrick, getTrickLeader, Hand } from "../lib/hand";
import { nextSeat, Seat } from "../lib/seat";
import { Card2 } from "./card";


export interface PlayProps {
    hand: Hand;
    seat?: Seat; // When specified, limits when you can.
}

export function Play({ hand, seat }: PlayProps) {
    const play = hand.play || [];

    let cards = getCurrentTrick(hand);
    if (!cards.length) {
        cards = getLastTrick(hand);
    }
    const leader = getTrickLeader(hand);

    const seatSxProps = {
        [Seat.West]: { left: "37%", transform: "translate(0, -50%)" },
        [Seat.North]: { top: "37%", transform: "translate(-50%)" },
        [Seat.East]: { right: "37%", transform: "translate(0, -50%)" },
        [Seat.South]: { bottom: "37%", transform: "translate(-50%)" },
    }
    return (
        <Box>
            {cards.map((card, i) => (
                <Card2 key={card} card={card} sx={{ position: "absolute", ...seatSxProps[nextSeat(leader, i)] }} />
            ))}
        </Box>
    );
} 