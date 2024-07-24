import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import LoadingScreen from "./../LoadingScreen/LoadingScreen";
import { toast } from "react-hot-toast";
import {DOMAIN} from "../../utils/constants";

export default function ResetPassword() {
  // Initialize hooks
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);

  // Form validation schema
  const validation = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .email("Email is invalid!"),
    newPassword: Yup.string()
      .required("New Password is required")
      .matches(
        /^[a-z0-9]{5,10}$/i,
        "New Password must include characters with length from 5 to 10 chars"
      ),
  });

  // Formik instance for the Reset Password form
  const resetForm = useFormik({
    initialValues: {
      email: "",
      newPassword: "",
    },
    validationSchema: validation,
    onSubmit: (values) => {
      resetPasswordApi(values);
    },
  });

  // Function to handle the API call for resetting the password
  async function resetPasswordApi(values) {
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${DOMAIN}/api/v1/auth/resetPassword`,
        values
      );
      if (data.token) {
        toast.success("Your password has been successfully reset.");
        navigate("/login");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }

  return (
    <>
      {Loading ? (
        // Loading screen
        <LoadingScreen />
      ) : (
        <div className="container">
          <form className="w-75 mx-auto py-5" onSubmit={resetForm.handleSubmit}>
            <h2 className="fw-bolder text-main mb-5 mt-3">Reset Password: </h2>
            <h5 className="mb-3 pt-2 lh-lg text-danger fw-bold">
              Please enter your registered email address with your new password.
            </h5>
            <label className="my-2" htmlFor="email">
              Email:
            </label>
            <input
              className="form-control"
              value={resetForm.values.email}
              type="email"
              name="email"
              id="email"
              onChange={resetForm.handleChange}
              onBlur={resetForm.handleBlur}
            />
            {resetForm.errors.email && resetForm.touched ? (
              <div className="alert alert-danger">{resetForm.errors.email}</div>
            ) : null}

            <label className="my-2" htmlFor="newPassword">
              New Password:
            </label>
            <input
              className="form-control"
              value={resetForm.values.newPassword}
              type="password"
              name="newPassword"
              id="newPassword"
              onChange={resetForm.handleChange}
              onBlur={resetForm.handleBlur}
            />
            {resetForm.errors.newPassword && resetForm.touched ? (
              <div className="alert alert-danger">
                {resetForm.errors.newPassword}
              </div>
            ) : null}

            <button type="submit" className="btn bg-main text-white my-3">
              Reset Password
            </button>
          </form>
        </div>
      )}
    </>
  );
}
