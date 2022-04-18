import { getState, Hand, HandState } from "./hand";
import { nextSeat, Seat } from "./seat";
import { Suit, Suits } from "./suit";

const BidLevels = ["1", "2", "3", "4", "5", "6", "7"].reduce((res, bid: string) => {
    const level = Suits.map((s) => (bid + s));
    return res.concat(level);
}, [] as string[]);

export function getBidder(hand: Hand) {
    const bidding = hand.bidding || [];
    return nextSeat(hand.dealer, bidding.length);
}

export function isBidding(hand: Hand) {
    return getState(hand) === HandState.Bidding;
}

export function bidLevel(bid: string) {
    return BidLevels.indexOf(bid);
}

export function bidSuit(bid: string) {
    return bid.substring(1) as Suit;
}

export function lastBidLevel(bidding: string[]) {
    for (const bid of bidding.slice().reverse()) {
        const level = bidLevel(bid);
        if (level != -1) {
            return level;
        }
    }
    return -1;
}

export function lastBidSuit(bidding: string[]) {
    for (const bid of bidding.slice().reverse()) {
        if (bid == "Pass" || bid == "X" || bid == "XX") continue;
        return bidSuit(bid);
    }
    return "";
}

export function validBids(bidding: string[]) {
    let bids = ["Pass", "X", "XX"];
    const last = lastBidLevel(bidding);
    if (last != -1) {
        return bids.concat(BidLevels.slice(last + 1));
    }
    return bids.concat(BidLevels);
}

export function validBidLevel(bidding: string[]) {
    const last = lastBidLevel(bidding);
    if (last == -1) {
        return 1;
    }
    const next = last + 1;
    if (next >= BidLevels.length) {
        return 8;
    }
    return parseInt(BidLevels[next][0]);
}

export function isValidBid(bidding: string[], bid: string) {
    if (bid === "Pass") return true;
    const level = bidLevel(bid);
    if (level != 1) {
        const lastLevel = lastBidLevel(bidding);
        if (lastLevel != -1 && lastLevel >= level) return false;
    }
    if (bid === "X") {
    }
    if (bid === "XX") {
    }
    return true;
}

export function canBid(hand: Hand, bidder: Seat, bid: string) {
    if (!isBidding(hand)) return false;
    if (getBidder(hand) != bidder) return false;
    if (!isValidBid(hand.bidding || [], bid)) return false;
    return true;
}