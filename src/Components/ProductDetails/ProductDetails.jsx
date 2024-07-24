import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../Context/CartContext";
import { toast } from "react-hot-toast";
import $ from "jquery";
import {DOMAIN} from "../../utils/constants";

export default function ProductDetails() {
  let { addToCart, deleteCartItem } = useContext(CartContext);

  const [productDetails, setProductDetails] = useState(null);
  let params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product details from the API
    async function getProductDetails(id) {
      try {
        let { data } = await axios.get(
          `${DOMAIN}/api/v1/products/${id}`
        );
        setProductDetails(data.data);
        if (localStorage.getItem(id) === "inCart") {
          $("#addBtn").hide();
          $("#deleteBtn").show();
        }
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    }

    getProductDetails(params.id);
  }, [params.id, navigate]);

  // Set react-slick slider settings
  let settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  async function addToCartProduct(id) {
    // Add product to cart
    let response = await addToCart(id);
    if (response.status === "success") {
      toast.success(response.message);
      $("#addBtn").fadeOut(300, function () {
        $("#deleteBtn").fadeIn(300);
      });

      localStorage.setItem("inCart", id);
    } else {
      toast.error("Sorry, there's an error adding your product to your cart!");
    }
  }

  async function deleteItem(productId) {
    // Delete item from cart
    let response = await deleteCartItem(productId);
    if (response.status === "success") {
      toast.success("Your item has been removed successfully.");
      $("#deleteBtn").fadeOut(300, function () {
        $("#addBtn").fadeIn(300);
      });

      localStorage.removeItem(productId);
    } else {
      toast.error(
        "Sorry, there's an error removing your product from your cart."
      );
    }
  }

  return (
    <>
      {productDetails ? (
        <div className="row align-items-center py-5">
          <div className="col-md-4">
            {/*Render react-slick slider*/}
            <Slider {...settings}>
              {productDetails?.images.map((image, idx) => (
                <img
                  key={idx}
                  className="w-100"
                  src={image}
                  alt={image.title}
                />
              ))}
            </Slider>
          </div>
          <div className="col-md-8 mt-4">
            <div className="py-3">
              <h3>{productDetails?.title}</h3>
              <p className="text-muted mt-4">{productDetails?.description}</p>
              <span className="font-sm fw-bold">
                {productDetails?.category.name}
              </span>
              <div className="d-flex justify-content-between align-items-center font-sm py-2">
                <span className="fw-bold">{productDetails?.price} EGP</span>
                <span>
                  <i className="fa-solid fa-star rating-color"></i>
                  {productDetails?.ratingsAverage}
                </span>
              </div>
              {/*Add to cart button*/}
              <button
                onClick={() => addToCartProduct(productDetails._id)}
                className="btn bg-main text-white w-100"
                id="addBtn"
              >
                Add to cart
              </button>
              {/*Remove from cart button*/}
              <button
                style={{ display: "none" }}
                onClick={() => deleteItem(productDetails._id)}
                className="btn btn-danger text-white w-100 delete-btn"
                id="deleteBtn"
              >
                Remove from cart
              </button>
            </div>
          </div>
        </div>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
}
