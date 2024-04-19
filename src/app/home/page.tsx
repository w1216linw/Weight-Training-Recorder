"use client";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import Dashboard from "./dashboard";
import Header from "./header";
const HomePage = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  if (!user) router.push("/");
  else
    return (
      <div className="w-screen">
        <Header user={user} />
        <Link href={"/home/plan"} className="text-lg">
          Add plan
        </Link>
        <Dashboard user={user} />
      </div>
    );
};

export default HomePage;
