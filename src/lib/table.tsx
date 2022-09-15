import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  FirestoreDataConverter,
  getDoc,
  query,
  QueryDocumentSnapshot,
  runTransaction,
  SnapshotOptions,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback } from "react";
import {
  ObservableStatus,
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";
import { Bid, Card, Hand, Seat } from "../../functions/core";
import { useCurrentUserMust } from "../components/auth";
import { useTableContext } from "../components/table";

export interface Table {
  id: string;
  tournamentId?: string;
  players?: string[];
  hand: Hand;
}

export const tableConverter: FirestoreDataConverter<Table> = {
  toFirestore(table: Table): DocumentData {
    return {
      ...table,
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
      ...data,
      id: snapshot.id,
      players: data.players || [],
      hand: Hand.fromJson(data.hand),
    };
  },
};

export function tableDoc(db: Firestore, id: string) {
  return doc(db, "tables", id).withConverter(tableConverter);
}

export function tableCollection(db: Firestore) {
  return collection(db, "tables").withConverter(tableConverter);
}

export function useTable(id: string) {
  const db = useFirestore();
  return useFirestoreDocData<Table>(tableDoc(db, id));
}

export function useTableList() {
  const db = useFirestore();
  return useFirestoreCollectionData<Table>(tableCollection(db));
}

export const useMyTables = () => {
  const db = useFirestore();
  const user = useCurrentUserMust();
  return useFirestoreCollectionData<Table>(
    query(tableCollection(db), where("players", "array-contains", user.uid))
  );
};

export function useMyTournamentTable(id: string): ObservableStatus<Table> {
  const user = useCurrentUserMust();
  const db = useFirestore();
  const q = query(
    collection(db, "tables").withConverter(tableConverter),
    where("tournamentId", "==", id),
    where("players", "array-contains", user.uid)
  );
  const status = useFirestoreCollectionData<Table>(q);
  return {
    ...status,
    data: status.data?.[0],
  };
}

export function useCreateTable() {
  const db = useFirestore();
  return useCallback(
    async (uid: string) => {
      return await runTransaction(db, async (tx) => {
        const ref = doc(collection(db, "tables"));
        await tx.set(ref, {
          players: [uid, "Robot", "Robot", "Robot"],
          hand: Hand.fromDeal().toJson(),
        });
        return ref.id;
      });
    },
    [db]
  );
}

export function useSit(seat: Seat) {
  const db = useFirestore();
  const { tableId } = useTableContext();
  return useCallback(
    async (uid: string) => {
      const [ref, _, table] = await get(db, tableId);
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
    [db, seat, tableId]
  );
}

export function useStand() {
  const db = useFirestore();
  const { tableId } = useTableContext();
  return useCallback(
    async (uid: string) => {
      const [ref, _, table] = await get(db, tableId);

      const oldPlayers = table.players || [];
      const newPlayers = oldPlayers.filter((p) => p !== uid);
      if (oldPlayers.length === newPlayers.length) {
        throw new Error("Not currently sitting");
      }
      updateDoc(ref, { players: newPlayers });
    },
    [db, tableId]
  );
}

async function get(
  db: Firestore,
  id?: string
): Promise<[DocumentReference, QueryDocumentSnapshot, Table]> {
  if (!id) throw new Error("No table id specified");
  const ref = tableDoc(db, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw "Table does not exist";
  }
  return [ref, snap, snap.data()];
}

export function useBid() {
  const db = useFirestore();
  const { tableId } = useTableContext();
  return useCallback(
    async (bid: Bid, seat: Seat) => {
      const [ref, _, table] = await get(db, tableId);
      const newHand = table.hand.doBid(bid, seat);
      if (newHand) {
        await updateDoc(ref, { hand: newHand.toJson() });
      }
    },
    [db, tableId]
  );
}

export function usePlay() {
  const db = useFirestore();
  const { tableId } = useTableContext();
  return useCallback(
    async (card: Card, seat: Seat) => {
      const [ref, _, table] = await get(db, tableId);
      const newHand = table.hand.doPlay(card, seat);
      if (newHand) {
        await updateDoc(ref, { hand: newHand.toJson() });
      }
    },
    [db, tableId]
  );
}

export function useRedeal() {
  const db = useFirestore();
  const { tableId } = useTableContext();
  return useCallback(async () => {
    const [ref] = await get(db, tableId);
    const newHand = Hand.fromDeal();
    await updateDoc(ref, { hand: newHand.toJson() });
  }, [db, tableId]);
}
