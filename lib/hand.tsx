import { lastBidSuit } from "./bidding";
import { nextSeat, Seat, seatIndex } from "./seat";
import { Suit } from "./suit";


export interface Hand {
    dealer: Seat;
    deal?: number[];
    bidding?: string[];
    play?: number[];
}

export enum HandState {
    Bidding,
    Playing,
    Complete,
}

export function getState(hand: Hand) {
    const bidding = hand.bidding || [];
    const play = hand.play || [];
    if (bidding.length < 4) return HandState.Bidding;
    if (bidding.length === 4 && !bidding.find((bid) => bid !== "Pass")) return HandState.Complete;
    if (play.length === 52) return HandState.Complete;
    if (bidding.slice(-3).find((bid) => bid !== "Pass")) return HandState.Bidding;
    return HandState.Playing;
}

export function getDeclarer(hand: Hand) {
    if (!isPlaying(hand)) throw "Not playing";
    // TODO: determine declarer  
    return Seat.South;
}

export function getLeader(hand: Hand) {
    return nextSeat(getDeclarer(hand));
}

export function getPlayer(hand: Hand) {
    const play = hand.play || [];
    const leader = getTrickLeader(hand);
    return nextSeat(leader, play.length % 4);
}

export function isPlaying(hand: Hand) {
    return getState(hand) === HandState.Playing;
}

export function canPlay(hand: Hand, player: Seat, card: number) {
    if (!isPlaying(hand)) return false;
    if (getPlayer(hand) != player) return false;
    // TODO: is valid card.  
    return true;
}

export function getTrickLeader(hand: Hand) {
    const play = hand.play || [];
    if (play.length >= 4) {
        const trick = getLastTrick(hand);
        const trump = lastBidSuit(hand.bidding || []);
        const card = trickWinner(trick, trump);
        return cardHolder(card, hand.deal || []);
    }
    return getLeader(hand);
}

export function cardHolder(card: number, cards: number[]) {
    const index = cards.indexOf(card);
    return Object.values(Seat)[Math.floor(index / 13)];
}

export function cardSuit(card: number) {
    return Object.values(Suit)[Math.floor(card / 13)];
}

export function trickWinner(cards: number[], trump: string) {
    let winner = cards[0];
    cards.slice(1).forEach((card) => {
        const ws = cardSuit(winner);
        const cs = cardSuit(card);
        if (ws == cs) {
            if (winner < card) {
                winner = card;
            }
        } else if (cs == trump) {
            winner = card;
        }
    })
    return winner;
}

export function getLastTrick(hand: Hand) {
    const play = hand.play || [];
    if (play.length >= 4) {
        const start = play.length / 4;
        return play.slice(start, start + 4);
    }
    return []
}

export function getCurrentTrick(hand: Hand) {
    const play = hand.play || [];
    const size = (play.length % 4);
    return play.slice(play.length - size, play.length);
}

export function getHolding(hand: Hand, seat: Seat) {
    if (!hand.deal || hand.deal.length != 52) {
        return []
    }
    const played = hand.play || [];
    const offset = 13 * seatIndex(seat);
    return hand.deal.slice(offset, offset + 13).filter((c) => !played.includes(c));
}