import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import type { AppProps } from "next/app";
import { ProfileButton } from "../components/profileButton";
import { theme } from "../components/theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <title>Bridge</title>
      <CssBaseline />
      <AppBar position="absolute" color="secondary" elevation={0}>
        <Toolbar>
          <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
            <Typography variant="h4" color="inherit" noWrap sx={{ pr: 10 }}>
              bridge
            </Typography>
            <Button color="inherit" href="/">
              Play
            </Button>
            <Button color="inherit" href="/analysis">
              Analyse
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <ProfileButton />
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Component {...pageProps} />
      </Box>
    </ThemeProvider>
  );
}

export default MyApp;
