import {
  GithubAuthProvider,
  linkWithPopup,
  fetchSignInMethodsForEmail,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";

export const useGithubLink = () => {
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const linkGithubAccount = async () => {
    setLinking(true);
    setError(null);

    const provider = new GithubAuthProvider();
    provider.addScope("repo"); // if you need repo access

    const user = auth.currentUser;

    try {
      if (!user) throw new Error("User not logged in");

      const result = await linkWithPopup(user, provider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      if (token) {
        localStorage.setItem("githubAccessToken", token);
      }

      console.log("GitHub linked and token saved.");
    } catch (err: any) {
      if (err.code === "auth/account-exists-with-different-credential") {
        const pendingCred = GithubAuthProvider.credentialFromError(err);
        const email = err.customData?.email;

        if (email && pendingCred) {
          const methods = await fetchSignInMethodsForEmail(auth, email);

          if (methods.includes("password")) {
            setError("Email already exists with password. Please sign in using password and then link GitHub.");
          } else {
            await signInWithCredential(auth, pendingCred);
          }
        }
      } else {
        console.error("Error linking GitHub:", err);
        setError(err.message);
      }
    } finally {
      setLinking(false);
    }
  };

  return { linkGithubAccount, linking, error };
};
