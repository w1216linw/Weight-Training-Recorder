"use client";
import { useRouter } from "next/navigation";
import Header from "./header";
const HomePage = () => {
  const router = useRouter();

  return (
    <div className="w-screen">
      <Header />
    </div>
  );
};

export default HomePage;
