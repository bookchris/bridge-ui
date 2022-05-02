import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Hand } from "../lib/hand";
import { Trick } from "../lib/play";
import { nextSeat, Seat } from "../lib/seat";
import { CardText } from "./cardText";

export interface PlayProps {
    hand: Hand;
    position: number;
}

export function Play({ hand, position }: PlayProps) {
    const highlighted = hand.data.play.length - position;
    const tricks = [...hand.tricks];

    if (hand.isPlaying) {
        if (hand.tricks.length === 0) {
            tricks.push(new Trick(hand.openingLeader!, [], hand.bidding.suit!));
        } else if (hand.tricks[hand.tricks.length - 1].complete) {
            const last = hand.tricks[hand.tricks.length - 1]
            tricks.push(new Trick(last.winningSeat!, [], hand.bidding.suit!));
        }
    }

    return (
        <Paper square>
            <Paper square elevation={0} sx={{ backgroundColor: "secondary.main" }}>
                <Typography sx={{ p: 1, color: "white" }}>Play</Typography>
            </Paper>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">West</TableCell>
                        <TableCell align="center">North</TableCell>
                        <TableCell align="center">East</TableCell>
                        <TableCell align="center">South</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tricks.map((trick, i) => {
                        let cols = trick.cards.map((card, j) => (
                            <TableCell key={card} align="center" sx={{ backgroundColor: i * 4 + j === highlighted ? "grey.300" : undefined }}>
                                <CardText card={card} />
                            </TableCell>
                        ));
                        cols.push(...Array(cols.length === 4 ? 0 : 1).fill(<TableCell sx={{ backgroundColor: i * 4 + cols.length === highlighted ? "grey.300" : undefined }} >&nbsp;</TableCell>));
                        cols.push(...Array(4 - cols.length).fill(<TableCell >&nbsp;</TableCell>));
                        let player = Seat.West
                        while (player != trick.leader) {
                            cols.unshift(cols.pop()!);
                            player = nextSeat(player);
                        }
                        return <TableRow key={i}>{cols}</TableRow>;
                    })}
                </TableBody>
            </Table>
        </Paper >
    );
}