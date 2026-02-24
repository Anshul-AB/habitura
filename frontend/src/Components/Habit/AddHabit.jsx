import React, { useCallback, useEffect, useState } from "react";
import InputHabit from "../formInputs/InputHabit";
import { IoMdAdd } from "react-icons/io";
import HabitCard from "./HabitCard";
import Datepicker from "../formInputs/Datepicker";
import { Toast, ToastProvider } from "../common/Toast";
import {
  makeAuthenticatedDELETERequest,
  makeAuthenticatedGETRequest,
  makeAuthenticatedPOSTRequest,
} from "../../utils/serverHelpers";
import LoadingSpinner from "../common/LoadingSpinner";
import { throttle } from "../../utils/throttleandDebounce";

const AddHabit = () => {
  const [habitData, setHabitData] = useState({
    habit: "",
    startDate: new Date(),
    endDate: null,
  });

  const [listOfHabits, setListOfHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState("");

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

  // Create/Add Habit
  const handleAdd = async (e) => {
    const formData = {
      habit: habitData.habit,
      startDate: habitData.startDate,
      endDate: habitData.endDate,
    };

    if (formData.habit === "") {
      Toast.error("Empty habit cannot be added");
      return;
    }
    setLoading(true);
    try {
      const response = await makeAuthenticatedPOSTRequest("/habit/addHabit", formData);
      console.log(response)
      setKey("");
      setHabitData({
        habit: "",
        startDate: null,
        endDate: null,
      });
      Toast.success("Habit Added Successfully");
      getMyHabits(); // Refresh habits after adding
    } catch (error) {
      console.error("Error:", error);
      Toast.error("There's an error adding the habit, Please try again later");
    } finally {
      setLoading(false);
    }
  };

  // Handle keydown to trigger the habit add on 'Enter'
  const handleKeyDown = (e) => {
    setKey(e.key);
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  // Get User Habits Array
  const getMyHabits = async () => {
    setLoading(true);
    try {
      const response = await makeAuthenticatedGETRequest(
        "/habit/getHabitslist"
      );
      if (response && Array.isArray(response)) {
        setListOfHabits(response);
      } else {
        console.error("Unexpected response format", response);
      }
    } catch (error) {
      console.error("Failed to fetch habits:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete Habit
  const deleteHabit = async (id) => {
    setLoading(true);
    try {
      await makeAuthenticatedDELETERequest(`/habit/deleteHabit/${id}`);
      Toast.success("Habit Deleted Successfully");
      setListOfHabits((prevHabits) =>
        prevHabits.filter((habit) => habit._id !== id)
      );
      // await getMyHabits();
    } catch (error) {
      console.error("Failed to delete habit", error);
      Toast.error(
        "There's an error deleting the habit, Please try again later"
      );
    } finally {
      setLoading(false);
    }
  };

  // Throttle getMyHabits to avoid excessive calls
  const throttledGetMyHabits = useCallback(throttle(getMyHabits, 10000), []);

  useEffect(() => {
    throttledGetMyHabits();
  }, []);

  return (
    <>
      <ToastProvider />

      {/* Input habit */}
      <div className="flex flex-col sm:flex-row justify-center items-center rounded-md sm:space-x-3 bg-white shadow-md mb-7">
        <InputHabit
          type={"text"}
          name={"habit"}
          value={habitData.habit}
          onChange={handleChange}
          placeholder={"Eg. Wake Up at 5 AM."}
          onKeyDown={handleKeyDown}
          className="p-3"
        />

        <Datepicker
          selectedDate={habitData.startDate}
          onChange={(date) => handleDateChange(date, "startDate")}
          dateLabel={"Start Date"}
          title={"Enter Start Date"}
        />

        <Datepicker
          selectedDate={habitData.endDate}
          onChange={(date) => handleDateChange(date, "endDate")}
          dateLabel={"End Date"}
          title={"Enter End Date"}
        />

        <button
          onClick={handleAdd}
          className="bg-habit h-full sm:w-fit w-full flex justify-center items-center text-white text-lg font-medium px-4 py-2 cursor-pointer hover:bg-[#1c7082] transition-colors duration-300 rounded-md"
        >
          <IoMdAdd className="text-2xl" />
          Create
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && <LoadingSpinner />}

      {/* List of habits */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {listOfHabits.map((habit) => (
          <HabitCard
            key={habit._id}
            habitDetails={habit}
            deleteHabit={deleteHabit}
            getMyHabits={getMyHabits}
          />
        ))}
      </div>
    </>
  );
};

export default AddHabit;