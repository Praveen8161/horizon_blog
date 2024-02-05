import { BlogState } from "../Context/ContextAPI";

const BlogsList = () => {
  const blogState = BlogState();
  return (
    <>
      <h4 className=" text-center fs-5">Staff Picks</h4>
      <div className="d-flex flex-md-column flex-row flex-wrap flex-md-nowrap gap-2 justify-content-md-start align-items-center  justify-content-center  overflow-y-auto custom_scrollbar overflow-x-hidden ">
        {/* Blogs Indivizuals */}
        {blogState?.blogData?.length &&
          blogState.blogData.map((val, idx) => (
            <div
              className=" d-flex flex-column gap-1 align-self-start"
              style={{
                width: "clamp(150px, 160px + 7vw ,250px)",
                fontSize: "14px",
              }}
              key={val.heading + idx}
            >
              <h5 style={{ cursor: "pointer" }} className="fs-6">
                {val.heading}
              </h5>
              <p
                className="align-self-center"
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                  overflow: "hidden",
                }}
              >
                {val.content}
              </p>
            </div>
          ))}
      </div>
    </>
  );
};

export default BlogsList;
