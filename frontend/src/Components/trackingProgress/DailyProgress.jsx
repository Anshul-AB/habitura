import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { makeAuthenticatedGETRequest } from "../../utils/serverHelpers";
import LoadingSpinner from "../common/LoadingSpinner";
import { socket } from "../../socket";

const DailyProgressChart = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [range, setRange] = useState(30); // default = 30 days

  const fetchProgress = async () => {
  try {
    const response = await makeAuthenticatedGETRequest("/track/dailyTasks");

    setProgressData(response?.allProgress || []);

    if (response?.user?._id) {
      setUserId(response.user._id);
    } else {
      setUserId(null);
      console.warn("No user found in response");
    }

  } catch (error) {
    console.error("Error fetching daily progress:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProgress(); // Initial fetch only
  }, []); // Fetch data once on mount

  useEffect(() => {
    if (userId) {
      socket.on("progressUpdate", (data) => {
        console.log("client connected");
        const dataupdate = progressData;
        if (Array.isArray(data.calculatedProgress)) {
  setProgressData(data.calculatedProgress);
}
        console.log(dataupdate);
      });
    }
    return () => {
      socket.off("progressUpdate");
    };
  }, [userId, socket]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!progressData || progressData.length === 0) {
    return (
      <div className="h-[150px] flex items-center justify-center bg-cyan-50 rounded-md">
        <p className="text-sm text-gray-500 font-primary">
          No tasks added yet. Start tracking to see your progress 📈
        </p>
      </div>
    );
  }

  // Formatted data
  const formattedData = progressData
    .map((progress) => ({
      date: new Date(progress.date).toLocaleDateString("default", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      progress: progress.progressPercentage,
    }))
    .reverse();

    const filteredData = formattedData.slice(-range);

  return (
    <>
      {/* Heading */}
      <div className="text-md mb-2 text-center text-secondary font-primary font-medium">
        Daily Progress
      </div>

      {/* chart */}
      <div className="h-[150px] w-full max-w-screen-lg bg-cyan-50">
        <ResponsiveContainer width="100%" height="100%">
  <LineChart data={filteredData}>
    <Line
      type="monotone"
      dataKey="progress"
      stroke="#0891B2"
      strokeWidth={2}
      animationDuration={400}
      dot={{ stroke: "#0891B2", strokeWidth: 1, r: 2 }}
    />
    <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis ticks={[0, 25, 50, 75, 100]} />
    <Tooltip />
  </LineChart>
</ResponsiveContainer>
      </div>

      <div className="flex gap-2 mb-2 justify-center">
  {[7, 30, 90, 365].map((days) => (
    <button
      key={days}
      onClick={() => setRange(days)}
      className={`px-2 py-1 text-xs rounded-md ${
        range === days
          ? "bg-cyan-600 text-white"
          : "bg-cyan-100 text-cyan-700"
      }`}
    >
      {days === 365 ? "All" : `${days} Days`}
    </button>
  ))}
</div>


    </>
  );
};

export default DailyProgressChart;
