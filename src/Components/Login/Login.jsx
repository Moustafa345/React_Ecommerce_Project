import React from "react";
import * as Yup from "yup";
import { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {DOMAIN} from "../../utils/constants";

export default function Login({ saveUserData }) {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const [msgErr, setmsgErr] = useState("");

  // Function to handle the login action
  async function handleLogin(values) {
    setisLoading(true);
     // Make an API request to the login endpoint
    let { data } = await axios
      .post(`${DOMAIN}/api/v1/auth/signin`, values)
      .catch((err) => {
        setisLoading(false);
        setmsgErr(err.response.data.message);
      });

    if (data.message === "success") {
      // Set the user token in local storage
      localStorage.setItem("userToken", data.token);
      saveUserData();
      setisLoading(false);
      navigate("/");
    }
  }
  
// Object to define the validation rules for the login form
  const validation = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .email("Email is invalid!"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^[a-z0-9]{5,10}$/i,
        "Password must include characters with length from 5 to 10 chars"
      ),
  });

  // Function to create a Formik instance
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validation,
    onSubmit: handleLogin,
  });

  return (
    <>
      <div className="container py-5">
        <div className="w-75 py-5 mx-auto">
          <h2 className="fw-bolder text-main mb-5 mt-3">Login</h2>
          {msgErr ? <div className="alert alert-danger">{msgErr}</div> : null}
          <form onSubmit={formik.handleSubmit}>
            <label className="my-2" htmlFor="email">
              Email:
            </label>
            <input
              className="form-control"
              value={formik.values.email}
              type="email"
              name="email"
              id="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.email && formik.touched ? (
              <div className="alert alert-danger">{formik.errors.email}</div>
            ) : null}
            <label className="my-2" htmlFor="password">
              Password:
            </label>
            <input
              className="form-control mb-3"
              value={formik.values.password}
              type="password"
              name="password"
              id="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.password && formik.touched ? (
              <div className="alert alert-danger">{formik.errors.password}</div>
            ) : null}
            <></>
            <Link className="text-success" to={"/forgotpassword"}>
              Forgot your password?
            </Link>
            <br />
            {isLoading ? (
              <button type="button" className="btn bg-main my-2 text-white">
                {" "}
                <i className="fa-solid fa-fan fa-spin"></i>{" "}
              </button>
            ) : (
              <button
                disabled={!(formik.isValid && formik.dirty)}
                type="submit"
                className="btn bg-main my-2 text-white"
              >
                Login
              </button>
            )}
          </form>
          <Link to={"/register"}>
            Don't have an account?{" "}
            <span className="fw-bold text-main">Register Now.</span>{" "}
          </Link>
        </div>
      </div>
    </>
  );
}
