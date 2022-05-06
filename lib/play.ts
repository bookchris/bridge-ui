import { cardSuit } from "./hand";
import { nextSeat, Seat } from "./seat";
import { Suit } from "./suit";

export class Trick {
  constructor(
    readonly leader: Seat,
    readonly cards: number[],
    readonly trump: Suit
  ) {}

  get complete() {
    return this.cards.length === 4;
  }

  get player() {
    if (this.complete) {
      return this.winningSeat;
    } else {
      return nextSeat(this.leader, this.cards.length);
    }
  }

  get winningSeat() {
    if (this.cards.length != 4) {
      return undefined;
    }
    let winner = this.cards[0];
    let seat = this.leader;
    this.cards.slice(1).forEach((card, i) => {
      const ws = cardSuit(winner);
      const cs = cardSuit(card);
      if (ws == cs) {
        if (winner < card) {
          winner = card;
          seat = nextSeat(this.leader, i + 1);
        }
      } else if (cs == this.trump) {
        winner = card;
        seat = nextSeat(this.leader, i + 1);
      }
    });
    return seat;
  }
}
