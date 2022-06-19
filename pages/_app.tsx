import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Menu,
  MenuItem,
  ThemeProvider,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import type { AppProps } from "next/app";
import NextLink from "next/link";
import { useState } from "react";
import { ProfileButton } from "../components/profileButton";
import { theme } from "../components/theme";

function MyApp({ Component, pageProps }: AppProps) {
  const isSm = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <ThemeProvider theme={theme}>
      <title>Bridge</title>
      <CssBaseline />
      <AppBar position="absolute" color="secondary" elevation={0}>
        <Toolbar>
          <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
            <Typography variant="h4" color="inherit" noWrap sx={{ pr: 4 }}>
              bridge
            </Typography>
            {isSm && (
              <>
                <Button color="inherit" href="/">
                  Play
                </Button>
                <AnalyizeMenu />
              </>
            )}
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
          mt: { sm: 2 },
        }}
      >
        <Component {...pageProps} />
      </Box>
    </ThemeProvider>
  );
}

const AnalyizeMenu = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  return (
    <>
      <Button
        color="inherit"
        id="menubutton1"
        aria-owns={anchorEl ? "analyize-menu" : null}
        aria-haspopup="true"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        onMouseOver={(e) => setAnchorEl(e.currentTarget)}
      >
        Analyse
      </Button>
      <Menu
        id="analyize-menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(undefined)}
        onClick={() => setAnchorEl(undefined)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <NextLink href="/tournaments" passHref>
          <MenuItem>Tournaments</MenuItem>
        </NextLink>
        <NextLink href="/analysis" passHref>
          <MenuItem>Import</MenuItem>
        </NextLink>
      </Menu>
    </>
  );
};

export default MyApp;
