import React from "react";
import { FallingLines } from "react-loader-spinner";

export default function LoadingScreen() {
  return (
    <>
      {/* Loading screen component */}
      <div className="vh-100 opacity-25 d-flex justify-content-center align-items-center">
        {/* FallingLines loader */}
        <FallingLines
          color="#d19002"
          width="200"
          visible={true}
          ariaLabel="falling-lines-loading"
        />
      </div>
    </>
  );
}
