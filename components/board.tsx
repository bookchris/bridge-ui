import { Box, Paper } from "@mui/material";
import { isBidding } from "../lib/bidding";
import { getHolding, Hand } from "../lib/hand";
import { Seat } from "../lib/seat";
import { Bidding } from "./bidding";
import { Orientation } from "./card";
import { Holding } from "./holding";
import { Play } from "./play";

export interface BoardProps {
    hand?: Hand,
}

export function Board({ hand }: BoardProps) {
    return (
        <Paper sx={{ backgroundColor: "green", width: "min(100vw, 800px);", height: "min(100vw, 800px);", position: "relative" }}>
            {hand ? <Contents hand={hand} /> : <div />}
        </Paper>
    );
}

function Contents({ hand }: { hand: Hand }) {
    const bidding = isBidding(hand);
    return (
        <Box display="grid" height="100%" gridTemplateColumns="15% auto 15%" gridTemplateRows="15% auto 15%" gridTemplateAreas={`". north ." "west main east" ". south ."`}>
            <Box gridArea="west" alignSelf="center" justifySelf="center">
                <Holding seat={Seat.West} orientation={Orientation.Left} cards={getHolding(hand, Seat.West)} />
            </Box>
            <Box gridArea="north" alignSelf="center" justifySelf="center">
                <Holding seat={Seat.North} cards={getHolding(hand, Seat.North)} />
            </Box>
            <Box gridArea="east" alignSelf="center" justifySelf="center">
                <Holding seat={Seat.East} orientation={Orientation.Right} cards={getHolding(hand, Seat.East)} />
            </Box>
            <Box gridArea="south" alignSelf="center" justifySelf="center">
                <Holding seat={Seat.South} cards={getHolding(hand, Seat.South)} />
            </Box>
            <Box gridArea="main" alignSelf="center" justifySelf="center" flexGrow="1">
                {bidding ? (<Bidding hand={hand} />) : (<Play hand={hand} />)}
            </Box>
        </Box>
    );
}
