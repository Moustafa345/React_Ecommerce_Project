import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

export default function MainSlider() {
  return (
    <>
      <div className="row g-0 py-3 cursor-pointer">
        <div className="col-md-12">
          <OwlCarousel
            className="owl-theme"
            items={1}
            loop
            autoplay={true}
            autoplayTimeout={3000}
            autoplayHoverPause={true}
            autoplaySpeed={2000}
            smartSpeed={2000}
          >
            {/* Slide 1 */}
            <img
              className="w-100"
              height={400}
              src={require("../../assets/images/slider-image-1.jpeg")}
              alt=""
            />

            {/* Slide 2 */}
            <img
              className="w-100"
              height={400}
              src={require("../../assets/images/slider-image-2.jpeg")}
              alt=""
            />

            {/* Slide 3 */}
            <img
              className="w-100"
              height={400}
              src={require("../../assets/images/slider-image-3.jpeg")}
              alt=""
            />
          </OwlCarousel>
        </div>
      </div>
    </>
  );
}
