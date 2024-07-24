import axios from "axios";
import React, { useEffect, useContext, useState } from "react";
import { UserDataContext } from "../../Context/UserDataContext";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import jwtDecode from "jwt-decode";
import {DOMAIN} from "../../utils/constants";

export default function ChangeEmail() {
  const { headers, getuserData } = useContext(UserDataContext); // Accessing headers and getuserData function from UserDataContext
  const navigate = useNavigate(); // Creating a navigate function for navigation
  const [userData, setuserData] = useState(null); // Initializing userData state variable as null

  let userToken = localStorage.getItem("userToken"); // Getting the user token from local storage
  let decodedToken = jwtDecode(userToken); // Decoding the user token to get the user ID

  useEffect(() => {
    // Fetching user data on component mount
    async function getEmail() {
      try {
        const { data } = await getuserData(decodedToken.id); // Calling the getuserData function with the decoded user ID
        setuserData(data); // Updating the userData state with the received data
      } catch (error) {
        console.log(error);
      }
    }
    getEmail();
  }, []);

  async function changeEmail(email) {
    // Function for changing the email address
    try {
      const { data } = await axios.put(
        `${DOMAIN}/api/v1/users/updateMe`,
        { email: email },
        { headers: headers }
      );
      if (data.message === "success") {
        toast.success("Your email has been changed successfully."); // Displaying success notification
        navigate("/profile"); // Navigating to the profile page
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.errors.msg); // Displaying error notification
    }
  }

  let userSchema = Yup.object({
    // Setting up form validation using Yup
    email: Yup.string()
      .required("Email is required")
      .email("Please enter a valid email!"),
  });

  let formik = useFormik({
    // Initializing the useFormik hook for form management
    initialValues: {
      email: "",
    },
    validationSchema: userSchema, // Applying the validation schema
    onSubmit: changeEmail, // Setting the submission handler
  });

  return (
    <>
      {userData != null ? (
        // If userData is not null, render the form
        <div className="row w-75 m-auto py-5 px-3 my-5  shadow-lg rounded-3 ">
          <h2 className="pb-5 fw-bold text-main">Change your email address</h2>
          <p>
            Current email address:{" "}
            <span className="fw-bold h6">{userData?.email}</span>
          </p>

          <h5 className="mb-3 lh-lg text-danger fw-bold">
            Enter the new email address you would like to associate with your
            account below.
          </h5>
          <form onSubmit={formik.handleSubmit}>
            {/* Form input for email */}
            <label className="my-2" htmlFor="email">
              Email address:
            </label>
            <input
              type="text"
              className="form-control my-2"
              id="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.errors.email && formik.touched.email ? (
              <div className="alert alert-danger">{formik.errors.email}</div>
            ) : (
              ""
            )}
            <button className="btn bg-main text-white my-2">
              Save changes
            </button>
          </form>
        </div>
      ) : (
        <LoadingScreen /> // If userData is null, display the LoadingScreen component
      )}
    </>
  );
}
