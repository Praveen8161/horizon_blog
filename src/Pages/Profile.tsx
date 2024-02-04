import { useEffect, useState } from "react";
import { BlogState } from "../Context/ContextAPI";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import NavBar from "../Components/NavBar";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

type userDataType = {
  email: string;
  user_name: string;
};

const Profile = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const blogState = BlogState();
  const [userData, setUserData] = useState<userDataType>({
    email: "",
    user_name: "",
  });

  useEffect(() => {
    if (blogState?.loggedUser.email) {
      setLoading(false);
      setUserData(() => ({
        email: blogState.loggedUser.email,
        user_name: blogState.loggedUser.user_name,
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
      <div className="flex-grow-1 d-flex flex-column bg-dark-subtle justify-content-center align-items-center">
        <div className=" d-flex justify-content-center align-items-center flex-column gap-3">
          <Image
            src="/images/avatar.svg"
            roundedCircle
            className=" "
            style={{ height: "100px", width: "100px" }}
          />
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
            <div>
              <Form.Label htmlFor="user_name">User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="User Name"
                style={{ maxWidth: "250px" }}
                value={userData.user_name}
                id="user_name"
                onChange={(e) => handleUserNameChange(e)}
              />
            </div>
            <Button variant="primary">Submit</Button>{" "}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
