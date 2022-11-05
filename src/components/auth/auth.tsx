import { useSigninCheck } from "reactfire";

export const useCurrentUser = () => {
  const { status, data: signInCheckResult } = useSigninCheck();
  return status === "success" && signInCheckResult.signedIn
    ? signInCheckResult?.user
    : undefined;
};

export const useCurrentUserMust = () => {
  const user = useCurrentUser();
  if (!user) throw new Error("There is no current user, but one was expected");
  return user;
};
