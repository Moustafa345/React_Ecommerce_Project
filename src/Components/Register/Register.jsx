import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {DOMAIN} from "../../utils/constants";


export default function Register() {
  let navigate = useNavigate();

  const [isLoading, setisLoading] = useState(false);
  const [msgErr, setmsgErr] = useState(""); // State for displaying error message

  async function handleRegister(values) {
    setisLoading(true); // Setting loading state to true
    let { data } = await axios
      .post(`${DOMAIN}/api/v1/auth/signup`, values)
      .catch((err) => {
        setisLoading(false); // Setting loading state to false
        setmsgErr(err.response.data.message);
      });
    if (data.message === "success") {
      setisLoading(false); // Setting loading state to false
      navigate("/login"); // Navigating to the login page
    }
  }

  let validation = Yup.object({
    // Validation schema using Yup
    name: Yup.string()
      .required("Name is required")
      .min(3, "Minimum length is 3 chars")
      .max(15, "Maximum length is 15 chars"),
    email: Yup.string()
      .required("Email is required")
      .email("Email is invalid!"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^[a-z0-9]{5,10}$/i,
        "Password must include characters with length from 5 to 10 chars"
      ),
    rePassword: Yup.string()
      .required("rePassword is required")
      .oneOf([Yup.ref("password")], "Passwords do not match"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^01[0125][0-9]{8}$/, "Your phone number must be Egyptian"),
  });

  let formik = useFormik({
    // Initializing formik
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
    validationSchema: validation, // Using the validation schema
    onSubmit: handleRegister, // Setting the form submission handler
  });

  return (
    <>
      <div className="w-75 mx-auto py-4">
        <h3 className="fw-bolder text-main mb-5 mt-3">Register Now</h3>

        {msgErr ? ( // Displaying error message if present
          <div className="alert alert-danger">{msgErr}</div>
        ) : null}

        <form onSubmit={formik.handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            onBlur={formik.handleBlur}
            className="form-control mb-2"
            onChange={formik.handleChange}
            value={formik.values.name}
            type="text"
            name="name"
            id="name"
          />
          {formik.errors.name && formik.touched.name ? ( // Displaying validation error message if present
            <div className="alert alert-danger">{formik.errors.name}</div>
          ) : (
            ""
          )}
          <label htmlFor="email">Email:</label>
          <input
            onBlur={formik.handleBlur}
            className="form-control mb-2"
            onChange={formik.handleChange}
            value={formik.values.email}
            type="text"
            name="email"
            id="email"
          />
          {formik.errors.email && formik.touched.email ? ( 
            <div className="alert alert-danger">{formik.errors.email}</div>
          ) : (
            ""
          )}
          <label htmlFor="password">Password:</label>
          <input
            onBlur={formik.handleBlur}
            className="form-control mb-2"
            onChange={formik.handleChange}
            value={formik.values.password}
            type="text"
            name="password"
            id="password"
          />
          {formik.errors.password && formik.touched.password ? ( 
            <div className="alert alert-danger">{formik.errors.password}</div>
          ) : (
            ""
          )}
          <label htmlFor="rePassword">rePassword:</label>
          <input
            onBlur={formik.handleBlur}
            className="form-control mb-2"
            onChange={formik.handleChange}
            value={formik.values.rePassword}
            type="text"
            name="rePassword"
            id="rePassword"
          />
          {formik.errors.rePassword && formik.touched.rePassword ? ( 
            <div className="alert alert-danger">{formik.errors.rePassword}</div>
          ) : (
            ""
          )}
          <label htmlFor="phone">Phone Number:</label>
          <input
            onBlur={formik.handleBlur}
            className="form-control mb-2"
            onChange={formik.handleChange}
            value={formik.values.phone}
            type="text"
            name="phone"
            id="phone"
          />
          {formik.errors.phone && formik.touched.phone ? ( 
            <div className="alert alert-danger">{formik.errors.phone}</div>
          ) : (
            ""
          )}

          {/* Repeat the above pattern for other form fields */}

          {isLoading > 0 ? ( // Displaying loading spinner if loading state is true
            <button type="button" className="btn bg-main text-white">
              <i className="fa-solid fa-fan fa-spin"></i>
            </button>
          ) : (
            <button
              disabled={!(formik.isValid && formik.dirty)} // Disabling the button if form is invalid or not dirty
              type="submit"
              className="btn bg-main text-white"
            >
              Register
            </button>
          )}
        </form>
      </div>
    </>
  );
}
