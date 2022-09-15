import { createContext, useContext, useMemo } from "react";
import { Seat, Seats } from "../../functions/core";
import { Table as LibTable, useTable } from "../lib/table";
import { useCurrentUser } from "./auth";
import { Board } from "./board";
import { ErrorAlert } from "./errorAlert";

interface TableContextType {
  tableId?: string;
  handId?: string;
  table?: LibTable;
  playingAs?: Seat;
}

const TableContext = createContext<TableContextType>({});

export const useTableContext = () => useContext(TableContext);

export function Table({ id }: { id: string }) {
  const { data: table, error } = useTable(id);
  if (error) {
    return <ErrorAlert error={error} />;
  }
  if (!table) {
    return <div>Loading...</div>;
  }

  return <TableContent table={table} />;
}

export function TableContent({ table }: { table: LibTable }) {
  const hand = table.hand;

  const user = useCurrentUser();

  const seatIndex = table?.players?.indexOf(user?.uid || "") ?? -1;
  const seat = seatIndex === -1 ? undefined : Seats[seatIndex];

  const value = useMemo(
    () => ({
      tableId: table?.id,
      table: table,
      playingAs: seat,
    }),
    [seat, table]
  );

  return (
    <TableContext.Provider value={value}>
      <Board hand={hand} playingAs={seat} live />
    </TableContext.Provider>
  );
}
