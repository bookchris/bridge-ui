import {
  doc,
  DocumentData,
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  setDoc,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";
import { useCallback } from "react";
import { useErrorHandler } from "react-error-boundary";
import { useFirestore, useFirestoreDocData } from "reactfire";

export interface User {
  id: string;
  displayName?: string;
}

const userConverter: FirestoreDataConverter<User> = {
  toFirestore(user: WithFieldValue<User>): DocumentData {
    return { displayName: user.displayName };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): User {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      displayName: data.displayName,
    };
  },
};

export function userDoc(db: Firestore, id: string) {
  return doc(db, "users", id).withConverter(userConverter);
}

export function useUser(id: string): User | undefined {
  const db = useFirestore();
  const status = useFirestoreDocData<User>(userDoc(db, id));
  console.log("useUser", status.error);
  useErrorHandler(status.error);
  return status.data;
}

export async function writeUser(db: Firestore, user: User) {
  await setDoc(userDoc(db, user.id), user);
}

export function useWriteUser() {
  const db = useFirestore();
  return useCallback((user: User) => writeUser(db, user), [db]);
}
