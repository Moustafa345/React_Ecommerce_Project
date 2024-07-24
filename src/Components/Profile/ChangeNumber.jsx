import axios from "axios";
import React, { useEffect, useContext, useState } from "react";
import { UserDataContext } from "../../Context/UserDataContext";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import jwtDecode from "jwt-decode";
import {DOMAIN} from "../../utils/constants";


export default function ChangeNumber() {
  const { headers, userToken, getuserData } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [userData, setuserData] = useState(null); // State for storing user data
  const [loading, setLoading] = useState(true);
  let decodedToken = jwtDecode(userToken); // Decoding the user token to get the user ID

  useEffect(() => {
    async function getNumber() {
      // Function for retrieving the user's phone number
      try {
        const { data } = await getuserData(decodedToken.id);
        setuserData(data.phone); // Storing the phone number in state
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    getNumber();
  }, []);

  async function changeNumber(values) {
    // Function for changing the phone number
    try {
      const { data } = await axios.put(
        `${DOMAIN}/api/v1/users/updateMe`,
        values,
        { headers: headers }
      );

      if (data.message === "success") {
        toast.success("Your phone number has been changed successfully."); // Displaying success notification
        navigate("/profile"); // Navigating to the profile page
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message); // Displaying error notification
    }
  }

  let userSchema = Yup.object({
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^01[0125][0-9]{8}$/, "Your phone number must be Egyptian"),
  });

  let formik = useFormik({
    initialValues: {
      phone: "",
    },
    validationSchema: userSchema,
    onSubmit: changeNumber,
  });

  return (
    <>
      {loading ? ( // If loading is true, display the LoadingScreen component
        <LoadingScreen />
      ) : (
        <div className="row w-75 m-auto py-5 px-3 my-5  shadow-lg rounded-3 ">
          <h2 className="pb-5 fw-bold text-main">Change Mobile Phone Number</h2>
          <p>
            Current mobile phone number:{" "}
            <span className="fw-bold h6">{userData}</span>
          </p>

          <h5 className="mb-3 lh-lg text-danger fw-bold">
            Enter the new mobile phone number you would like to associate with
            your account below.
          </h5>
          <form onSubmit={formik.handleSubmit}>
            <label className="my-2" htmlFor="phone">
              Mobile phone number:
            </label>
            <input
              type="text"
              className="form-control my-2"
              id="phone"
              name="phone"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
            />
            {formik.errors.phone && formik.touched.phone ? (
              <div className="alert alert-danger">{formik.errors.phone}</div>
            ) : (
              ""
            )}
            <button type="submit" className="btn bg-main text-white my-2">
              Save changes
            </button>
          </form>
        </div>
      )}
    </>
  );
}
