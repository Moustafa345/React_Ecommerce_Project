import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./../Navbar/Navbar";
import Footer from "./../Footer/Footer";

export default function Layout({ userData, setUserData, userName }) {
  const navigate = useNavigate();

  // Function to handle the logout action
  function logOut() {
    localStorage.removeItem("userToken");
    navigate("/");
    setUserData(null);
  }

  return (
    <>
      <Navbar userData={userData} logOut={logOut} userName={userName} />
      <div className="container">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
