import { Hand } from "@chrisbook/bridge-core";
import {
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import {
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

  const matchingVariations = useMemo(
    () => variations.filter((h) => handAt.isEquivalent(h.atPosition(position))),
    [handAt, position, variations]
  );
  const domain = useMemo(
    () => [
      matchingVariations.reduce(
        (m, h) => Math.min(m, h.score),
        Number.MAX_VALUE
      ),
      matchingVariations.reduce(
        (m, h) => Math.max(m, h.score),
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
        if (notable.includes(h.players[0].toString())) {
          m[action] = [...(m[action] || []), h];
        }
        return m;
      }, {} as { [key: string]: Hand[] }),
    [matchingVariations, position]
  );
  const data2 = useMemo(
    () =>
      matchingVariations.reduce((m, h) => {
        const action = h.atPosition(position + 1).lastAction();
        const score = h.score;
        const existing = m[action.toString()];
        if (existing) {
          const s = existing.find((e) => e.score === score);
          if (s) {
            s.count = s.count + 1;
          } else {
            existing.push({
              score: score,
              count: 1,
              index: 1,
            });
          }
        } else {
          m[action.toString()] = [{ score: score, count: 1, index: 1 }];
        }
        return m;
      }, {} as { [key: string]: [{ score: number; count: number; index: number }] }),
    [matchingVariations, position]
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
          {Object.keys(data2).map((action, i) => (
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
                      <Tooltip cursor={false} wrapperStyle={{ zIndex: 100 }} />

                      <Scatter data={data2[action]} fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveContainer>
                  <Typography variant="body2">
                    {notableActions[action]?.map((h, i) => (
                      <>
                        {i !== 0 && " - "}

                        <NextLink
                          key={h.id}
                          passHref
                          href={`${asPath.split("?")[0]}?hand=${
                            h.id
                          }&position=${position}`}
                        >
                          <Link variant="inherit">
                            {h.players[0].toString()}
                          </Link>
                        </NextLink>
                      </>
                    ))}
                  </Typography>
                </div>
              </TableCell>
            </TableRow>
          ))}
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
