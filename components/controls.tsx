import { Box, Icon, IconButton, Paper, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Hand } from "../lib/hand";
import { useRedeal } from "../lib/table";

export interface ControlsProps {
    hand: Hand,
    position: number,
    setPosition: Dispatch<SetStateAction<number>>
}

export function Controls({ hand, position, setPosition }: ControlsProps) {
    const redeal = useRedeal();
    return (
        <Paper square>
            <Paper square elevation={0} sx={{ backgroundColor: "secondary.main" }}>
                <Typography sx={{ p: 1, color: "white" }}>Controls</Typography>
            </Paper>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <IconButton
                    onClick={() => setPosition(hand.positions)}
                    disabled={position === hand.positions}
                ><Icon>first_page</Icon>
                </IconButton>
                <IconButton
                    onClick={() => setPosition((p) => Math.min(p + 1, hand.positions))}
                    disabled={position === hand.positions}>
                    <Icon>navigate_before</Icon>
                </IconButton>
                <IconButton
                    onClick={() => setPosition((p) => Math.max(0, p - 1))} disabled={position === 0}>
                    <Icon>navigate_next</Icon>
                </IconButton>
                <IconButton
                    onClick={() => setPosition(0)}
                    disabled={position === 0}>
                    <Icon>last_page</Icon>
                </IconButton>
                <IconButton onClick={redeal}>
                    <Icon>restart_alt</Icon>
                </IconButton>
            </Box >
        </Paper >
    );
}