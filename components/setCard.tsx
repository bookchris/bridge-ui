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

export interface SetCardProps {
  hand: Hand;
  set: Hand[];
}

export function SetCard({ hand, set }: SetCardProps) {
  const { query, pathname } = useRouter();
  return (
    <Paper square>
      <Paper square elevation={0} sx={{ backgroundColor: "secondary.main" }}>
        <Typography sx={{ p: 1, color: "white" }}>Boards</Typography>
      </Paper>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Contract</TableCell>
            <TableCell>Result</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {set.map((h) => (
            <TableRow
              key={h.id}
              sx={{
                backgroundColor:
                  h.board === hand.board ? "grey.300" : undefined,
              }}
            >
              <TableCell>
                <NextLink
                  href={{ pathname: pathname, query: { ...query, hand: h.id } }}
                  passHref
                >
                  <Link>{h.board}</Link>
                </NextLink>
              </TableCell>
              <TableCell>{h.bidding.contract.toString()}</TableCell>
              <TableCell>{h.result}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
