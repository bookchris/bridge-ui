import { Bidding } from "./bidding";
import { Trick } from "./play";
import { nextSeat, Seat, seatIndex } from "./seat";
import { Suit } from "./suit";

export interface HandJson {
    dealer?: Seat,
    deal?: number[],
    bidding?: string[],
    play?: number[],
}

export class Hand {
    readonly data: Required<HandJson>;

    constructor(data: HandJson) {
        this.data = {
            dealer: data.dealer || Seat.South,
            deal: data.deal || [],
            bidding: data.bidding || [],
            play: data.play || [],
        }
    };

    getHolding(seat: Seat) {
        if (this.data.deal.length != 52) {
            return []
        }
        const offset = 13 * seatIndex(seat);
        return this.data.deal.slice(offset, offset + 13).filter((c) => !this.data.play.includes(c))
    }

    get north() {
        return this.getHolding(Seat.North);
    }

    get south() {
        console.log("south", this.getHolding(Seat.South));
        return this.getHolding(Seat.South);
    }

    get east() {
        return this.getHolding(Seat.East);
    }

    get west() {
        return this.getHolding(Seat.West);
    }

    get nextBidder() {
        return nextSeat(this.dealer, this.bidding.bids.length);
    }

    get dealer() {
        return this.data.dealer;
    }

    get bidding() {
        return new Bidding(this.data.bidding, this.dealer);
    }

    get state() {
        if (this.bidding.passed) {
            return HandState.Complete;
        }
        if (!this.bidding.complete) {
            return HandState.Bidding;
        }
        if (this.data.play?.length === 52) return HandState.Complete;
        return HandState.Playing;
    }

    get isPlaying() {
        return this.state === HandState.Playing;
    }

    get isBidding() {
        return this.state === HandState.Bidding;
    }

    get openingLeader() {
        return this.bidding.declarer ? nextSeat(this.bidding.declarer) : undefined;
    }


    get player() {
        const tricks = this.tricks;
        if (!tricks.length) {
            return this.openingLeader;
        }
        return tricks[tricks.length - 1].player;
    }

    get tricks() {
        const trump = this.bidding.suit;
        if (!trump) {
            return []
        }
        if (!this.openingLeader) {
            return []
        }
        let leader = this.openingLeader;
        const tricks = [] as Trick[];
        for (let i = 0; i < this.data.play.length; i += 4) {
            const cards = this.data.play.slice(i, i + 4);
            const trick = new Trick(leader, cards, trump);
            if (trick.winningSeat) {
                leader = trick.winningSeat;
            }
            tricks.push(trick);
        }
        return tricks;
    }

    get positions() {
        return this.data.bidding.length + this.data.play.length;
    }

    atPosition(pos: number) {
        if (pos <= 0) {
            return this;
        }

        const play = this.data.play.slice(0, Math.max(this.data.play.length - pos, 0));
        pos -= (this.data.play.length - play.length);

        const bidding = this.data.bidding.slice(0, Math.max(this.data.bidding.length - pos, 0));

        return new Hand({
            dealer: this.data.dealer,
            deal: this.data.deal,
            bidding: bidding,
            play: play,
        })
    }
}

export enum HandState {
    Bidding,
    Playing,
    Complete,
}

export function cardSuit(card: number) {
    return Object.values(Suit)[Math.floor(card / 13)];
}

export function cardRank(card: number) {
    const rank = card % 13;
    switch (rank) {
        case 8: return "T";
        case 9: return "J";
        case 10: return "Q";
        case 11: return "K";
        case 12: return "A";
        default: return `${rank + 2}`;
    }
}

export function cardString(card: number) {
    return `${cardRank(card)}${cardSuit(card)}`;
} 
