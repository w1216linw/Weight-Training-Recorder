import Link from "next/link";
import Login from "./login";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="bg-gray-300 px-10 py-5 rounded-lg space-y-5">
        <Login />
        <Link href="/signup" className="block mt-2 text-neutral-900 font-serif">
          Register
        </Link>
      </div>
    </main>
  );
}
