import { Box, Paper, Typography } from "@mui/material";
import { Hand } from "../lib/hand";

export interface ContractCardProps {
    hand: Hand;
}

export function ContractCard({ hand }: ContractCardProps) {
    const contract = hand.bidding.contract;
    if (!contract) return <div />;
    return (
        <Paper square>
            <Paper square elevation={0} sx={{ backgroundColor: "secondary.main" }}>
                <Typography sx={{ p: 1, color: "white" }}>Hand</Typography>
            </Paper>
            <Box sx={{ m: 1 }}>
                {!hand.isBidding && <>Contract: {hand.bidding.contract}</>}
            </Box>
        </ Paper>
    );
}

