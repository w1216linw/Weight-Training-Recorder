import { User as FirebaseUser } from "firebase/auth";
import Calendar from "./calendar";
import CompoundTraining from "./compoundTraining";

const Dashboard = ({ user }: { user: FirebaseUser }) => {
  return (
    <div className="space-y-3 ">
      <Calendar user={user} />
      <CompoundTraining user={user} />
    </div>
  );
};

export default Dashboard;
