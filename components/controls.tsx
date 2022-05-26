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

export interface ControlsProps {
  hand: Hand;
  position: number;
  setPosition: Dispatch<SetStateAction<number>>;
}

export function Controls({ hand, position, setPosition }: ControlsProps) {
  const redeal = useRedeal();

  const prev = useCallback(
    () =>
      setPosition((p) => (p === -1 ? hand.positions - 1 : Math.max(0, p - 1))),
    [hand.positions, setPosition]
  );
  const next = useCallback(
    () =>
      setPosition((p) =>
        p === -1 ? -1 : p >= hand.positions - 1 ? -1 : p + 1
      ),
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
      }
    };
    document.addEventListener("keydown", onKeyPress);
    return () => document.removeEventListener("keydown", onKeyPress);
  }, [next, prev]);

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
              <Icon>navigate_next</Icon>
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Live">
          <span>
            <IconButton
              onClick={() => setPosition(-1)}
              disabled={position === -1}
            >
              <Icon>last_page</Icon>
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Redeal">
          <span>
            <IconButton
              onClick={() => {
                redeal();
                setPosition(-1);
              }}
            >
              <Icon>restart_alt</Icon>
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Paper>
  );
}
