import { Hand, Seat } from "@chrisbook/bridge-core";
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
  WithFieldValue,
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
  handId: string;
}

const tableConverter: FirestoreDataConverter<Table> = {
  toFirestore(tournament: WithFieldValue<Table>): DocumentData {
    return tournament;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Table {
    return {
      ...(snapshot.data(options) as Table),
      id: snapshot.id,
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
  return useCallback(async () => {
    await runTransaction(db, async (tx) => {
      const tableRef = doc(collection(db, "tables"));
      await tx.set(tableRef, {});
      const handRef = doc(collection(db, "tables", tableRef.id, "hands"));
      await tx.set(handRef, Hand.fromDeal().toJson());
      await tx.set(tableRef, { handId: handRef.id });
      return tableRef.id;
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
