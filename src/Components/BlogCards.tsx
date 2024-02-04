import Card from "react-bootstrap/Card";

type blogData = {
  imgUrl?: string;
  heading: string;
  content: string;
};

const BlogCards = ({ values }: { values: blogData }) => {
  return (
    <Card className="card_bg" style={{ cursor: "pointer" }}>
      <Card.Img
        variant="top"
        src={`${
          values.imgUrl ? values.imgUrl : "/images/placeholderImage.svg"
        }`}
        loading="lazy"
      />
      <Card.Body>
        <Card.Title className="fs-6">{values.heading}</Card.Title>
        <Card.Text
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 5,
            overflow: "hidden",
            fontSize: "13px",
          }}
        >
          {values.content}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default BlogCards;
