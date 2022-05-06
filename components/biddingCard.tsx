import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import { Hand } from "../lib/hand";
import { nextSeat, Seat } from "../lib/seat";
import { BidText } from "./bidText";
import { TableRowGrouper } from "./tableRowGrouper";

export interface BiddingProps {
  hand: Hand;
  position: number;
  seat?: Seat;
}

export function BiddingCard({ hand, seat, position }: BiddingProps) {
  const highlighted =
    hand.data.bidding.length + hand.data.play.length - position;
  const viewer = Seat.South;
  const dealer = hand.dealer;

  const bids = [] as ReactNode[];
  let pos = nextSeat(viewer);
  while (pos != dealer) {
    pos = nextSeat(pos);
    bids.push(<TableCell key={"empty" + pos} />);
  }
  hand.bidding.bids.forEach((bid, i) => {
    bids.push(
      <TableCell
        key={"bid" + i}
        align="center"
        sx={{ backgroundColor: i === highlighted ? "grey.300" : undefined }}
      >
        <BidText bid={bid} />
      </TableCell>
    );
  });
  if (hand.isBidding) {
    bids.push(
      <TableCell
        key="next"
        sx={{ backgroundColor: position === 0 ? "grey.300" : undefined }}
      >
        &nbsp;
      </TableCell>
    );
  }

  return (
    <Paper square>
      <Paper square elevation={0} sx={{ backgroundColor: "secondary.main" }}>
        <Typography sx={{ p: 1, color: "white" }}>Bidding</Typography>
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
          <TableRowGrouper>{bids}</TableRowGrouper>
        </TableBody>
      </Table>
    </Paper>
  );
}
