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
import type { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Board } from "../../components/board";
import {
  Tournament,
  useTournament,
  useTournamentHands,
  useTournamentPlayers,
} from "../../lib/tournament";

const TournamentPage: NextPage = () => {
  const { query, isReady } = useRouter();
  if (!isReady) return <div />;

  const first = (v: string | string[]) => (Array.isArray(v) ? v[0] : v);

  return (
    <TournamentPageContent id={first(query.id)} handId={first(query.hand)} />
  );
};

const TournamentPageContent = ({
  id,
  handId,
}: {
  id: string;
  handId?: string;
}) => {
  const [tournament] = useTournament(id);
  const [players] = useTournamentPlayers(id);
  const [hands] = useTournamentHands(id);

  if (!tournament || !players || !hands) {
    return <div>Loading...</div>;
  }
  const hand = hands.find((h) => h.id === handId);
  if (hand) {
    return <Board hand={hand} allHands={hands} />;
  }
  return <PlayerList tournament={tournament} hands={hands} players={players} />;
};

const PlayerList = ({
  tournament,
  hands,
  players,
}: {
  tournament: Tournament;
  hands: Hand[];
  players: string[];
}) => {
  const first = hands
    .filter((h) => h.board === 1)
    .reduce((m, h) => {
      m[h.players[0].toString()] = h;
      return m;
    }, {} as { [key: string]: Hand });

  return (
    <Paper sx={{ m: 2, width: "100%", maxWidth: 800 }}>
      <Typography variant="h4" sx={{ m: 2 }}>
        {tournament.name || tournament.id}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Player</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player) => {
            const h = first[player];
            return (
              <TableRow key={player}>
                <TableCell>
                  {h ? (
                    <NextLink
                      href={`/tournaments/${tournament.id}?hand=${h.id}`}
                      passHref
                    >
                      <Link>{player}</Link>
                    </NextLink>
                  ) : (
                    player
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default TournamentPage;
