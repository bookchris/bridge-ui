import { Box, Paper, Typography } from "@mui/material";
import { Seat } from "../../../functions/core";
import { useCurrentUser } from "../auth/auth";
import { useSit } from "../db/table";
import { useUser } from "../db/user";
import { useBoardContext } from "./board";
import { useTableContext } from "./table";

export interface PlayerBoxProps {
  seat: Seat;
}

export function PlayerBox({ seat }: PlayerBoxProps) {
  const { table } = useTableContext();
  const { scale, handAt } = useBoardContext();
  const user = useCurrentUser();
  const sit = useSit(seat);

  const index = Object.values(Seat).indexOf(seat);
  const playerId = table?.players?.[index];
  const isRobot = playerId === "Robot";
  const tableUser = useUser(playerId || "invalid");

  let player = "";
  if (isRobot) {
    player = "Robot";
  } else if (table) {
    player = tableUser?.displayName || "";
  } else {
    player = handAt.players[index].toString() || seat.toString();
  }
  const isTurn = handAt.turn === seat;

  const paperSx = {
    [Seat.North.toString()]: {
      top: "0%",
      bottom: "95%",
      left: "50%",
      transform: `translate(-50%) scale(${scale})`,
    },
    [Seat.South.toString()]: {
      bottom: "0%",
      top: "95%",
      left: "50%",
      transform: `translate(-50%) scale(${scale})`,
    },
    [Seat.West.toString()]: {
      left: "2.5%",
      top: "50%",
      transform: `translate(-50%) rotate(270deg) scale(${scale})`,
    },
    [Seat.East.toString()]: {
      right: "2.5%",
      top: "50%",
      transform: `translate(50%) rotate(90deg) scale(${scale})`,
    },
  }[seat.toString()];

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
            {seat.toChar()}
          </Typography>
        </Paper>
        <Paper
          square
          elevation={0}
          onClick={() => user && sit(user?.uid)}
          sx={{
            px: 1,
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: isTurn ? "info.dark" : "secondary.main",
            cursor: "pointer",
          }}
        >
          <Typography sx={{ color: "white" }}>{player}</Typography>
        </Paper>
      </Box>
    </Box>
  );
}
