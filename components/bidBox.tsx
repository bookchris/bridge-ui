import { Box, Button, ButtonProps, Icon, Paper } from "@mui/material";
import { useState } from "react";
import { Hand } from "../lib/hand";
import { Seat } from "../lib/seat";
import { useBid } from "../lib/table";

export interface BidBoxProps {
  hand: Hand;
  seat?: Seat; // When specified, limits when you can bid.
}

export function BidBox({ hand, seat }: BidBoxProps) {
  const viewer = Seat.South;
  const dealer = hand.dealer;
  const bidder = hand.nextBidder;
  return (
    <Box
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 2,
      }}
    >
      {(!seat || seat === bidder) && (
        <BidSelector hand={hand} bidder={bidder} />
      )}
    </Box>
  );
}

function BidSelector({ hand, bidder }: { hand: Hand; bidder: Seat }) {
  const [level, setLevel] = useState(0);

  const bid = useBid();
  const bidAs = (b: string) => {
    setLevel(0);
    bid(b, bidder);
  };

  const minLevel = hand.bidding.validBidLevel;
  const bids = hand.bidding.validBids;
  const isValid = (b: string) => bids.includes(b);

  return (
    <Paper sx={{ p: 1 }}>
      <Box display="flex">
        {Array.from({ length: 7 }, (_, i) => i + 1).map((l) => (
          <BidButton
            key={l}
            variant={level === l ? "outlined" : "contained"}
            onClick={() => setLevel(l)}
            disabled={!!level || l < minLevel}
            sx={{ minWidth: 0 }}
          >
            {l}
          </BidButton>
        ))}
      </Box>
      {level ? (
        <div>
          <Box display="flex">
            <BidButton
              startIcon={<Icon>navigate_before</Icon>}
              onClick={() => setLevel(0)}
            />
            {["♣", "♦", "♥", "♠", "NT"].map((suit) => {
              const bid = `${level}${suit}`;
              return (
                <BidButton
                  key={suit}
                  onClick={() => bidAs(bid)}
                  disabled={!level || !isValid(bid)}
                >
                  {suit}
                </BidButton>
              );
            })}
          </Box>
        </div>
      ) : (
        <div>
          <Box display="flex">
            <BidButton onClick={() => bidAs("Pass")}>Pass</BidButton>
            <BidButton onClick={() => bidAs("X")} disabled={!isValid("X")}>
              X
            </BidButton>
            <BidButton onClick={() => bidAs("XX")} disabled={!isValid("XX")}>
              XX
            </BidButton>
          </Box>
        </div>
      )}
    </Paper>
  );
}

function BidButton(props: ButtonProps) {
  return (
    <Button
      variant="contained"
      fullWidth
      {...props}
      sx={{ minWidth: 0, m: 0.5, px: { xs: 1, sm: 2 } }}
    />
  );
}
