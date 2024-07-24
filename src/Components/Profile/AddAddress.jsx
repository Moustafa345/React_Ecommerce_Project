import { useFormik } from "formik";
import React, { useContext } from "react";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserDataContext } from "../../Context/UserDataContext"; 
import {DOMAIN} from "../../utils/constants";

export default function AddAddress() {
  const { headers } = useContext(UserDataContext); // Accessing headers from UserDataContext
  let navigate = useNavigate(); 

  // Function for handling the address addition
  async function handleAddingAddress(values) {
    try {
      let { data } = await axios.post(
        `${DOMAIN}/api/v1/addresses`,
        values,
        {
          headers: headers,
        }
      );

      if (data.status === "success") {
        toast.success("Your address has been added successfully."); // Displaying success notification
        navigate("/editaddresses"); // Navigating to the editaddresses page
      }
    } catch (error) {
      toast.error("Sorry! There was an error adding your new address."); // Displaying error notification
      console.log(error);
    }
  }

  let validation = Yup.object({
    // Setting up form validation using Yup
    name: Yup.string()
      .required("Name is required")
      .min(3, "Minimum length is 3 chars")
      .max(30, "Maximum length is 30 characters"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^01[0125][0-9]{8}$/, "Your phone number must be Egyptian"),
    city: Yup.string()
      .required("City is required")
      .matches(/^[a-zA-Z]{3,30}$/, "30 maximum characters are allowed!"),
    details: Yup.string()
      .required("Details are required")
      .matches(/^[^\n]{3,100}$/, "100 maximum characters are allowed!"),
  });

  let formik = useFormik({
    // Initializing the useFormik hook for form management
    initialValues: {
      name: "",
      phone: "",
      city: "",
      details: "",
    },
    validationSchema: validation, // Applying the validation schema
    onSubmit: handleAddingAddress, // Setting the submission handler
  });

  return (
    <>
      <div className="w-75 mx-auto py-4">
        <h3 className="pb-5 fw-bold text-main">Add Address: </h3>

        <form onSubmit={formik.handleSubmit}>
          {/* Form inputs */}
          {/* Name input */}
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
          {formik.errors.name && formik.touched.name ? (
            <div className="alert alert-danger">{formik.errors.name}</div>
          ) : (
            ""
          )}

          {/* City input */}
          <label htmlFor="city">City:</label>
          <input
            onBlur={formik.handleBlur}
            className="form-control mb-2"
            onChange={formik.handleChange}
            value={formik.values.city}
            type="text"
            name="city"
            id="city"
          />
          {formik.errors.city && formik.touched.city ? (
            <div className="alert alert-danger">{formik.errors.city}</div>
          ) : (
            ""
          )}

          {/* Details input */}
          <label htmlFor="details">Details:</label>
          <input
            onBlur={formik.handleBlur}
            className="form-control mb-2"
            onChange={formik.handleChange}
            value={formik.values.details}
            type="text"
            name="details"
            id="details"
          />
          {formik.errors.details && formik.touched.details ? (
            <div className="alert alert-danger">{formik.errors.details}</div>
          ) : (
            ""
          )}

          {/* Phone input */}
          <label htmlFor="phone">Phone:</label>
          <input
            className="form-control mb-2"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.phone}
            type="tel"
            name="phone"
            id="phone"
          />
          {formik.errors.phone && formik.touched.phone ? (
            <div className="alert alert-danger">{formik.errors.phone}</div>
          ) : (
            ""
          )}

          <button type="submit" className="btn bg-main text-white">
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
}
