import { Bid, Card, Hand, HandJson, Seat } from "@chrisbook/bridge-core";
import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  getDoc,
  QueryDocumentSnapshot,
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

const handDoc = (tableId: string, handId: string) =>
  doc(db, "tables", tableId, "hands", handId).withConverter(handConverter);

export function useTournamentHands(id: string) {
  return useCollectionData<Hand>(
    collection(db, "tournaments", id, "hands").withConverter(handConverter)
  );
}

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

export function useBid() {
  const { tableId, handId } = useTableContext();
  return useCallback(
    async (bid: Bid, seat: Seat) => {
      const [ref, _, hand] = await get(tableId, handId);
      const newHand = hand.doBid(bid, seat);
      if (newHand) {
        await updateDoc(ref, newHand.toJson());
      }
    },
    [tableId, handId]
  );
}

export function usePlay() {
  const { tableId, handId } = useTableContext();
  return useCallback(
    async (card: Card, seat: Seat) => {
      const [ref, _, hand] = await get(tableId, handId);
      const newHand = hand.doPlay(card, seat);
      if (newHand) {
        await updateDoc(ref, newHand.toJson());
      }
    },
    [tableId, handId]
  );
}

export function useRedeal() {
  const { tableId, handId } = useTableContext();
  return useCallback(async () => {
    const [ref] = await get(tableId, handId);
    const newHand = Hand.fromDeal();
    await updateDoc(ref, newHand.toJson());
  }, [tableId, handId]);
}

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
