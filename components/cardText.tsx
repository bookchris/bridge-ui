import { Suit } from "@chrisbook/bridge-core";
import { Typography } from "@mui/material";
import { cardString, cardSuit } from "../lib/hand";

export interface CardTextProps {
  card: number;
}

export function CardText({ card }: CardTextProps) {
  const suit = cardSuit(card);
  return (
    <Typography variant="inherit" sx={{ color: cardColor(card) }}>
      {cardString(card)}
    </Typography>
  );
}

export function cardColor(card: number) {
  switch (cardSuit(card)) {
    case Suit.Heart:
      return "red";
    case Suit.Diamond:
      return "orange";
    case Suit.Club:
      return "blue";
    default:
    case Suit.Spade:
      return "black";
  }
}
