import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BlogState } from "../Context/ContextAPI";
import { API } from "../helpers/API";
import NavBar from "../Components/NavBar";
import BlogsList from "../Components/BlogsList";
import { singleBlogPostType } from "../helpers/Types";
import parse from "html-react-parser";
import Footer from "../Components/Footer";

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

  const [loading, setLoading] = useState<boolean>(true);

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
            console.log(data);
          }
          setLoading(false);
        })
        .catch((err) => console.log(err));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div
        className="container d-flex align-items-center justify-content-center"
        style={{
          minHeight: "100vh",
          minWidth: "100vw",
          maxHeight: "100vh",
          maxWidth: "100vw",
        }}
      >
        <div className=" fs-3 fw-bold">Loading...</div>
      </div>
    );
  }
  return (
    <div>
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
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default ShowBlog;
