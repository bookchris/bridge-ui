import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Link,
  Menu,
  MenuItem,
  ThemeProvider,
  Toolbar,
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
            <NextLink passHref href="/">
              <Link
                variant="h4"
                color="inherit"
                underline="none"
                noWrap
                sx={{ pr: 4 }}
              >
                bridge
              </Link>
            </NextLink>
            {isSm && (
              <>
                <NextLink passHref href="/">
                  <Button
                    color="inherit"
                    sx={{ "&:hover": { color: "black" } }}
                  >
                    Play
                  </Button>
                </NextLink>
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
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ "&:hover": { color: "black" } }}
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
