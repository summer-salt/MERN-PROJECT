// Login.jsx (Improved Bootstrap version)
import React from 'react';
import Form from '../../components/shared/Form/Form';
import { useSelector } from 'react-redux';
import { DNA } from 'react-loader-spinner';
import toast from 'react-hot-toast';

const Login = () => {
  const { loading, error } = useSelector((state) => state.auth);
  if (error) toast.error(error);

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "#f3f4f6" }}
    >
      <div className="container">
        <div className="row gx-0 shadow-lg rounded-4 overflow-hidden">
          
          {/* LEFT BANNER */}
          <div
            className="col-md-6 d-none d-md-block position-relative"
            style={{ minHeight: "550px" }}
          >
            <img
              src="./assets/banner1.jpg"
              alt="banner"
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.35), rgba(0,0,0,0.05))",
              }}
            ></div>
          </div>

          {/* RIGHT SIDE LOGIN CARD */}
          <div className="col-md-6 bg-white d-flex align-items-center">
            <div className="p-5 w-100">
              
              {/* Logo + Heading */}
              <div className="text-center mb-4">
                <img
                  src="./assets/logo.png"
                  alt="logo"
                  style={{ height: "70px" }}
                />

                <h2
                  className="mt-3 mb-1 fw-bold"
                  style={{ fontSize: "1.85rem", color: "#1e1e2f" }}
                >
                  Welcome Back
                </h2>

                <p className="text-muted" style={{ fontSize: "0.95rem" }}>
                  Login to continue to your dashboard
                </p>
              </div>

              {/* LOADER OR FORM */}
              {loading ? (
                <div className="d-flex justify-content-center py-5">
                  <DNA visible={true} height="160" width="160" />
                </div>
              ) : (
                <Form
                  formTitle="Log In"
                  submitBtn="Log In"
                  formType="login"
                />
              )}

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
