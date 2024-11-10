import React, { useCallback, useContext, useEffect, useState } from "react";
import Card from "./Card";

import InputHabit from "../formInputs/InputHabit";
import { IoMdAdd } from "react-icons/io";
import PageHeading from "../common/PageHeading";
import { TiRefreshOutline } from "react-icons/ti";
import { MdFolderDelete } from "react-icons/md";
import { throttle } from "../../utils/throttleandDebounce";
import { HabitContext, TaskContext } from "../../store/store";
import {
  DndContext,
  closestCorners,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { makeAuthenticatedPUTRequest } from "../../utils/serverHelpers";

const DailyTasks = () => {
  // Task Api's
  const {
    addTask,
    getTasklist,
    handleKeyDown,
    updateTask,
    handleUpdateClick,
    deleteTask,
    delAllTasks,
    taskCompletionDate,
    taskUncompleted,
    isTaskChecked,
    handleChange,
    inputRef,
    task,
    isUpdating,
    updateTaskId,
    listOfTasks = [],
    setListOfTasks,
  } = useContext(TaskContext);

  // Habit Api's
  const {
    listOfHabits,
    showMenu,
    getMyHabits,
    habitCompleted,
    habitUncompleted,
    isHabitChecked,
    uncheckAllHabits,
  } = useContext(HabitContext);

  // Draagable div
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    // Check if 'over' is null before accessing its properties
    if (!over) {
      // console.log("Dropped outside of any valid target.");
      return;
    }
    if (active.id !== over.id) {
      const oldIndex = listOfTasks.findIndex((task) => task._id === active.id);
      const newIndex = listOfTasks.findIndex((task) => task._id === over.id);
      // Check if both indices are valid
      if (oldIndex === -1 || newIndex === -1) {
        // console.log("One of the task IDs was not found.");
        return;
      }

      const updatedTasks = arrayMove(listOfTasks, oldIndex, newIndex);
      setListOfTasks(updatedTasks);
      const taskOrder = updatedTasks.map((task) => task._id);
      console.log(oldIndex, newIndex);

      const response = await makeAuthenticatedPUTRequest("/task/order", {
        taskOrder,
      });
      console.log(response);
      getTasklist();
    }
  };

  const arrayMove = (array, from, to) => {
    const newArray = [...array];
    const [movedItem] = newArray.splice(from, 1);
    newArray.splice(to, 0, movedItem);
    return newArray;
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Throttled Get Tasks and Habits
  const throttledGetMyTasks = useCallback(throttle(getTasklist, 10000, []));
  const throttledGetMyHabits = useCallback(throttle(getMyHabits, 10000, []));

  useEffect(() => {
    throttledGetMyHabits();
    throttledGetMyTasks();
  }, []);

  return (
    <div>
      {/* head */}
      <PageHeading title={" Today's Tasks"} />

      {/* Input tasks */}
      <div className="flex flex-col md:flex-row justify-center items-center mb-4 rounded-md md:space-x-3 bg-gray-100 shadow-md">
        <InputHabit
          ref={inputRef}
          type={"text"}
          name={"task"}
          value={task}
          onChange={handleChange}
          placeholder={"Eg. Meeting with a client at 5 PM."}
          className={"bg-gray-100 md:pl-5 p-3 md:p-0"}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={() => {
            isUpdating ? handleUpdateClick(updateTaskId, task) : addTask();
          }}
          className="bg-primary h-full w-full md:w-fit flex justify-center items-center text-secondary text-lg font-medium px-4 py-2 cursor-pointer hover:bg-coolsecondary hover:text-primary transition-colors duration-300 rounded-md"
        >
          <IoMdAdd className="text-2xl md:mr-2" />
          {isUpdating ? "Update" : "Add"}
        </button>
      </div>

      {/* View list */}
      <div className="">
        {/* View habits */}
        <div className="flex justify-between items-center ">
          <p className="text-[10px] text-right font-medium text-secondary w-fit bg-green-100 rounded-sm p-1 mb-2 ">
            My Habits
          </p>
          <TiRefreshOutline
            title="Refresh habits"
            className="text-3xl text-coolsecondary hover:text-secondary cursor-pointer mb-2"
            onClick={uncheckAllHabits}
          />
        </div>
        {listOfHabits.map((habit, index) => (
          <Card
            key={index}
            task={habit.habit}
            cardClass={"bg-green-100"}
            addCompletionDate={habitCompleted}
            removeCompletionDate={habitUncompleted}
            isTickMarked={isHabitChecked}
            taskId={habit._id}
            isChecked={habit.isCompleted}
          />
        ))}

        {/* view tasks */}
        <div className="flex justify-between items-center ">
          <p className="text-[10px] text-right font-medium text-secondary w-fit bg-cyan-100 rounded-sm p-1 my-2 ">
            Today's Tasks
          </p>
          <MdFolderDelete
            title="Delete all tasks"
            className="text-3xl text-coolsecondary hover:text-secondary cursor-pointer mb-2"
            onClick={delAllTasks}
          />
        </div>

        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={listOfTasks}
            strategy={verticalListSortingStrategy}
          >
            {listOfTasks.map((task, index) => (
              <Card
                key={index}
                taskId={task._id}
                task={task.task}
                cardClass={"bg-cyan-100"}
                showMenu={showMenu}
                deleteTask={deleteTask}
                updateTask={updateTask}
                addCompletionDate={taskCompletionDate}
                removeCompletionDate={taskUncompleted}
                isChecked={task.isCompleted}
                isTickMarked={isTaskChecked}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default DailyTasks;
