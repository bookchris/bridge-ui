import { Card } from "@chrisbook/bridge-core";
import { Box, Paper, PaperProps, styled } from "@mui/material";
import { useBoardContext } from "./board";
import { cardColor } from "./cardText";

export const useCardSize = () => {
  const { width } = useBoardContext();
  return {
    width: width / 9.3,
    height: width / 6,
  };
};

export enum Orientation {
  None = 0,
  Left = 1,
  Right = 2,
}

export interface CardProps extends PaperProps {
  card: Card;
  orientation?: Orientation;
}

const CardImage = styled("img")({
  display: "block",
});

export function Card2({
  card,
  orientation = Orientation.None,
  ...paperProps
}: CardProps) {
  const { width, height } = useCardSize();
  const paperSxProps = {
    [Orientation.None]: { width: width, height: height },
    [Orientation.Left]: { width: height, height: width },
    [Orientation.Right]: { width: height, height: width },
  };
  const imageSxProps = {
    [Orientation.None]: {},
    [Orientation.Left]: { transform: "rotate(270deg)" },
    [Orientation.Right]: { transform: "rotate(90deg)" },
  };
  const color = cardColor(card);
  return (
    <Paper
      {...paperProps}
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        fontSize: width / 6,
        borderRadius: 2,
        boxShadow: 1,
        ...paperSxProps[orientation],
        ...paperProps?.sx,
      }}
    >
      <Box sx={{ position: "absolute", top: "0.5em", left: "0.9em" }}>
        <CornerText sx={{ color: color }}>{card.rankStr}</CornerText>
        <CornerText sx={{ color: color }}>{card.suit.toString()}</CornerText>
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: "0.5em",
          right: "0.9em",
          transform: "rotate(180deg);",
        }}
      >
        <CornerText sx={{ color: color }}>{card.rankStr}</CornerText>
        <CornerText sx={{ color: color }}>{card.suit.toString()}</CornerText>
      </Box>
    </Paper>
  );
}

const CornerText = styled("div")({
  fontSize: "2.0em",
  fontFamily: "'Roboto Slab', serif;",
  lineHeight: 0.8,
  width: "1em",
  textAlign: "center",
  transform: "translate(-50%, 0);",
});
