import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import InputHabit from "../formInputs/InputHabit";
import Datepicker from "../formInputs/Datepicker";
import { GrDocumentUpdate } from "react-icons/gr";
import { makeAuthenticatedPUTRequest } from "../../utils/serverHelpers";
import { Toast, ToastProvider } from "../common/Toast";
import OutsideClickHandler from "react-outside-click-handler";

const UpdateHabit = ({ habitDetails, isPopUp, setIsPopUp, getMyHabits }) => {
  const [key, setKey] = useState("");
  const [habitData, setHabitData] = useState({
    habit: "",
    startDate: new Date(),
    endDate: null,
  });
  useEffect(() => {
    setHabitData({
      habit: habitDetails.habit,
      startDate: habitDetails.startDate,
      endDate: habitDetails.endDate,
    });
  }, [habitDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHabitData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date, field) => {
    setHabitData((prevData) => ({
      ...prevData,
      [field]: date,
    }));
  };

  // Update habits
  const updateHabit = async () => {
    try {
      const response = await makeAuthenticatedPUTRequest(
        `/habit/updateHabit/${habitDetails._id}`,
        habitData
      );
      //   console.log('Update Successful:', response);
      Toast.success("Habit updated successfully");
      getMyHabits();
      setIsPopUp(false);
    } catch (error) {
      console.error("Error updating habit:", error);
      Toast.error("There's an error updating habit, Refer console.");
    }
  };

  const handleKeyDown = (e) => {
    setKey(e.key);
    if (e.key === "Enter") {
      updateHabit();
    }
  };

  return (
    <>
  <OutsideClickHandler
    onOutsideClick={(e) => {
      setIsPopUp(false);
      e.stopPropagation();
    }}
  >
    <ToastProvider />

    <div
      className={`fixed inset-0 flex justify-center items-center bg-darkestgreen bg-opacity-50 z-50 px-4 ${
        isPopUp ? "block" : "hidden"
      }`}
    >
      {/* modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#ebc1c1] rounded-md shadow-md p-4 sm:p-6 md:p-8 overflow-y-auto">

        {/* close button */}
        <RxCross1
          className="absolute top-3 right-3 cursor-pointer text-3xl sm:text-4xl text-red-500"
          onClick={() => setIsPopUp(false)}
        />

        {/* Title */}
        <div className="text-xl sm:text-2xl md:text-3xl font-normal text-darkgreen mb-4">
          Update My Habit
        </div>

        {/* Inputs */}
        <div className="flex flex-col md:flex-row gap-3 rounded-md bg-white drop-shadow-lg p-3">

          <InputHabit
            type={"text"}
            name={"habit"}
            value={habitData.habit}
            onChange={handleChange}
            placeholder={"Eg. Wake Up at 5 AM."}
            onKeyDown={handleKeyDown}
            className="p-3 w-full"
          />

          <Datepicker
            selectedDate={habitData.startDate}
            onChange={(date) => handleDateChange(date, "startDate")}
            dateLabel="Start Date"
          />

          <Datepicker
            selectedDate={habitData.endDate}
            onChange={(date) => handleDateChange(date, "endDate")}
            dateLabel="End Date"
          />
        </div>

        {/* button */}
        <div className="mt-5">
          <button
            className="bg-habit flex justify-center items-center text-white text-base sm:text-lg font-medium px-4 py-2 cursor-pointer hover:bg-[#1c7082] transition-colors duration-300 rounded-md w-full sm:w-auto"
            onClick={updateHabit}
          >
            <GrDocumentUpdate className="text-xl sm:text-2xl mr-2" />
            Update
          </button>
        </div>

      </div>
    </div>
  </OutsideClickHandler>
</>
  );
};

export default UpdateHabit;
