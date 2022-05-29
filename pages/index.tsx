import { Box, Button, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { MiniBoard } from "../components/board";
import { useCreateTable, useTableList } from "../lib/table";

const Home: NextPage = () => {
  const router = useRouter();
  const [tables, loading, error] = useTableList();
  const createTable = useCreateTable();

  if (!tables) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Typography variant="h5" sx={{ py: 1 }}>
        Join a table
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", width: "800px", gap: 2 }}>
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
          onClick={() =>
            createTable().then((id) => router.push("/tables/" + id))
          }
        >
          Create a new table
        </Button>
      </Box>
    </div>
  );
};

export default Home;
