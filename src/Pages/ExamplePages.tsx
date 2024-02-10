import BlogsList from "../Components/BlogsList";
import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";

const ExamplePages = () => {
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
              BLOG TITLE
            </p>

            {/* Blog author and Date */}
            <p className=" d-flex gap-3 flex-row justify-content-end">
              <span>2024-02-09 17:47:22</span>
              <span className=" fw-medium">Praveen</span>
            </p>

            {/* Blog Image */}
            <p
              style={{ maxHeight: "100%", maxWidth: "100%" }}
              className=" d-flex justify-content-center align-items-center"
            >
              <img
                src="/images/ai.jpg"
                alt="blog_image"
                style={{ maxWidth: "50%", maxHeight: "50%" }}
              />
            </p>

            {/* Blog Content */}
            <div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti
              eum praesentium fugiat, dolor accusamus ipsum voluptate corporis
              illo hic ducimus ipsa, quibusdam neque et id molestiae
              voluptatibus iusto quasi eligendi? Quasi similique dicta neque,
              optio saepe quibusdam earum totam minima est consectetur nesciunt
              aspernatur doloribus tempora aperiam culpa, ipsam deserunt
              deleniti vel nam? Possimus placeat aliquid facere, ut eum eius.
              Delectus facilis debitis iusto. Beatae itaque dolorum blanditiis
              officiis autem molestiae, quidem eligendi eius totam error quis
              architecto consectetur eveniet nisi provident delectus sequi.
              Culpa, facilis totam. Voluptatem, error eveniet. Dolorem
              perspiciatis error voluptatibus ad esse rerum, nostrum quae
              temporibus incidunt quia facilis, similique inventore
              exercitationem dicta ipsam cum quis minima doloribus vel labore
              dignissimos molestiae sapiente facere aliquid? Quo! Aspernatur
              blanditiis eos voluptates illum? Fuga, est provident! Veniam
              laboriosam sit vel ratione illo quibusdam quos architecto
              obcaecati recusandae error corrupti exercitationem pariatur,
              consectetur ea! Dolor numquam eveniet voluptatem voluptate.
            </div>
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
    </main>
  );
};

export default ExamplePages;
