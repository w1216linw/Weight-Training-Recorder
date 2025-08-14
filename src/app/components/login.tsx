"use client";
import { auth } from "@/lib/firebase";
import { decrypt } from "@/lib/jwt";
import { handleError, setSession } from "@/lib/utils";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FormInput from "./ui/FormInput";
import Button from "./ui/Button";

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
        <div className="bg-secondary text-secondary-content p-2 rounded">{error}</div>
      )}
      <FormInput
        id="email"
        name="email"
        type="text"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label="Email:"
        required
      />
      <FormInput
        id="password"
        name="password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label="Password:"
        required
      />
      <Button
        onClick={handleLogin}
        variant="accent"
        className="w-full"
      >
        Login
      </Button>
    </form>
  );
};

export default Login;
