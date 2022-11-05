import { firestore, logger } from "firebase-functions";
import { Hand, HandJson, HandState } from "../core";
import { app } from "./firebase";

const db = app.firestore();

export const robot = firestore
  .document("tables/{tableId}")
  .onWrite(async (change, context) => {
    const tableId = context.params.tableId;
    logger.info("table processing for table " + tableId);

    const ref = db.collection("tables").doc(tableId);
    const snapshot = await ref.get();
    if (!snapshot.exists) {
      throw new Error("Table not found at " + tableId);
    }

    const data = snapshot.data() as {
      players?: [];
      hand?: HandJson;
      tournamentId: string;
    };
    const hand = Hand.fromJson(data.hand || {});

    if (hand.state !== HandState.Complete) {
      logger.info("Hand is not complete");
    }

    if (data.tournamentId) {
        const ref = db.collection("tournaments").doc(data.tournamentId).collection("hands");
        const snapshot = await ref.get();
        if (!snapshot.exists) {
          throw new Error("Table not found at " + tableId);
        }
        }
  });
