import { ChangeEvent, useEffect, useRef, useState } from "react";
import { BlogState } from "../Context/ContextAPI";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import NavBar from "../Components/NavBar";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { API } from "../helpers/API";
import { toastType, user } from "../helpers/Types";
import { FaRegEdit } from "react-icons/fa";
import Toast from "react-bootstrap/Toast";

type userDataType = {
  email: string;
  user_name: string;
  profile_image: string | null;
};

type serverResponse =
  | {
      acknowledged: true;
    }
  | {
      acknowledged: false;
      error: string;
    };

type profile_img_serverResponse =
  | {
      acknowledged: true;
      profile_image: string | null;
    }
  | {
      acknowledged: false;
      error: string;
    };

const Profile = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<toastType>({
    show: false,
    background: "danger",
    message: "",
  });
  const blogState = BlogState();
  const [userData, setUserData] = useState<userDataType>({
    email: "",
    user_name: "",
    profile_image: "",
  });
  const [editBtn, setEditBtn] = useState<boolean>(false);

  const fileInput = useRef<HTMLInputElement>(null);
  // Trigger the file input click event
  const handleEditClick = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];

    if (!file) {
      setToast(() => ({
        show: true,
        background: "danger",
        message: "Image is required",
      }));

      return;
    }

    if (file.size / 1024 > 200) {
      setToast(() => ({
        show: true,
        background: "danger",
        message: "Image Size should be less than 200KB",
      }));
      return;
    }

    const url = URL.createObjectURL(file);

    setUserData((prev) => ({
      ...prev,
      profile_image: url,
    }));

    setEditBtn(true);

    // Updating image in formData
    const formData: FormData = new FormData();
    formData.append("file", file);

    const profileImageUpdateAPI = `${API}/user/profile-image`;

    fetch(profileImageUpdateAPI, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${blogState?.loggedUser.token}`,
      },
      body: formData,
    })
      .then((res) => res.json() as Promise<profile_img_serverResponse>)
      .then((data: profile_img_serverResponse) => {
        if (data.acknowledged) {
          const userItem: string | null = localStorage.getItem("horizonUser");

          if (userItem) {
            const parsedUser: user | null = JSON.parse(userItem);
            if (parsedUser) {
              parsedUser.profile_image = data.profile_image;
              localStorage.setItem("horizonUser", JSON.stringify(parsedUser));
            }
          }
        } else {
          setToast(() => ({
            show: true,
            background: "danger",
            message: "Error updating image try again later",
          }));
        }
      })
      .catch(() => {
        setToast(() => ({
          show: true,
          background: "danger",
          message: "Error updating image try again later",
        }));
      })
      .finally(() => {
        setEditBtn(false);
      });
  };

  // Initial Value Updates
  useEffect(() => {
    if (blogState?.loggedUser.email) {
      setLoading(false);
      setUserData(() => ({
        email: blogState.loggedUser.email,
        user_name: blogState.loggedUser.user_name,
        profile_image: blogState.loggedUser.profile_image
          ? `${API}/${blogState.loggedUser.profile_image}`
          : null,
      }));
    }
  }, [blogState?.loggedUser.email]);

  const handleUserNameChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ): void => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNameUpdate = (): void => {
    if (!userData.user_name) {
      setToast(() => ({
        show: true,
        background: "danger",
        message: "Fields are required",
      }));
      return;
    }

    setBtnLoading(true);

    const UNameUpdateAPI = `${API}/user/profile/update`;
    fetch(UNameUpdateAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${blogState?.loggedUser.token}`,
      },
      body: JSON.stringify({ user_name: userData.user_name }),
    })
      .then((response) => response.json() as Promise<serverResponse>)
      .then((data: serverResponse) => {
        // Update the user name in localStorage
        if (data.acknowledged) {
          if (blogState?.loggedUser) {
            const tempUser: user = {
              ...blogState?.loggedUser,
              user_name: userData.user_name,
            };

            blogState.setLoggedUser((prev) => ({
              ...prev,
              user_name: userData.user_name,
            }));

            localStorage.setItem("horizonUser", JSON.stringify(tempUser));
          }
        } else {
          setToast(() => ({
            show: true,
            background: "danger",
            message: "Error updating name try again later",
          }));
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setBtnLoading(false));
  };

  if (loading) {
    return (
      <div
        className=" container-fluid d-flex justify-content-center align-items-center w-100 bg-dark-subtle"
        style={{ minHeight: "100vh" }}
      >
        <Spinner
          animation="border"
          variant="dark"
          style={{ minWidth: "60px", minHeight: "60px" }}
        />
        ;
      </div>
    );
  }

  return (
    <section style={{ minHeight: "100vh" }} className=" d-flex flex-column   ">
      <div>
        <NavBar />
      </div>

      {/* Main */}
      <div className="flex-grow-1 d-flex flex-column bg-dark-subtle justify-content-center align-items-center">
        <div className=" d-flex justify-content-center align-items-center flex-column gap-3">
          {/* Profile Images */}
          <div
            style={{ height: "100px", width: "100px" }}
            className=" position-relative"
          >
            <Image
              src={
                userData.profile_image
                  ? userData.profile_image
                  : "images/avatar.svg"
              }
              roundedCircle
              className=" "
              style={{ height: "100%", width: "100%" }}
            />

            {/* Edit icon for image upload */}
            <button
              className=" position-absolute bg-dark text-white px-2 py-2 rounded-5 d-flex justify-content-center align-items-center"
              style={{ bottom: "0px", right: "0px" }}
              onClick={handleEditClick}
              disabled={editBtn}
            >
              {" "}
              <FaRegEdit size={10} />
            </button>

            {/* Hidden File Input to select the Image */}
            <input
              type="file"
              ref={fileInput}
              accept=".jpg,.jpeg,.png"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>

          {/* User Email */}
          <div className=" d-flex flex-column gap-3 justify-content-center align-items-center flex-grow-1 ">
            <div>
              <Form.Label htmlFor="email">Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email Address"
                style={{ maxWidth: "250px" }}
                value={userData.email}
                id="email"
                disabled
              />
            </div>
            {/* User Name */}
            <div>
              <Form.Label htmlFor="user_name">User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="User Name"
                style={{ maxWidth: "250px" }}
                name="user_name"
                value={userData.user_name}
                id="user_name"
                onChange={(e) => handleUserNameChange(e)}
              />
            </div>
            {/* Profile Images */}
            <Button
              variant="primary"
              onClick={handleNameUpdate}
              style={{ minWidth: "40%" }}
              disabled={btnLoading}
            >
              {btnLoading ? (
                <Spinner as="span" size="sm" animation="border" />
              ) : (
                "Submit"
              )}
            </Button>{" "}
          </div>
        </div>
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
    </section>
  );
};

export default Profile;
