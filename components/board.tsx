import { Box, Paper, useMediaQuery, useTheme } from "@mui/material";
import useSize from "@react-hook/size";
import { createContext, useContext, useMemo, useRef, useState } from "react";
import { Hand, HandState } from "../lib/hand";
import { Seat } from "../lib/seat";
import { BidBox } from "./bidBox";
import { BiddingCard } from "./biddingCard";
import { ContractCard } from "./contractCard";
import { Controls } from "./controls";
import { Holding } from "./holding";
import { Play } from "./playCard";
import { PlayerBox } from "./playerBox";
import { ScoreBox } from "./scoreBox";
import { Trick } from "./trick";

interface BoardContextType {
  hand: Hand;
  position: number;
  handAt: Hand;
  width: number;
  scale: number;
}

const BoardContext = createContext({} as BoardContextType);

export const useBoardContext = () => useContext(BoardContext);

export interface BoardProps {
  hand: Hand;
}

export function Board({ hand }: BoardProps) {
  const [position, setPosition] = useState(0);
  const readOnly = position !== 0;

  const theme = useTheme();
  const columns = useMediaQuery(theme.breakpoints.up("lg"));

  const ref = useRef<HTMLDivElement>(null);
  const [width] = useSize(ref);

  const handAt = hand.atPosition(position);

  const value = useMemo(
    () => ({
      width: width,
      scale: width / 900,
      hand: hand,
      handAt: handAt,
      position: position,
    }),
    [width, hand, handAt, position]
  );

  const cards = (
    <>
      <Controls hand={hand} position={position} setPosition={setPosition} />
      <ContractCard hand={handAt} />
      <BiddingCard hand={hand} position={position} />
      {hand.isBidding ? <div /> : <Play hand={hand} position={position} />}
    </>
  );
  return (
    <div>
      <BoardContext.Provider value={value}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            my: 2,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Paper
            ref={ref}
            sx={{
              backgroundColor: "#378B05",
              width: "min(100vmin, 900px);",
              height: "min(100vmin, 900px);",
              position: "relative",
            }}
          >
            <Holding seat={Seat.North} cards={handAt.north} />
            <Holding seat={Seat.West} cards={handAt.west} />
            <Holding seat={Seat.East} cards={handAt.east} />
            <Holding seat={Seat.South} cards={handAt.south} />
            <PlayerBox seat={Seat.South} />
            <PlayerBox seat={Seat.North} />
            <PlayerBox seat={Seat.East} />
            <PlayerBox seat={Seat.West} />
            {!readOnly && handAt.state === HandState.Bidding && (
              <BidBox hand={handAt} />
            )}
            {handAt.state === HandState.Playing && <Trick hand={handAt} />}
            {handAt.state === HandState.Complete && <ScoreBox hand={handAt} />}
          </Paper>
          {columns && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {cards}
            </Box>
          )}
        </Box>
        {!columns && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: width /*"min(100vw, 900px);"*/,
            }}
          >
            {cards}
          </Box>
        )}
      </BoardContext.Provider>
    </div>
  );
}

export interface MiniBoardProps {
  hand: Hand;
  onClick?: () => void;
}

export function MiniBoard({ hand, onClick = () => {} }: MiniBoardProps) {
  const width = 400;
  const value = useMemo(
    () => ({
      width: width,
      scale: width / 900,
      hand: hand,
      handAt: hand,
      position: 0,
    }),
    [width, hand]
  );

  return (
    <Paper
      onClick={onClick}
      sx={{
        backgroundColor: "#378B05",
        width: `${width}px`,
        height: `${width}px`,
        position: "relative",
      }}
    >
      <BoardContext.Provider value={value}>
        <Holding seat={Seat.North} cards={hand.north} />
        <Holding seat={Seat.West} cards={hand.west} />
        <Holding seat={Seat.East} cards={hand.east} />
        <Holding seat={Seat.South} cards={hand.south} />
        <PlayerBox seat={Seat.South} />
        <PlayerBox seat={Seat.North} />
        <PlayerBox seat={Seat.East} />
        <PlayerBox seat={Seat.West} />
        {hand.state === HandState.Playing && <Trick hand={hand} />}
        {hand.state === HandState.Complete && <ScoreBox hand={hand} />}
      </BoardContext.Provider>
    </Paper>
  );
}
