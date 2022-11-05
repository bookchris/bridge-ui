import { createContext, useContext, useMemo } from "react";
import { useErrorHandler } from "react-error-boundary";
import { Seat, Seats } from "../../../functions/core";
import { useCurrentUser } from "../auth/auth";
import { Table as LibTable, useTable } from "../db/table";
import { Board } from "./board";

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
  console.log("useTable", table, error);
  useErrorHandler(error);
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
