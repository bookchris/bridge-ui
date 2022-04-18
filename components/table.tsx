import { Box, useMediaQuery, useTheme } from "@mui/material";
import { createContext, useContext, useState } from "react";
import { useTable } from "../lib/table";
import { BiddingCard } from "./bidding";
import { Board } from "./board";
import { Controls } from "./controls";
import { Play } from "./play";

const tableId = 'NYHC3TLyjxRso2RkBHtZ';

const TableContext = createContext("");
export const useTableId = () => useContext(TableContext);

export function Table() {
    const [hand, loading, error] = useTable(tableId);
    const [position, setPosition] = useState(0);

    const theme = useTheme();
    const columns = useMediaQuery(theme.breakpoints.up('lg'));

    if (!hand) {
        return <div>Loading...</div>
    }

    const handAt = hand.atPosition(position);

    const bidding = <BiddingCard hand={handAt} />;
    const play = hand.isBidding ? <div /> : <Play hand={hand} position={position} />;
    const controls = <Controls hand={hand} position={position} setPosition={setPosition} />;
    return (
        <TableContext.Provider value={tableId}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Box sx={{ display: "flex", gap: 2, my: 2, justifyContent: "center", alignItems: "flex-start" }}>
                    <Board hand={handAt} />
                    {columns && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {controls}
                            {bidding}
                            {play}
                        </Box>
                    )}
                </Box>
                {!columns && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "min(100vw, 900px);" }}>
                        {controls}
                        {bidding}
                        {play}
                    </Box>
                )}
            </Box>
        </TableContext.Provider>
    );
}