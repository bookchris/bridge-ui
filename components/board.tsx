import { Paper } from "@mui/material";
import { Hand, HandState } from "../lib/hand";
import { Seat } from "../lib/seat";
import { Bidding } from "./bidding";
import { Holding } from "./holding";
import { Trick } from "./trick";

export interface BoardProps {
    hand?: Hand,
}

export function Board({ hand }: BoardProps) {
    return (
        <Paper sx={{ backgroundColor: "#378B05", width: "min(100vw, 900px);", height: "min(100vw, 900px);", position: "relative" }}>
            {hand ? <Contents hand={hand} /> : <div />}
        </Paper>
    );
}

function Contents({ hand }: { hand: Hand }) {
    const state = hand.state;
    return (
        <>
            <Holding seat={Seat.North} cards={hand.north} />
            <Holding seat={Seat.West} cards={hand.south} />
            <Holding seat={Seat.East} cards={hand.east} />
            <Holding seat={Seat.South} cards={hand.west} />
            {hand.state === HandState.Bidding && <Bidding hand={hand} />}
            {hand.state === HandState.Playing && <Trick hand={hand} />}
        </>
    );
}
