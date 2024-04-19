"use client";

import { auth, db } from "@/lib/firebase";
import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaLessThan, FaPlus } from "react-icons/fa";

const Exercise = ({ user, date }: { user: FirebaseUser; date: string }) => {
  const [exercise, setExercise] = useState({ name: "", weight: "", sets: "" });
  const update = async () => {
    const userRef = doc(db, user.uid + "dates", date);
    await setDoc(userRef, {
      [exercise.name]: {
        weight: exercise.weight,
        sets: exercise.sets,
      },
    });
  };
  return (
    <div className="flex gap-2">
      <div>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Name"
            value={exercise.name}
            onChange={(e) => setExercise({ ...exercise, name: e.target.value })}
            className="px-4 py-2 w-full rounded-md border border-gray-300"
          />
        </div>
        <div className="flex">
          <input
            type="text"
            placeholder="Weight"
            value={exercise.weight}
            onChange={(e) =>
              setExercise({ ...exercise, weight: e.target.value })
            }
            className="px-4 py-2 w-1/2 mr-2 rounded-md border border-gray-300"
          />
          <input
            type="text"
            placeholder="Sets"
            value={exercise.sets}
            onChange={(e) => setExercise({ ...exercise, sets: e.target.value })}
            className="px-4 py-2 w-1/2 rounded-md border border-gray-300"
          />
        </div>
      </div>
      <button
        onClick={update}
        className="text-neutral-50 text-2xl px-2 bg-green-300 rounded-md"
      >
        <FaPlus />
      </button>
    </div>
  );
};

const dayPage = ({ params }: { params: { day: string } }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [exercise, setExercise] = useState({});
  const fetchData = async () => {
    if (user) {
      const userRef = doc(db, user.uid + "dates", params.day);
      const docSnap = await getDoc(userRef);

      return docSnap.exists() ? docSnap.data() : {};
    } else {
      return {};
    }
  };

  useEffect(() => {
    fetchData().then((res) => {
      setExercise(res);
    });
  }, []);

  return (
    <div className="p-2">
      <div className="flex items-center">
        <button onClick={() => router.push("/home")} className="text-2xl">
          <FaLessThan />
        </button>
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold">{params.day}</h1>
      </div>
      <div>{user && <Exercise user={user} date={params.day} />}</div>
      <div></div>
    </div>
  );
};

export default dayPage;
