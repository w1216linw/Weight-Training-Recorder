import { User as FirebaseUser } from "firebase/auth";
import Image from "next/image";
import { useUserAvatar } from "@/lib/hooks";

const Avatar = ({ user }: { user: FirebaseUser }) => {
  const { avatar, loading } = useUserAvatar(user);

  if (loading) return <div className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>;

  return (
    <div>
      {avatar && (
        <Image
          src={`/images/${avatar}.png`}
          alt="avatar"
          width={64}
          height={64}
        />
      )}
    </div>
  );
};

export default Avatar;
