import { createContext, useContext } from "react";
import { useTable } from "../lib/table";
import { Board } from "./board";

const tableId = "NYHC3TLyjxRso2RkBHtZ";
const BoardContext = createContext("");
export const useTableId = () => useContext(BoardContext);

export function Table() {
  const [hand, loading, error] = useTable(tableId);

  if (!hand) {
    return <div>Loading...</div>;
  }

  return (
    <BoardContext.Provider value={tableId}>
      <Board hand={hand} />
    </BoardContext.Provider>
  );
}
