"use client";
import withAuth from "@/lib/withAuth";
import { User as FirebaseUser } from "firebase/auth";
import Link from "next/link";
import Dashboard from "./dashboard";
import Header from "./header";

const HomePage = ({ user }: { user: FirebaseUser }) => {
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

export default withAuth(HomePage);
