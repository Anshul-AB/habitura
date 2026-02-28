import React, { useCallback, useEffect, useState } from "react";
import TextareaInput from "../formInputs/TextareaInput";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  makeAuthenticatedPOSTRequest,
  makeAuthenticatedGETRequest,
} from "../../utils/serverHelpers";
import { debounce } from "../../utils/throttleandDebounce";

const MyNote = () => {
  const [myNote, setMyNote] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to save the note
  const saveNote = async (note) => {
    setLoading(true);
    try {
      const res =await makeAuthenticatedPOSTRequest("/myNotes/note", { note });
      console.log(res)
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSaveNote = useCallback(debounce(saveNote, 1000), []);

  const handleChange = async (e) => {
    const note = e.target.value;
    setMyNote(note);
    debouncedSaveNote(note); 
  };

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      try {
        const response = await makeAuthenticatedGETRequest("/myNotes/getNote");
        if (response && response.note) {
          setMyNote(response.note[0].note);
          // console.log(response)
        } else {
          console.warn("No note found.");
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, []);

  return (
    <div className="relative h-full text-sm overflow-y-auto custom-scrollbar">
      {/* {loading && <LoadingSpinner />} */}
      <TextareaInput handleChange={handleChange} value={myNote} />
    </div>
  );
};

export default MyNote;