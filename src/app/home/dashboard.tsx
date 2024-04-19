import { User as FirebaseUser } from "firebase/auth";
import Calendar from "./calendar";

const Dashboard = ({ user }: { user: FirebaseUser }) => {
  return (
    <div>
      <Calendar />
    </div>
  );
};

export default Dashboard;
