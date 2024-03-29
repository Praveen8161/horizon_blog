import { FC, useEffect, useState } from "react";
import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";
import { API } from "../helpers/API";
import { BlogState } from "../Context/ContextAPI";
import { singleBlogPostType, toastType } from "../helpers/Types";
import BlogsList from "../Components/BlogsList";
import { NavigateFunction, useNavigate } from "react-router-dom";
import UserBlogsList from "../Components/UserBlogsList";
import { Toast } from "react-bootstrap";

type serverResponse =
  | {
      acknowledged: false;
      error: string;
    }
  | {
      acknowledged: true;
      blogList: singleBlogPostType[];
    };

const UserBlogs: FC = () => {
  const blogState = BlogState();
  const [toast, setToast] = useState<toastType>({
    show: false,
    background: "danger",
    message: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    // Get a user blogs list if it is not available

    if (!blogState?.userBlogList[0].blog_id && blogState?.loggedUser.token) {
      const userBlogListAPI = `${API}/user/blogs`;

      fetch(userBlogListAPI, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${blogState?.loggedUser.token}`,
        },
      })
        .then((response) => response.json() as Promise<serverResponse>)
        .then((data: serverResponse) => {
          if (data.acknowledged) {
            blogState.setUserBlogList(data.blogList);
          }
        })
        .catch(() => {
          setToast(() => ({
            show: true,
            background: "danger",
            message: "Error Loading Blogs try again later",
          }));
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [blogState?.loggedUser.user_id]);

  if (loading) {
    return (
      <main className=" container-fluid d-flex justify-content-center align-items-center">
        Loading ...
      </main>
    );
  }

  //
  return (
    <main className="position-relative">
      {/* Nav Bar */}
      <div>
        <NavBar />
      </div>
      {/* User Blog List section */}
      <section style={{ minHeight: "100vh" }} className=" mt-3 container">
        <div className=" row">
          <div className=" col-md-7">
            {blogState?.userBlogList[0].blog_id ? (
              <UserBlogsList />
            ) : (
              <div
                className=" d-flex flex-column justify-content-center align-items-center"
                style={{ minHeight: "100%" }}
              >
                <p className=" fw-semibold">No Blogs Found</p>
                <p>
                  Create a{" "}
                  <span
                    className=" text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/write")}
                  >
                    New Blog
                  </span>
                </p>
              </div>
            )}
          </div>

          <div
            className=" col-md-5 d-none d-md-flex flex-column justify-content-center align-items-center"
            style={{ maxHeight: "60vh" }}
          >
            <BlogsList />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <Footer />
      </footer>

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
        className=" position-fixed p-2 z-3 end-0 bottom-0 mb-5 me-2 text-white"
      >
        <Toast.Body>{toast.message}</Toast.Body>
      </Toast>
    </main>
  );
};

export default UserBlogs;
