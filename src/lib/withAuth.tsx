"use client";
import { User as FirebaseUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "./firebase";

export default function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  const AuthComponent = (props: P) => {
    const [user, setUser] = useState<FirebaseUser>();
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setUser(user);
        } else {
          router.push("/");
        }
      });

      return unsubscribe;
    }, [router]);

    if (!user) return <div>Loading...</div>;

    return <Component {...props} user={user} />;
  };

  return AuthComponent;
}
