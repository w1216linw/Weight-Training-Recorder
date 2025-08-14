import { auth } from "@/lib/firebase";
import { clearSession, getDate } from "@/lib/utils";
import { User as FirebaseUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useSignOut } from "react-firebase-hooks/auth";
import Avatar from "./avatar";

const Header = ({ user }: { user: FirebaseUser }) => {
  const router = useRouter();
  const [signOut, loading] = useSignOut(auth);
  const handleSignOut = async () => {
    await signOut();
    clearSession();
    router.push("/");
  };
  return (
    <header className="w-full flex items-center justify-between p-4 border-neutral-content border-b-2 mb-2 text-neutral-content">
      <Avatar user={user} />
      <div className="text-right space-y-4 min-w-max">
        <p className="cursor-default">{getDate("dddd, MMM DD")}</p>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="disabled:opacity-50 cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Header;
