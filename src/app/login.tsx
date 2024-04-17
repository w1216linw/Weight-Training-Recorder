"use client";
import { auth } from "@/lib/firebase";
import { handleError } from "@/lib/utils";
// import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");
  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/home");
    } catch (e) {
      handleError(e, setError);
    }
  };
  return (
    <form className="flex flex-col gap-5">
      <div className="flex flex-col">
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-1 rounded-md"
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
          className="px-4 py-1 rounded-md"
        />
      </div>
      <button
        onClick={handleLogin}
        className=" bg-white px-4 py-1 rounded-md hover:bg-gray-50 transition-colors"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
