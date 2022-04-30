import { Box, Button, ButtonProps, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import { Bid } from "../lib/bidding";
import { Hand } from "../lib/hand";
import { nextSeat, Seat } from "../lib/seat";
import { useBid } from "../lib/table";

export interface BiddingProps {
    hand: Hand;
    seat?: Seat; // When specified, limits when you can bid.   
}

export function Bidding({ hand, seat }: BiddingProps) {
    const viewer = Seat.South;
    const dealer = hand.dealer;
    const bidder = hand.nextBidder;

    let row = [] as (Bid | undefined)[];
    const rows = [row];
    let pos = nextSeat(viewer);
    while (pos != dealer) {
        pos = nextSeat(pos);
        row.push(undefined);
    }
    hand.bidding.bids.forEach((bid) => {
        row.push(bid)
        if (row.length == 4) {
            row = [] as (Bid | undefined)[];
            rows.push(row);
        }
    });

    return (
        <Box sx={{ width: "50%", height: "50%", position: "absolute", left: "50%", top: "25%", transform: "translate(-50%)", zIndex: 2 }}>
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
                                {row.map((bid, i) => (
                                    <TableCell key={i}>{bid?.bid}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {(!seat || seat === bidder) && <BidSelector hand={hand} bidder={bidder} />}
        </Box>
    );
}

export function BiddingCard({ hand, seat }: BiddingProps) {
    return (
        <Paper square>
            <Paper square elevation={0} sx={{ backgroundColor: "secondary.main" }}>
                <Typography sx={{ p: 1, color: "white" }}>Bidding</Typography>
            </Paper>
            <BiddingTable hand={hand} seat={seat} />
        </Paper>
    );
}

export function BiddingTable({ hand, seat }: BiddingProps) {
    const viewer = Seat.South;
    const dealer = hand.dealer;
    const bidder = hand.nextBidder;

    let row = [] as (Bid | undefined)[];
    const rows = [row];
    let pos = nextSeat(viewer);
    while (pos != dealer) {
        pos = nextSeat(pos);
        row.push(undefined);
    }
    hand.bidding.bids.forEach((bid) => {
        row.push(bid)
        if (row.length == 4) {
            row = [] as (Bid | undefined)[];
            rows.push(row);
        }
    });

    return (
        <Paper>
            <Table size="small">
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
                            {row.map((bid, i) => (
                                <TableCell key={i}>{bid?.bid}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

function BidSelector({ hand, bidder }: { hand: Hand, bidder: Seat }) {
    const [level, setLevel] = useState(0);

    const bid = useBid();
    const bidAs = (b: string) => {
        setLevel(0);
        bid(b, bidder);
    }

    const minLevel = hand.bidding.validBidLevel;
    const bids = hand.bidding.validBids;
    const isValid = (b: string) => bids.includes(b);

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