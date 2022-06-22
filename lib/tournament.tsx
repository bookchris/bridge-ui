import {
  collection,
  doc,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { db } from "../utils/firebase";

export interface Tournament {
  id: string;
  bboid: string;
  name: string;
  date: string;
}

const tournamentConverter: FirestoreDataConverter<Tournament> = {
  toFirestore(tournament: WithFieldValue<Tournament>): DocumentData {
    return tournament;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Tournament {
    return {
      ...(snapshot.data(options) as Tournament),
      id: snapshot.id,
    };
  },
};

export function tournamentDoc(id: string) {
  return doc(db, "tournaments", id).withConverter(tournamentConverter);
}

export function tournamentsCollection() {
  return collection(db, "tournaments").withConverter(tournamentConverter);
}

export function useTournament(id: string) {
  return useDocumentData<Tournament>(tournamentDoc(id));
}

export function useTournamentList() {
  return useCollectionData<Tournament>(tournamentsCollection());
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
  return useCollectionData<string>(
    collection(db, "tournaments", id, "players").withConverter(
      tournamentPlayerConverter
    )
  );
}
