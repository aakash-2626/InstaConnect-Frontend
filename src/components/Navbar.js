import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import "./Navbar.css";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  let navigate = useNavigate();

  const LogOut = () => {
    localStorage.clear();
    dispatch({ type: "CLEAR" });
    navigate("/signin");
    toast.success("Log out Successful.", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  };

  const renderList = () => {
    if (state) {
      return [
        <li key="search" className="nav-item">
          <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            className="btn btn-light"
            onClick={() => {}}
          >
            <i className="bi bi-search searchIcon"></i>
          </button>
        </li>,
        <li key="h" className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/">
            Home
          </Link>
        </li>,
        <li key="myfollowing" className="nav-item">
          <Link
            className="nav-link active"
            aria-current="page"
            to="/myFollowingPosts"
          >
            My Followings Posts
          </Link>
        </li>,
        <li key="profile" className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/profile">
            Profile
          </Link>
        </li>,
        <li key="cp" className="nav-item">
          <Link
            className="nav-link active"
            aria-current="page"
            to="/createPost"
          >
            Create Post
          </Link>
        </li>,
        <li key="logout" className="nav-item">
          <button type="button" className="btn" onClick={() => LogOut()}>
            Log out
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="in" className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/signin">
            Sign In
          </Link>
        </li>,
        <li key="up" className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/signup">
            Signup
          </Link>
        </li>,
      ];
    }
  };

  const searchUsers = (query) => {
    setSearch(query);
    if (query.length !== 0) {
      axios
        .post("https://instaconnect1.herokuapp.com/search-users", JSON.stringify({ query }), {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setUserDetails(res.data.user);
        });
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand navTitle" to={state ? "/" : "/signin"}>
          InstaConnect
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ padding: "1px" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav">{renderList()}</ul>
        </div>
      </div>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Search Users
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setSearch("")}
              ></button>
            </div>
            <input
              type="text"
              className="form-control"
              style={{
                marginTop: "10px",
                width: "85%",
                marginLeft: "35px",
                marginBottom: "10px",
              }}
              value={search}
              onChange={(event) => searchUsers(event.target.value)}
              placeholder="Search"
            />

            <ul className="list-group">
              {userDetails.map((item, idx) => {
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      item._id === state._id
                        ? navigate("/profile")
                        : navigate(`/profile/${item._id}`);
                    }}
                    className="list-group-item"
                  >
                    {item.name}
                  </button>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
