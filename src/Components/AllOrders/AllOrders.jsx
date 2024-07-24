import React, { useContext, useEffect, useState } from "react";
import image from "../../assets/images/noorders.png";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import axios from "axios";
import { UserDataContext } from "../../Context/UserDataContext";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import {DOMAIN} from "../../utils/constants"

export default function AllOrders() {
  const [allOrders, setAllOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userToken } = useContext(UserDataContext);
  let decodedToken = jwtDecode(userToken);

  async function getALlOrders() {
    try {
      let { data } = await axios.get(
        `${DOMAIN}/api/v1/orders/user/${decodedToken.id}`
      );
      setAllOrders(data.reverse());
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getALlOrders();
  }, []);

  return (
    <>
      {/* Loading Screen */}
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="container my-4">
          <h2 className="fw-bolder text-main">Orders</h2>
        </div>
      )}

      {/* Order Details */}
      {allOrders.length > 0 ? (
        allOrders.map((order) => (
          <div key={order._id} className="container font-sm my-4">
            <div className="header d-flex bg-main-light text-black-50 text-center justify-content-between align-items-center mx-auto p-2 rounded-top border border-bottom-0">
              <div className="left-sub-header d-flex flex-wrap align-items-center">
                {/* Order Placed and Total */}
                <div className="me-3 fw-bold">
                  <p>
                    <span>Order Placed</span>
                    <br />
                    {order.createdAt.slice(0, 10)}
                  </p>
                  <p>
                    <span>Total</span>
                    <br />
                    EGP {order.totalOrderPrice}
                  </p>
                </div>
                {/* Ship To and Delivery Status */}
                <div className="fw-bold">
                  <p>
                    Ship To
                    <br />
                    <span className="text-primary text-uppercase">
                      {order.user.name}
                    </span>
                  </p>
                  {order.isDelivered ? (
                    <p className="ms-3">
                      <span>Delivery Status</span>
                      <br />
                      <small className="bg-main text-white rounded-2 p-1">
                        Delivered
                      </small>
                    </p>
                  ) : (
                    <p className="ms-3">
                      <span>Delivery Status</span>
                      <br />
                      <small className="bg-danger text-white rounded-2 p-1">
                        Not delivered yet
                      </small>
                    </p>
                  )}
                </div>
              </div>
              {/* Order ID and View Order Details */}
              <div className="right-sub-header">
                <p className="mb-1 fw-bold">
                  ORDER # {order._id.split(3, 3).join("-")}
                </p>
                <Link to={`/orderdetails/${order._id}`}>
                  <p className="text-primary fw-bold">View Order Details</p>
                </Link>
              </div>
            </div>

            {/* Order Items */}
            {order.cartItems.map((item) => (
              <div key={item._id} className="row mx-auto bg-white border ">
                <div className="col-12 col-md-3 col-lg-1 mt-3">
                  <img
                    className="w-100 rounded-3"
                    src={item.product.imageCover}
                    alt={item.product.title}
                  />
                </div>
                <div className="col-12 col-md-9 col-lg-11 mt-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-primary mb-1 fw-bold">
                        {item.product.title.slice(0, 80)}
                      </p>
                      <p className="mb-1 fw-bold">
                        Qty: <span className="fw-normal">{item.count}</span>
                      </p>
                      <p className="mb-1 fw-bold">
                        PRICE:{" "}
                        <span className="fw-normal">EGP {item.price}</span>
                      </p>
                      <p className="mb-1 fw-bold">
                        Brand:{" "}
                        <span className="fw-normal">
                          {item.product.brand.name}
                        </span>
                      </p>
                    </div>
                    <div className="d-none d-md-block">
                      {" "}
                      {/* Hide on small screens */}
                      <Link to={`/productdetails/${item.product._id}`}>
                        <p className="text-white bg-main p-2 rounded-2 text-center">
                          Reorder Item
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <div className="container d-flex justify-content-center align-items-center">
          <img className="mw-100 w-50 py-5" src={image} alt="no-orders" />
        </div>
      )}
    </>
  );
}
