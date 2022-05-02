import { Box, Icon, IconButton, Paper, Tooltip, Typography } from "@mui/material";
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
                <Tooltip title="Hand start">
                    <span>
                        <IconButton
                            onClick={() => setPosition(hand.positions)}
                            disabled={position === hand.positions}
                        ><Icon>first_page</Icon>
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Previous">
                    <span>
                        <IconButton
                            onClick={() => setPosition((p) => Math.min(p + 1, hand.positions))}
                            disabled={position === hand.positions}>
                            <Icon>navigate_before</Icon>
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Next">
                    <span>
                        <IconButton
                            onClick={() => setPosition((p) => Math.max(0, p - 1))} disabled={position === 0}>
                            <Icon>navigate_next</Icon>
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Live">
                    <span>
                        <IconButton
                            onClick={() => setPosition(0)}
                            disabled={position === 0}>
                            <Icon>last_page</Icon>
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Redeal">
                    <span>
                        <IconButton onClick={() => {
                            redeal();
                            setPosition(0);
                        }}>
                            <Icon>restart_alt</Icon>
                        </IconButton>
                    </span>
                </Tooltip>
            </Box >
        </Paper >
    );
}