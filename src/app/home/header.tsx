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
    <div className="w-full flex items-center justify-between p-4 border-gray-200 border-b mb-2">
      <Avatar user={user} />
      <div className="text-right space-y-4 min-w-max">
        <p>{getDate("dddd, MMM DD")}</p>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="disabled:text-gray-600"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Header;
