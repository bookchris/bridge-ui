import {
  collection,
  DocumentData,
  FirestoreDataConverter,
  query,
  QueryDocumentSnapshot,
  SnapshotOptions,
  where,
} from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { Hand, HandJson } from "../../../functions/core";

const handConverter: FirestoreDataConverter<Hand> = {
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

/* 
const handDoc = (tableId: string, handId: string) =>
  doc(db, "tables", tableId, "hands", handId).withConverter(handConverter);
*/

export function useTournamentHands(id: string) {
  const db = useFirestore();
  return useFirestoreCollectionData<Hand>(
    collection(db, "tournaments", id, "hands").withConverter(handConverter)
  );
}

export function useMyTournamentHands(id: string) {
  const db = useFirestore();
  const q = query(
    collection(db, "tournaments", id, "hands").withConverter(handConverter),
    where("players", "==", "active")
  );
  return useFirestoreCollectionData<Hand>(q);
}

/*
export function useTableHands(id: string) {
  return useCollectionData<Hand>(
    collection(db, "tables", id, "hands").withConverter(handConverter)
  );
}

export function useTableHand(tableId?: string, handId?: string) {
  return useDocumentData<Hand>(
    tableId && handId
      ? doc(db, "tables", tableId, "hands", handId).withConverter(handConverter)
      : null
  );
}
*/

/*
 */

/*
async function get(
  tableId?: string,
  handId?: string
): Promise<[DocumentReference, QueryDocumentSnapshot, Hand]> {
  if (!tableId) throw new Error("table id not provided");
  if (!handId) throw new Error("hand id not provided");
  const ref = handDoc(tableId, handId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw "Hand does not exist";
  }
  return [ref, snap, snap.data()];
}
*/
