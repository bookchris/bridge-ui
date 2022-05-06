import { Box, Paper, Typography } from "@mui/material";
import { Seat } from "../lib/seat";
import { useBoardContext } from "./board";

export interface PlayerBoxProps {
  seat: Seat;
}

export function PlayerBox({ seat }: PlayerBoxProps) {
  const { scale, handAt } = useBoardContext();

  const player =
    handAt.data.players[Object.values(Seat).indexOf(seat)] || "Unknown";
  const isTurn = handAt.turn === seat;

  const paperSx = {
    [Seat.North]: {
      top: "0%",
      bottom: "95%",
      left: "50%",
      transform: `translate(-50%) scale(${scale})`,
    },
    [Seat.South]: {
      bottom: "0%",
      top: "95%",
      left: "50%",
      transform: `translate(-50%) scale(${scale})`,
    },
    [Seat.West]: {
      left: "2.5%",
      top: "50%",
      transform: `translate(-50%) rotate(270deg) scale(${scale})`,
    },
    [Seat.East]: {
      right: "2.5%",
      top: "50%",
      transform: `translate(50%) rotate(90deg) scale(${scale})`,
    },
  }[seat];

  return (
    <Box
      sx={{
        position: "absolute",
        zIndex: 1,
        display: "flex",
        flexDireciton: "column",
        alignItems: "center",
        ...paperSx,
      }}
    >
      <Box sx={{ display: "flex", width: 200 }}>
        <Paper
          square
          elevation={0}
          sx={{
            px: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <Typography sx={{ color: "secondary.main", fontWeight: 600 }}>
            {seat.charAt(0)}
          </Typography>
        </Paper>
        <Paper
          square
          elevation={0}
          sx={{
            px: 1,
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: isTurn ? "info.dark" : "secondary.main",
          }}
        >
          <Typography sx={{ color: "white" }}>{player}</Typography>
        </Paper>
      </Box>
    </Box>
  );
}
