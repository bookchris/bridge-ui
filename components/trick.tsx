import { Hand } from "../lib/hand";
import { nextSeat, Seat } from "../lib/seat";
import { Card2 } from "./card";

const OFFSET = "32%";

export interface TrickProps {
  hand: Hand;
  seat?: Seat; // When specified, limits when you can.
}

export function Trick({ hand, seat }: TrickProps) {
  const tricks = hand.tricks;
  const trick = tricks.length ? tricks[tricks.length - 1] : undefined;

  const seatSxProps = {
    [Seat.West]: { left: OFFSET, top: "50%", transform: "translate(0, -45%)" },
    [Seat.North]: { top: OFFSET, left: "50%", transform: "translate(-55%)" },
    [Seat.East]: { right: OFFSET, top: "50%", transform: "translate(0, -55%)" },
    [Seat.South]: { bottom: OFFSET, left: "50%", transform: "translate(-45%)" },
  };
  return (
    <>
      {trick?.cards.map((card, i) => (
        <Card2
          key={card}
          card={card}
          sx={{
            position: "absolute",
            ...seatSxProps[nextSeat(trick.leader, i)],
          }}
        />
      ))}
    </>
  );
}
