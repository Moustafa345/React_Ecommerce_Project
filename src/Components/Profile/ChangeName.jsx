import axios from "axios";
import React, { useContext, useRef } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "./../../Context/UserDataContext";
import {DOMAIN} from "../../utils/constants";

export default function ChangeName({ setUserName }) {
  const { headers } = useContext(UserDataContext);
  console.log(headers);
  const navigate = useNavigate();
  const inputValue = useRef(null); // Creating a ref for storing input value

  async function changeName(name) {
    // Function for changing the name
    try {
      const { data } = await axios.put(
        `${DOMAIN}/api/v1/users/updateMe`,
        { name: name },
        { headers: headers }
      );
      if (data.message === "success") {
        toast.success("Your name has been changed successfully."); // Displaying success notification
        setUserName(data.user.name); // Updating the name in the parent component
        navigate("/profile"); // Navigating to the profile page
      }
    } catch (error) {
      console.log(error);
      toast.error("Sorry. There's an error changing your name!"); // Displaying error notification
    }
  }

  return (
    <>
      <div className="row w-75 m-auto py-5 px-3 my-5  shadow-lg rounded-3 ">
        <h2 className="pb-5 fw-bold text-main">Change Your Name</h2>
        <h5 className="mb-3 lh-lg text-danger fw-bold">
          If you want to change the name associated with your Fresh Cart
          customer account, you may do so below. Be sure to click the Save
          Changes button when you are done.
        </h5>
        <label className="my-2" htmlFor="newName">
          New Name:
        </label>
        <input
          type="text"
          className="form-control my-2"
          id="newName"
          placeholder="Enter your new name"
          ref={inputValue}
        />
        <button
          onClick={() => changeName(inputValue.current.value)}
          className="btn bg-main text-white my-2"
        >
          Save changes
        </button>
      </div>
    </>
  );
}
