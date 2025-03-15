"use client";
import { avatars } from "@/lib/data";
import { auth, db } from "@/lib/firebase";
import { getDate, handleError, setSession, validate_inputs } from "@/lib/utils";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("dog");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      validate_inputs(email, password);
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userRef = doc(db, credential.user.uid, "data");
      const exerciseMonth = collection(
        db,
        credential.user.uid,
        "exercise",
        "month"
      );
      const exerciseCountRef = doc(exerciseMonth, getDate("MM-YYYY"));
      await setDoc(exerciseCountRef, {});
      await setDoc(userRef, {
        avatar: avatar,
      });
      await setSession(email, password);
      router.push("/home");
    } catch (e) {
      handleError(e, setError);
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      {error.length > 1 && <div>{error}</div>}
      <form
        onSubmit={handleSignUp}
        className="flex flex-col px-4 w-3/4 py-2 rounded-lg gap-3 bg-primary"
      >
        <div className="flex flex-col">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-1 rounded-md bg-neutral text-primary"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-1 rounded-md bg-neutral text-primary"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="avatar">Avatar:</label>
          <div className="flex gap-5 justify-evenly">
            {avatars.map((elem) => (
              <Image
                key={elem.value}
                src={elem.url}
                alt={elem.value}
                width={32}
                height={32}
                onClick={() => setAvatar(elem.value)}
                className={`${
                  avatar === elem.value
                    ? "outline-2 outline-offset-4 outline-dashed outline-neutral"
                    : "outline-hidden"
                } rounded-full cursor-pointer`}
              />
            ))}
          </div>
        </div>
        <motion.button
          whileHover={{ opacity: 0.9 }}
          type="submit"
          className="cursor-pointer bg-accent py-1 rounded-md text-accent-content hover:opacity-50 transition-colors text-lg"
        >
          Register
        </motion.button>
        <motion.button
          whileHover={{ opacity: 0.5 }}
          onClick={() => router.back()}
          className="text-primary-content text-left cursor-pointer w-min"
        >
          Cancel
        </motion.button>
      </form>
    </div>
  );
};

export default SignUpPage;
