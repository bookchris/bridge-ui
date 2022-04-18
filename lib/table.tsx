import { arrayUnion, doc, DocumentData, DocumentReference, FirestoreDataConverter, QueryDocumentSnapshot, runTransaction, SnapshotOptions, Transaction, updateDoc } from 'firebase/firestore';
import { useCallback } from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';
import { useTableId } from '../components/table';
import { db } from "../utils/firebase";
import { canBid } from './bidding';
import { canPlay, Hand } from './hand';
import { Seat } from './seat';

interface Table extends Hand {
}

const tableConverter: FirestoreDataConverter<Table> = {
    toFirestore(table: Table): DocumentData {
        return { ...table, dealer: table.dealer ? Seat[table.dealer] : undefined };
    },

    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): Table {
        const data = snapshot.data(options);
        return {
            ...data,
            dealer: data.dealer ? data.dealer as Seat : Seat.South
        };
    },
};

export function tableDoc(id: string) {
    return doc(db, 'tables', id).withConverter(tableConverter);
}

export function useTable(id: string) {
    return useDocument<Table>(tableDoc(id));
}

export function useBid() {
    const tableId = useTableId();
    return useCallback(async (bid: string, seat: Seat) => {
        await runTransaction(db, async (tx) => {
            const [ref, _, table] = await getInTx(tx, tableId);
            if (!canBid(table, seat, bid)) {
                throw new Error(`Cannot bid ${bid} from seat ${seat}`);
            }
            tx.update(ref, { bidding: [...(table.bidding || []), bid], });
        });
    }, [tableId]);
}

export function usePlay() {
    const tableId = useTableId();
    return useCallback(async (card: number, seat: Seat) => {
        await runTransaction(db, async (tx) => {
            const [ref, snap, table] = await getInTx(tx, tableId);
            if (!canPlay(table, seat, card)) {
                throw "Not allowed to play";
            }
            tx.update(ref, { play: arrayUnion(card) });
        });
    }, [tableId]);
}

export function useRedeal(tableId: string) {
    return useCallback(async () => {
        const ref = tableDoc(tableId);
        return updateDoc(ref, {
            dealer: Seat.South,
            deal: generateDeal(),
            bidding: [],
            play: [],
        }
        );
    }, [tableId]);
}

async function getInTx(tx: Transaction, tableId: string): Promise<[DocumentReference, QueryDocumentSnapshot, Table]> {
    const ref = tableDoc(tableId);
    const snap = await tx.get(ref);
    if (!snap.exists()) {
        throw "Table does not exist";
    }
    return [ref, snap, snap.data() as Table];
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
