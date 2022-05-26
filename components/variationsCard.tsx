import { Hand } from "@chrisbook/bridge-core";
import {
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useBoardContext } from "./board";

export interface VariationsCardProps {
  variations: Hand[];
}

export function VariationsCard({ variations }: VariationsCardProps) {
  const { hand, handAt, position } = useBoardContext();
  const { query, pathname } = useRouter();

  const matchingVariations = useMemo(
    () => variations.filter((h) => handAt.isEquivalent(h.atPosition(position))),
    [handAt, position, variations]
  );
  type Result = {
    count: number;
    hand: Hand;
  };
  const variationsMap = useMemo(
    () =>
      new Map(
        [
          ...matchingVariations.reduce((m, h) => {
            const action = h.atPosition(position + 1).lastAction();
            const existing = m.get(action.toString());
            if (existing) {
              m.set(action.toString(), {
                ...existing,
                count: existing.count + 1,
              });
            } else {
              m.set(action.toString(), { hand: h, count: 1 });
            }
            return m;
          }, new Map<string, Result>()),
        ].sort(([_a, a], [_b, b]) => b.count - a.count)
      ),
    [matchingVariations, position]
  );

  return (
    <Paper square>
      <Paper square elevation={0} sx={{ backgroundColor: "secondary.main" }}>
        <Typography sx={{ p: 1, color: "white" }}>Variations</Typography>
      </Paper>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{handAt.isBidding ? "Bids" : "Card"}</TableCell>
            <TableCell>Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from(variationsMap.entries()).map(([action, result]) => (
            <TableRow key={action}>
              <TableCell>
                <NextLink
                  href={{
                    pathname: pathname,
                    query: { ...query, hand: result.hand.id },
                  }}
                  passHref
                >
                  <Link>{action}</Link>
                </NextLink>
              </TableCell>
              <TableCell>{result.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
