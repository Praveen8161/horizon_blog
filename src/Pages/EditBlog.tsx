import React, { FC, useEffect, useRef, useState } from "react";
import NavBar from "../Components/NavBar";
import ReactQuill from "react-quill";
import { Delta } from "quill";
import "react-quill/dist/quill.snow.css";
import Form from "react-bootstrap/Form";
import objChecker from "../helpers/ObjectChecker.ts";
import { IoMdCloseCircle } from "react-icons/io";
import { BlogState } from "../Context/ContextAPI.tsx";
import Button from "react-bootstrap/Button";
import { API } from "../helpers/API.ts";
import { singleBlogPostType } from "../helpers/Types.ts";
import { NavigateFunction, useNavigate } from "react-router-dom";
import parse from "html-react-parser";

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

const EditBlog: FC = () => {
  const blogState = BlogState();
  const navigate: NavigateFunction = useNavigate();
  // To manage Blog State
  const [blogData, setBlogData] = useState<blogDataType>({
    blog_title: "",
    blog_description: "",
    blog_content: "",
  });
  // To manage Image State
  const [preview, setPreview] = useState<string | null>();
  // Handling Image for server side upload
  const [file, setFile] = useState<File | null>(null);

  const fileInput = useRef<HTMLInputElement>(null);

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
    // Remove from Html Element
    if (fileInput.current) {
      fileInput.current.value = "";
    }
  };

  // To get length of blogContent for other functions
  const [blogLen, setBlogLen] = useState<number>(0);

  // For React Quill -- To Extract Content
  const handleEditorChange = (
    con: string,
    // _ means the unused error will not be thrown
    _delta: Delta,
    _source: "user" | "api" | "silent",
    editor: ReactQuill.UnprivilegedEditor
  ): void => {
    // It gives deafult length of 1 so we are subtracting 1
    setBlogLen(editor.getLength() - 1);

    // Updating the Blog Data State
    if (editor.getLength() > 5000) return;
    setBlogData((prev) => ({
      ...prev,
      blog_content: con,
    }));
  };

  // Updating Blog Data State
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

  const handleUpdateBlog = (): void => {
    const checkObject: boolean = objChecker(blogData);
    // check empty value
    if (!checkObject) {
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
      return;
    }

    // Collecting blog Data for Blog Update
    const formData: FormData = new FormData();
    if (file) {
      formData.append("file", file);
    }

    formData.append("blog_title", blogData.blog_title);
    formData.append("blog_description", blogData.blog_description);
    formData.append("blog_content", blogData.blog_content);
    const updateBlogAPI = `${API}/blog/update`;

    fetch(updateBlogAPI, {
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
          const tempBlogList =
            blogState?.userBlogList.map((val) => {
              if (val.blog_id === data.blog.blog_id) {
                return data.blog;
              } else {
                return val;
              }
            }) || [];

          blogState?.setUserBlogList(tempBlogList);

          // Removing the selectedChat so the blog can reload
          blogState?.setSelectedBlog({
            blog_id: 0,
            blog_title: "",
            blog_description: "",
            blog_content: "",
            blog_image: null,
            published_date: undefined,
            user_id: 0,
            author: "",
          });

          //   Navigate to Show Blog Page
          navigate(`/showblog/${data.blog.blog_id}`);
        } else {
          console.log(data);
        }
      })
      .catch((err) => console.log(err));
  };

  //   Checking the Editable Blog and updating Local State Blog Data
  useEffect(() => {
    if (!blogState?.editBlog.blog_id) {
      navigate("/userblog");
    } else {
      setBlogData(() => ({
        blog_title: blogState.editBlog.blog_title,
        blog_description: blogState.editBlog.blog_description,
        blog_content: blogState.editBlog.blog_content,
      }));

      setPreview(`${API}/${blogState.editBlog.blog_image}`);
    }

    // When Unmounting it will reset the editBlog State
    return () => {
      blogState?.setEditBlog({
        blog_id: 0,
        blog_title: "",
        blog_description: "",
        blog_content: "",
        blog_image: null,
        published_date: undefined,
        user_id: 0,
        author: "",
      });
    };
  }, []);

  return (
    <main>
      <header>
        <NavBar />
      </header>
      <section className=" container-fluid pt-2 px-5">
        <div className="row">
          <div className=" col-12 col-md-5">
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
              <Button variant="primary" onClick={handleUpdateBlog}>
                Update
              </Button>
            </div>
          </div>

          {/* Side Blog List */}
          <div
            className=" col-md-6 d-none d-md-block"
            style={{ minHeight: "60vh" }}
          >
            <p className=" d-flex flex-column">
              <span className=" fs-5 fw-medium text-center">Live Preview</span>{" "}
              <span className="" style={{ fontSize: "10px" }}>
                Blog Description Will not be shown in preview
              </span>
            </p>

            <div
              className=" border d-md-flex flex-column   border-black"
              style={{ minHeight: "100%" }}
            >
              {/* Blog Title */}
              <p className=" fw-bold fs-4 text-center" style={{}}>
                {blogData.blog_title.toUpperCase()}
              </p>

              {/* Blog Image */}
              {preview && (
                <p
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                  className=" d-flex justify-content-center align-items-center"
                >
                  <img
                    src={preview}
                    alt="blog_image"
                    style={{ maxWidth: "50%", maxHeight: "50%" }}
                  />
                </p>
              )}

              {/* Blog Content */}
              <div>{parse(blogData.blog_content || "")}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EditBlog;
