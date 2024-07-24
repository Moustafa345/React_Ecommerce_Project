import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {DOMAIN} from "../../utils/constants";

export default function ForgotPassword() {
  // State variables
  const [codeFlag, setCodeFlag] = useState(true);
  const [errMsg, seterrMsg] = useState("");
  const [errEmail, seterrEmail] = useState("");
  const [successEmail, setsuccessEmail] = useState("");

  const navigate = useNavigate();

  // Form validation schema
  let validationSchema = Yup.object({
    email: Yup.string().required().email("Please enter a valid email!"),
  });

  // Formik instance for the Forgot Password form
  let ForgotPasswordForm = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: (vals) => {
      forgotPassApi(vals);
    },
    validationSchema,
  });

  // Formik instance for the Reset Code form
  let resetForm = useFormik({
    initialValues: {
      resetCode: "",
    },
    onSubmit: (vals) => {
      resetCodeApi(vals);
    },
  });

  // Function to handle the API call for forgot password
  async function forgotPassApi(vals) {
    try {
      let { data } = await axios.post(
        `${DOMAIN}/api/v1/auth/forgotPasswords`,
        vals
      );
      if (data.statusMsg === "success") {
        setCodeFlag(false);
        setsuccessEmail(data.message);
      }
    } catch (error) {
      console.log(error);
      seterrEmail(error.response.data.message);
    }
  }

  // Function to handle the API call for resetting the code
  async function resetCodeApi(valobj) {
    try {
      let { data } = await axios.post(
        `${DOMAIN}/api/v1/auth/verifyResetCode`,
        valobj
      );
      if (data.status === "Success") {
        navigate("/resetpassword");
      }
    } catch (error) {
      console.log(error);
      seterrMsg(error.response.data.message);
    }
  }

  return (
    <>
      <div className="container w-75 py-5">
        <h2 className="fw-bolder text-main mb-5 mt-3">Forgot Password</h2>

        {codeFlag ? (
          // Forgot Password form
          <form onSubmit={ForgotPasswordForm.handleSubmit}>
            <h5 className="mb-3 pt-4 lh-lg text-danger fw-bold">
              If you forgot your password that is associated with your Fresh
              Cart customer account, you may enter your registered email. Be
              sure to click the Send Message button when you are done.
            </h5>
            <div>
              <label className="mb-2 mt-4" htmlFor="email">
                Email:
              </label>
              <input
                onChange={ForgotPasswordForm.handleChange}
                type="email"
                className="form-control"
                name="email"
                id="email"
              />
            </div>
            {errEmail !== "" ? (
              <p className="alert alert-danger">{errEmail}</p>
            ) : (
              ""
            )}
            <button type="submit" className="btn bg-main text-white my-3">
              Send Message
            </button>
          </form>
        ) : (
          // Reset Code form
          <form onSubmit={resetForm.handleSubmit}>
            <div>
              <h5 className="mb-3 pt-2 lh-lg text-danger fw-bold">
                Please enter your reset code that has been sent to your email
                address.
              </h5>
              <label htmlFor="resetCode">Reset Code:</label>
              <input
                onChange={resetForm.handleChange}
                type="text"
                className="form-control"
                name="resetCode"
                id="resetCode"
              />
            </div>
            {successEmail !== "" ? (
              <div className="my-2 p-2 rounded-3 bg-warning ">
                {successEmail}
              </div>
            ) : (
              ""
            )}
            {errMsg !== "" ? (
              <div className="alert alert-danger">{errMsg}</div>
            ) : (
              ""
            )}
            <button type="submit" className="btn bg-main text-white mt-4 mb-5">
              Verify Code
            </button>
          </form>
        )}
      </div>
    </>
  );
}
