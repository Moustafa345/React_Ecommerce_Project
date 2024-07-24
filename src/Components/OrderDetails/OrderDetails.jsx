import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../../Context/UserDataContext";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import {DOMAIN} from "../../utils/constants";

export default function OrderDetails() {
  const { id } = useParams();
  const { headers } = useContext(UserDataContext);
  const [orders, setOrders] = useState(null);

  async function getOrderDetails() {
    try {
      // Fetch order details from the API
      const { data } = await axios.get(
        `${DOMAIN}/api/v1/orders/${id}`,
        { headers }
      );
      const dataArray = Object.values(data);
      setOrders(dataArray);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // Fetch order details when the component mounts
    getOrderDetails();
  }, []);

  return (
    <>
      <div className="container my-4">
        <h2 className="fw-bolder text-main">Order Details</h2>
      </div>

      {orders ? (
        orders.map((order) => (
          <div
            key={order._id}
            className="container bg-white border border-bottom-0 rounded-3 my-4"
          >
            <div className="row">
              <div className="col-lg-4 mt-3">
                {/* Shipping address */}
                <h5 className="fw-bold text-main">SHIPPING ADDRESS</h5>
                <h6 className="fw-bold">Name</h6>
                <p>{order.user.name}</p>
                <h6 className="fw-bold">Email</h6>
                <p>{order.user.email}</p>
                <h6 className="fw-bold">Phone Number</h6>
                <p>{order.user.phone}</p>
              </div>

              <div className="col-lg-4 mt-3">
                {/* Order information */}
                <h5 className="fw-bold text-main">ORDER INFORMATION</h5>
                <h6 className="fw-bold">Payment Method</h6>
                <p>{order.paymentMethodType}</p>
                <h6 className="fw-bold">Order Date</h6>
                <p>
                  {order.paidAt
                    ? order.paidAt.slice(0, 10)
                    : order.createdAt?.slice(0, 10)}
                </p>
                <h6 className="fw-bold mb-3">Payment Status</h6>
                {/* Display payment status */}
                {order.isPaid ? (
                  <small className="bg-main text-white rounded-2 py-2 px-5">
                    Paid
                  </small>
                ) : (
                  <small className="bg-danger text-white rounded-2 py-1 px-4">
                    Not Paid
                  </small>
                )}
              </div>

              <div className="col-lg-4 mt-3">
                {/* Order summary */}
                <h5 className="fw-bold text-main">ORDER SUMMARY</h5>
                <h6 className="fw-bold">Tax Price</h6>
                <p>EGP {order.taxPrice}</p>
                <h6 className="fw-bold">Shipping Price</h6>
                <p>EGP {order.shippingPrice}</p>
                <h6 className="fw-bold">Total Price</h6>
                <p>EGP {order.totalOrderPrice}</p>
              </div>
            </div>

            <div className=" my-4">
              {/* Order items */}
              <div className="header d-flex bg-main-light text-black-50  justify-content-between align-items-center p-3 rounded-top border border-bottom-0  d-none d-md-block">
                <div className="sub-header">
                  <h5 className="h6 fw-bold">
                    ORDER # {order._id.split(3, 3).join("-")} |{" "}
                    {order.isDelivered ? (
                      <small className="bg-main text-white rounded-2 p-1">
                        Delivered
                      </small>
                    ) : (
                      <small className="bg-danger text-white rounded-2 p-1">
                        Not delivered yet
                      </small>
                    )}{" "}
                  </h5>
                </div>
              </div>

              {/* Render individual order items */}
              {order?.cartItems.map((item) => (
                <div
                  key={item._id}
                  className="row bg-white border-bottom border-top"
                >
                  <div className="col-md-4 col-lg-1 mt-3">
                    {/* Item image */}
                    <img
                      className="w-100 rounded-3"
                      src={item.product.imageCover}
                      alt={item.product.title}
                    />
                  </div>
                  <div className="col-md-8 col-lg-11 mt-3 ">
                    <div className="d-flex justify-content-between align-items-center ">
                      <div>
                        {/* Item details */}
                        <p className="mb-1 fw-bold">
                          Title:{" "}
                          <span className="fw-normal">
                            {item.product.title}
                          </span>{" "}
                        </p>
                        <p className="mb-1 fw-bold">
                          Qty: <span className="fw-normal">{item.count}</span>
                        </p>
                        <p className="mb-1 fw-bold">
                          Price:{" "}
                          <span className="fw-normal">EGP {item.price}</span>{" "}
                        </p>
                        <p className="mb-1 fw-bold">
                          Category:{" "}
                          <span className="fw-normal">
                            {item.product.category.name}
                          </span>{" "}
                        </p>
                        <p className="mb-1 fw-bold">
                          Brand:{" "}
                          <span className="fw-normal">
                            {item.product.brand.name}
                          </span>
                        </p>
                      </div>
                      <div className="d-none d-md-block">
                        {/* Link to reorder product */}
                        <Link to={`/productdetails/${item.product._id}`}>
                          <p className="text-white bg-main p-2 rounded-2">
                            Reorder
                          </p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <LoadingScreen />
      )}
    </>
  );
}
