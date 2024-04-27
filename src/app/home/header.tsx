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
    <div className="flex items-center justify-between px-2 py-4 border-gray-200 border-b">
      <Avatar user={user} />
      <div className="text-end space-y-4">
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
