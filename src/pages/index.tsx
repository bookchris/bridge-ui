import { Box, Button, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useErrorHandler } from "react-error-boundary";
import { useCurrentUser } from "../components/auth/auth";
import { MiniBoard } from "../components/board";
import {
  useCreateTable,
  useMyTables,
  useMyTournamentTable,
} from "../components/db/table";
import {
  Tournament,
  useDailyTournament,
  useJoinTournament,
} from "../components/db/tournament";

const Home: NextPage = () => {
  const user = useCurrentUser();
  return (
    <div>
      <Daily />
    </div>
  );
};

const Daily = () => {
  const daily = useDailyTournament();
  if (!daily) {
    return <div>No daily tournament, sorry!</div>;
  }
  return <DailyBoard tournament={daily} />;
};

const DailyBoard = ({ tournament }: { tournament: Tournament }) => {
  const user = useCurrentUser();

  return (
    <div>
      <Typography variant="h5" sx={{ py: 1 }}>
        {tournament.name}
      </Typography>
      {user ? <MyDailyBoard tournament={tournament} /> : <p>Login to join</p>}
    </div>
  );
};

const MyDailyBoard = ({ tournament }: { tournament: Tournament }) => {
  const router = useRouter();
  const table = useMyTournamentTable(tournament.id);
  const joinTournament = useJoinTournament();
  return (
    <div>
      {table ? (
        <div>
          <p>You are joined. Click to play this tournament</p>
          <MiniBoard
            hand={tournament.hands[0]}
            onClick={() => router.push(`/tables/${table.id}`)}
          />
        </div>
      ) : (
        <div>
          <p>Click to join this tournament</p>
          <MiniBoard
            hand={tournament.hands[0]}
            onClick={() => joinTournament(tournament.id)}
          />
        </div>
      )}
    </div>
  );
};

const MyTables = () => {
  const createTable = useCreateTable();
  const router = useRouter();
  const user = useCurrentUser();

  const { data: tables, error } = useMyTables();
  useErrorHandler(error);
  return (
    <div>
      <Typography variant="h5" sx={{ py: 1 }}>
        My tables
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {tables.map((t) => (
          <MiniBoard
            key={t.id}
            hand={t.hand}
            onClick={() => router.push("/tables/" + t.id)}
          />
        ))}
      </Box>
      <Box>
        <Button
          disabled={!user}
          onClick={() =>
            createTable(user?.uid || "").then((id) =>
              router.push("/tables/" + id)
            )
          }
        >
          Create a new table
        </Button>
      </Box>
    </div>
  );
};

export default Home;
