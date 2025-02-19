import { useRouter } from "next/navigation";
import { FaLessThan } from "react-icons/fa6";

const BackBtn = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="text-2xl fixed top-[24px] left-4"
    >
      <FaLessThan />
    </button>
  );
};

export default BackBtn;
