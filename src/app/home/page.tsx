"use client";
import withAuth from "@/lib/withAuth";
import dayjs from "dayjs";
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
      <div className="p-4">
        {dayjs().year()}
        {dayjs().month() + 1}
      </div>
      <Dashboard user={user} />
    </div>
  );
};

export default withAuth(HomePage);
