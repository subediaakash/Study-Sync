import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { authAtom, checkAuthAtom, loginAtom, signupAtom } from "@/auth/atom";

export const useAuth = () => {
  const [auth, setAuth] = useAtom(authAtom);
  const [, login] = useAtom(loginAtom);
  const [, signup] = useAtom(signupAtom);
  const [, checkAuth] = useAtom(checkAuthAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setLoading(false);
    };
    verifyAuth();
  }, [checkAuth]);

  return {
    user: auth,
    isAuthenticated: !!auth,
    login,
    signup,
    loading,
  };
};
