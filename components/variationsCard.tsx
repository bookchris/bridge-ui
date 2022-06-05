import { Hand, Seat } from "@chrisbook/bridge-core";
import {
  Box,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import {
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { useBoardContext } from "./board";

export interface VariationsCardProps {
  variations: Hand[];
}

const notable = ["bookopoulo", "DarrylB", "mmoutadayn", "asheppard1"];

export function VariationsCard({ variations }: VariationsCardProps) {
  const { handAt, position } = useBoardContext();
  const { asPath } = useRouter();
  const theme = useTheme();

  const matchingVariations = useMemo(
    () => variations.filter((h) => handAt.isEquivalent(h.atPosition(position))),
    [handAt, position, variations]
  );
  const domain = useMemo(
    () => [
      matchingVariations.reduce(
        (m, h) => Math.min(m, h.scoreAs(Seat.South)),
        Number.MAX_VALUE
      ),
      matchingVariations.reduce(
        (m, h) => Math.max(m, h.scoreAs(Seat.South)),
        Number.MIN_VALUE
      ),
    ],
    [matchingVariations]
  );
  const notableActions = useMemo(
    () =>
      matchingVariations.reduce((m, h) => {
        const action = h
          .atPosition(position + 1)
          .lastAction()
          .toString();
        const score = h.score;
        const player = h.players[0].toString();
        if (notable.includes(player)) {
          const actionEntry = m[action] || {};
          m[action] = actionEntry;
          const scoreEntry = actionEntry[score] || {
            hands: [],
            color: nameToColor(player),
          };
          actionEntry[score] = scoreEntry;
          /*
          if (player === handAt.players[0].toString()) {
            entry.hands = [h, ...entry.hands];
          } else {
            */
          scoreEntry.hands = [...scoreEntry.hands, h];
          // }
        }
        return m;
      }, {} as { [key: string]: { [score: number]: { color: string; hands: Hand[] } } }),
    [matchingVariations, position]
  );
  const data2 = useMemo(
    () =>
      matchingVariations.reduce((m, h) => {
        const action = h.atPosition(position + 1).lastAction();
        const score = h.scoreAs(Seat.South);
        const existing = m[action.toString()];
        const notable = notableActions[action.toString()]?.[score];
        if (existing) {
          const s = existing.find((e) => e.score === score);
          if (s) {
            s.count = s.count + 1;
          } else {
            existing.push({
              score: score,
              count: 1,
              index: 1,
              color: notable?.color,
            });
          }
        } else {
          m[action.toString()] = [
            { score: score, count: 1, index: 1, color: notable?.color },
          ];
        }
        return m;
      }, {} as { [key: string]: [{ score: number; count: number; index: number; color?: string }] }),
    [matchingVariations, notableActions, position]
  );
  const maxCount = Object.values(data2).reduce(
    (m, set) =>
      Math.max(
        m,
        set.reduce((m, result) => Math.max(m, result.count), 0)
      ),
    0
  );
  return (
    <Paper square sx={{ width: "100%" }}>
      <Paper square elevation={0} sx={{ backgroundColor: "secondary.main" }}>
        <Typography sx={{ p: 1, color: "white" }}>Variations</Typography>
      </Paper>
      <Table size="small">
        <TableBody>
          {Object.keys(data2).map((action, i) => {
            const notable = notableActions[action];
            return (
              <TableRow key={action}>
                <TableCell>{action}</TableCell>
                <TableCell width="100%">
                  <div>
                    <ResponsiveContainer width="100%" height={20}>
                      <ScatterChart
                        margin={{ top: 10, right: 10, bottom: 0, left: 10 }}
                      >
                        <XAxis
                          hide
                          type="number"
                          dataKey="score"
                          name="score"
                          interval={0}
                          domain={domain}
                          axisLine={i === Object.keys(data2).length - 1}
                        />
                        <YAxis
                          hide
                          type="number"
                          dataKey="index"
                          tick={false}
                          tickLine={false}
                          axisLine={false}
                        />
                        <ZAxis
                          type="number"
                          dataKey="count"
                          scale="linear"
                          range={[10, 300]}
                          domain={[0, maxCount]}
                        />
                        <Tooltip
                          cursor={false}
                          wrapperStyle={{ zIndex: 100 }}
                        />

                        <Scatter
                          data={data2[action]}
                          fill={theme.palette.grey[600]}
                        >
                          {data2[action].map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color ?? theme.palette.grey[600]}
                            />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                    <Typography variant="body2">
                      {notable &&
                        Object.values(notable).map((score, i) =>
                          score.hands.map((h, j) => (
                            <>
                              {!!(i || j) && " - "}
                              {h.players[0].toString() ===
                              handAt.players[0].toString() ? (
                                <Box
                                  component="span"
                                  sx={{
                                    color: score.color,
                                    fontWeight: "medium",
                                  }}
                                >
                                  {h.players[0].toString()}
                                </Box>
                              ) : (
                                <NextLink
                                  key={h.id}
                                  passHref
                                  href={`${asPath.split("?")[0]}?hand=${
                                    h.id
                                  }&position=${position}`}
                                >
                                  <Link
                                    variant="inherit"
                                    underline="hover"
                                    sx={{ color: score.color }}
                                  >
                                    {h.players[0].toString()}
                                  </Link>
                                </NextLink>
                              )}
                            </>
                          ))
                        )}
                    </Typography>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell />
            <TableCell>
              <ResponsiveContainer width="100%" height={40}>
                <ScatterChart
                  margin={{ top: 10, right: 10, bottom: 0, left: 10 }}
                >
                  <XAxis
                    type="number"
                    dataKey="score"
                    name="score"
                    interval={0}
                    domain={domain}
                    tickLine={{ transform: "translate(0, -6)" }}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}

const nameToColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  return color;
};
