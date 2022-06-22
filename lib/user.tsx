import {
  doc,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  setDoc,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";
import { useCallback } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../utils/firebase";

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

export function userDoc(id: string) {
  return doc(db, "users", id).withConverter(userConverter);
}

export function useUser(id: string | undefined) {
  return useDocumentData<User>(id ? userDoc(id) : null);
}

export async function writeUser(user: User) {
  await setDoc(userDoc(user.id), user);
}

export function useWriteUser() {
  return useCallback(writeUser, []);
}
