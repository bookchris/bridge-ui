import { useRouter } from "next/router";
import { useCallback } from "react";
import { Hand } from "../../../functions/core";
import { useTableContext } from "./table";

export const usePosition = (hand: Hand) => {
  const { push, query, pathname } = useRouter();
  const { tableId } = useTableContext();

  const first = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;
  let position = parseInt(first(query.position) || "");
  if (isNaN(position)) position = tableId ? hand.positions : 0;

  const setPosition = useCallback(
    (p: number | ((prev: number) => number)) => {
      const newPosition = p instanceof Function ? p(position) : p;
      const newQuery = { ...query };
      if (
        (newPosition === hand.positions && tableId) ||
        (newPosition === 0 && !tableId)
      ) {
        delete newQuery["position"];
      } else {
        newQuery["position"] = newPosition.toString();
      }
      push({ pathname: pathname, query: newQuery });
    },
    [hand, pathname, position, push, query, tableId]
  );
  return { position: position, setPosition: setPosition };
};
