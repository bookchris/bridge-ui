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
import { getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import type { AppProps } from "next/app";
import NextLink from "next/link";
import { ReactNode, useEffect, useState } from "react";
import {
  AuthProvider,
  FirebaseAppProvider,
  FirestoreProvider,
  useFirebaseApp,
} from "reactfire";
import { ProfileButton } from "../components/profileButton";
import { theme } from "../components/theme";

const firebaseConfig = {
  apiKey: "AIzaSyCtSsAIy3AFecDUcyvX7l6gbp-FKhQgeQs",
  authDomain: "freebridge.firebaseapp.com",
  projectId: "freebridge",
  storageBucket: "freebridge.appspot.com",
  messagingSenderId: "856419566005",
  appId: "1:856419566005:web:64f1efe8de70461f9119fc",
  measurementId: "G-CZJFR4Q370",
};

function SafeHydrate({ children }: { children: ReactNode }) {
  const [render, setRender] = useState(false);

  useEffect(() => {
    setRender(true);
  }, []);
  return <div>{render && children}</div>;
}

const FirebaseSDKProviders = ({ children }: { children: ReactNode }) => {
  const firebaseApp = useFirebaseApp();
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  if (process.env.NEXT_PUBLIC_USE_EMULATORS) {
    try {
      connectFirestoreEmulator(firestore, "localhost", 8080);
    } catch (error: unknown) {}
  }

  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestore}>{children}</FirestoreProvider>
    </AuthProvider>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  const isSm = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <SafeHydrate>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <FirebaseSDKProviders>
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
        </FirebaseSDKProviders>
      </FirebaseAppProvider>
    </SafeHydrate>
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
