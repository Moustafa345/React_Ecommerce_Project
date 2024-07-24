import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {DOMAIN} from "../../src/utils/constants";



export let CartContext = createContext(0); // Creating a context for the shopping cart

export default function CartContextProvider(props) {
  // Component for managing the shopping cart state and providing cart-related functions

  let userToken = localStorage.getItem("userToken"); // Getting the user token from local storage
  let headers = { token: userToken }; // Creating headers object with the user token

  const [cartItems, setCartItems] = useState(null); // State for storing the number of cart items
  const [cartId, setCartId] = useState(null); // State for storing the cart ID
  const [wishlistCount, SetWishlistCount] = useState(null); // State for storing the number of wishlist items
  const [wishlistProducts, setWishlistProducts] = useState(null); // State for storing the wishlist products
  const [cartProducts, setCartProducts] = useState(null); // State for storing the cart products

  // Function for adding a product to the cart
  async function addToCart(productId) {
    try {
      const { data } = await axios.post(
        `${DOMAIN}/api/v1/cart`,
        { productId: productId },
        { headers: headers }
      );
      await getLoggedUserCart(); // Refreshing the user's cart
      return data;
    } catch (error) {
      return error;
    }
  }

  // Function for getting the user's cart
  async function getLoggedUserCart() {
    try {
      const { data } = await axios.get(
        `${DOMAIN}/api/v1/cart`,
        { headers: { token: localStorage.getItem("userToken") } }
      );
      setCartItems(data.numOfCartItems); // Updating the number of cart items
      setCartId(data.data._id); // Updating the cart ID
      setCartProducts(data.data.products); // Updating the cart products
      return data;
    } catch (error) {
      if (error.response.data.statusMsg === "fail") {
        setCartProducts([]);
      }
      return error;
    }
  }

  // Function for updating the count of a product in the cart
  async function updateProductCount(productId, productCount) {
    try {
      const { data } = await axios.put(
        `${DOMAIN}/api/v1/cart/${productId}`,
        { count: productCount },
        { headers: headers }
      );
      return data;
    } catch (error) {
      return error;
    }
  }

  // Function for deleting a product from the cart
  async function deleteCartItem(productId) {
    try {
      const { data } = await axios.delete(
        `${DOMAIN}/api/v1/cart/${productId}`,
        { headers: headers }
      );
      await getLoggedUserCart(); // Refreshing the user's cart
      return data;
    } catch (error) {
      return error;
    }
  }

  // Function for removing the entire cart
  async function removeCart() {
    try {
      const { data } = await axios.delete(
        `${DOMAIN}/api/v1/cart`,
        { headers: headers }
      );
      setCartItems(0); // Resetting the number of cart items
      return data;
    } catch (error) {
      return error;
    }
  }

  // // Function for making an online payment
  // async function onlinePayment(cartId, shippingAddress) {
  //   try {
  //     const { data } = await axios.post(
  //       `${DOMAIN}/api/v1/orders/checkout-session/${cartId}?url=http://localhost:3000`,
  //       { shippingAddress: shippingAddress },
  //       { headers: headers }
  //     );
  //     console.log(data);
  //     return data;
  //   } catch (error) {
  //     console.log(error);
  //     return error;
  //   }
  // }

  // Function for removing a product from the wishlist
  async function removeWishlist(productId) {
    try {
      const { data } = await axios.delete(
        `${DOMAIN}/api/v1/wishlist/${productId}`,
        { headers }
      );
      if (data.status === "success") {
        SetWishlistCount(data.data.length);
        getWishlist(); // Refreshing the user's wishlist
        setTimeout(() => {
          toast.success("Product removed successfully from your wishlist"); // Showing a success notification
        }, 1000);
      }
      console.log(data);
      return data;
    } catch (error) {
      console.log("error", error);
      toast.error(error.response.data.statusMsg); // Showing an error notification
    }
  }

  // Function for getting the user's wishlist
  async function getWishlist() {
    try {
      const { data } = await axios.get(
        `${DOMAIN}/api/v1/wishlist`,
        { headers: { token: localStorage.getItem("userToken") } }
      );
      SetWishlistCount(data.count); // Updating the number of wishlist items
      setWishlistProducts(data.data); // Updating the wishlist products
      return data;
    } catch (error) {
      console.log("error", error);
    }
  }

  // Function for adding a product to the wishlist
  async function addWishlist(productId) {
    try {
      const { data } = await axios.post(
        `${DOMAIN}/api/v1/wishlist`,
        { productId },
        { headers }
      );
      SetWishlistCount(data.data.length); // Updating the number of wishlist items
      getWishlist(); // Refreshing the user's wishlist
      console.log(data.data.length);
      console.log(productId);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  // useEffect hook to load the user's wishlist and cart on component mount
  useEffect(() => {
    getWishlist();
    getLoggedUserCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        addToCart,
        getLoggedUserCart,
        updateProductCount,
        deleteCartItem,
        removeCart,
        cartItems,
        setCartItems,
        cartId,
        removeWishlist,
        getWishlist,
        wishlistCount,
        addWishlist,
        wishlistProducts,
        cartProducts,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
}
