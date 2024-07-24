import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../Context/CartContext";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import styles from "./Cart.module.css";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";


export default function Cart() {
  const { getLoggedUserCart, updateProductCount, deleteCartItem, removeCart } =
    useContext(CartContext);
  const [cartDetails, setCartDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCart() {
      let response = await getLoggedUserCart();
      setCartDetails(response.data);

      setLoading(false);
    }

    getCart();
  }, []);

  async function updateCount(productId, count) {
    let response = await updateProductCount(productId, count);
    setCartDetails(response.data);
  }

  async function deleteItem(productId) {
    let response = await deleteCartItem(productId);
    setCartDetails(response.data);
  }

  async function removeAllCart() {
    let response = await removeCart();
    if (response.message === "success") {
      toast.success("All products removed successfully");
      console.log(response.message);
      setCartDetails(response.data);
    } else {
      toast.error("Sorry! Your products couldn't be removed!");
      console.log(response.message);
    }
  }

  return (
    <>
      {/* Renders a loading screen if data is still loading */}
      {loading ? (
        <LoadingScreen />
      ) : cartDetails?.products?.length > 0 ? (
        <div className="bg-main-light p-4 my-4">
          <h5>Shopping Cart</h5>
          <h6 className="text-main">
            Total Price: {cartDetails.totalCartPrice} EGP
          </h6>
          {/* Renders each product in the cart */}
          {cartDetails.products.map((product, idx) => (
            <div
              key={idx}
              className="row border-bottom py-2 my-2 align-items-center"
            >
              <div className="col-md-3 col-lg-1">
                <img
                  className="w-100"
                  src={product.product.imageCover}
                  alt={product.product.title}
                />
              </div>
              <div className="col-md-9 col-lg-11 d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bolder mt-2">
                    {/* Limits the title length to 16 words */}
                    {product.product.title.split(" ").slice(0, 16).join(" ")}
                  </h6>
                  <h6 className="text-main">
                    {product.price} <span className="text-black">EGP</span>
                  </h6>
                  {/* Deletes the item from the cart */}
                  <button
                    onClick={() => deleteItem(product.product._id)}
                    className="btn p-0"
                  >
                    <i className="fa-solid fa-circle-minus text-danger mx-1"></i>
                    Remove
                  </button>
                </div>
                <div className="d-none d-lg-block">
                  {/* Updates the count of the product */}
                  <button
                    onClick={() =>
                      updateCount(product.product._id, product.count + 1)
                    }
                    className="btn btn-sm border-main"
                  >
                    +
                  </button>
                  <span className=" d-inline-block mx-2">{product.count}</span>
                  <button
                    onClick={() =>
                      updateCount(
                        product.product._id,
                        product.count > 1 ? product.count - 1 : 1
                      )
                    }
                    className="btn btn-sm border-main"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            {/* Removes all items from the cart */}
            <img
              onClick={removeAllCart}
              className={styles.removeCart}
              src={require("../../assets/images/clearCart.png")}
              alt="clear-cart"
            />
            <div className="text-center mt-3">
              {/* Proceeds to checkout */}
              <Link to={"/checkoutall"}>
                <button className="btn bg-main text-white px-3 py-2 fw-bold fs-3">
                  Proceed To Checkout{" "}
                  <i className="fa-solid fa-angles-right"></i>
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          {/* Displays an empty cart image if there are no products */}
          <img
            className="py-4 mw-100"
            src={require("../../assets/images/empty-cart.png")}
            alt="empty-cart"
          />
        </div>
      )}
    </>
  );
}
