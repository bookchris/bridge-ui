import { Box, Button, ButtonProps, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useState } from "react";
import { getBidder, validBidLevel, validBids } from "../lib/bidding";
import { Hand } from "../lib/hand";
import { nextSeat, Seat } from "../lib/seat";
import { useBid } from "../lib/table";

export interface BiddingProps {
    hand: Hand;
    seat?: Seat; // When specified, limits when you can bid.  
}

export function Bidding({ hand, seat }: BiddingProps) {
    const viewer = Seat.South;
    const bidding = hand.bidding || [];
    const dealer = hand.dealer;
    const bidder = getBidder(hand);

    let row = [] as string[];
    const rows = [row] as string[][];
    let pos = nextSeat(viewer);
    while (pos != dealer) {
        pos = nextSeat(pos);
        row.push("");
    }
    bidding.forEach((bid) => {
        row.push(bid)
        if (row.length == 4) {
            row = []
            rows.push(row);
        }
    });

    return (
        <div>
            <TableContainer component={Paper}  >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>West</TableCell>
                            <TableCell>North</TableCell>
                            <TableCell>East</TableCell>
                            <TableCell>South</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, i) => (
                            <TableRow key={i}>
                                {row.map((cell, i) => (
                                    <TableCell key={i}>{cell}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {(!seat || seat === bidder) && <BidSelector hand={hand} bidder={bidder} />}
        </div>
    );
}

function BidSelector({ hand, bidder }: { hand: Hand, bidder: Seat }) {
    const [level, setLevel] = useState(0);

    const bid = useBid();
    const bidAs = (b: string) => {
        setLevel(0);
        bid(b, bidder);
    }

    const bidding = hand.bidding || [];
    const bids = validBids(bidding);
    const isValid = (b: string) => bids.includes(b);
    const minLevel = validBidLevel(bidding);

    return (
        <Paper>
            <Box display="flex">
                <BidButton onClick={() => bidAs("Pass")}>Pass</BidButton>
                {Array.from({ length: 7 }, (_, i) => i + 1).map((l) => (
                    <BidButton key={l} onClick={() => setLevel(l)} disabled={l < minLevel} sx={{ minWidth: 0 }}>{l}</BidButton>
                ))}
            </Box>
            <Box display="flex">
                <BidButton onClick={() => bidAs("X")} disabled={!isValid("X")}>X</BidButton>
                <BidButton onClick={() => bidAs("XX")} disabled={!isValid("XX")}>XX</BidButton>
                {["♣", "♦", "♥", "♠", "NT"].map((suit) => {
                    const bid = `${level}${suit}`;
                    return (<BidButton key={suit} onClick={() => bidAs(bid)} disabled={!level || !isValid(bid)}>{suit}</BidButton>);
                }
                )}
            </Box>
        </Paper >
    );
}

function BidButton(props: ButtonProps) {
    return <Button variant="contained" {...props} sx={{ minWidth: 0 }} />
}