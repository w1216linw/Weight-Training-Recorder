import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

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

const Chart = ({ data }: { data: Data[] }) => {
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
    <div className="overflow-x-scroll w-full">
      <LineChart
        width={600}
        height={300}
        data={dateVolumeSet}
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="volume"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </div>
  );
};

export default Chart;
