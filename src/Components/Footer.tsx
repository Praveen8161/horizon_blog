import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { TbWorldShare } from "react-icons/tb";
import { NavigateFunction, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <div className="container-fluid position-relative overflow-hidden bg-dark ">
      {/* Custom shape divider */}
      {/* <div className="custom-shape-divider-bottom-1707159217">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V6c0,21.6,291,111.46,741,110.26,445.39,3.6,459-88.3,459-110.26V0Z"
            className="shape-fill"
          ></path>
        </svg>
      </div> */}

      {/* Footer Starts */}
      <div
        className=" text-white  row overflow-hidden pt-2 position-relative"
        style={{ minHeight: "30vh", zIndex: "5" }}
      >
        <div className="col-sm-6 px-5 py-md-5 col-md-4 col-12 overflow-hidden">
          <h3
            className="txt_gradient--footer"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Horizon
          </h3>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo
            quam libero sapiente est non nesciunt
          </p>
          <p>
            Copyright <sup>&#169;</sup>
            {new Date().getFullYear()}
          </p>
        </div>

        <div className="col-sm-6 px-5 py-md-5 col-md-4 col-12 overflow-hidden">
          <h4>Quick Links</h4>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Career</li>
            <li>FAQ</li>
          </ul>
        </div>

        <div className=" px-5 py-md-5 col-md-4 col-12 overflow-hidden">
          <h4>News Letter</h4>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo
            quam libero sapiente est non nesciunt
          </p>
          <InputGroup className="mb-3" style={{ maxWidth: "250px" }}>
            <Form.Control
              placeholder="Email Address"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              id="basic-asson2-form"
            />
            <InputGroup.Text id="basic-addon2" className="bg-primary">
              <TbWorldShare />
            </InputGroup.Text>
          </InputGroup>
        </div>
      </div>
    </div>
  );
};

export default Footer;
