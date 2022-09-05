import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";

export const useAuth = () => useAuthState(auth);
