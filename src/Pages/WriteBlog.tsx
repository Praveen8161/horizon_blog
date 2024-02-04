import React, { useState } from "react";
import NavBar from "../Components/NavBar";
import ReactQuill from "react-quill";
import { Delta } from "quill";
import "react-quill/dist/quill.snow.css";
import Form from "react-bootstrap/Form";

type blogDataType = {
  blog_title: string;
  blog_description: string;
};

const WriteBlog = () => {
  const [blogData, setBlogData] = useState<blogDataType>({
    blog_title: "",
    blog_description: "",
  });
  const [content, setContent] = useState<string>("");
  const [blogLen, setBlogLen] = useState<number>(0);

  const handleBlogData = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ): void => {
    setBlogData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditorChange = (
    con: string,
    // _ means the unused error will not be thrown
    _delta: Delta,
    _source: "user" | "api" | "silent",
    editor: ReactQuill.UnprivilegedEditor
  ): void => {
    setBlogLen(editor.getLength());
    if (editor.getLength() > 5000) return;
    setContent(() => con);
  };

  return (
    <div>
      <div>
        <NavBar />
      </div>
      <section className=" container">
        <div className="row">
          <div className=" col-7">
            {/* Blog Title */}
            <div>
              <Form.Label htmlFor="blog_title" className=" fw-bold">
                Blog Title:
              </Form.Label>
              <Form.Control
                type="text"
                id="blog_title"
                aria-describedby="blog_title"
                placeholder="Blog Title"
                name="blog_title"
                value={blogData.blog_title}
                onChange={(e) => handleBlogData(e)}
              />
              <>
                <Form.Text muted style={{ fontSize: "10px" }} className=" me-3">
                  Blog Title should not exceed 50 characters
                </Form.Text>
                <Form.Text
                  style={{ fontSize: "10px" }}
                  className={`${
                    blogData.blog_title.length > 50 ? " text-danger" : ""
                  }`}
                >
                  <span>{blogData.blog_title.length || 0} </span>
                  <span>/ 50</span>
                </Form.Text>
              </>
            </div>

            {/* Blog Description */}
            <div>
              <Form.Label htmlFor="blog_description" className=" fw-bold">
                Blog Description:
              </Form.Label>
              <Form.Control
                as="textarea"
                id="blog_description"
                aria-describedby="blog_description"
                placeholder="Blog Description"
                name="blog_description"
                value={blogData.blog_description}
                onChange={handleBlogData}
              />
              <>
                <Form.Text muted style={{ fontSize: "10px" }} className=" me-3">
                  Blog Description should not exceed 100 characters
                </Form.Text>
                <Form.Text
                  style={{ fontSize: "10px" }}
                  className={`${
                    blogData.blog_description.length > 100 ? " text-danger" : ""
                  }`}
                >
                  <span>{blogData.blog_description.length || 0} </span>
                  <span>/ 100</span>
                </Form.Text>
              </>
            </div>

            {/* Image Upload */}
            <div>
              <Form.Label className=" fw-bold">Blog Image</Form.Label>
              <Form.Control type="file" />
              <>
                <Form.Text muted style={{ fontSize: "10px" }} className=" me-3">
                  Image size should be less than 200kb and Image uploading is
                  not mandatory
                </Form.Text>
              </>
            </div>
            {/* React Quill Editor */}
            <div className="mt-3" style={{ minHeight: "500px" }}>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={handleEditorChange}
                style={{ height: "100%" }}
              />
              <>
                <Form.Text muted style={{ fontSize: "10px" }} className=" me-3">
                  Blog Should not be more than 5000 Characters
                </Form.Text>
                <Form.Text
                  style={{ fontSize: "10px" }}
                  className={`${blogLen > 5000 ? " text-danger" : ""}`}
                >
                  <span>{blogLen || 0} </span>
                  <span>/ 5000</span>
                </Form.Text>
              </>
            </div>
          </div>
          <div className=" col-5"></div>
        </div>
      </section>
    </div>
  );
};

export default WriteBlog;
