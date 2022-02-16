import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "./SignIn.css";
import { UserContext } from "../App";

const SignIn = () => {
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const PostData = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND}/signin`, {
        email,
        password,
      });
      localStorage.setItem("jwt", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      dispatch({ type: "USER", payload: response.data.user });
      toast.success("Signed In Successfully.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      navigate("/");
    } catch (err) {
      setLoading(false)
      toast.error(err.response.data.error, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.png"
              className="img-fluid"
              alt=""
            />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
              Sign In
            </p>
            <form>
              {/* Email input */}
              <div className="form-outline mb-4">
                <input
                  type="email"
                  id="form3Example3"
                  className="form-control form-control-lg"
                  placeholder="Enter a valid email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <label className="form-label" htmlFor="form3Example3">
                  Email address
                </label>
              </div>
              {/* Password input */}
              <div className="form-outline mb-3">
                <input
                  type="password"
                  id="form3Example4"
                  className="form-control form-control-lg"
                  placeholder="Enter password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <label className="form-label" htmlFor="form3Example4">
                  Password
                </label>
              </div>

              <div className="text-center text-lg-start mt-4 pt-2">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                  onClick={() => {
                    PostData();
                  }}
                  disabled={loading}
                >
                  {loading ? "Signing In" : "Sign In"}
                </button>
                <p className="small fw-bold mt-2 pt-1 mb-0">
                  Forgot Password?{" "}
                  <Link to="/resetPassword" className="link-danger">
                    Reset Password
                  </Link>
                </p>
                <p className="small fw-bold mt-2 pt-1 mb-0">
                  Don't have an account?{" "}
                  <Link to="/signup" className="link-danger">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
