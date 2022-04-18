import { Button } from "@mui/material";
import { createContext, useContext } from "react";
import { useRedeal, useTable } from "../lib/table";
import { Board } from "./board";

const tableId = 'NYHC3TLyjxRso2RkBHtZ';

const TableContext = createContext("");
export const useTableId = () => useContext(TableContext);

export function Table() {
    const [value, loading, error] = useTable(tableId);
    const redeal = useRedeal(tableId);

    if (!value) {
        return <div>Loading...</div>
    }
    return (
        <div>
            <TableContext.Provider value={tableId}>
                <Button variant="outlined" onClick={redeal}>Deal</Button>
                <Board hand={value.data()} />
            </TableContext.Provider>
        </div>
    );
}