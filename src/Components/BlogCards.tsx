import Card from "react-bootstrap/Card";
import { data } from "../helpers/Data";

const BlogCards = ({ values }: { values: data }) => {
  return (
    <Card className="card_bg" style={{ cursor: "pointer" }}>
      <Card.Img
        variant="top"
        src={`${
          values.blog_image ? values.blog_image : "/images/placeholderImage.svg"
        }`}
        loading="lazy"
      />
      <Card.Body>
        <Card.Title className="fs-6">{values.blog_title}</Card.Title>
        <Card.Text
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 5,
            overflow: "hidden",
            fontSize: "13px",
          }}
        >
          {values.blog_content}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default BlogCards;
