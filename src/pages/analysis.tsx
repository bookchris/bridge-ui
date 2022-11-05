import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import { useState } from "react";
import { Hand } from "../../functions/core";
import { Board } from "../components/ui/board";

const Analyse: NextPage = () => {
  const [hand, setHand] = useState<Hand>();
  if (!hand) {
    return <Import onImport={setHand} />;
  }
  return <Board hand={hand} />;
};

const Import = ({ onImport }: { onImport: (hand: Hand) => void }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState<Error>();
  return (
    <Paper sx={{ m: 2, p: 2, width: "100%", maxWidth: 800 }}>
      <Typography paragraph variant="h3">
        Import a Game
      </Typography>
      {error && <Alert severity="error">{error.message}</Alert>}
      <Typography paragraph>Paste a BBO handviewer URL</Typography>
      <TextField
        fullWidth
        multiline
        rows="5"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Box sx={{ display: "flex", justifyContent: "right", mt: 1 }}>
        <Button
          disabled={!input}
          onClick={() => {
            try {
              onImport(Hand.fromLin(input));
            } catch (e: unknown) {
              setError(e as Error);
            }
          }}
        >
          Import
        </Button>
      </Box>
    </Paper>
  );
};

export default Analyse;
