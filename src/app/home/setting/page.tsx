"use client";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaLessThan } from "react-icons/fa6";
import Avatar from "./select-avatar";

const SettingPage = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  return (
    <div className="p-2 space-y-3 border">
      <button onClick={() => router.back()} className="text-2xl">
        <FaLessThan />
      </button>
      <h1 className="text-xl accent-col text-center">Setting</h1>
      <div className=" p-2 rounded-md text-neutral-100 bg-[#35524A]">
        {user && <Avatar user={user} />}
      </div>
    </div>
  );
};

export default SettingPage;
