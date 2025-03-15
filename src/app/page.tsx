import Link from "next/link";
import Login from "./components/login";

export default function Home() {
  return (
    <main className="flex w-full min-h-screen flex-col items-center justify-center font-bold bg-base-100">
      <div className="bg-primary p-2 rounded-lg space-y-5 w-3/4">
        <Login />
        <Link href="/signup" className="block mt-2 text-primary-content w-min">
          Register
        </Link>
      </div>
    </main>
  );
}
