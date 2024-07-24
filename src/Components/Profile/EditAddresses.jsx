import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../../Context/UserDataContext";
import jwtDecode from "jwt-decode";
import axios from "axios";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import {DOMAIN} from "../../utils/constants";

export default function EditAddresses() {
  const { getuserData, userToken } = useContext(UserDataContext);
  const [userData, setuserData] = useState(null); // State for storing user data
  const [deleteAddress, setdeleteAddress] = useState(null); // State for handling address deletion
  const [loading, setLoading] = useState(true); // State for managing loading state

  let headers = { token: userToken };
  let decodedToken = jwtDecode(userToken);

  useEffect(() => {
    async function getData() {
      try {
        const { data } = await getuserData(decodedToken.id); // Fetching user data
        setuserData(data.addresses); // Updating user data in state
        setLoading(false); // Setting loading state to false
      } catch (error) {
        console.log(error);
      }
    }

    getData();
  }, [deleteAddress]);

  async function removeAddress(id) {
    try {
      const { data } = await axios.delete(
        `${DOMAIN}/api/v1/addresses/${id}`,
        {
          headers: headers,
        }
      );
      setdeleteAddress(data.data); // Updating deleteAddress state to trigger useEffect
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {loading ? ( // If loading is true, display the LoadingScreen component
        <LoadingScreen />
      ) : (
        <>
          <h2 className="py-5 fw-bold text-main fs-1">Your Addresses</h2>
          <div className="row ">
            <div className="col-12 col-md-4 mb-5">
              <Link to={"/addaddress"}>
                <div className="card h-100 d-flex justify-content-center align-items-center  text-main">
                  <i className="fa-solid fa-plus fa-5x p-5"></i>
                  <p className="fw-bold fs-3">Add Address</p>
                </div>
              </Link>
            </div>

            {userData?.map((address) => (
              <div key={address._id} className="col-12 col-md-4 mb-5">
                <div className="card h-100">
                  <div className="p-3">
                    <h5 className="my-2 fw-bold text-main">Name:</h5>
                    <p>{address.name}</p>
                    <h5 className="my-2 fw-bold text-main">Details:</h5>
                    <p>{address.details}</p>
                    <h5 className="my-2 fw-bold text-main">City:</h5>
                    <p>{address.city}</p>
                    <h5 className="my-2 fw-bold text-main">Phone Number:</h5>
                    <p>{address.phone}</p>
                    <button
                      onClick={() => removeAddress(address._id)}
                      className="btn btn-danger w-100 py-3"
                    >
                      Remove Address
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
