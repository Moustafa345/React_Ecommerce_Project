import {
  HashRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";
import Cart from "./Components/Cart/Cart";
import Brands from "./Components/Brands/Brands";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import NotFound from "./Components/NotFound/NotFound";
import jwtDecode from "jwt-decode";
import ProductDetails from "./Components/ProductDetails/ProductDetails";
import BrandDetails from "./Components/BrandDetails/BrandDetails";
import CartContextProvider from "./Context/CartContext";
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import ResetPassword from "./Components/ForgotPassword/ResetPassword";
import Profile from "./Components/Profile/Profile";
import ChangeName from "./Components/Profile/ChangeName";
import ChangeEmail from "./Components/Profile/ChangeEmail";
import ChangeNumber from "./Components/Profile/ChangeNumber";
import UserContextProvider from "./Context/UserDataContext";
import ChangePassword from "./Components/Profile/ChangePassword";
import EditAddresses from "./Components/Profile/EditAddresses";
import AddAddress from "./Components/Profile/AddAddress";
import AllOrders from "./Components/AllOrders/AllOrders";
import OrderDetails from "./Components/OrderDetails/OrderDetails";
import CashPayment from "./Components/CashPayment/CashPayment";
import WishList from "./Components/WishList/WishList";
import CheckoutAll from "./Components/CheckoutAll/CheckoutAll";

function App() {
  useEffect(() => {
    if (localStorage.getItem("userToken") !== null) {
      saveUserData();
    }
  }, []);

  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState(null);

  function ProtectRoute({ children }) {
    if (localStorage.getItem("userToken") == null) {
      return <Navigate to="/" />;
    } else {
      return children;
    }
  }

  function saveUserData() {
    let encodedToken = localStorage.getItem("userToken");
    let decodedToken = jwtDecode(encodedToken);
    setUserName(decodedToken.name);
    setUserData(decodedToken);
  }

  return (
    <>
      <CartContextProvider>
        <Toaster />
        <UserContextProvider>
          <HashRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <Layout userData={userData} setUserData={setUserData} userName={userName} />
                }
              >
                <Route index element={<Home userData={userData} />} />
                <Route
                  path="cart"
                  element={
                    <ProtectRoute>
                      <Cart />
                    </ProtectRoute>
                  }
                />
                <Route
                  path="wishlist"
                  element={
                    <ProtectRoute>
                      <WishList />
                    </ProtectRoute>
                  }
                />
                <Route
                  path="checkoutall"
                  element={
                    <ProtectRoute>
                      <CheckoutAll />
                    </ProtectRoute>
                  }
                />
                <Route
                  path="cashpayment"
                  element={
                    <ProtectRoute>
                      <CashPayment />
                    </ProtectRoute>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <ProtectRoute>
                      <Profile />
                    </ProtectRoute>
                  }
                />
                <Route
                  path="changename"
                  element={
                    <ProtectRoute>
                      <ChangeName setUserName={setUserName} />
                    </ProtectRoute>
                  }
                />
                <Route
                  path="changeemail"
                  element={
                    <ProtectRoute>
                      <ChangeEmail />
                    </ProtectRoute>
                  }
                />
                <Route
                  path="changenumber"
                  element={
                    <ProtectRoute>
                      <ChangeNumber />
                    </ProtectRoute>
                  }
                />
                <Route
                  path="changepassword"
                  element={
                    <ProtectRoute>
                      <ChangePassword />
                    </ProtectRoute>
                  }
                />
                <Route
                  path="addaddress"
                  element={
                    <ProtectRoute>
                      <AddAddress />
                    </ProtectRoute>
                  }
                />
                <Route
                  path="editaddresses"
                  element={
                    <ProtectRoute>
                      <EditAddresses />
                    </ProtectRoute>
                  }
                />
                <Route path="login" element={<Login saveUserData={saveUserData} />} />
                <Route path="forgotpassword" element={<ForgotPassword />} />
                <Route path="resetpassword" element={<ResetPassword />} />
                <Route path="register" element={<Register />} />
                <Route path="brands" element={<Brands />} />
                <Route
                  path="productdetails/:id"
                  element={
                    <ProtectRoute>
                      <ProductDetails />
                    </ProtectRoute>
                  }
                />
                <Route
                  path="branddetails/:id"
                  element={
                    <ProtectRoute>
                      <BrandDetails />
                    </ProtectRoute>
                  }
                />
                <Route
                  path="allorders"
                  element={
                    <ProtectRoute>
                      <AllOrders />
                    </ProtectRoute>
                  }
                />
                <Route
                  path="orderdetails/:id"
                  element={
                    <ProtectRoute>
                      <OrderDetails />
                    </ProtectRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </HashRouter>
        </UserContextProvider>
      </CartContextProvider>
    </>
  );
}

export default App;
