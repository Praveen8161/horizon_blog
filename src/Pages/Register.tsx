import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../App.css";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { API } from "../helpers/API.ts";
import Toast from "react-bootstrap/Toast";
import Spinner from "react-bootstrap/Spinner";
import { toastType, user } from "../helpers/Types.ts";

type serverResponse =
  | {
      acknowledged: true;
      message: string;
    }
  | {
      acknowledged: false;
      error: string;
    };

const Register = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [toast, setToast] = useState<toastType>({
    show: false,
    background: "danger",
    message: "",
  });
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const emailRef = useRef<HTMLInputElement | null>(null);
  const userNameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const navigate: NavigateFunction = useNavigate();

  // Clear Values in Input Fields
  function clearValues(): void {
    if (emailRef.current && userNameRef.current && passwordRef.current) {
      emailRef.current.value = "";
      userNameRef.current.value = "";
      passwordRef.current.value = "";
    }
  }

  const handleRegister = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (
      emailRef.current?.value &&
      userNameRef.current?.value &&
      passwordRef.current?.value
    ) {
      const email = emailRef.current.value;
      const userName = userNameRef.current.value;
      const password = passwordRef.current.value;
      setBtnLoading(() => true);
      // registering in Database
      const registerAPI = `${API}/register`;
      fetch(registerAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, userName, password }),
      })
        .then((response) => response.json() as Promise<serverResponse>)
        .then((data: serverResponse) => {
          if (data.acknowledged) {
            clearValues();
            setToast(() => ({
              show: true,
              background: "success",
              message: data.message,
            }));

            setTimeout(() => {
              navigate("/login");
            }, 3000);
          } else {
            setToast(() => ({
              show: true,
              background: "danger",
              message: data.error,
            }));
          }
        })
        .catch(() => {
          setToast(() => ({
            show: true,
            background: "danger",
            message: "Error Login",
          }));
        })
        .finally(() => setBtnLoading(false));
    } else {
      setToast(() => ({
        show: true,
        background: "danger",
        message: "Error Creating Profile",
      }));
    }
  };

  useEffect(() => {
    const userItem: string | null = localStorage.getItem("horizonUser");
    if (userItem) {
      const currUser: user | null = JSON.parse(userItem);
      if (currUser?.email) navigate("/", { replace: true });
    }
  }, []);

  return (
    <main className="container-fluid d-flex justify-content-center align-items-center min-vh-100 gap-3 flex-column">
      <h1
        className="mb-4 txt_gradient"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        Horizon
      </h1>
      <div
        style={{ minWidth: "260px", width: "100%", maxWidth: "360px" }}
        className=" pt-3 px-3 bg_homepage pb-5"
      >
        <Form onSubmit={(e) => handleRegister(e)}>
          <Form.Text className="text-center fs-4 fw-semibold w-100 text-dark d-flex justify-content-center">
            Register
          </Form.Text>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              ref={emailRef}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicUserName">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="userName"
              placeholder="Enter User Name"
              ref={userNameRef}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              ref={passwordRef}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="Show Password"
              onChange={() => setShowPassword(!showPassword)}
            />
          </Form.Group>
          <div className="d-flex justify-content-center ">
            <Button
              variant="primary"
              type="submit"
              style={{ minWidth: "40%" }}
              disabled={btnLoading}
            >
              {btnLoading ? (
                <Spinner as="span" size="sm" animation="border" />
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </Form>
        {/* Login */}

        <>
          {/* Separating line */}
          <div>
            <div className="d-flex justify-content-center align-items-center w-100 flex-row flex-nowrap gap-1 mt-2">
              <span
                className="bg-black flex-grow-1 bg-opacity-25"
                style={{ height: "1px" }}
              ></span>
              <span className=" opacity-75">OR</span>
              <span
                className="bg-black flex-grow-1  bg-opacity-25"
                style={{ height: "1px" }}
              ></span>
            </div>
          </div>
          {/* Register */}
          <div className=" d-flex justify-content-center align-items-center flex-row flex-nowrap gap-2">
            <span>Already have an account</span>
            <span
              className=" text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </div>
        </>
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
        className=" position-fixed z-3 p-2 end-0 bottom-0 mb-5 me-2 text-white"
      >
        <Toast.Body>{toast.message}</Toast.Body>
      </Toast>
      {/* Background color divider */}
      <div className="custom-shape-divider-top-1706868040">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
    </main>
  );
};

export default Register;
