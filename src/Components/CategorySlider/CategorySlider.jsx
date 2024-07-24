import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import {DOMAIN} from "../../utils/constants";

export default function CategorySlider() {
  const [categories, setCategories] = useState([]);

  // Fetch categories from the server
  async function getCategories() {
    let { data } = await axios.get(
      `${DOMAIN}/api/v1/categories`
    );
    setCategories(data.data);
  }

  useEffect(() => {
    // Fetch categories when the component mounts
    getCategories();
  }, []);

  // Settings for the slider component
  let settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 7,
    slidesToScroll: 5,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <>
      <div className="container">
        <h3 className="h5 fw-bolder my-2">Shop Popular Categories</h3>
        <div className="row">
          <div className="col">
            {/* Slider component */}
            <Slider {...settings}>
              {/* Render each category */}
              {categories.map((category) => (
                <div key={category._id}>
                  <img
                    className="w-100 my-4 cursor-pointer"
                    height={200}
                    src={category.image}
                    alt=""
                  />
                  <h2 className="h6 pt-2 text-center">{category.name}</h2>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
}
