import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { BlogState } from "../Context/ContextAPI";
import { API } from "../helpers/API";
import NavBar from "../Components/NavBar";
import BlogsList from "../Components/BlogsList";
import { singleBlogPostType, toastType } from "../helpers/Types";
import parse from "html-react-parser";
import Footer from "../Components/Footer";
import { Toast } from "react-bootstrap";

type serverResponse =
  | {
      acknowledged: false;
      error: string;
    }
  | {
      acknowledged: true;
      blog: singleBlogPostType;
    };

const ShowBlog = () => {
  const blogState = BlogState();
  const [toast, setToast] = useState<toastType>({
    show: false,
    background: "danger",
    message: "",
  });

  const [loading, setLoading] = useState<boolean>(true);

  const navigate: NavigateFunction = useNavigate();

  // Get Id from Params
  const { id } = useParams();
  useEffect(() => {
    const numberId: number = Number(id);
    if (blogState?.selectedBlog.blog_id !== numberId) {
      setLoading(true);

      const getSingleBlogAPI = `${API}/blog/single/${id}`;
      fetch(getSingleBlogAPI, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json() as Promise<serverResponse>)
        .then((data: serverResponse) => {
          if (data.acknowledged) {
            blogState?.setSelectedBlog(data.blog);
          } else {
            setToast(() => ({
              show: true,
              background: "danger",
              message: "Unknown blog URL ",
            }));

            setTimeout(() => {
              navigate("/", { replace: true });
            }, 3000);
          }
        })
        .catch(() => {
          setToast(() => ({
            show: true,
            background: "danger",
            message: "Error Loading blog try again later",
          }));
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setToast(() => ({
      show: true,
      background: "info",
      message:
        "Image may or may not available because images are stored in Render's server instance not on the actual server",
    }));
  }, []);

  if (loading) {
    return (
      <div
        className="container d-flex align-items-center justify-content-center flex-column"
        style={{
          minHeight: "100vh",
          minWidth: "100vw",
          maxHeight: "100vh",
          maxWidth: "100vw",
        }}
      >
        <div className=" fs-3 fw-bold">Loading...</div>
        <div>Only At Start It takes some time to start the backend server</div>
        <div>Please wait </div>
      </div>
    );
  }

  // Main Return code
  return (
    <main>
      {/* Navbar */}
      <div>
        <NavBar />
      </div>

      {/* Blog Container */}
      <section className="container container-lg-fluid mt-3">
        <div className="row">
          {/* Show Blog */}
          <div className=" col-12 col-lg-7 ">
            {/* Blog Title */}
            <p className=" fw-bold fs-3 text-center" style={{}}>
              {blogState?.selectedBlog.blog_title.toUpperCase()}
            </p>

            {/* Blog author and Date */}
            <p className=" d-flex gap-3 flex-row justify-content-end">
              <span>
                {blogState?.selectedBlog.published_date
                  ?.split(".")[0]
                  .replace("T", " ")}
              </span>
              <span className=" fw-medium">
                {blogState?.selectedBlog.author}
              </span>
            </p>

            {/* Blog Image */}
            {blogState?.selectedBlog.blog_image && (
              <p
                style={{ maxHeight: "100%", maxWidth: "100%" }}
                className=" d-flex justify-content-center align-items-center"
              >
                <img
                  src={`${API}/${blogState.selectedBlog.blog_image}`}
                  alt="blog_image"
                  style={{ maxWidth: "50%", maxHeight: "50%" }}
                />
              </p>
            )}

            {/* Blog Content */}
            <div>{parse(blogState?.selectedBlog.blog_content || "")}</div>
          </div>

          {/* Show Other Blog List  */}
          <div
            className=" col-lg-5 d-none d-lg-flex flex-column justify-content-center align-items-center"
            style={{ maxHeight: "60vh" }}
          >
            <BlogsList />
          </div>
        </div>
      </section>

      {/* footer */}
      <div className=" mt-5">
        <Footer />
      </div>

      {/* Toast */}
      <Toast
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            show: false,
          }))
        }
        show={toast.show}
        delay={3000}
        bg={toast.background}
        autohide
        className=" position-absolute p-2 end-0 bottom-0 mb-5 me-2 text-white"
      >
        <Toast.Body>{toast.message}</Toast.Body>
      </Toast>
    </main>
  );
};

export default ShowBlog;
