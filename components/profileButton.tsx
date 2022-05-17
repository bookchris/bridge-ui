import { Button, Icon, Menu, MenuItem } from "@mui/material";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";

export const ProfileButton = () => {
  const [user, loading, error] = useAuthState(auth);
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();

  if (loading) {
    return <div />;
  }
  if (!user) {
    return (
      <Button color="inherit" onClick={signIn}>
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
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

const googleProvider = new GoogleAuthProvider();
const signIn = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (err) {
    console.error(err);
  }
};
