"use client";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaLessThan } from "react-icons/fa6";
import Avatar from "./components/select-avatar";

const SettingPage = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  return (
    <div className="p-4 space-y-3 bg-neutral h-screen">
      <button
        onClick={() => router.back()}
        className="text-2xl text-neutral-content"
      >
        <FaLessThan />
      </button>
      <h1 className="text-xl accent-col text-center text-neutral-content">
        Setting
      </h1>
      <div className=" p-2 rounded-md bg-neutral-content">
        {user && <Avatar user={user} />}
      </div>
    </div>
  );
};

export default SettingPage;
