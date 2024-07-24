import React, { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { UserDataContext } from "../../Context/UserDataContext";
import { CartContext } from "../../Context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {DOMAIN} from "../../utils/constants";

export default function CashPayment() {
  const navigate = useNavigate();
  const { headers } = useContext(UserDataContext);
  const { cartId, setCartItems } = useContext(CartContext);

  // Function to handle cash payment
  async function payCash(values) {
    try {
      // Send a POST request to the server to create an order with cash payment
      const { data } = await axios.post(
        `${DOMAIN}/api/v1/orders/${cartId}`,
        { shippingAddress: values },
        { headers }
      );
      if (data.status === "success") {
        // Display success message and navigate to the orders page
        toast.success("Your order has been placed successfully");
        setCartItems(0);
        navigate("/allorders");
      }
      console.log(data);
    } catch (error) {
      console.log(error);
      // Display error message if the request fails
      toast.error(error.response.data.statusMsg);
    }
  }

  // Form validation schema using Yup
  let validationSchema = Yup.object({
    details: Yup.string()
      .required("Details are required!")
      .min(10, "10 characters are the minimum length.")
      .max(100, "100 characters are the maximum length."),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^01[0125][0-9]{8}$/, "Your phone number must be Egyptian"),
    city: Yup.string()
      .required("City is required")
      .matches(
        /^[a-zA-Z]{3,30}$/,
        "Make sure you only enter characters, not numbers. Max length is 30 characters."
      ),
  });

  // Initialize Formik hook
  let formik = useFormik({
    initialValues: {
      details: "",
      phone: "",
      city: "",
    },
    validationSchema,
    onSubmit: payCash,
  });

  return (
    <>
      <div className="w-75 mx-auto">
        <h2>CashPayment</h2>
        {/* Form for cash payment */}
        <form onSubmit={formik.handleSubmit}>
          <label htmlFor="details">Details:</label>
          <input
            type="text"
            className="form-control mb-2"
            id="details"
            name="details"
            value={formik.values.details}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Display error message if details field is invalid */}
          {formik.errors.details && formik.touched.details ? (
            <div className="alert alert-danger">{formik.errors.details}</div>
          ) : (
            ""
          )}

          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            className="form-control mb-2"
            id="phone"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Display error message if phone field is invalid */}
          {formik.errors.phone && formik.touched.phone ? (
            <div className="alert alert-danger">{formik.errors.phone}</div>
          ) : (
            ""
          )}

          <label htmlFor="city">City:</label>
          <input
            type="text"
            className="form-control mb-2"
            id="city"
            name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Display error message if city field is invalid */}
          {formik.errors.city && formik.touched.city ? (
            <div className="alert alert-danger">{formik.errors.city}</div>
          ) : (
            ""
          )}

          <button
            type="submit"
            className="btn w-100 border-main text-main fw-bolder"
          >
            Pay in cash
          </button>
        </form>
      </div>
    </>
  );
}
