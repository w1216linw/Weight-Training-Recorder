"use client";
import { auth } from "@/lib/firebase";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaLessThan } from "react-icons/fa6";
import Avatar from "./components/select-avatar";

const SettingPage = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  return (
    <div className="p-4 space-y-3 bg-neutral h-screen">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => router.back()}
        className="text-2xl text-accent cursor-pointer"
      >
        <FaLessThan />
      </motion.button>
      <h1 className="text-xl accent-col text-center text-neutral-content">
        Setting
      </h1>
      {user && <Avatar user={user} />}
    </div>
  );
};

export default SettingPage;
