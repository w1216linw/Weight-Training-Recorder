"use client";
import { auth, db } from "@/lib/firebase";
import { encrypt } from "@/lib/jwt";
import { handleError, validate_inputs } from "@/lib/utils";
import dayjs from "dayjs";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const avatars = [
  { url: "/images/dog.png", value: "dog" },
  { url: "/images/gorilla.png", value: "gorilla" },
  { url: "/images/panda.png", value: "panda" },
  { url: "/images/penguin.png", value: "penguin" },
];

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("dog");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: any) => {
    e.preventDefault();
    try {
      validate_inputs(email, password);
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userRef = doc(db, credential.user.uid, "data");
      const exerciseCounts = collection(
        db,
        credential.user.uid,
        "exercise-count",
        "month"
      );
      const exerciseCountRef = doc(
        exerciseCounts,
        `${dayjs().month()}-${dayjs().year()}`
      );
      await setDoc(exerciseCountRef, {});
      await setDoc(userRef, {
        avatar: avatar,
      });
      const session = await encrypt({ email, password });
      localStorage.setItem("wtr-local", session);
      router.push("/home");
    } catch (e) {
      handleError(e, setError);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 ">
      {error.length > 1 && <div>{error}</div>}
      <form className="flex flex-col bg-gray-300 px-10 py-5 rounded-lg gap-3">
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
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-1 rounded-md"
          />
        </div>
        <div className="space-y-2">
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
                    ? "outline-2 outline-offset-4 outline-dashed outline-white"
                    : "outline-none"
                } rounded-full`}
              />
            ))}
          </div>
        </div>
        <button
          onClick={handleSignUp}
          className=" bg-white px-4 py-1 rounded-md hover:bg-gray-50 transition-colors mt-4"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
