import { NavigateFunction, useNavigate } from "react-router-dom";
import BlogCards from "../Components/BlogCards";
import BlogsList from "../Components/BlogsList";
import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";
import { BlogState } from "../Context/ContextAPI";

const HomePage = () => {
  const blogState = BlogState();

  const navigate: NavigateFunction = useNavigate();

  return (
    <main
      className=" overflow-hidden custom_background "
      style={{ maxWidth: "100vw" }}
    >
      <header>
        <NavBar />
      </header>
      <section className="pt-2 px-sm-5 container-fluid overflow-hidden">
        <h2 className="fs-3">Horizon: unleash your creativity</h2>

        {/* Top Row */}
        <div className="row">
          {/* Top Banner Image */}
          <div
            className="col-12 col-md-6 bg-white rounded-3 overflow-hidden px-0 border border-black-subtle"
            style={{ height: "55vh", minHeight: "55vh", cursor: "pointer" }}
            onClick={() => navigate("staffpick")}
          >
            <img
              src={
                blogState?.blogData[0].blog_image ||
                "/images/placeholderImage.svg"
              }
              alt=""
              className="object-fit-cover w-100"
              style={{ height: "75%" }}
            />
            <div
              className=" d-flex flex-column gap-2 text-black px-3 py-2"
              data-name="body"
            >
              <span className=" fw-medium fs-6">
                {blogState?.blogData[0].blog_title || "Artificial Intelligence"}
              </span>
              <h5 className=" fs-6 fw-light">
                {blogState?.blogData[0].blog_description ||
                  "Active learning: How to accelerate AI model training"}
              </h5>
            </div>
          </div>

          {/* TOP Side Blog List */}
          <div
            className="col-12  col-md-5 mx-auto mt-3 mt-md-0 d-flex justify-content-center flex-column align-items-center mb-5"
            style={{ maxHeight: "60vh" }}
          >
            <BlogsList />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="row position-relative py-3">
          <div className="col custom_grid--layout gap-5">
            {blogState?.blogData.length &&
              blogState.blogData.map((val, idx) => (
                <BlogCards values={val} key={idx + val.blog_title} />
              ))}
          </div>
        </div>

        {/*  */}
      </section>
      <Footer />
    </main>
  );
};

export default HomePage;
