import getApiParams from "helpers/getApiParams";
import getServerSession from "helpers/getServerSession";
import Monster from "models/monster";

export const getMonsters = async (req, res) => {
  try {
    const monsterId = getApiParams("id", req);

    if (!!monsterId) {
      const monster = await Monster.findById(monsterId);

      res.status(200).json({ payload: monster });
    } else {
      const session = await getServerSession(req);

      if (!!session) {
        const { skip, limit, qs } = req.query;
        const parsedQs = new RegExp(qs, "i");

        const total = await Monster.aggregate([
          { $match: { name: { $regex: parsedQs }, createdBy: session.userId } },
          {
            $group: {
              _id: { $ifNull: ["$flavor.group", "$_id"] },
              id: { $first: "$_id" },
              name: { $first: "$name" },
              personality: { $first: "$flavor.personality" },
              avatar: { $first: "$flavor.portrait.avatar" },
              avatar: { $first: "$flavor.portrait.avatar" },
              classes: { $first: "$flavor.class" },
              race: { $first: "$stats.race" },
              count: { $sum: 1 },
            },
          },
        ]);

        const monsters = await Monster.aggregate([
          { $match: { name: { $regex: parsedQs }, createdBy: session.userId } },
          {
            $group: {
              _id: { $ifNull: ["$flavor.group", "$_id"] },
              id: { $first: "$_id" },
              name: { $first: "$name" },
              personality: { $first: "$flavor.personality" },
              avatar: { $first: "$flavor.portrait.avatar" },
              avatar: { $first: "$flavor.portrait.avatar" },
              class: { $first: "$flavor.class" },
              race: { $first: "$stats.race" },
              count: { $sum: 1 },
            },
          },
          { $sort: { name: 1 } },
          { $skip: parseInt(skip) ?? 0 },
          { $limit: parseInt(limit) ?? 0 },
        ]);

        res.status(200).json({ payload: { data: monsters, total: total.length } });
      } else {
        res.status(401).json({ message: "Usuario sin autenticar." });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const postMonster = async (req, res) => {
  try {
    const session = await getServerSession(req);

    if (!!session) {
      const monster = req.body;
      monster["createdBy"] = session["userId"];
      const newMonster = new Monster(npc);

      newMonster.save((err) => {
        if (err) return res.status(403).json({ message: err });

        res.status(200).json({ payload: newMonster._id });
      });
    } else {
      res.status(401).json({ message: "Usuario sin autenticar." });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const putMonster = async (req, res) => {
  try {
    const session = getServerSession(req);

    if (!!session) {
      const monsterId = getApiParams("id", req);

      Monster.findByIdAndUpdate(monsterId, req.body, (err) => {
        if (err) return res.status(403).json({ message: "El monstruo no ha podido ser modificado." });

        return res.status(200).json({ message: "Monstruo modificado" });
      });
    } else {
      res.status(401).json({ message: "Usuario sin autenticar." });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const deleteMonster = async (req, res) => {
  try {
    const session = await getServerSession(req);

    if (!!session) {
      const monsterId = getApiParams("id", req);

      Monster.findOneAndDelete({ _id: monsterId, createdBy: session["userId"] }, (err) => {
        if (err) return res.status(403).json({ message: "El monstruo no ha podido ser eliminado." });

        return res.status(200).json({ message: "El monstruo ha sido eliminado" });
      });
    } else {
      res.status(401).json({ message: "Usuario sin autenticar." });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const getCampaignMonsters = async (req, res) => {
  try {
    const campaignId = await getApiParams("id", req);
    const { skip, limit, qs } = req.query;
    const parsedQs = new RegExp(qs, "i");

    const total = await Monster.aggregate([
      { $match: { name: { $regex: parsedQs }, "flavor.campaign": { $elemMatch: { campaignId: campaignId } } } },
      {
        $group: {
          _id: { $ifNull: ["$flavor.group", "$_id"] },
          id: { $first: "$_id" },
          name: { $first: "$name" },
          personality: { $first: "$flavor.personality" },
          avatar: { $first: "$flavor.portrait.avatar" },
          avatar: { $first: "$flavor.portrait.avatar" },
          classes: { $first: "$flavor.class" },
          race: { $first: "$stats.race" },
          count: { $sum: 1 },
        },
      },
    ]);

    const monsters = await Monster.aggregate([
      { $match: { name: { $regex: parsedQs }, "flavor.campaign": { $elemMatch: { campaignId: campaignId } } } },
      {
        $group: {
          _id: { $ifNull: ["$flavor.group", "$_id"] },
          id: { $first: "$_id" },
          name: { $first: "$name" },
          personality: { $first: "$flavor.personality" },
          avatar: { $first: "$flavor.portrait.avatar" },
          avatar: { $first: "$flavor.portrait.avatar" },
          class: { $first: "$flavor.class" },
          race: { $first: "$stats.race" },
          count: { $sum: 1 },
        },
      },
      { $sort: { name: 1 } },
      { $skip: parseInt(skip) ?? 0 },
      { $limit: parseInt(limit) ?? 0 },
    ]);

    res.status(200).json({ payload: { data: monsters, total: total.length } });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
