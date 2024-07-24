import axios from "axios";
import { useFormik } from "formik";
import React, { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { UserDataContext } from "../../Context/UserDataContext";
import {DOMAIN} from "../../utils/constants";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { headers } = useContext(UserDataContext);
  const [loading, setLoading] = useState(false);

  async function changePassword(values) {
    // Function for changing the password
    try {
      setLoading(true); // Setting loading state to true
      const { data } = await axios.put(
        `${DOMAIN}/api/v1/users/changeMyPassword`,
        values,
        { headers: headers }
      );

      if (data.message === "success") {
        setLoading(false); // Setting loading state to false
        toast.success("Your password has been changed successfully."); // Displaying success notification
        navigate("/profile"); // Navigating to the profile page
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response.data.errors.msg || error.response.data.message
      ); // Displaying error notification
      setLoading(false); // Setting loading state to false
    }
  }

  let userSchema = Yup.object({
    currentPassword: Yup.string().required("Current password is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^[a-z0-9]{5,10}$/i,
        "Password must include characters with length from 5 to 20 chars"
      ),
    rePassword: Yup.string()
      .required("rePassword is required")
      .oneOf([Yup.ref("password")], "Passwords do not match"),
  });

  let formik = useFormik({
    initialValues: {
      currentPassword: "",
      password: "",
      rePassword: "",
    },
    validationSchema: userSchema,
    onSubmit: changePassword,
  });

  return (
    <>
      {loading ? ( // If loading is true, display the LoadingScreen component
        <LoadingScreen />
      ) : (
        <div className="row w-75 m-auto py-5 px-3 my-5  shadow-lg rounded-3 ">
          <h2 className="pb-5 fw-bold text-main">Change Password</h2>
          <h5 className="mb-3 lh-lg text-danger fw-bold">
            Use the form below to change the password for your Fresh Cart
            account.
          </h5>
          <form onSubmit={formik.handleSubmit}>
            <label className="my-2" htmlFor="currentPassword">
              Current password:
            </label>
            <input
              type="password"
              className="form-control my-2"
              id="currentPassword"
              name="currentPassword"
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.currentPassword && formik.touched.currentPassword ? (
              <div className="alert alert-danger">
                {formik.errors.currentPassword}
              </div>
            ) : (
              ""
            )}

            <label className="my-2" htmlFor="password">
              New password:
            </label>
            <input
              type="password"
              className="form-control my-2"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.password && formik.touched.password ? (
              <div className="alert alert-danger">{formik.errors.password}</div>
            ) : (
              ""
            )}

            <label className="my-2" htmlFor="rePassword">
              Reenter new password:
            </label>
            <input
              type="password"
              className="form-control my-2"
              id="rePassword"
              name="rePassword"
              value={formik.values.rePassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.rePassword && formik.touched.rePassword ? (
              <div className="alert alert-danger">
                {formik.errors.rePassword}
              </div>
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
