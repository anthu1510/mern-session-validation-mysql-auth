import React from "react";

const Login = () => {
  return (
    <div className="card">
      <div className="card-header">Login</div>
      <div className="card-body">
        <form action="">
          <div className="mb-3">
            <label htmlFor="">Email</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Email"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
            />
          </div>
          <div className="mb-3">
            <button className="btn btn-info">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
