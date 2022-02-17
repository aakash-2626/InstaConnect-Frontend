import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import CreatePost from "./components/CreatePost";
import UserProfile from "./components/UserProfile";
import { ToastContainer } from "react-toastify";
import { useEffect, createContext, useReducer, useContext } from "react";
import { reducer, initialState } from "./reducers/userReducer";
import FollowingUserPosts from "./components/FollowingUserPosts";
import ResetPassword from "./components/ResetPassword";
import SetNewPassword from "./components/SetNewPassword";

export const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      if (!window.location.pathname.includes("/reset") &&
        !window.location.pathname.includes("/signup")) {
        navigate("/signin");
      }
    }
    // eslint-disable-next-line
  }, []);
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/signin" element={<SignIn />} />
      <Route exact path="/signup" element={<Signup />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route exact path="/createPost" element={<CreatePost />} />
      <Route exact path="/profile/:userid" element={<UserProfile />} />
      <Route exact path="/myFollowingPosts" element={<FollowingUserPosts />} />
      <Route exact path="/resetPassword" element={<ResetPassword />} />
      <Route exact path="/resetPassword/:token" element={<SetNewPassword />} />
    </Routes>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <div>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss={false}
            rtl={false}
            draggable
            pauseOnHover={false}
          />
          <Navbar />
          <Routing />
        </div>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
