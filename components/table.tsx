import { Seat, Seats } from "@chrisbook/bridge-core";
import { createContext, useContext, useMemo } from "react";
import { Table, useTable } from "../lib/table";
import { useAuth } from "./auth";
import { Board } from "./board";

interface TableContextType {
  tableId?: string;
  handId?: string;
  table?: Table;
  playingAs?: Seat;
}

const TableContext = createContext<TableContextType>({});

export const useTableContext = () => useContext(TableContext);

export function Table({ id }: { id: string }) {
  const [table] = useTable(id);

  if (!table) {
    return <div>Loading...</div>;
  }

  return <TableContent table={table} />;
}

export function TableContent({ table }: { table: Table }) {
  const hand = table.hand;

  const [user] = useAuth();

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
