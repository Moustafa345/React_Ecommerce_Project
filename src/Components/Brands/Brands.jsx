import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { useNavigate, Link } from "react-router-dom";
import {DOMAIN} from "../../utils/constants";

export default function Brands() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getBrands() {
      try {
        const { data } = await axios.get(
          `${DOMAIN}/api/v1/brands`
        );
        setBrands(data.data);
        setLoading(false);
      } catch (error) {
        console.log("Error: ", error);
        navigate("/");
      }
    }
    getBrands();
  }, [navigate]);

  return (
    <>
      {/* Check if loading */}
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="row py-5 text-center align-items-center gy-4">
          {/* Render static content */}
          <div className="col-md-3">
            <h2>Our Brands</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. A
              pariatur doloribus repellendus neque laudantium suscipit veniam
              error sequi quas harum.
            </p>
          </div>
          {/* Render brands */}
          {brands.map((brand) => (
            <div className="col-md-3 cursor-pointer" key={brand._id}>
              <Link to={`/branddetails/${brand._id}`}>
                <img className="w-100" src={brand.image} alt={brand.title} />
                <h3 className="fw-bold h6 text-muted">{brand.name}</h3>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
