import React, { FC, useRef, useState } from "react";
import NavBar from "../Components/NavBar";
import ReactQuill from "react-quill";
import { Delta } from "quill";
import "react-quill/dist/quill.snow.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { IoMdCloseCircle } from "react-icons/io";
import { API } from "../helpers/API.ts";
import { BlogState } from "../Context/ContextAPI.tsx";
import BlogsList from "../Components/BlogsList.tsx";
import { singleBlogPostType, toastType } from "../helpers/Types.ts";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Spinner, Toast } from "react-bootstrap";
import Footer from "../Components/Footer.tsx";

type blogDataType = {
  blog_title: string;
  blog_description: string;
  blog_content: string;
};

type serverResponse =
  | {
      acknowledged: false;
      error: string;
    }
  | {
      acknowledged: true;
      blog: singleBlogPostType;
    };

const WriteBlog: FC = () => {
  const blogState = BlogState();
  const [toast, setToast] = useState<toastType>({
    show: false,
    background: "danger",
    message: "",
  });
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const [blogData, setBlogData] = useState<blogDataType>({
    blog_title: "",
    blog_description: "",
    blog_content: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>();
  const fileInput = useRef<HTMLInputElement>(null);

  const navigate: NavigateFunction = useNavigate();

  // Handle File Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const uploadedFile = e.target.files ? e.target.files[0] : null;
    setFile(uploadedFile);

    // If there is a image show preview
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };
  // Remove Selected File
  const removeFile = (): void => {
    setFile(null);
    setPreview(null);
    if (fileInput.current) {
      fileInput.current.value = "";
    }
  };

  // To access blogContent from other functions
  const [blogLen, setBlogLen] = useState<number>(0);
  const handleEditorChange = (
    con: string,
    // _ means the unused error will not be thrown
    _delta: Delta,
    _source: "user" | "api" | "silent",
    editor: ReactQuill.UnprivilegedEditor
  ): void => {
    // It gives deafult length of 1 so we are subtracting 1
    setBlogLen(editor.getLength() - 1);

    if (editor.getLength() > 5001) {
      setToast(() => ({
        show: true,
        background: "danger",
        message: "Excess characters in Blog Content",
      }));
      return;
    }
    setBlogData((prev) => ({
      ...prev,
      blog_content: con,
    }));
  };

  // Updating BlogContent
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

  const handleNewBlog = (): void => {
    // check empty value
    if (
      !(
        blogData.blog_description &&
        blogData.blog_content &&
        blogData.blog_title
      )
    ) {
      setToast(() => ({
        show: true,
        background: "danger",
        message: "Fields are required",
      }));
      return;
    }
    // Check length of the values
    if (
      !(
        blogLen <= 5000 &&
        blogData.blog_title.length <= 50 &&
        blogData.blog_description.length <= 100
      )
    ) {
      setToast(() => ({
        show: true,
        background: "danger",
        message: "Excess Characters in Blog data",
      }));
      return;
    }

    const formData: FormData = new FormData();
    if (file) {
      formData.append("file", file);
    }

    formData.append("blog_title", blogData.blog_title);
    formData.append("blog_description", blogData.blog_description);
    formData.append("blog_content", blogData.blog_content);

    setBtnLoading(true);
    const newBlogAPI = `${API}/blog/create`;
    fetch(newBlogAPI, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${blogState?.loggedUser.token}`,
      },
      body: formData,
    })
      .then((response) => {
        return response.json() as Promise<serverResponse>;
      })
      .then((data: serverResponse) => {
        if (data.acknowledged) {
          blogState?.setSelectedBlog(data.blog);
          blogState?.setUserBlogList((prev) => [...prev, data.blog]);
          navigate(`/showblog/${data.blog.blog_id}`);
        } else {
          setToast(() => ({
            show: true,
            background: "danger",
            message: "Error creating blog try gain later",
          }));
        }
      })
      .catch(() => {
        setToast(() => ({
          show: true,
          background: "danger",
          message: "Error creating blog try gain later",
        }));
      })
      .finally(() => setBtnLoading(false));
  };

  return (
    <main>
      <header>
        <NavBar />
      </header>
      <section className=" container pt-2">
        <div className="row">
          <div className=" col-12 col-md-7">
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
              <Form.Control
                type="file"
                ref={fileInput}
                accept=".jpg,.jpeg,.png"
                onChange={(e) =>
                  handleFileChange(e as React.ChangeEvent<HTMLInputElement>)
                }
              />
              <>
                <Form.Text
                  muted
                  style={{ fontSize: "10px", lineHeight: "0.2" }}
                  className="me-1"
                >
                  Image size should be less than 200KB and Image uploading is
                  not mandatory, Accepted Image format JPG, JPEG, PNG
                </Form.Text>
              </>
              {/* Show uploaded Image Preview */}
              <>
                {preview && (
                  <div
                    className=" position-relative"
                    style={{ maxHeight: "100px", maxWidth: "100px" }}
                  >
                    <span
                      onClick={removeFile}
                      className=" position-absolute "
                      style={{ top: "-12px", right: "-7px", cursor: "pointer" }}
                    >
                      <IoMdCloseCircle color="red" />
                    </span>
                    <img
                      src={preview}
                      alt="image"
                      className=""
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                  </div>
                )}
              </>
            </div>
            {/* React Quill Editor */}
            <div className="mt-3">
              <ReactQuill
                theme="snow"
                value={blogData.blog_content}
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
            {/* Create blog Button */}
            <div className=" mt-2 text-end">
              <Button
                variant="primary"
                onClick={handleNewBlog}
                style={{ minWidth: "200px" }}
                disabled={btnLoading}
              >
                {btnLoading ? (
                  <Spinner as="span" size="sm" animation="border" />
                ) : (
                  "Publish"
                )}
              </Button>
            </div>
          </div>

          {/* Side Blog List */}
          <div
            className=" col-md-5 d-none d-md-flex flex-column justify-content-center align-items-center"
            style={{ maxHeight: "60vh" }}
          >
            <BlogsList />
          </div>
        </div>
      </section>

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
        className=" position-fixed z-3 p-2 end-0 bottom-0 mb-5 me-2 text-white"
      >
        <Toast.Body>{toast.message}</Toast.Body>
      </Toast>

      <div className=" mt-5">
        <Footer />
      </div>
    </main>
  );
};

export default WriteBlog;
