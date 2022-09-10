import { Box, Button, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAuth } from "../components/auth";
import { MiniBoard } from "../components/board";
import { ErrorAlert } from "../components/errorAlert";
import { useCreateTable, useMyTables } from "../lib/table";

const Home: NextPage = () => {
  const router = useRouter();
  const [tables, _, error] = useMyTables();
  const createTable = useCreateTable();
  const [auth] = useAuth();

  if (error) {
    return <ErrorAlert error={error} />;
  }
  if (!tables) {
    return <div>Loading...</div>;
  }

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
          disabled={!auth}
          onClick={() =>
            createTable(auth?.uid || "").then((id) =>
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
