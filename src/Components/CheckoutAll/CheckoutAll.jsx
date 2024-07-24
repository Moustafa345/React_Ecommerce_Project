import React, { useContext, useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { UserDataContext } from "../../Context/UserDataContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Form, useNavigate } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import { Box, Button } from "@mui/material";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import {DOMAIN} from "../../utils/constants";

export default function CheckoutAll() {
  const navigate = useNavigate();
  const { headers } = useContext(UserDataContext);
  const { cartId, setCartItems } = useContext(CartContext);

  const [addressValue, setAddressValue] = useState("");
  const [addressData, setAddressData] = useState([]);

  const [loading, setLoading] = useState(true);

  // Get Addresses Details Function.
  const getAddresses = async () => {
    // Fetch addresses from the API
    try {
      const { data } = await axios.get(
        `${DOMAIN}/api/v1/addresses`,
        { headers }
      );
      setAddressData(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Pay Cash Function.
  const payCash = async (addressValue) => {
    // Process cash payment
    const shippingAddress = {
      details: addressValue.details,
      phone: addressValue.phone,
      city: addressValue.city,
    };
    try {
      const { data } = await axios.post(
        `${DOMAIN}/api/v1/orders/${cartId}`,
        { shippingAddress },
        { headers }
      );
      if (data.status === "success") {
        toast.success("Your order has been successfully placed");
        setCartItems(0);
        navigate("/allorders");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.statusMsg);
    }
  };

  // Pay Online Function
  const onlinePayment = async (addressValue) => {
    // Process online payment
    const shippingAddress = {
      details: addressValue.details,
      phone: addressValue.phone,
      city: addressValue.city,
    };

    try {
      const { data } = await axios.post(
        `${DOMAIN}/api/v1/orders/checkout-session/${cartId}?url=https://Moustafa345.github.io/React_Ecommerce_Project/#`,
        { shippingAddress },
        { headers }
      );
      window.open(data.session.url);
      navigate("/");
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  useEffect(() => {
    getAddresses();
  }, []);

  // Handelling addresses values in select group.
  const handleChange = (event) => {
    // Update selected address value
    setAddressValue(event.target.value);
  };

  const initialValues = {
    name: "",
    details: "",
    city: "",
    number: "",
  };

  const addAddress = async (values) => {
    // Add a new address
    try {
      let { data } = await axios.post(
        `${DOMAIN}/api/v1/addresses`,
        values,

        { headers }
      );
      if (data.status === "success") {
        toast.success("Your address has been added successfully.");
        await getAddresses();
      }
    } catch (error) {
      toast.error("Sorry! There was an error adding your new address.");
      console.log(error);
    }
  };

  const validationSchema = Yup.object().shape({
    // Define form validation rules
    name: Yup.string()
      .required("Name is required")
      .min(3, "Minimum length is 3 chars")
      .max(30, " Maximum length is 30 characters"),
    details: Yup.string()
      .required("Details are required")
      .matches(/^[^\n]{3,100}$/, "100 maximum characters are allowed!"),
    city: Yup.string()
      .required("City is required")
      .matches(/^[a-zA-Z]{3,30}$/, "30 maximum characters are allowed!"),
    number: Yup.string()
      .required("Phone number is required")
      .matches(/^01[0-2]{1}[0-9]{8}$/, "Your phone number must be Egyptian"),
  });

  return (
    <>
      {/* Checkout section */}
      <div className="row w-75 mx-auto">
        <h2 className="fw-bolder text-main pt-5 pb-4">Checkout</h2>

        {loading ? (
          // Display loading screen while fetching data
          <LoadingScreen />
        ) : addressData.length > 0 ? (
          // Display address selection and payment options if addresses exist
          <>
            {/* Address selection */}
            <div className="d-flex flex-column align-items-center mt-3">
              <h4 className="text-success">Select an address</h4>
              <FormControl sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="demo-simple-select-autowidth-label">
                  Address
                </InputLabel>
                <Select
                  value={
                    addressValue ||
                    (addressData?.length > 0 && addressData[0]) ||
                    ""
                  }
                  onChange={handleChange}
                  autoWidth
                  label="Address"
                >
                  {addressData.map((address) => (
                    <MenuItem key={address._id} value={address}>
                      {address.details}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Payment options */}
            <h4 className="text-success pt-5 text-center">
              <i className="fa-solid fa-angles-down text-main d-none d-md-inline"></i>{" "}
              Choose your preferred payment method{" "}
              <i className="fa-solid fa-angles-down text-main ms-1 d-none d-md-inline"></i>
            </h4>

            <div className="d-flex justify-content-around align-items-center py-5 flex-wrap">
              {/* Pay Cash button */}
              <button
                onClick={payCash}
                className="btn bg-main text-white px-4 py-2 fw-bold fs-3 my-2"
                disabled={addressData.length === 0}
              >
                <i className="fa-solid fa-money-bill text-white"></i> Pay Cash
              </button>

              {/* Pay Online button */}
              <button
                onClick={onlinePayment}
                className="btn bg-main text-white px-4 py-2 fw-bold fs-3 my-2"
                disabled={addressData.length === 0}
              >
                <i className="fa-regular fa-credit-card text-white"></i> Pay
                Online
              </button>
            </div>
          </>
        ) : (
          // Display address form if no addresses exist
          <>
            <h4 className="fw-bold text-success ms-2 pt-5 pb-3">
              Please add an address to be able to place an order.
            </h4>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={addAddress}
            >
              {({ errors, touched, handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  <Box
                    component="div"
                    sx={{
                      "& .MuiTextField-root": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    {/* Address form fields */}
                    <div>
                      <Field
                        required
                        name="name"
                        as={TextField}
                        label="Name"
                        variant="filled"
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                      />
                      <Field
                        required
                        name="details"
                        as={TextField}
                        label="Details"
                        variant="filled"
                        error={touched.details && Boolean(errors.details)}
                        helperText={touched.details && errors.details}
                      />
                      <Field
                        required
                        name="city"
                        as={TextField}
                        label="City"
                        variant="filled"
                        error={touched.city && Boolean(errors.city)}
                        helperText={touched.city && errors.city}
                      />
                      <Field
                        required
                        name="number"
                        as={TextField}
                        label="Number"
                        variant="filled"
                        error={touched.number && Boolean(errors.number)}
                        helperText={touched.number && errors.number}
                      />
                    </div>

                    {/* Submit button */}
                    <Button
                      className="bg-main ms-3 mt-3 mb-5"
                      type="submit"
                      size="medium"
                      variant="contained"
                    >
                      <CheckCircleIcon className="me-1" />
                      <span className="mt-1">Submit</span>
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </>
        )}
      </div>
    </>
  );
}
