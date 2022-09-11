import { https, pubsub } from "firebase-functions";
import { Hand } from "../core";
import { app } from "./firebase";

const db = app.firestore();

export const daily = pubsub.schedule("0 0 * * *").onRun(async () => {
  console.log("Starting new daily tournamenet");
  await action();
  console.log("Done new daily tournamenet");
});

export const dailyManual = https.onRequest(async (req, res) => {
  console.log("Starting new daily tournamenet (manual)");
  await action();
  console.log("Done new daily tournamenet (manual");
  res.send("ok");
});

const action = () => {
  const newTournament = {
    name:
      "Daily Tournament for " + new Intl.DateTimeFormat().format(new Date()),
    daily: "active",
    hands: Array.from(Array(10).keys()).map(() => Hand.fromDeal().toJson()),
  };

  const tournamentsRef = db.collection("tournaments");
  return db.runTransaction((t) => {
    return t
      .get(tournamentsRef.where("daily", "==", "active"))
      .then((list) => {
        list.forEach((doc) => t.update(doc.ref, { daily: "complete" }));
      })
      .then(() => t.set(tournamentsRef.doc(), newTournament));
  });
};
