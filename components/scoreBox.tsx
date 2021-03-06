import { Hand, Seat } from "@chrisbook/bridge-core";
import { Paper, Typography } from "@mui/material";
import { ResultText } from "./resultText";

export interface ScoreBoxProps {
  hand: Hand;
}

export function ScoreBox({ hand }: ScoreBoxProps) {
  return (
    <Paper
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 2,
        p: 1,
      }}
    >
      <Typography paragraph>
        {hand.bidding.contract}&nbsp;
        <ResultText result={hand.result} />
      </Typography>
      <Typography paragraph>Score: {hand.scoreAs(Seat.South)}</Typography>
    </Paper>
  );
}
