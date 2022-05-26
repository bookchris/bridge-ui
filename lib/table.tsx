import { Bid, Card, Hand, HandJson, Seat } from "@chrisbook/bridge-core";
import {
  arrayUnion,
  collection,
  doc,
  DocumentReference,
  getDoc,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useTableId } from "../components/table";
import { db } from "../utils/firebase";

class Table {
  constructor(readonly id: string, readonly hand: Hand) {}
}

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
        setTable(new Table(d.id, Hand.fromJson(d.data() as HandJson)));
        return () => unsub();
      },
      setError
    );
  }, [id]);
  return [table, !table && !error, error];
}

export function useTableList(): [
  Table[] | undefined,
  boolean,
  Error | undefined
] {
  const [tables, setTables] = useState<Table[]>();
  const [error, setError] = useState<Error>();
  useEffect(() => {
    const q = query(collection(db, "tables"));
    const unsub = onSnapshot(
      q,
      (qs) => {
        const tables = [] as Table[];
        qs.forEach((doc) => {
          tables.push(new Table(doc.id, Hand.fromJson(doc.data() as HandJson)));
        });
        setTables(tables);
        return () => unsub();
      },
      setError
    );
  }, []);
  return [tables, !tables && !error, error];
}

export function useCreateTable() {
  return useCallback(async () => {
    const ref = doc(collection(db, "tables"));
    await setDoc(ref, {
      dealer: Seat.South.toJson(),
      deal: generateDeal(),
      bidding: [],
      play: [],
    });
    return ref.id;
  }, []);
}

export function useBid() {
  const tableId = useTableId();
  return useCallback(
    async (bid: Bid, seat: Seat) => {
      const [ref, _, table] = await get(tableId);
      const newHand = table.hand.doBid(bid, seat);
      if (newHand) {
        await updateDoc(ref, newHand.toJson());
      }
    },
    [tableId]
  );
}

export function usePlay() {
  const tableId = useTableId();
  return useCallback(
    async (card: Card, seat: Seat) => {
      const [ref, _, table] = await get(tableId);
      const hand = table.hand;
      if (!hand.isPlaying) throw new Error("Not in playing state");
      if (hand.player != seat) throw new Error(`Not ${seat}'s turn to play`);
      const holding = hand.getHolding(seat);
      if (!holding.find((c) => c.id === card.id))
        throw new Error(`${seat} doesn't have card ${card}`);
      const lastTrick = hand.tricks.at(-1);
      if (lastTrick && !lastTrick.complete) {
        const lead = lastTrick.cards[0];
        if (
          card.suit !== lead.suit &&
          holding.filter((c) => c.suit === lead.suit).length
        )
          throw new Error(`Must follow suit`);
      }
      await updateDoc(ref, {
        play: arrayUnion(card.id),
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
      dealer: Seat.South.toJson(),
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
  return [ref, snap, new Table(ref.id, Hand.fromJson(snap.data() as HandJson))];
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
