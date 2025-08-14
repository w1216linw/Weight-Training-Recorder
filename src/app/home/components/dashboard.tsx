import { User as FirebaseUser } from "firebase/auth";
import Calendar from "./calendar";
import CompoundTraining from "./compoundTraining";

const Dashboard = ({ user }: { user: FirebaseUser }) => {
  return (
    <main className="space-y-3">
      <section aria-labelledby="calendar-heading">
        <h2 id="calendar-heading" className="sr-only">Training Calendar</h2>
        <Calendar user={user} />
      </section>
      <section aria-labelledby="compound-heading">
        <h2 id="compound-heading" className="sr-only">Compound Training Progress</h2>
        <CompoundTraining user={user} />
      </section>
    </main>
  );
};

export default Dashboard;
