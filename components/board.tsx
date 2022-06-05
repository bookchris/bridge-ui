import { Hand, HandState, Seat } from "@chrisbook/bridge-core";
import { Box, Paper, useMediaQuery, useTheme } from "@mui/material";
import useSize from "@react-hook/size";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useRef,
} from "react";
import { BidBox } from "./bidBox";
import { BiddingCard } from "./biddingCard";
import { ContractCard } from "./contractCard";
import { Controls } from "./controls";
import { Holding } from "./holding";
import { Play } from "./playCard";
import { PlayerBox } from "./playerBox";
import { usePosition } from "./position";
import { ScoreBox } from "./scoreBox";
import { SetCard } from "./setCard";
import { Trick } from "./trick";
import { VariationsCard } from "./variationsCard";

interface BoardContextType {
  hand: Hand;
  position: number;
  setPosition: Dispatch<SetStateAction<number>>;
  handAt: Hand;
  width: number;
  scale: number;
}

const BoardContext = createContext({} as BoardContextType);

export const useBoardContext = () => useContext(BoardContext);

export interface BoardProps {
  hand: Hand;
  allHands?: Hand[];
  live?: boolean;
  position?: number;
}

export function Board({ hand, allHands, live }: BoardProps) {
  const { position, setPosition } = usePosition(hand);
  const readOnly = position !== hand.positions || !live;

  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));
  const isXl = useMediaQuery(theme.breakpoints.up("xl"));

  const ref = useRef<HTMLDivElement>(null);
  const [width] = useSize(ref);

  const handAt = hand.atPosition(position);

  const set = useMemo(
    () =>
      allHands
        ?.filter((h) => h.players[0].toString() === hand.players[0].toString())
        .slice()
        .sort((a, b) => a.board - b.board),
    [allHands, hand]
  );

  const variations = useMemo(
    () => allHands?.filter((h) => h.board === hand.board),
    [allHands, hand]
  );

  const value = useMemo(
    () => ({
      width: width,
      scale: width / 900,
      hand: hand,
      handAt: handAt,
      position: position,
      setPosition: setPosition,
    }),
    [width, hand, handAt, position, setPosition]
  );

  const setCard = <>{set && <SetCard hand={hand} set={set} />}</>;
  const variationCard = (
    <>{set && <VariationsCard variations={variations} />}</>
  );
  const right = (
    <>
      <Controls hand={hand} position={position} setPosition={setPosition} />
      <ContractCard />
      <BiddingCard hand={hand} position={position} />
      {!hand.isBidding && <Play hand={hand} position={position} />}
    </>
  );
  return (
    <div>
      <BoardContext.Provider value={value}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            //my: 2,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          {isXl && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minWidth: 400,
              }}
            >
              {setCard}
              {variationCard}
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Paper
              ref={ref}
              sx={{
                backgroundColor: "#378B05",
                width: "min(100vmin, 800px);",
                height: "min(100vmin, 800px);",
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
              {handAt.state === HandState.Complete && (
                <ScoreBox hand={handAt} />
              )}
            </Paper>
            {!isXl && variationCard}
            {!isLg && setCard}
            {!isLg && right}
          </Box>
          {isLg && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minWidth: 300,
              }}
            >
              {right}
              {isLg && !isXl && setCard}
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: width,
            mt: 2,
          }}
        ></Box>
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
      position: hand.positions,
      setPosition: () => {},
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
        cursor: "pointer",
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
