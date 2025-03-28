"use client";
import { auth } from "@/lib/firebase";
import { decrypt } from "@/lib/jwt";
import { handleError, setSession } from "@/lib/utils";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await setSession(email, password);
      router.push("/home");
    } catch (err) {
      handleError(err, setError);
    }
  };

  const autoLogIn = async (userInfo: string) => {
    const { email, password } = await decrypt(userInfo);
    await signInWithEmailAndPassword(auth, email, password);
    router.push("/home");
  };
  useEffect(() => {
    const userInfo = localStorage.getItem("wtr-local");
    if (!userInfo) return;
    autoLogIn(userInfo);
  }, []);

  return (
    <form className="flex flex-col gap-5">
      {error.length > 1 && (
        <div className="bg-secondary text-secondary-content">{error}</div>
      )}
      <div className="flex flex-col">
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-1 rounded-md text-primary bg-neutral"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-1 rounded-md text-primary bg-neutral"
        />
      </div>
      <button
        onClick={handleLogin}
        className="bg-accent rounded-md py-1 hover:opacity-50 transition-colors text-accent-content text-lg "
      >
        Login
      </button>
    </form>
  );
};

export default Login;
