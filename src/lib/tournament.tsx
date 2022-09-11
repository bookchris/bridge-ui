import {
  collection,
  doc,
  DocumentData,
  Firestore,
  FirestoreDataConverter,
  query,
  QueryDocumentSnapshot,
  runTransaction,
  SnapshotOptions,
  Transaction,
  where,
  WithFieldValue,
} from "firebase/firestore";
import { useCallback } from "react";
import {
  ObservableStatus,
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";
import { Hand } from "../../functions/core";
import { useCurrentUserMust } from "../components/auth";
import { tableCollection, tableConverter } from "./table";

export interface Tournament {
  id: string;
  bboid: string;
  name: string;
  date: string;
  daily: string;
  hands: Hand[];
}

const tournamentConverter: FirestoreDataConverter<Tournament> = {
  toFirestore(tournament: Tournament): DocumentData {
    return {
      ...tournament,
      hands: tournament.hands.map((hand) => hand.toJson()),
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Tournament {
    const data = snapshot.data(options);
    const hands = Array.isArray(data.hands)
      ? data.hands.map((h) => Hand.fromJson(h))
      : [];
    return {
      ...(snapshot.data(options) as Tournament),
      id: snapshot.id,
      hands: hands,
    };
  },
};

export function tournamentDoc(db: Firestore, id: string) {
  return doc(db, "tournaments", id).withConverter(tournamentConverter);
}

export function tournamentsCollection(db: Firestore) {
  return collection(db, "tournaments").withConverter(tournamentConverter);
}

export function tournamentTables(db: Firestore, id: string) {
  return collection(db, "tournaments", id, "tables").withConverter(
    tableConverter
  );
}

export function useTournament(id: string) {
  const db = useFirestore();
  return useFirestoreDocData<Tournament>(tournamentDoc(db, id));
}

export function useTournamentList() {
  const db = useFirestore();
  return useFirestoreCollectionData<Tournament>(tournamentsCollection(db));
}

const tournamentPlayerConverter: FirestoreDataConverter<string> = {
  toFirestore(player: WithFieldValue<string>): DocumentData {
    return {};
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): string {
    return snapshot.id;
  },
};

export function useTournamentPlayers(id: string) {
  const db = useFirestore();
  return useFirestoreCollectionData<string>(
    collection(db, "tournaments", id, "players").withConverter(
      tournamentPlayerConverter
    )
  );
}

export function useDailyTournament(): ObservableStatus<Tournament> {
  const db = useFirestore();
  const status = useFirestoreCollectionData<Tournament>(
    query(tournamentsCollection(db), where("daily", "==", "active"))
  );
  return {
    ...status,
    data: status.data?.[0],
  };
}

export function useJoinTournament() {
  const db = useFirestore();
  const user = useCurrentUserMust();
  return useCallback(
    async (id: string) => {
      return await runTransaction(db, async (tx: Transaction) => {
        const tournamentRef = tournamentDoc(db, id);
        const tournament = await tx.get(tournamentRef);
        if (tournament.data()?.daily !== "active") {
          throw new Error("Cannot join inactive tournament");
        }
        const tableRef = doc(tableCollection(db));
        await tx.set(tableRef, {
          id: tableRef.id,
          tournamentId: id,
          players: [user.uid, "Robot", "Robot", "Robot"],
          hand: Hand.fromDeal(),
        });
        return tableRef.id;
        /*
        const tournamentRef = );
        const [ref, _, table] = await get(db, tableId);
        const newHand = table.hand.doBid(bid, seat);
        if (newHand) {
          await updateDoc(ref, { hand: newHand.toJson() });
        }
        */
      });
    },
    [db]
  );
}
