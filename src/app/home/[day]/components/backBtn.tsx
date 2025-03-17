import { useRouter } from "next/navigation";
import { FaLessThan } from "react-icons/fa6";

const BackBtn = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="text-2xl text-accent absolute top-6 left-2"
    >
      <FaLessThan />
    </button>
  );
};

export default BackBtn;
