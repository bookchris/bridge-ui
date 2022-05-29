import { Hand } from "@chrisbook/bridge-core";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useBoardContext } from "./board";

export interface SetCardProps {
  hand: Hand;
  set: Hand[];
}

export function SetCard({ hand, set }: SetCardProps) {
  const { push, query, pathname } = useRouter();
  const { setPosition } = useBoardContext();
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
              hover
              onClick={() => {
                const newQuery = { ...query, hand: h.id };
                delete newQuery["position"];
                push({ pathname: pathname, query: newQuery });
              }}
              key={h.id}
              sx={{
                backgroundColor:
                  h.board === hand.board ? "grey.300" : undefined,
                cursor: "pointer",
              }}
            >
              <TableCell>{h.board}</TableCell>
              <TableCell>{h.bidding.contract.toString()}</TableCell>
              <TableCell>{h.result}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
