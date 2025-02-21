import { useAuthContext } from "@/app/contexts/authContext";
import { db } from "@/lib/firebase";
import dayjs from "dayjs";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import PrevExercise from "./prevExercise";
import Tags from "./tags";

const tags = ["l", "b", "s", "c", "switch"];

const DateControl = ({ params }: { params: { day: string } }) => {
  const [isExercise, setIsExercise] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [delay, setDelay] = useState(false);
  const [tag, setTag] = useState("");
  const { user } = useAuthContext();
  const handleClick = () => {
    setIsExercise(!isExercise);
    setDelay(!delay);
  };
  const fetchIsExercise = async () => {
    if (user) {
      const userRef = doc(
        db,
        user.uid,
        "exercise",
        "month",
        dayjs(params.day).format("MM-YYYY")
      );
      const docSnap = await getDoc(userRef);
      return docSnap.exists() ? docSnap.get(params.day) : {};
    } else {
      return {};
    }
  };
  const updateIsExercise = async () => {
    if (user) {
      const userRef = doc(
        db,
        user.uid,
        "exercise",
        "month",
        dayjs(params.day).format("MM-YYYY")
      );
      const docSnap = (await getDoc(userRef)).get(params.day);
      await updateDoc(userRef, {
        [params.day]: { ...docSnap, isExercise },
      });
    } else {
      return;
    }
  };

  // initial the details and isExercise
  useEffect(() => {
    fetchIsExercise().then((res) => {
      setIsExercise(res?.isExercise);
      setTag(res?.tag);
    });
  }, []);

  // debounce for updating isExercise
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        updateIsExercise();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [delay]);

  return (
    <>
      <div className="text-center flex items-center justify-center gap-2 pb-10">
        <h1 className="text-2xl font-bold">{params.day}</h1>
        <Tags
          tags={tags}
          user={user}
          params={params}
          selectedTag={tag}
          lighted={isExercise}
          updateIsExercise={handleClick}
          setSelectedTag={setTag}
        />
      </div>
      <PrevExercise user={user} tag={tag} />
    </>
  );
};

export default DateControl;
