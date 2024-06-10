"use client";
import { auth } from "@/lib/firebase";
import { User as FirebaseUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Dashboard from "./dashboard";
import Header from "./header";

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

  if (!user) return <div>Loading...</div>;
  return (
    <div>
      <Header user={user} />
      {/* <Link href={"/home/plan"} className="text-lg">
        Add plan
      </Link> */}
      {/* <div className="bg-white p-2 rounded-md flex">
        <Link href="home/setting" className="bg-neutral-100 rounded-md p-2">
          <IoIosSettings fontSize={36} />
        </Link>
      </div> */}
      <Dashboard user={user} />
    </div>
  );
};

export default HomePage;
