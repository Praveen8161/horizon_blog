import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { CiMail } from "react-icons/ci";
import Toast from "react-bootstrap/Toast";
import { API } from "../helpers/API";
import { NavigateFunction, useNavigate } from "react-router-dom";
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

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [toast, setToast] = useState<toastType>({
    show: false,
    background: "danger",
    message: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const navigate: NavigateFunction = useNavigate();

  function handleForgotEmail(): void {
    if (!email) {
      setToast(() => ({
        show: true,
        background: "danger",
        message: "Fields are required",
      }));
      return;
    }

    setLoading(() => true);

    // Forgot Password
    const forgotAPI = `${API}/forgot`;
    fetch(forgotAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((response) => response.json() as Promise<serverResponse>)
      .then((data: serverResponse) => {
        if (data.acknowledged) {
          setEmail("");
          setToast(() => ({
            show: true,
            background: "success",
            message: data.message,
          }));
        } else {
          setToast(() => ({
            show: true,
            background: "danger",
            message: data.error,
          }));
        }
        setLoading(() => false);
      })
      .catch(() => {
        setToast(() => ({
          show: true,
          background: "danger",
          message: "Error Checking Email",
        }));
        setLoading(() => false);
      });
  }

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
        className=" pt-3 px-3 bg_homepage pb-5 d-flex justify-content-center flex-column align-items-center gap-3"
      >
        <h4>Forgot Password</h4>
        <InputGroup>
          <InputGroup.Text id="basic-addon1">
            <CiMail size={20} />
          </InputGroup.Text>
          <Form.Control
            placeholder="Email"
            aria-label="Email"
            aria-describedby="basic-addon1"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
        </InputGroup>
        <Button
          variant="primary"
          onClick={handleForgotEmail}
          style={{ minWidth: "40%" }}
        >
          {loading ? (
            <Spinner as="span" size="sm" animation="border" />
          ) : (
            "Submit"
          )}
        </Button>

        {/* Separating line */}
        <div>
          <div className="d-flex justify-content-center align-items-center w-100 flex-row flex-nowrap gap-2">
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
          {/* Login */}
          <div className=" d-flex justify-content-center align-items-center flex-row flex-nowrap gap-2">
            <span>Want to Login</span>
            <span
              className=" text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Click Here
            </span>
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

export default ForgotPassword;
