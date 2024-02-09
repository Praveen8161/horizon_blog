import { NavigateFunction, useNavigate } from "react-router-dom";
import { BlogState } from "../Context/ContextAPI";
import { RiEditLine } from "react-icons/ri";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { API } from "../helpers/API";
import { singleBlogPostType } from "../helpers/Types";
import Button from "react-bootstrap/Button";
import { useState } from "react";

type deleteServerResponse =
  | {
      acknowledged: false;
      error: string;
    }
  | {
      acknowledged: true;
    };

type confirmDeleteType =
  | {
      confirm: true;
      id: number;
    }
  | {
      confirm: false;
    };

const UserBlogsList = () => {
  const blogState = BlogState();
  const navigate: NavigateFunction = useNavigate();
  const [confirmDel, setConfirmDel] = useState<confirmDeleteType>({
    confirm: false,
  });

  const handleDeleteBlog = (id: number): void => {
    if (!id) return;

    const tempBlogList: singleBlogPostType[] =
      blogState?.userBlogList.filter((val) => val.blog_id !== id) || [];

    blogState?.setUserBlogList(tempBlogList);

    setConfirmDel({
      confirm: false,
    });

    const delBlogAPI = `${API}/user/delete`;

    fetch(delBlogAPI, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${blogState?.loggedUser.token}`,
      },
      body: JSON.stringify({ blog_id: id }),
    })
      .then((response) => response.json() as Promise<deleteServerResponse>)
      .then((data: deleteServerResponse) => {
        if (data.acknowledged) {
          return data;
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEditBlog = (val: singleBlogPostType): void => {
    blogState?.setEditBlog(() => val);
    navigate("/edit");
  };

  return (
    <div className=" px-sm-5 d-flex justify-content-center align-items-center flex-column">
      <h4 className=" text-center fs-5">Blog List</h4>
      {blogState?.userBlogList.length && (
        <div className=" d-flex flex-column gap-2">
          {blogState.userBlogList.map((val) => (
            <div key={val.blog_id} className=" border px-3 py-2">
              <div className=" d-flex flex-row gap-2 ">
                {/* Heading of the Blog */}
                <h5
                  className=" fs-6"
                  style={{
                    width: "80%",
                    maxWidth: "80%",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/showblog/${val.blog_id}`)}
                >
                  {val.blog_title.toUpperCase()}
                </h5>

                {/* editing and deleting the blog */}
                <p
                  className=" d-flex flex-row gap-1 justify-content-end"
                  style={{
                    width: "20%",
                    maxWidth: "20%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {/* Edit Button */}
                  <span
                    onClick={() => handleEditBlog(val)}
                    style={{ cursor: "pointer" }}
                  >
                    <RiEditLine />
                  </span>
                  {/* Delete Button */}
                  <span
                    onClick={() =>
                      setConfirmDel({
                        confirm: true,
                        id: val.blog_id,
                      })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <MdOutlineDeleteOutline />
                  </span>
                </p>
              </div>

              {/* Blog Description */}
              <p
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/showblog/${val.blog_id}`)}
              >
                {val.blog_description}
              </p>
            </div>
          ))}
        </div>
      )}
      {/* Confirm Delete Button */}
      {confirmDel.confirm && (
        <div
          className=" position-fixed z-3 rounded-3 top-0 end-0 start-0 bottom-0 d-flex justify-content-center align-items-center"
          style={{ maxWidth: "100vw", maxHeight: "100vh" }}
        >
          <div
            className=" bg-dark-subtle px-3 py-2 rounded-3 d-flex justify-content-center align-items-center flex-column"
            style={{ minHeight: "30vh", minWidth: "30vw" }}
          >
            <p className=" fs-6 fw-medium">Confirm Delete?</p>
            <div className=" d-flex justify-content-center align-items-center gap-2 flex-row">
              <Button
                variant="danger"
                onClick={() => handleDeleteBlog(confirmDel.id)}
              >
                Delete
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  setConfirmDel({
                    confirm: false,
                  })
                }
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBlogsList;
