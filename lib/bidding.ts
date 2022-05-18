import { Bid, Seat, Suit, SuitBids } from "@chrisbook/bridge-core";

export class Contract {
  suit?: Suit;
}

export class Bidding {
  bids: Bid[];
  suit?: Suit;
  level?: number;
  index?: number;
  bidder?: Seat;
  doubled?: boolean;
  redoubled?: boolean;
  complete: boolean;
  passed: boolean;

  constructor(bids: string[], private dealer: Seat) {
    this.bids = [];
    bids.forEach((b, i) => {
      const bid = new Bid(b);
      if (bid.suit && bid.index && bid.level) {
        this.suit = bid.suit;
        this.index = bid.index;
        this.level = bid.level;
        this.doubled = false;
        this.redoubled = false;
        this.bidder = this.dealer.next(i);
      }
      if (bid.bid === "X") {
        this.doubled = true;
      } else if (bid.bid === "XX") {
        this.redoubled = true;
        this.doubled = false;
      }
      this.bids.push(bid);
    });
    this.passed = bids.length === 4 && !bids.find((b) => b !== "Pass");
    this.complete =
      this.passed ||
      (bids.length >= 4 && !bids.slice(-3).find((b) => b !== "Pass"));
  }

  get contract() {
    if (!this.complete) return "";
    if (this.index === undefined) return "Passed out";

    const result = `${SuitBids[this.index]} ${this.declarer}`;
    if (this.doubled) {
      return result + " Doubled";
    }
    if (this.redoubled) {
      return result + " Redoubled";
    }
    return result;
  }

  get declarer() {
    if (this.suit && this.bidder) {
      const partner = this.bidder.partner();
      let seat = this.dealer;
      for (let i = 0; i < this.bids.length; i++) {
        const bid = this.bids[i];
        if (bid.suit === this.suit) {
          if (seat === this.bidder) {
            return this.bidder;
          }
          if (seat === partner) {
            return partner;
          }
        }
        seat = seat.next();
      }
    }
    return undefined;
  }

  get pendingOpponentBid() {
    if (this.bids.length && this.bids[this.bids.length - 1].bid !== "Pass") {
      return this.bids[this.bids.length - 1];
    }
    if (
      this.bids.length >= 3 &&
      this.bids[this.bids.length - 1].bid === "Pass" &&
      this.bids[this.bids.length - 2].bid === "Pass" &&
      this.bids[this.bids.length - 3].bid !== "Pass"
    ) {
      return this.bids[this.bids.length - 3];
    }
    return undefined;
  }

  get canDouble() {
    return !!this.pendingOpponentBid?.suit;
  }

  get canRedouble() {
    return this.pendingOpponentBid?.bid === "X";
  }

  get validBids() {
    let bids = ["Pass"];
    if (this.canDouble) {
      bids.push("X");
    }
    if (this.canRedouble) {
      bids.push("XX");
    }
    if (this.index) {
      return bids.concat(SuitBids.slice(this.index + 1));
    }
    return bids.concat(SuitBids);
  }

  get validBidLevel() {
    if (this.index) {
      const next = this.index + 1;
      if (next >= SuitBids.length) {
        return 8;
      }
      return parseInt(SuitBids[next][0]);
    }
    return 1;
  }

  validateNext(b: string) {
    if (b === "Pass") return true;
    if (b === "X") return this.canDouble;
    if (b === "XX") return this.canRedouble;
    const bid = new Bid(b);
    if (!this.index || !this.suit || !bid.index || !bid.suit) return true;
    return (
      this.index < bid.index ||
      (this.index === bid.index && this.suit < bid.suit)
    );
  }
}
