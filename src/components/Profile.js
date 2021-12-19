import "./Profile.css";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../App";

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const [image, setImage] = useState("");
  const [clearInput, setClearInput] = useState(Date.now());
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    axios
      .get("https://instaconnect1.herokuapp.com/myposts", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        setPics(response.data.posts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (image) {
      const url = `https://api.cloudinary.com/v1_1/aakash2626/image/upload`;
      let formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "instaconnect");
      formData.append("cloud_name", "aakash2626");

      axios
        .post(url, formData)
        .then(async (result) => {
          axios
            .put(
              "https://instaconnect1.herokuapp.com/updateimage/",
              JSON.stringify({ image: result.data.secure_url }),
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
              }
            )
            .then((res) => {
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, image: res.data.image })
              );
              dispatch({ type: "UPDATEPIC", payload: res.data.image });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // eslint-disable-next-line
  }, [image]);

  const updatePic = (file) => {
    setImage(file);
    setClearInput(Date.now());
  };

  return (
    <div>
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
              src={state ? state.image : ""}
            />
          </div>

          <div style={{ marginTop: "15px" }}>
            <h4>{state ? state.name : ""}</h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "108%",
              }}
            >
              <h6>{mypics.length} posts</h6>
              <h6>{state ? state.followers.length : 0} followers</h6>
              <h6>{state ? state.following.length : 0} following</h6>
            </div>

            <div className="mb-3">
              <label htmlFor="formFile" className="form-label">
                Update Profile Pic
              </label>
              <input
                className="form-control"
                onChange={(event) => updatePic(event.target.files[0])}
                type="file"
                id="formFile"
                key={clearInput}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="gallery" style={{marginLeft:"370px", maxWidth:"60%"}}>
        {mypics.map((item) => {
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
  );
};

export default Profile;
