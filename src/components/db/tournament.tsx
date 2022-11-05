import {
  collection,
  doc,
  DocumentData,
  Firestore,
  FirestoreDataConverter,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  runTransaction,
  SnapshotOptions,
  Transaction,
  where,
  WithFieldValue,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useErrorHandler } from "react-error-boundary";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";
import { Hand } from "../../../functions/core";
import { useCurrentUserMust } from "../auth/auth";
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

export function useDailyTournament(): Tournament {
  const db = useFirestore();
  const status = useFirestoreCollectionData<Tournament>(
    query(tournamentsCollection(db), where("daily", "==", "active"))
  );
  useErrorHandler(status.error);
  return status.data?.[0];
  /*
  return {
    ...status,
    data: status.data?.[0],
  };
  */
}

export function useDailyTournament2(): Tournament | undefined {
  const db = useFirestore();
  const [data, setData] = useState<Tournament | undefined>();

  const resolveRef = useRef<(t: Tournament | undefined) => void>();
  const promise = useMemo(
    () =>
      new Promise<Tournament | undefined>((resolve) => {
        resolveRef.current = resolve;
      }),
    []
  );

  useEffect(() => {
    // todo return;
    console.log("reqeusting snapshot");
    onSnapshot(
      query(tournamentsCollection(db), where("daily", "==", "active")),
      (snapshot) => {
        const data = snapshot.empty ? undefined : snapshot.docs[0].data();
        console.log("data", data, resolveRef.current);
        setData(data);
        if (resolveRef.current) {
          resolveRef.current(data);
          resolveRef.current = undefined;
        }
      },
      (error) => {
        console.log("got an error", error);
      }
    );
  }, [db]);
  console.log("daily", resolveRef.current, promise, data);
  if (resolveRef.current) throw promise;
  return data;

  //const status = useFirestoreCollectionData<Tournament>();
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
    [db, user.uid]
  );
}
