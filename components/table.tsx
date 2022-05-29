import { createContext, useContext } from "react";
import { useTable } from "../lib/table";
import { Board } from "./board";

const TableContext = createContext("");
export const useTableId = () => useContext(TableContext);

export function Table({ id }: { id: string }) {
  const [table, loading, error] = useTable(id);

  if (!table) {
    return <div>Loading...</div>;
  }

  return (
    <TableContext.Provider value={id}>
      <Board hand={table.hand} live />
    </TableContext.Provider>
  );
}
