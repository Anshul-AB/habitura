import React, { lazy, Suspense } from "react";
import Sidebar from "../../Components/common/Sidebar";
import DailyProgress from "../../Components/trackingProgress/DailyProgress";
import MyNote from "../../Components/notes/MyNote";
import TaskProvider from "../../store/contexts/TaskProvider";
import HabitProvider from "../../store/contexts/HabitProvider";
import LoadingSpinner from "../../Components/common/LoadingSpinner";
const DailyTasks = lazy(()=>import ("../../Components/dailyTasks/DailyTasks"));

const Dashboard = () => {
  return (
    <div className="lg:h-screen flex flex-col lg:flex-row">
      <Sidebar />

      <div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-3 max-h-full bg-primary bg-opacity-50 p-pagePadding">
        {/* Habit Section - left */}
        <div className="min-h-0 bg-white p-5 shadow-md rounded-md overflow-y-auto custom-scrollbar">
          <HabitProvider>
            <TaskProvider>
              <Suspense fallback={<LoadingSpinner/>}>
              <DailyTasks />
              </Suspense>
            </TaskProvider>
          </HabitProvider>
        </div>

        {/* Stats - right */}
        <div className="grid grid-rows-3 gap-3 min-h-0">
          {/* Bar graph daily status */}
          <div className="bg-cyan-50 max-h-full rounded-md shadow-md p-2">
            <DailyProgress />
          </div>

          {/* My notes */}
          <div className="row-span-2 max-h-full rounded-md shadow-md z-0 min-h-0">
            <MyNote />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
