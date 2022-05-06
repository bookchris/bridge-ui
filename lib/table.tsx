import {
  arrayUnion,
  doc,
  DocumentReference,
  getDoc,
  onSnapshot,
  QueryDocumentSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useTableId } from "../components/table";
import { db } from "../utils/firebase";
import { Hand, HandJson } from "./hand";
import { Seat } from "./seat";

class Table extends Hand {}

export function tableDoc(id: string) {
  return doc(db, "tables", id);
}

export function useTable(
  id: string
): [Table | undefined, boolean, Error | undefined] {
  const [table, setTable] = useState<Table>();
  const [error, setError] = useState<Error>();
  useEffect(() => {
    const unsub = onSnapshot(
      tableDoc(id),
      (d) => {
        setTable(new Table(d.data() as HandJson));
        return () => unsub();
      },
      setError
    );
  }, [id]);
  return [table, !table && !error, error];
}

export function useBid() {
  const tableId = useTableId();
  return useCallback(
    async (bid: string, seat: Seat) => {
      const [ref, _, table] = await get(tableId);
      if (!table.isBidding) throw new Error("Not in bidding state");
      if (table.nextBidder != seat) throw new Error(`Not ${seat} turn to bid`);
      if (!table.bidding.validateNext(bid))
        throw new Error(`Bid ${bid} is not valid`);
      await updateDoc(ref, { bidding: [...table.data.bidding, bid] });
    },
    [tableId]
  );
}

export function usePlay() {
  const tableId = useTableId();
  return useCallback(
    async (card: number, seat: Seat) => {
      const [ref, _, table] = await get(tableId);
      if (!table.isPlaying) throw new Error("Not in playing state");
      if (table.player != seat) throw new Error(`Not ${seat}'s turn to play`);
      // TODO: does the player have the card.
      // TODO: is valid card to player.
      await updateDoc(ref, {
        play: arrayUnion(card),
      });
    },
    [tableId]
  );
}

export function useRedeal() {
  const tableId = useTableId();
  return useCallback(async () => {
    const ref = tableDoc(tableId);
    return updateDoc(ref, {
      dealer: Seat.South,
      deal: generateDeal(),
      bidding: [],
      play: [],
    });
  }, [tableId]);
}

async function get(
  tableId: string
): Promise<[DocumentReference, QueryDocumentSnapshot, Table]> {
  const ref = tableDoc(tableId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw "Table does not exist";
  }
  return [ref, snap, new Table(snap.data() as HandJson)];
}

function generateDeal() {
  const cards = [] as number[];
  for (let i = 0; i < 52; i++) {
    cards.push(i);
  }

  const result = [] as number[];
  for (let i = 0; i < 52; i++) {
    const index = Math.floor(Math.random() * cards.length);
    const card = cards[index];
    cards.splice(index, 1);
    result.push(card);
  }
  return result;
}
