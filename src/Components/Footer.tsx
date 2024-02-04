import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { TbWorldShare } from "react-icons/tb";
import { NavigateFunction, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <div className="container-fluid">
      <div
        className=" text-white bg-dark row overflow-hidden pt-2"
        style={{ minHeight: "30vh" }}
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
