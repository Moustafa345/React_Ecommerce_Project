import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { CartContext } from "../../Context/CartContext";
import { toast } from "react-hot-toast";
import $ from "jquery";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import {DOMAIN} from "../../utils/constants";

export default function FeaturedProducts({ userData }) {
  // Destructure methods and state from CartContext
  let {
    addToCart,
    getLoggedUserCart,
    deleteCartItem,
    removeWishlist,
    addWishlist,
    wishlistProducts,
    cartProducts,
  } = useContext(CartContext);

  const [products, setProducts] = useState([]); // State to store the fetched products
  const [loading, setLoading] = useState(true); // State to handle the loading screen
  const [page, setPage] = useState(1); // State to handle the pagination
  const [numberOfPages, setNumberOfPages] = useState(null); // State to store the number of pages
  let navigate = useNavigate(); // Navigation hook

  // Function to handle the pagination change
  const handleChange = (event, value) => {
    setPage(value);
  };

  // Fetch products based on the current page and update the state
  const getProducts = async (page) => {
    const limit = 10; // Limit of products per page
    try {
      const { data } = await axios.get(
        `${DOMAIN}/api/v1/products?page=${page}&limit=${limit}`
      );
      setNumberOfPages(data?.metadata.numberOfPages);
      setProducts(data.data);
      getLoggedUserCart();
      setLoading(false);
    } catch (error) {
      navigate("");
      console.log(error);
    }
  };

  // Fetch products when the component mounts or when the page state changes
  useEffect(() => {
    getProducts(page);
  }, [page]);

  // Function to handle adding a product to the cart
  async function addProductToCart(id) {
    if (userData === null) {
      navigate("/login");
    } else {
      let response = await addToCart(id);
      if (response.status === "success") {
        $(`#addBtn${id}`).fadeOut(() => {
          $(`#deleteBtn${id}`).fadeIn();
        });
        toast.success(response.message);
      } else {
        toast.error("Sorry, there's an error adding your product to the cart!");
      }
    }
  }

  // Function to handle removing an item from the cart
  async function deleteItem(id) {
    let response = await deleteCartItem(id);
    if (response.status === "success") {
      toast.success("Your item has been removed successfully.");
      $(`#deleteBtn${id}`).addClass("d-none");
      $(`#addBtn${id}`).removeClass("d-none");
    } else {
      toast.error(
        "Sorry, there's an error removing your product from your cart."
      );
    }
  }

  // Create sets of wishlist products and cart products to check whether a product is in the wishlist or cart
  let wishlistSet = new Set(wishlistProducts?.map((item) => item.id));
  let cartProductsSet = new Set(cartProducts?.map((pro) => pro.product.id));
  if (!userData) {
    wishlistSet = null;
    cartProductsSet = null;
  }

  // Call the addWishlist function to add the product to the user's wishlist
  async function addWishlistItem(productId) {
    if (userData === null) {
      navigate("/login");
    } else {
      const data = await addWishlist(productId);

      // Check if the product was added successfully
      if (data.status === "success") {
        toast.success("Product added successfully to your wishlist");
      }
    }
  }

  // Call the removeWishlist function to remove the product from the user's wishlist
  async function removeList(id) {
    await removeWishlist(id);
  }

  return (
    <>
      {loading ? (
        // Render the LoadingScreen component while the page is still loading
        <LoadingScreen />
      ) : (
        // Render the product list once loading is complete
        <div className="row row-cols row-cols-1 row-cols-md-3  row-cols-lg-4 row-cols-xl-5 gy-4 py-5">
          {products?.map((product) => (
            // Iterate over each product in the products array
            <div key={product._id} className="col">
              <div className="product cursor-pointer p-3 position-relative">
                {/* Render the heart icon for adding/removing products from the wishlist */}
                {wishlistSet?.has(product._id) ? (
                  <i
                    onClick={() => removeList(product._id)}
                    id={`removeListBtn${product._id}`}
                    className=" fa-solid fa-heart fa-1x position-absolute top-0 end-0 bg-white text-main m-2 p-2 rounded-circle"
                  ></i>
                ) : (
                  <i
                    onClick={() => addWishlistItem(product._id)}
                    id={`addListBtn${product._id}`}
                    className=" fa-regular fa-heart fa-1x position-absolute top-0 end-0 bg-main text-white m-2 p-2 rounded-circle"
                  ></i>
                )}

                {/* Render the product details and image */}
                <Link to={`/productdetails/${product._id}`}>
                  <img
                    key={product._id}
                    className="w-100"
                    src={product.imageCover}
                    alt={product.title}
                  />
                  <span className="font-sm fw-bold text-main">
                    {product.brand.name}
                  </span>
                  <h3 className="h6 fw-bold">
                    {product.title?.split(" ").slice(0, 2).join(" ")}
                  </h3>
                  <div className="d-flex justify-content-between align-items-center font-sm py-3">
                    {/* Render the product price and rating */}
                    <small className="text-info">
                      {product.priceAfterDiscount ? (
                        <>
                          <p className="text-decoration-line-through text-danger m-0">
                            {product.price}
                          </p>
                          <span>{product.priceAfterDiscount}</span>
                        </>
                      ) : (
                        <span>{product.price}</span>
                      )}
                      <span className=" text-black"> EGP</span>
                    </small>
                    <span>
                      <i className="fa-solid fa-star rating-color"></i>
                      {product.ratingsAverage}
                    </span>
                  </div>
                </Link>

                {/* Render the add/remove from cart button */}
                {cartProductsSet?.has(product._id) ? (
                  <button
                    onClick={() => deleteItem(product._id)}
                    className="btn btn-danger text-white w-100 font-sm"
                    id={`deleteBtn${product._id}`}
                  >
                    Remove from cart
                  </button>
                ) : (
                  <button
                    onClick={() => addProductToCart(product._id)}
                    className="btn bg-main text-white w-100"
                    id={`addBtn${product._id}`}
                  >
                    Add to cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Render the pagination component */}
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          margin: "20px 0px",
        }}
      >
        <Pagination
          count={numberOfPages ? numberOfPages : 0}
          page={page}
          onChange={handleChange}
        />
      </Box>
    </>
  );
}
