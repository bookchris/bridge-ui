import { Bid, Card, Hand, Seat } from "@chrisbook/bridge-core";
import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  getDoc,
  QueryDocumentSnapshot,
  runTransaction,
  SnapshotOptions,
  updateDoc,
} from "firebase/firestore";
import { useCallback } from "react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { useTableContext } from "../components/table";
import { db } from "../utils/firebase";

export interface Table {
  id: string;
  players?: string[];
  hand: Hand;
}

const tableConverter: FirestoreDataConverter<Table> = {
  toFirestore(table: Table): DocumentData {
    return {
      players: table.players,
      hand: table.hand.toJson(),
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Table {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      players: data.players || [],
      hand: Hand.fromJson(data.hand),
    };
  },
};

export function tableDoc(id: string) {
  return doc(db, "tables", id).withConverter(tableConverter);
}

export function tableCollection() {
  return collection(db, "tables").withConverter(tableConverter);
}

export function useTable(id: string) {
  return useDocumentData<Table>(tableDoc(id));
}

export function useTableList() {
  return useCollectionData<Table>(tableCollection());
}

export function useCreateTable() {
  return useCallback(async (uid: string) => {
    return await runTransaction(db, async (tx) => {
      const ref = doc(collection(db, "tables"));
      await tx.set(ref, {
        players: [uid, "Robot", "Robot", "Robot"],
        hand: Hand.fromDeal().toJson(),
      });
      return ref.id;
    });
  }, []);
}

export function useSit(seat: Seat) {
  const { tableId } = useTableContext();
  return useCallback(
    async (uid: string) => {
      const [ref, _, table] = await get(tableId);
      if (table.players?.[seat.index()]) {
        throw new Error("Seat is already taken");
      }
      if (table.players?.includes(uid)) {
        throw new Error("Player is already at the table");
      }
      const oldPlayers = table.players || [];
      const newPlayers = [...oldPlayers];
      newPlayers.push(...Array(4 - newPlayers.length).fill(""));
      newPlayers[seat.index()] = uid;
      updateDoc(ref, { players: newPlayers });
    },
    [seat, tableId]
  );
}

export function useStand() {
  const { tableId } = useTableContext();
  return useCallback(
    async (uid: string) => {
      const [ref, _, table] = await get(tableId);

      const oldPlayers = table.players || [];
      const newPlayers = oldPlayers.filter((p) => p !== uid);
      if (oldPlayers.length === newPlayers.length) {
        throw new Error("Not currently sitting");
      }
      updateDoc(ref, { players: newPlayers });
    },
    [tableId]
  );
}

async function get(
  id?: string
): Promise<[DocumentReference, QueryDocumentSnapshot, Table]> {
  if (!id) throw new Error("No table id specified");
  const ref = tableDoc(id);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw "Table does not exist";
  }
  return [ref, snap, snap.data()];
}

export function useBid() {
  const { tableId } = useTableContext();
  return useCallback(
    async (bid: Bid, seat: Seat) => {
      const [ref, _, table] = await get(tableId);
      const newHand = table.hand.doBid(bid, seat);
      if (newHand) {
        await updateDoc(ref, { hand: newHand.toJson() });
      }
    },
    [tableId]
  );
}

export function usePlay() {
  const { tableId } = useTableContext();
  return useCallback(
    async (card: Card, seat: Seat) => {
      const [ref, _, table] = await get(tableId);
      const newHand = table.hand.doPlay(card, seat);
      if (newHand) {
        await updateDoc(ref, { hand: newHand.toJson() });
      }
    },
    [tableId]
  );
}

export function useRedeal() {
  const { tableId } = useTableContext();
  return useCallback(async () => {
    const [ref] = await get(tableId);
    const newHand = Hand.fromDeal();
    await updateDoc(ref, { hand: newHand.toJson() });
  }, [tableId]);
}
