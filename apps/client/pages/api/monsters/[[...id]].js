import connectDB from "middleware/mongodb";

const { getMonsters, postMonster, putMonster, deleteMonster } = require("controllers/monster");

const handler = (req, res) => {
  switch (req.method) {
    case "GET":
      return getMonsters(req, res);
    case "POST":
      return postMonster(req, res);
    case "PUT":
      return putMonster(req, res);
    case "DELETE":
      return deleteMonster(req, res);
    default:
      res.status(422).send("req_method_not_supported");
  }
};

export default connectDB(handler);
