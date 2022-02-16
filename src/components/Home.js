import "./Home.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../App";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND}/allposts`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        setData(response.data.posts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [data]);

  const likePost = (id) => {
    axios
      .put(`${process.env.REACT_APP_BACKEND}/like`, JSON.stringify({ postId: id }), {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        const newData = data.map((item) => {
          if (item._id === response.data._id) {
            return response.data;
          } else {
            return item;
          }
        });
        setData(newData);
      });
  };

  const unlikePost = (id) => {
    axios
      .put(`${process.env.REACT_APP_BACKEND}/unlike`, JSON.stringify({ postId: id }), {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        const newData = data.map((item) => {
          if (item._id === response.data._id) {
            return response.data;
          } else {
            return item;
          }
        });
        setData(newData);
      });
  };

  const makeComment = (text, postId) => {
    axios
      .put(`${process.env.REACT_APP_BACKEND}/comment`, JSON.stringify({ postId, text }), {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        const newData = data.map((item) => {
          if (item._id === response.data._id) {
            return response.data;
          } else {
            return item;
          }
        });
        setData(newData);
      });
  };

  const submitComment = (item, event) => {
    event.preventDefault();
    if (event.target[0].value === '') {
      return;
    }

    makeComment(event.target[0].value, item._id);
    event.target[0].value = "";
  };

  const deletePost = (postId) => {
    axios
      .delete(`${process.env.REACT_APP_BACKEND}/deletepost/${postId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        const newData = data.filter((item) => {
          return item._id !== response._id;
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <h5 style={{ padding: "5px" }}>
              <Link
                to={
                  item.postedBy._id !== state._id
                    ? `/profile/${item.postedBy._id}`
                    : "/profile"
                }
                style={{
                  color: "black",
                  marginLeft: "7px",
                  marginTop: "5px",
                  textDecoration: "none",
                }}
              >
                {item.postedBy.name}
              </Link>

              {item.postedBy._id === state._id && (
                <button
                  style={{ backgroundColor: "white", float: "right" }}
                  className="border-0"
                  onClick={() => deletePost(item._id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              )}
            </h5>
            <div className="card-image">
              <img
                alt=""
                className="img-fluid img-thumbnail"
                style={{ width: "100%", height: "400px" }}
                src={item.photo}
              />
            </div>
            <div className="card-body">
              {item.likes.includes(state._id) ? (
                <button
                  style={{ backgroundColor: "white", border: "0", padding: "0" }}
                  onClick={() => unlikePost(item._id)}
                >
                  <i className="bi bi-hand-thumbs-down"></i>
                </button>
              ) : (
                <button
                  style={{ backgroundColor: "white", border: "0" }}
                  onClick={() => likePost(item._id)}
                >
                  <i className="bi bi-hand-thumbs-up"></i>
                </button>
              )}

              <h6>{item.likes.length} likes</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>

              {item.comments.map((record) => {
                return (
                  <h6 key={record._id}>
                    <span style={{ fontWeight: "700" }}>
                      {record.postedBy.name}
                    </span>
                    <span style={{ fontWeight: "400" }}>
                      {" " + record.text}
                    </span>
                  </h6>
                );
              })}

              <form
                onSubmit={(event) => {
                  submitComment(item, event);
                }}
              >
                <input
                  type="text"
                  placeholder="Add a Comment"
                  style={{ width: "94%" }}
                />
                <button
                  style={{ marginLeft: "6px", backgroundColor: "white" }}
                  className="border-0"
                  type="submit"
                >
                  <i className="bi bi-send-fill"></i>
                </button>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
