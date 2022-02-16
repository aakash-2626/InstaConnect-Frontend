import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (imageURL) {
      try {
        axios.post(
          `${process.env.REACT_APP_BACKEND}/createpost`,
          {
            title,
            body,
            imageURL,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
          }
        );
        toast.success("Posted Successfully.", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
        setLoading(false);
        navigate("/");
      } catch (err) {
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
    }
    // eslint-disable-next-line
  }, [imageURL]);

  const postDetails = () => {
    setLoading(true);
    if (!title || !body || !image) {
      toast.error("Please fill all the fields.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      setLoading(false);
      return;
    }

    const url = `https://api.cloudinary.com/v1_1/aakash2626/image/upload`;
    let formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "instaconnect");
    formData.append("cloud_name", "aakash2626");

    axios
      .post(url, formData)
      .then(async (result) => {
        setImageURL(result.data.secure_url);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div
      className="card input-filled"
      style={{
        margin: "30px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text" id="inputGroup-sizing-default">
            Title
          </span>
        </div>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-label="Default"
        />
      </div>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text" id="inputGroup-sizing-default">
            Body
          </span>
        </div>
        <input
          type="text"
          className="form-control"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          aria-label="Default"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="formFile" className="form-label">
          Upload Image
        </label>
        <input
          className="form-control"
          onChange={(event) => setImage(event.target.files[0])}
          type="file"
          id="formFile"
        />
      </div>
      <button
        type="button"
        onClick={() => postDetails()}
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? "Submitting Post" : "Submit Post"}
      </button>
    </div>
  );
};

export default CreatePost;
