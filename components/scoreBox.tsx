import { Paper, Typography } from "@mui/material";
import { Hand } from "../lib/hand";

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
        Result: {hand.bidding.contract} {hand.result}
      </Typography>
      <Typography paragraph>Score: {hand.score}</Typography>
    </Paper>
  );
}