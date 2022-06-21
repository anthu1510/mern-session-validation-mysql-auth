import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-xxl-4 offset-xxl-4 mt-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
