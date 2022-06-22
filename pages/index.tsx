import { Box, Button, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { MiniBoard } from "../components/board";
import { useTableHand } from "../lib/hand";
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

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {tables.map((t) => (
          <TableHand key={t.id} tableId={t.id} handId={t.handId} />
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

function TableHand({ tableId, handId }: { tableId: string; handId: string }) {
  const router = useRouter();
  const [hand] = useTableHand(tableId, handId);

  if (!hand) return <div />;

  return (
    <MiniBoard hand={hand} onClick={() => router.push("/tables/" + tableId)} />
  );
}

export default Home;
