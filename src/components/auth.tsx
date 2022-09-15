import { useSigninCheck } from "reactfire";

export const useCurrentUser = () => {
  const { data: signInCheckResult } = useSigninCheck();
  return signInCheckResult?.user;
};

export const useCurrentUserMust = () => {
  const user = useCurrentUser();
  if (!user) throw new Error("There is no current user, but one was expected");
  return user;
};
