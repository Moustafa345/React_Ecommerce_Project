import React, { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/freshcart-logo.svg";
import { CartContext } from "../../Context/CartContext";
import styles from "./Navbar.module.css";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

export default function Navbar({ userData, logOut, userName }) {
  const { cartItems, wishlistCount } = useContext(CartContext);

  // Style customization for the badge component
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  }));

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-light" id="navbar">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="logo" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {userData !== null ? (
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center">
                <li className="nav-item">
                  <Link className="nav-link fw-bold text-main" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-bold text-main" to="brands">
                    Brands
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-bold text-main" to="allorders">
                    Orders
                  </Link>
                </li>
              </ul>
            ) : null}

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              {/* Social media icons */}
              {userData === null ? (
                <>
                  {/* Login and Register links */}
                  <li className="nav-item">
                    <Link className="nav-link fw-bold text-main" to="login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link fw-bold text-main" to="register">
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {/* User profile dropdown */}
                  <li className="nav-item">
                    <div className="dropdown-center">
                      <button
                        className="border-0 bg-transparent"
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        <Stack direction="row" spacing={0}>
                          <span className="font-sm mx-1 mt-1 fw-bold text-main">
                            User
                          </span>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              color: "#fff",
                              backgroundColor: "#0aad0a",
                              borderBlockEndColor: "green",
                            }}
                            alt="Remy Sharp"
                            src="/"
                          >
                            {userName.slice(0, 1).toUpperCase()}
                          </Avatar>
                        </Stack>
                      </button>
                      <ul className="dropdown-menu">
                        {/* Profile link */}
                        <li>
                          <span className="dropdown-item">
                            <Link
                              className="nav-link text-main fw-bold"
                              to="/profile"
                            >
                              <i className="fa-solid fa-user"></i> Profile
                            </Link>
                          </span>
                        </li>
                        {/* Logout link */}
                        <li>
                          <Link className="dropdown-item">
                            <span
                              onClick={logOut}
                              className="cursor-pointer nav-link fw-bold text-muted"
                            >
                              <i className="fa-solid fa-user"></i> Logout
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </li>

                  {/* Wishlist Icon */}
                  <li className="nav-item me-2">
                    <Link className="nav-link" to="wishlist">
                      <div style={{ position: "relative" }}>
                        <span className="font-sm mx-1 fw-bold text-main">
                          Wishlist
                        </span>
                        <i className="fa-regular fa-heart fs-4 text-main"></i>
                        <StyledBadge
                          badgeContent={wishlistCount}
                          color="secondary"
                          style={{ position: "absolute", top: -5, right: -4 }}
                        ></StyledBadge>
                      </div>
                    </Link>
                  </li>

                  {/* Cart Icon */}
                  <li className="nav-item navCart mx-2">
                    <Link className={`${styles.custom} nav-link`} to="cart">
                      <IconButton className="p-0 " aria-label="cart">
                        <span className="font-sm mx-1 fw-bold text-main">
                          Cart
                        </span>
                        <StyledBadge
                          badgeContent={cartItems}
                          max={10}
                          color="secondary"
                          className="bg-main rounded-circle p-1 text-white border border-white"
                        >
                          <ShoppingCartIcon />
                        </StyledBadge>
                      </IconButton>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
