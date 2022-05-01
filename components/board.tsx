import { Box, Paper, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { Hand, HandState } from "../lib/hand";
import { Seat } from "../lib/seat";
import { BidBox } from "./bidBox";
import { BiddingCard } from "./biddingCard";
import { Controls } from "./controls";
import { Holding } from "./holding";
import { Play } from "./playCard";
import { Trick } from "./trick";

export interface BoardProps {
    hand?: Hand,
    readOnly?: boolean,
}

export function Board({ hand }: BoardProps) {
    const [position, setPosition] = useState(0);
    const readOnly = position !== 0;

    const theme = useTheme();
    const columns = useMediaQuery(theme.breakpoints.up('lg'));

    if (!hand) {
        return <div>Loading...</div>
    }

    const handAt = hand.atPosition(position);

    const bidding = <BiddingCard hand={hand} position={position} />;
    const play = hand.isBidding ? <div /> : <Play hand={hand} position={position} />;
    const controls = <Controls hand={hand} position={position} setPosition={setPosition} />;
    return (
        <div>
            <Box sx={{ display: "flex", gap: 2, my: 2, justifyContent: "center", alignItems: "flex-start" }}>
                <Paper sx={{ backgroundColor: "#378B05", width: "min(100vw, 900px);", height: "min(100vw, 900px);", position: "relative" }}>
                    <Holding seat={Seat.North} cards={handAt.north} />
                    <Holding seat={Seat.West} cards={handAt.west} />
                    <Holding seat={Seat.East} cards={handAt.east} />
                    <Holding seat={Seat.South} cards={handAt.south} />
                    {!readOnly && handAt.state === HandState.Bidding && <BidBox hand={handAt} />}
                    {handAt.state === HandState.Playing && <Trick hand={handAt} />}
                </Paper>
                {columns && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {controls}
                        {bidding}
                        {play}
                    </Box>
                )}
            </Box>
            {!columns && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "min(100vw, 900px);" }}>
                    {controls}
                    {bidding}
                    {play}
                </Box>
            )}
        </div>
    );
} 