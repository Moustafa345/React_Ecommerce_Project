import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../Context/CartContext";
import { toast } from "react-hot-toast";
import comingSoon from "../../assets/images/coming-soon.png";
import {DOMAIN} from "../../utils/constants";

export default function BrandDetails() {
  let { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  let params = useParams();

  const [brandDetails, setBrandDetails] = useState(null);

  useEffect(() => {
    async function getBrandDetails() {
      try {
        const { data } = await axios.get(
          `${DOMAIN}/api/v1/products`,
          {
            params: { brand: params.id },
          }
        );
        setBrandDetails(data.data);
      } catch (error) {
        console.log("Error:", error);
        navigate("/");
      }
    }
    getBrandDetails();
  }, [params.id, navigate]);

  async function addProductToCart(id) {
    let response = await addToCart(id);
    if (response.status === "success") {
      toast.success(response.message);
    } else {
      toast.error("Sorry, there's an error adding your product to the cart!");
    }
  }

  return (
    <>
      {/* Brand Details */}
      <div className="container my-5">
        <h2 className="fw-bolder text-main">Brand Details</h2>
      </div>

      {/* Check if there are no brand details */}
      {brandDetails?.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center py-5 my-5">
          <img className="w-75" src={comingSoon} alt="coming-soon" />
        </div>
      ) : brandDetails ? (
        /* Render brand details */
        <div className="row row-cols row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-5 py-5">
          {brandDetails.map((brand) => (
            <div key={brand._id} className="col">
              <Link to={`/productdetails/${brand._id}`}>
                <div className="item h-100 d-flex flex-column justify-content-between">
                  <img
                    className="w-100"
                    src={brand.imageCover}
                    alt={brand.title}
                  />
                  <h4>{brand.title.split(" ").slice(0, 16).join(" ")}</h4>
                  <h5 className="font-sm text-main">
                    <span className="fw-bold fs-5 text-black">Price: </span>EGP{" "}
                    {brand.price}
                  </h5>
                </div>
              </Link>
              <button
                onClick={() => addProductToCart(brand._id)}
                className="btn bg-main text-white w-100"
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Render loading screen */
        <LoadingScreen />
      )}
    </>
  );
}
