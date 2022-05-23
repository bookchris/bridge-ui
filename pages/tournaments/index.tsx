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
import type { NextPage } from "next";
import NextLink from "next/link";
import { useTournamentList } from "../../lib/tournament";

const TournamentsPage: NextPage = () => {
  const [tournaments, loading, error] = useTournamentList();

  if (!tournaments) {
    return <div>Loading...</div>;
  }

  return (
    <Paper sx={{ m: 2, width: "100%", maxWidth: 800 }}>
      <Typography variant="h4" sx={{ m: 2 }}>
        Tournaments
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tournaments.map((tournament) => (
            <TableRow key={tournament.id}>
              <TableCell>
                <NextLink href={`/tournaments/${tournament.id}`} passHref>
                  <Link variant="body2">{tournament.name}</Link>
                </NextLink>
              </TableCell>
              <TableCell>{tournament.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default TournamentsPage;
