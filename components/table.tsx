import { createContext, useContext, useMemo } from "react";
import { useTableHand } from "../lib/hand";
import { Table, useTable } from "../lib/table";
import { Board } from "./board";

interface TableContextType {
  tableId?: string;
  handId?: string;
  table?: Table;
}

const TableContext = createContext<TableContextType>({});

export const useTableContext = () => useContext(TableContext);

export function Table({ id }: { id: string }) {
  const [table] = useTable(id);
  const [hand] = useTableHand(id, table?.handId);

  const value = useMemo(
    () => ({ tableId: table?.id, handId: table?.handId, table: table }),
    [table]
  );

  if (!table || !hand) {
    return <div>Loading...</div>;
  }

  return (
    <TableContext.Provider value={value}>
      <Board hand={hand} live />
    </TableContext.Provider>
  );
}
