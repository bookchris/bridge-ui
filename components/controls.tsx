import { Hand } from "@chrisbook/bridge-core";
import {
  Box,
  Icon,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { useRedeal } from "../lib/table";
import { useTableId } from "./table";

export interface ControlsProps {
  hand: Hand;
  position: number;
  setPosition: Dispatch<SetStateAction<number>>;
}

export function Controls({ hand, position, setPosition }: ControlsProps) {
  const redeal = useRedeal();
  const tableId = useTableId();

  const prev = useCallback(
    () => setPosition((p) => Math.max(0, p - 1)),
    [setPosition]
  );
  const next = useCallback(
    () => setPosition((p) => Math.min(hand.positions, p + 1)),
    [hand.positions, setPosition]
  );
  const prevSeat = useCallback(
    () => setPosition((p) => (p - 4 >= 0 ? p - 4 : p)),
    [setPosition]
  );
  const nextSeat = useCallback(
    () => setPosition((p) => (p + 4 <= hand.positions ? p + 4 : p)),
    [hand.positions, setPosition]
  );

  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          prev();
          break;
        case "ArrowRight":
          next();
          break;
        case "ArrowUp":
          prevSeat();
          break;
        case "ArrowDown":
          nextSeat();
          break;
      }
    };
    document.addEventListener("keydown", onKeyPress);
    return () => document.removeEventListener("keydown", onKeyPress);
  }, [next, nextSeat, prev, prevSeat]);

  return (
    <Paper square>
      <Paper square elevation={0} sx={{ backgroundColor: "secondary.main" }}>
        <Typography sx={{ p: 1, color: "white" }}>Controls</Typography>
      </Paper>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Tooltip title="Hand start">
          <span>
            <IconButton
              onClick={() => setPosition(0)}
              disabled={position === 0}
            >
              <Icon>first_page</Icon>
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Previous in seat">
          <span>
            <IconButton onClick={prevSeat} disabled={position - 4 < 0}>
              <Icon>expand_less</Icon>
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Previous">
          <span>
            <IconButton onClick={prev} disabled={position === 0}>
              <Icon>navigate_before</Icon>
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Next">
          <span>
            <IconButton onClick={next} disabled={position === -1}>
              <Icon>chevron_right</Icon>
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Next in seat">
          <span>
            <IconButton
              onClick={nextSeat}
              disabled={position + 4 > hand.positions}
            >
              <Icon>expand_more</Icon>
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={tableId ? "Live" : "Hand end"}>
          <span>
            <IconButton
              onClick={() => setPosition(hand.positions)}
              disabled={position === hand.positions}
            >
              <Icon>last_page</Icon>
            </IconButton>
          </span>
        </Tooltip>
        {tableId && (
          <Tooltip title="Redeal">
            <span>
              <IconButton
                onClick={() => {
                  redeal();
                  setPosition(0);
                }}
              >
                <Icon>restart_alt</Icon>
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Box>
    </Paper>
  );
}
