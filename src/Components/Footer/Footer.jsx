import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className="p-5 pb-2 bg-main-light mt-4 text-center">
      <h3 className="text-md-start ">Get the FreshCart app</h3>
      <p className="text-md-start">
        We will send you a link, open it on your phone to download the app.
      </p>

      {/* Input and Button */}
      <div className="row align-items-center">
        <div className="col-md-8 py-2">
          <input className="form-control" type="email" placeholder="Email..." />
        </div>
        <div className="col-md-4 py-2">
          <button
            className="btn bg-main text-white px-5 py-2 w-100"
            type="button"
          >
            Share APP Link
          </button>
        </div>
      </div>

      <hr />

      {/* Payment Partners */}
      <div className="d-flex flex-wrap justify-content-center justify-content-md-between align-items-center text-center text-md-start">
        <div className="d-flex align-items-center flex-wrap">
          <div className="py-2 text-md-start">
            <p className="fw-bold fs-5">Payment Partners</p>
          </div>
          {/* Logos */}
          <div
            className={`${styles.leftLogo} d-flex align-items-center ms-2 mb-2 mb-md-0`}
          >
            <img
              className="w-100"
              src={require("../../assets/images/Logos/amazon-pay.png")}
              alt="amazon-pay"
            />
          </div>
          <div
            className={`${styles.leftLogo} d-flex align-items-center ms-2 mb-2 mb-md-0`}
          >
            <img
              className="w-100"
              src={require("../../assets/images/Logos/american-express.png")}
              alt="american-express"
            />
          </div>
          <div
            className={`${styles.leftLogo} d-flex align-items-center ms-2 mb-2 mb-md-0`}
          >
            <img
              className="w-100"
              src={require("../../assets/images/Logos/master-card.png")}
              alt="master-card"
            />
          </div>
          <div
            className={`${styles.leftLogo} d-flex align-items-center ms-2 mb-2 mb-md-0`}
          >
            <img
              className="w-100"
              src={require("../../assets/images/Logos/paypal.png")}
              alt="paypal"
            />
          </div>
        </div>

        {/* App Store and Google Play Logos */}
        <div className="d-flex align-items-center flex-wrap py-2">
          <p className="me-3 mt-3 fw-bold fs-5 text-center text-md-start text-nowrap">
            Get Deliveries with FreshCart
          </p>
          <div className="d-flex justify-content-center justify-content-md-start">
            <div
              className={`${styles.logoImg} d-flex align-items-center ms-2 mb-2 mb-md-0`}
            >
              <img
                className="w-100"
                src={require("../../assets/images/Logos/app-store.png")}
                alt="app-store"
              />
            </div>
            <div className={`${styles.logoImg} d-flex align-items-center ms-2`}>
              <img
                className="w-100"
                src={require("../../assets/images/Logos/google-play.png")}
                alt="google-play"
              />
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4" />
      {/* Copyright Notice */}
      <p className="text-muted  text-center">
        © 2023 <span className="fw-bold text-main">Moustafa Mouhamed.</span> All
        rights reserved.
      </p>
    </footer>
  );
}
