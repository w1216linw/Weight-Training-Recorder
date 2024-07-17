import Link from "next/link";
import Login from "./login";

export default function Home() {
  return (
    <main className="flex w-full min-h-screen flex-col items-center justify-center text-primary-content font-bold bg-base-100">
      <div className="bg-primary p-2 rounded-lg space-y-5 w-3/4">
        <Login />
        <Link href="/signup" className="block mt-2">
          Register
        </Link>
      </div>
    </main>
  );
}
