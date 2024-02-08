import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { BlogState } from "../Context/ContextAPI";
import { useEffect, useState } from "react";
import { user } from "../helpers/Types.ts";
import { MdOutlineModeEdit } from "react-icons/md";

function NavBar() {
  const navigate: NavigateFunction = useNavigate();
  const blogState = BlogState();

  const [showProfile, setShowProfile] = useState<boolean>(false);

  const handleLogout = (): void => {
    localStorage.removeItem("horizonUser");
    const userReset: user = {
      user_id: 0,
      email: "",
      user_name: "",
      token: "",
      profile_image: "",
    };
    blogState?.setLoggedUser(() => userReset);
    setShowProfile(false);
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (blogState !== null) {
      const { loggedUser } = blogState;
      if (loggedUser.email) {
        setShowProfile(true);
      }
    }
  }, [blogState?.loggedUser]);

  return (
    <Navbar
      collapseOnSelect
      expand="sm"
      className=" border-black text-black nav_bg"
    >
      <Container>
        <Navbar.Brand
          className=" fw-semibold fs-4 txt_gradient--nav"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          Horizon
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>

          {/* Show if the user is logged In */}
          {showProfile ? (
            <Nav>
              {/* only on sm and larger */}
              <>
                <Nav.Link
                  className="text-black  fw-medium d-none d-sm-block align-self-center"
                  style={{ minWidth: "50px" }}
                  onClick={() => navigate("/write")}
                >
                  <MdOutlineModeEdit /> Write
                </Nav.Link>
                <Nav.Link
                  className="text-black fw-medium d-none d-sm-block align-self-center"
                  style={{ minWidth: "70px" }}
                  onClick={() => navigate("/userblog")}
                >
                  Your Blogs
                </Nav.Link>

                <NavDropdown
                  title={`Hi ${blogState?.loggedUser.user_name.toUpperCase()}`}
                  id="basic-nav-dropdown"
                  className=" d-none d-sm-block"
                >
                  <NavDropdown.Item onClick={() => navigate("/profile")}>
                    Profile
                  </NavDropdown.Item>

                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>

              {/* Only show at smaller than sm */}
              <>
                <NavDropdown.Item
                  onClick={() => navigate("/profile")}
                  className="d-sm-none"
                >
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item
                  className=" d-sm-none "
                  onClick={() => navigate("/write")}
                >
                  <MdOutlineModeEdit />
                  Write Blog
                </NavDropdown.Item>
                <NavDropdown.Item
                  className=" d-sm-none"
                  onClick={() => navigate("/userblog")}
                >
                  Your Blogs
                </NavDropdown.Item>

                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="d-sm-none">
                  Logout
                </NavDropdown.Item>
              </>
            </Nav>
          ) : (
            // Show if there is no logged User
            <Nav>
              <Nav.Link
                className="text-black me-2 fw-medium d-none d-sm-block align-self-center"
                style={{ minWidth: "100px" }}
                onClick={() => navigate("/login")}
              >
                Sign in
              </Nav.Link>

              {/* On smaller than sm */}
              <Button
                variant="dark"
                className=" mt-md-0 mt-4 align-self-center w-75 d-sm-none"
                style={{ maxWidth: "250px" }}
                onClick={() => navigate("/login")}
              >
                Sign in
              </Button>

              <Button
                variant="dark"
                className=" mt-md-0 mt-2 align-self-center w-75"
                style={{ maxWidth: "250px" }}
                onClick={() => navigate("/register")}
              >
                Get started
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
