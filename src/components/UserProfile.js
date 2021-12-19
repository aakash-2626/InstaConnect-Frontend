import "./Profile.css";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const [userProfile, setProfile] = useState(null);
  const [showFollow, setShowFollow] = useState();
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();

  useEffect(() => {
    if (state && state.following.includes(userid)) {
      setShowFollow(false);
    } else {
      setShowFollow(true);
    }
    axios
      .get(`https://instaconnect1.herokuapp.com/user/${userid}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        setProfile(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line
  }, []);

  const followUser = () => {
    axios
      .put(
        `https://instaconnect1.herokuapp.com/follow`,
        JSON.stringify({ followId: userid }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
      .then((res) => {
        dispatch({
          type: "UPDATE",
          payload: {
            following: res.data.following,
            followers: res.data.followers,
          },
        });
        localStorage.setItem("user", JSON.stringify(res.data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, res.data._id],
            },
          };
        });
        setShowFollow(false);
      });
  };

  const unfollowUser = () => {
    axios
      .put(
        `https://instaconnect1.herokuapp.com/unfollow`,
        JSON.stringify({ unfollowId: userid }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
      .then((res) => {
        dispatch({
          type: "UPDATE",
          payload: {
            following: res.data.following,
            followers: res.data.followers,
          },
        });
        localStorage.setItem("user", JSON.stringify(res.data));
        setProfile((prevState) => {
          const newFollowers = prevState.user.followers.filter(
            (item) => item !== res.data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollowers,
            },
          };
        });
        setShowFollow(true);
      });
  };

  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "550px", margin: "10px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                  marginBottom: "5px",
                }}
                alt=""
                src={userProfile.user.image}
              />
            </div>
            <div style={{ marginTop: "15px" }}>
              <h4>{userProfile.user.name}</h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>{userProfile.posts.length} posts</h6>
                <h6>{userProfile.user.followers.length} followers</h6>
                <h6>{userProfile.user.following.length} following</h6>
              </div>
              {showFollow ? (
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={() => followUser()}
                >
                  Follow
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={() => unfollowUser()}
                >
                  Following
                </button>
              )}
            </div>
          </div>

          <div className="gallery">
            {userProfile.posts.map((item) => {
              return (
                <img
                  className="item"
                  style={{ height: "170px", width: "250px" }}
                  key={item._id}
                  alt={item.title}
                  src={item.photo}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2 className="display-2">Loading ...</h2>
      )}
    </>
  );
};

export default UserProfile;
