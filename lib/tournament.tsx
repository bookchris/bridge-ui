import { Hand, HandJson } from "@chrisbook/bridge-core";
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
/*
export function useTournament(
  id: string
): [Tournament | undefined, boolean, Error | undefined] {
  const [tournament, setTournament] = useState<Tournament>();
  const [error, setError] = useState<Error>();
  useEffect(() => {
    const unsub = onSnapshot(
      tournamentDoc(id),
      (d) => {
        setTournament({ id: d.id, ...(d.data() as Tournament) });
        return () => unsub();
      },
      setError
    );
  }, [id]);
  return [tournament, !tournament && !error, error];
}
*/

export function useTournamentList() {
  return useCollectionData<Tournament>(tournamentsCollection());
}

/*
export function useTournamentList(): [
  Tournament[] | undefined,
  boolean,
  Error | undefined
] {
  const [tournaments, setTournaments] = useState<Tournament[]>();
  const [error, setError] = useState<Error>();
  useEffect(() => {
    const q = query(collection(db, "tournaments"));
    const unsub = onSnapshot(
      q,
      (qs) => {
        const tournaments = [] as Tournament[];
        qs.forEach((doc) =>
          tournaments.push({ id: doc.id, ...(doc.data() as Tournament) })
        );
        setTournaments(tournaments);
        return () => unsub();
      },
      setError
    );
  }, []);
  return [tournaments, !tournaments && !error, error];
}
*/
const tournamentPlayerConverter: FirestoreDataConverter<string> = {
  toFirestore(player: WithFieldValue<string>): DocumentData {
    return {};
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): string {
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

const tournamentHandConverter: FirestoreDataConverter<Hand> = {
  toFirestore(hand: Hand): DocumentData {
    return hand.toJson();
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Hand {
    return Hand.fromJson(snapshot.data(options) as HandJson, snapshot.id);
  },
};

export function useTournamentHands(id: string) {
  return useCollectionData<Hand>(
    collection(db, "tournaments", id, "hands").withConverter(
      tournamentHandConverter
    )
  );
}

/*
export function useTournamentPlayers(
  id: string
): [string[] | undefined, boolean, Error | undefined] {
  const [players, setPlayers] = useState<string[]>();
  const [error, setError] = useState<Error>();
  useEffect(() => {
    const q = query(collection(db, "tournaments", id, "players"));
    const unsub = onSnapshot(
      q,
      (qs) => {
        const players = [] as string[];
        qs.forEach((doc) => players.push(doc.id));
        setPlayers(players);
        return () => unsub();
      },
      setError
    );
  }, [id]);
  return [players, !players && !error, error];
}
*/

/*
export function useTournamentHands(
  id: string
): [HandJson | undefined, boolean, Error | undefined] {
  const [players, setPlayers] = useState<string[]>();
  const [error, setError] = useState<Error>();
  useEffect(() => {
    const q = query(collection(db, "tournaments", id, "hands"));
    const unsub = onSnapshot(
      q,
      (qs) => {
        const hands = [] as HandJson[];
        qs.forEach((doc) =>
          hands.push({ id: doc.id, ...(doc.data() as HandJson) })
        );
        setPlayers(players);
        return () => unsub();
      },
      setError
    );
  }, [id]);
  return [players, !players && !error, error];
}
*/

/*
export function useCreateTournament() {
  return useCallback(async () => {
    const ref = doc(collection(db, "tournaments"));
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
  const tournamentId = useTournamentId();
  return useCallback(
    async (bid: Bid, seat: Seat) => {
      const [ref, _, tournament] = await get(tournamentId);
      const newHand = tournament.hand.doBid(bid, seat);
      if (newHand) {
        await updateDoc(ref, newHand.toJson());
      }
    },
    [tournamentId]
  );
}

export function usePlay() {
  const tournamentId = useTournamentId();
  return useCallback(
    async (card: Card, seat: Seat) => {
      const [ref, _, tournament] = await get(tournamentId);
      const hand = tournament.hand;
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
    [tournamentId]
  );
}

export function useRedeal() {
  const tournamentId = useTournamentId();
  return useCallback(async () => {
    const ref = tournamentDoc(tournamentId);
    return updateDoc(ref, {
      dealer: Seat.South.toJson(),
      deal: generateDeal(),
      bidding: [],
      play: [],
    });
  }, [tournamentId]);
}

async function get(
  tournamentId: string
): Promise<[DocumentReference, QueryDocumentSnapshot, Tournament]> {
  const ref = tournamentDoc(tournamentId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw "Tournament does not exist";
  }
  return [ref, snap, new Tournament(ref.id, Hand.fromJson(snap.data() as HandJson))];
}
*/
