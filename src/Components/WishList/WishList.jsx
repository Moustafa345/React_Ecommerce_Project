import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../../Context/UserDataContext";
import axios from "axios";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { Link } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import wishlistImg from "../../assets/images/empty-wishlist.png";
import {DOMAIN} from "../../utils/constants";

export default function WishList() {
  // Accessing the user data and cart context using useContext
  const { headers } = useContext(UserDataContext);
  const { removeWishlist } = useContext(CartContext);

  // State variables for wishlist and loading status
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist data from the API
  async function getWishlist() {
    try {
      const { data } = await axios.get(
        `${DOMAIN}/api/v1/wishlist`,
        { headers }
      );
      setWishlist(data.data);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  }

  // Fetch wishlist data without setting loading status
  async function getlist() {
    try {
      const { data } = await axios.get(
        `${DOMAIN}/api/v1/wishlist`,
        { headers }
      );
      setWishlist(data.data);
    } catch (error) {
      console.log("error", error);
    }
  }

  // Fetch wishlist data when the component mounts
  useEffect(() => {
    getWishlist();
  }, []);

  // Remove an item from the wishlist and update the wishlist
  async function removeList(id) {
    await removeWishlist(id);
    await getlist();
  }

  return (
    <>
      {loading ? (
        <LoadingScreen /> // Display a loading screen while fetching data
      ) : (
        <>
          {wishlist.length > 0 ? (
            <div className="row row-cols row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 py-5">
              {wishlist.map((item) => (
                <div key={item._id} className="col">
                  <div className="h-100 d-flex flex-column justify-content-between">
                    <Link to={`/productdetails/${item._id}`}>
                      {/* Display item details */}
                      <div className="text-center">
                        <img
                          key={item._id}
                          className="w-75 mx-auto"
                          src={item.imageCover}
                          alt={item.title}
                        />
                      </div>
                      <span className="font-sm fw-bold text-main ps-5">
                        {item.brand.name}
                      </span>
                      <h3 className="h6 fw-bold ps-5">
                        {item.title.split(" ").slice(0, 2).join(" ")}
                      </h3>
                      <div className="d-flex justify-content-around align-items-center font-sm">
                        <small className="text-info">
                          {item.priceAfterDiscount ? (
                            <>
                              <p className="text-decoration-line-through text-danger m-0">
                                {item.price}
                              </p>
                              <span>{item.priceAfterDiscount}</span>
                            </>
                          ) : (
                            <span>{item.price}</span>
                          )}
                          <span className="text-black"> EGP</span>
                        </small>
                        <span>
                          <i className="fa-solid fa-star rating-color"></i>
                          {item.ratingsAverage}
                        </span>
                      </div>
                    </Link>
                    {/* Remove item from wishlist button */}
                    <button
                      onClick={() => removeList(item._id)}
                      className="btn btn-danger text-white w-75 font-sm mx-auto"
                    >
                      Remove from wishlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="d-flex justify-content-center align-items-center">
              <img className="w-50" src={wishlistImg} alt="empty-wishlist" />
            </div>
          )}
        </>
      )}
    </>
  );
}
