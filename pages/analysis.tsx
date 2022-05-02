import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { useState } from 'react';
import { Board } from '../components/board';
import { Hand, HandJson } from '../lib/hand';
import { Seat } from '../lib/seat';
import { Suit, Suits } from '../lib/suit';

const Analyse: NextPage = () => {
    const [hand, setHand] = useState<Hand>();
    if (!hand) {
        return <Import onImport={setHand} />;
    }
    return <Board hand={hand} />;
}

const Import = ({ onImport }: { onImport: (hand: Hand) => void }) => {
    const [input, setInput] = useState("");
    const [error, setError] = useState<string>();
    return (
        <Paper sx={{ m: 2, p: 2, width: "100%", maxWidth: 800 }}>
            <Typography paragraph variant="h3">Import a Game</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Typography paragraph>Paste a BBO handviewer URL</Typography>
            <TextField fullWidth multiline rows="5" value={input} onChange={(e) => setInput(e.target.value)} />
            <Box sx={{ display: "flex", justifyContent: "right", mt: 1 }}>
                <Button disabled={!input} onClick={() => performImport(input).then(onImport, setError)}>Import</Button>
            </Box>
        </Paper >
    )
}

const LinToSeat: { [bid: string]: Seat } = { "1": Seat.South, "2": Seat.West, "3": Seat.North, "4": Seat.East };
const LinToSuit: { [bid: string]: Suit } = { "S": Suit.Spade, "H": Suit.Heart, "D": Suit.Diamond, "C": Suit.Club };

const performImport = (data: string): Promise<Hand> => {
    let url: URL;
    try {
        url = new URL(data);
    } catch (_) {
        return Promise.reject("Not a valid URL");
    }
    const lin = url.searchParams.get("lin");
    if (!lin) {
        return Promise.reject("No lin found in URL");

    }
    console.log("lin", lin);
    const line = lin.split("\n")[0].trim();
    const terms = line.split("|");

    const json: HandJson = {};

    while (terms.length >= 2) {
        const [key, value] = terms;
        terms.splice(0, 2);
        switch (key) {
            case "md":
                json.dealer = LinToSeat[value[0]];
                const linHands = value.substring(1).split(",");
                if (linHands.length !== 4) {
                    continue;
                }
                const hands = linHands.map((linHand, i) => {
                    const hand: number[] = [];
                    ["C", "D", "H", "S"].forEach(s => {
                        const suit = LinToSuit[s];
                        const start = linHand.indexOf(s) + 1;
                        if (start === 0) return;
                        let end = linHand.substring(start).search(/[SHDC]/) + start;
                        if (end === start - 1) {
                            end = linHand.length;
                        }
                        const cards = linHand.substring(start, end)
                        for (const c of cards) {
                            const rank = linCardToRank(c)
                            if (rank !== -1) {
                                hand.push(rank + 13 * Suits.indexOf(suit));
                            }
                        }
                    })
                    return hand;
                })
                json.deal = ([] as number[]).concat(hands[0], hands[1], hands[2], hands[3]);
                break;
            case "mb":
                const bid = linBidToBid(value);
                if (!json.bidding) {
                    json.bidding = [];
                }
                json.bidding.push(bid);
                break;
            case "pc":
                const suit = LinToSuit[value[0]];
                const rank = linCardToRank(value[1]);
                if (rank === -1) {
                    continue;
                }
                const card = rank + 13 * Suits.indexOf(suit);
                if (!json.play) {
                    json.play = [];
                }
                json.play.push(card);
                break;
            default:
                console.log("other key, value", key, value);
        }
    }
    console.log("hand", json);
    return Promise.resolve(new Hand(json));
}

function linCardToRank(c: string) {
    switch (c) {
        case "A": return 12;
        case "K": return 11;
        case "Q": return 10;
        case "J": return 9;
        case "T": return 8;
    }
    const number = parseInt(c);
    if (number > 0) {
        return number - 2;
    }
    return -1
}

function linBidToBid(b: string) {
    let bid = b.toUpperCase().replaceAll("!", "");
    if (bid.endsWith("N")) {
        bid = bid + "T";
    } else if (bid === "DBL" || bid === "D") {
        bid = "X"
    } else if (bid === "REDBL" || bid === "R") {
        bid = "XX";
    } else if (bid === "P") {
        bid = "Pass";
    }
    return bid;
}

export default Analyse
