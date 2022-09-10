import axios from "axios";
import * as admin from "firebase-admin";
import { firestore, logger } from "firebase-functions";
import { Bid, Card, Hand, HandJson, Seat, Suit } from "../core";

const app = admin.initializeApp();
const db = app.firestore();

const baseURL = "https://ben-wrqv6ob42a-uc.a.run.app";
// const baseURL = "http://localhost:8081";

export interface Table {
  id: string;
  players?: string[];
  hand: Hand;
}

export const robot = firestore
  .document("tables/{tableId}")
  .onWrite(async (change, context) => {
    const tableId = context.params.tableId;
    logger.info("onWrite for tableY " + tableId);

    const ref = db.collection("tables").doc(tableId);
    const snapshot = await ref.get();
    if (!snapshot.exists) {
      throw new Error("Table not found at " + tableId);
    }

    const data = snapshot.data() as { players?: []; hand?: HandJson };
    const hand = Hand.fromJson(data.hand || {});

    const turn = hand.turn;
    let newHand: Hand | undefined;
    if (turn && data?.players?.at(turn.index()) === "Robot") {
      logger.info("Robot's turn!");
      if (hand.isBidding) {
        const bid = await getBid(hand);
        newHand = hand.doBid(bid, turn);
        if (!newHand) {
          logger.info("unable to perform bid", bid.toString());
        }
      } else if (hand.isPlaying) {
        if (!hand.play.length) {
          const card = await getLead(hand);
          newHand = hand.doPlay(card, turn);
          if (!newHand) {
            logger.info("unable to perform lead", card.toString());
          }
        } else {
          const playable = hand
            .getHolding(turn)
            .filter((card) => hand.canPlay(card, turn));
          let card: Card;
          if (playable.length === 1) {
            card = playable[0];
          } else {
            card = await getPlay(hand);
          }
          newHand = hand.doPlay(card, turn);
          if (!newHand) {
            logger.info("unable to perform play", card.toString());
          }
        }
      }
    } else {
      logger.info("Not Robot's turn");
    }
    if (newHand) {
      ref.update({ hand: newHand.toJson() });
    }
  });

const getBid = async (hand: Hand) => {
  const req = {
    vul: hand.vulnerability.toBen(),
    hand: getHolding(hand),
    auction: getAuction(hand),
  };
  console.log("requesting bid", req);
  const resp = await axios.post(baseURL + "/api/bid", req);
  const data: { bid: string } = resp.data;
  console.log("response", data);
  return new Bid(data.bid);
};

const getLead = async (hand: Hand) => {
  const req = {
    vul: hand.vulnerability.toBen(),
    hand: getHolding(hand),
    auction: getAuction(hand),
  };
  console.log("requesting lead", req);
  const resp = await axios.post(baseURL + "/api/lead", req);
  const data: { card: string } = resp.data;
  console.log("response", data);
  return Card.fromLin(data.card);
};

const getPlay = async (hand: Hand) => {
  const req = {
    vul: hand.vulnerability.toBen(),
    hands: [
      holdingToBen(hand.getDeal(Seat.North)),
      holdingToBen(hand.getDeal(Seat.East)),
      holdingToBen(hand.getDeal(Seat.South)),
      holdingToBen(hand.getDeal(Seat.West)),
    ],
    auction: getAuction(hand),
    play: hand.play.map((c) => c.toBen()),
  };
  console.log("requesting play", req);
  const resp = await axios.post(baseURL + "/api/play", req);
  const data: { card: string } = resp.data;
  console.log("response", data);
  return Card.fromLin(data.card);
};

const getAuction = (hand: Hand) => {
  const padding = [] as string[];
  for (let d = hand.dealer; d !== Seat.North; d = d.next()) {
    padding.push("PAD_START");
  }
  return [...padding, ...hand.bidding.map((b) => b.toBen())];
};

const getHolding = (hand: Hand, seat?: Seat) => {
  if (!seat) {
    seat = hand.turn;
  }
  return holdingToBen(hand.getHolding(seat!));
};

const holdingToBen = (cards: Card[]) => {
  const holdingMap = cards.reduce(
    (m, card) => {
      const suit = card.suit.toString();
      m[suit] += card.rankStr;
      return m;
    },
    {
      [Suit.Spade.toString()]: "",
      [Suit.Heart.toString()]: "",
      [Suit.Diamond.toString()]: "",
      [Suit.Club.toString()]: "",
    }
  );
  return Object.values(holdingMap).join(".");
};
