import getApiParams from "helpers/getApiParams";
import getServerSession from "helpers/getServerSession";
import Item from "models/item";

export const getItems = async (req, res) => {
  try {
    const itemId = getApiParams("id", req);

    if (!!itemId) {
      const item = await Item.findById(req.params.id);

      res.status(200).json({ payload: item });
    } else {
      const itemIds = getApiParams("itemIds", req);
      const { skip, limit } = req.query;

      if (!!itemIds) {
        const itemIdsArr = itemIds.split(",");

        const items = await Item.find({ _id: { $in: itemIdsArr } })
          .sort({ name: 1 })
          .skip(parseInt(skip ?? 0))
          .limit(parseInt(limit ?? 0));

        res.status(200).json({ payload: items });
      } else {
        const items = await Item.find({}).sort({ name: 1 });

        res.status(200).json({ payload: items });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const postItem = async (req, res) => {
  try {
    const session = await getServerSession(req);

    if (!!session) {
      const item = req.body;
      item["createdBy"] = session["userId"];
      const newItem = new Item(item);

      newItem.save((err) => {
        if (err) return res.status(403).json({ message: err });

        res.status(200).json({ payload: newItem._id });
      });
    } else {
      res.status(401).json({ message: "Usuario sin autenticar." });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
