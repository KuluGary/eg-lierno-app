import connectDB from "middleware/mongodb";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
    case "POST":
    case "PUT":
    case "DELETE":
    default:
      res.status(422).send("req_method_not_supported");
  }
};
export default connectDB(handler);
