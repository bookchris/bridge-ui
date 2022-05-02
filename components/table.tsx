import { createContext, useContext } from "react";
import { useTable } from "../lib/table";
import { Board } from "./board";

const tableId = 'NYHC3TLyjxRso2RkBHtZ';
const TableContext = createContext("");
export const useTableId = () => useContext(TableContext);

export function Table() {
    const [hand, loading, error] = useTable(tableId);

    if (!hand) {
        return <div>Loading...</div>
    }

    return (
        <TableContext.Provider value={tableId}>
            <Board hand={hand} />
        </TableContext.Provider>
    );
}