"use client";
import { auth } from "@/lib/firebase";
import { User as FirebaseUser } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosSettings } from "react-icons/io";
import Dashboard from "./components/dashboard";
import Header from "./components/header";

const HomePage = () => {
  const [user, setUser] = useState<FirebaseUser>();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/");
      }
    });

    return unsubscribe;
  }, [router]);

  if (!user)
    return (
      <div className="w-screen h-screen grid place-content-center">
        <span>Loading</span>
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  return (
    <div className=" p-2 space-y-3 bg-[#35524A]">
      <Header user={user} />
      {/* <Link href={"/home/plan"} className="text-lg">
        Add plan
      </Link> */}
      <div className="bg-neutral-100 p-2 rounded-md flex">
        <Link
          href="home/setting"
          className="bg-[#35524A] rounded-md p-2 text-neutral-100"
        >
          <IoIosSettings fontSize={36} />
        </Link>
      </div>
      <Dashboard user={user} />
    </div>
  );
};

export default HomePage;
