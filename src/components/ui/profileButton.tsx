import { Button, Icon, Menu, MenuItem } from "@mui/material";
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { Firestore } from "firebase/firestore";
import { useState } from "react";
import { useAuth, useFirestore, useSigninCheck } from "reactfire";
import { useCurrentUser } from "../auth/auth";
import { writeUser } from "../db/user";

export const ProfileButton = () => {
  const { status } = useSigninCheck();
  const user = useCurrentUser();
  const auth = useAuth();
  const db = useFirestore();
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();

  if (status === "loading") {
    return <div />;
  }
  if (!user) {
    return (
      <Button color="inherit" onClick={() => signIn(db, auth)}>
        Login
      </Button>
    );
  }
  return (
    <>
      <Button
        color="inherit"
        endIcon={<Icon>arrow_drop_down</Icon>}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        {user.displayName}
      </Button>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(undefined)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(undefined);
            signOut(auth);
            // Hack to clear reactfire cache.
            // https://github.com/FirebaseExtended/reactfire/discussions/228
            const reactFirePreloadedObservables = (
              globalThis as Record<string, unknown>
            )["_reactFirePreloadedObservables"] as
              | Map<string, unknown>
              | undefined;
            if (reactFirePreloadedObservables) {
              Array.from(reactFirePreloadedObservables.keys())
                .filter((key) => key.includes("firestore"))
                .forEach((key) => reactFirePreloadedObservables.delete(key));
            }
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

const signIn = async (db: Firestore, auth: Auth) => {
  try {
    const provider = new GoogleAuthProvider();
    const creds = await signInWithPopup(auth, provider);
    const user = creds.user;
    await writeUser(db, {
      id: user.uid,
      displayName: user.displayName || undefined,
    });
  } catch (err) {
    console.error(err);
  }
};
