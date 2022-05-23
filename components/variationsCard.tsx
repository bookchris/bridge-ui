import { Bid, Card, Hand } from "@chrisbook/bridge-core";
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
    () =>
      variations
        .map((h) => h.atPosition(position))
        .filter((h) => handAt.isEquivalent(h)),
    [handAt, position, variations]
  );
  console.log("position", position, matchingVariations.length);
  type Result = {
    count: number;
    hand: Hand;
  };
  const variationsMap = useMemo(
    () =>
      matchingVariations.reduce((m, h) => {
        /*
        const action = h.atPosition(position - 1).lastAction();
        const existing = m.get(action);
        if (existing) {
          m.set(action, { ...existing, count: existing.count + 1 });
        } else {
          m.set(action, { hand: h, count: 1 });
        }
        */
        return m;
      }, new Map<Bid | Card, Result>()),
    [matchingVariations]
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
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from(variationsMap.entries()).map(([action, result]) => (
            <TableRow key={action.toString()}>
              <TableCell>
                <NextLink
                  href={{
                    pathname: pathname,
                    query: { ...query, hand: result.hand.id },
                  }}
                  passHref
                >
                  <Link>{action.toString()}</Link>
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
