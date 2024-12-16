import { AnimatePresence, motion } from "motion/react";
import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

type Data = {
  date: string;
  weight: number;
  reps: number;
  sets: number;
};

type Volume = {
  weight: number;
  sets: number;
  reps: number;
};

const getVolume = (v: Volume) => {
  return v.reps * v.sets * v.weight;
};

const CustomTooltip = ({ payload, label, active }: any) => {
  if (active && payload && payload.length) {
    const { date, reps, sets, volume, weight } = payload[0].payload;
    return (
      <div className="bg-neutral-300 p-2 rounded-md">
        <p className="intro">{date}</p>
        <p className="desc">{volume}</p>
        <p className="desc">
          {weight} X {reps} X {sets}
        </p>
      </div>
    );
  }

  return null;
};

const Chart = ({ data, tab }: { data: Data[]; tab: string }) => {
  const dateVolumeSet = data
    .map((elem) => ({
      volume: getVolume({ ...elem }),
      ...elem,
    }))
    .sort((a, b) => {
      const c = new Date(a.date);
      const d = new Date(b.date);
      return c < d ? -1 : 1;
    });
  if (dateVolumeSet.length < 1) {
    return <div className="grid place-items-center h-[300px]">no data</div>;
  }
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tab}
        initial={{ x: 10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -10, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-x-scroll w-full"
      >
        <LineChart
          width={600}
          height={300}
          data={dateVolumeSet}
          margin={{
            top: 20,
            right: 30,
            left: 10,
            bottom: 5,
          }}
        >
          <XAxis
            label={{
              value: "nth",
              position: "insideBottom",
              offset: "0",
            }}
          />
          <YAxis
            label={{
              value: "volume",
              position: "insideLeft",
              angle: "-90",
              offset: "0",
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="volume"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </motion.div>
    </AnimatePresence>
  );
};

export default Chart;
