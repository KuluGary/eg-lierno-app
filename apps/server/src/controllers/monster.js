const Monster = require("../models/monster");
const User = require("../models/user");
const Campaign = require("../models/campaign");

const utils = require("../utils/utils");

module.exports.getMonster = async (req, res) => {
  try {
    const { valid, decoded, message } = utils.validateToken(req.headers.authorization);

    if (valid) {
      if (!!req.params.id) {
        const monster = await Monster.findById(req.params.id);

        res.status(200).json({ payload: monster });
      } else {
        const { skip, limit, qs } = req.query;
        const parsedQs = new RegExp(qs, "i");

        let total = await Monster.aggregate([
          { $match: { name: { $regex: parsedQs }, createdBy: decoded.userId } },
          {
            $group: {
              _id: { $ifNull: ["$flavor.group", "$_id"] },
              id: { $first: "$_id" },
              name: { $first: "$name" },
              description: { $first: "$flavor.description" },
              avatar: { $first: "$flavor.portrait.avatar" },
              race: { $first: "$flavor.race" },
              alignment: { $first: "$flavor.alignment" },
              count: { $sum: 1 },
            },
          },
        ]);

        let monsters = await Monster.aggregate([
          { $match: { name: { $regex: parsedQs }, createdBy: decoded.userId } },
          {
            $group: {
              _id: { $ifNull: ["$flavor.group", "$_id"] },
              id: { $first: "$_id" },
              name: { $first: "$name" },
              description: { $first: "$flavor.description" },
              avatar: { $first: "$flavor.portrait.avatar" },
              race: { $first: "$flavor.race" },
              alignment: { $first: "$flavor.alignment" },
              count: { $sum: 1 },
            },
          },
          { $sort: { name: 1 } },
          { $skip: parseInt(skip) ?? 0 },
          { $limit: parseInt(limit) ?? 0 },
        ]);

        res.status(200).json({ payload: { data: monsters, total: total.length } });
      }
    } else {
      res.status(401).json({ message });
    }
  } catch (e) {
    res.status(400).json({ message: "Error: " + e });
  }
};

module.exports.postMonster = async (req, res) => {
  try {
    const { valid, decoded, message } = utils.validateToken(req.headers.authorization);

    if (valid) {
      const monster = req.body;
      monster["createdBy"] = decoded["userId"];
      const newMonster = new Monster(monster);

      newMonster.save(function (err) {
        if (err) {
          return res.status(403).json({ message: "Error: " + err });
        }

        res.status(200).json({ payload: newMonster._id });
      });
    } else {
      res.status(401).json({ message });
    }
  } catch (err) {
    res.status(400).json({ message: "Error: " + err });
  }
};

module.exports.putMonster = async (req, res) => {
  try {
    const { valid, message } = utils.validateToken(req.headers.authorization);

    if (valid) {
      Monster.findByIdAndUpdate(req.params.id, req.body, function (err) {
        if (err) {
          return res.status(403).json({ message: "El monstruo no ha podido ser modificado." });
        }

        return res.status(200).json({ message: "Monstruo modificado" });
      });
    } else {
      res.status(401).json({ message });
    }
  } catch (e) {
    res.status(400).json({ message: "Error: " + e });
  }
};

module.exports.deleteMonster = async (req, res) => {
  try {
    const { valid, decoded, message } = utils.validateToken(req.headers.authorization);

    if (valid) {
      Monster.findOneAndDelete({ _id: req.params.id, createdBy: decoded["userId"] }, function (err) {
        if (err) return res.status(403).json({ message: "Error " + err });

        return res.status(200).json({ message: "El monstruo ha sido eliminado" });
      });
    } else {
      res.status(401).json({ message });
    }
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
};

module.exports.postMonsterInfo = async (req, res) => {
  try {
    const { monsterIds } = req.body;

    const monsters = await Monster.find({ _id: { $in: monsterIds } });

    const payload = { monsters };

    res.status(200).json({ payload });
  } catch (e) {
    res.status(400).json({ message: "Error: " + e });
  }
};

module.exports.getCampaignMonsters = async (req, res) => {
  try {
    const { valid, message } = utils.validateToken(req.headers.authorization);

    if (valid) {
      const { skip, limit, qs } = req.query;
      const parsedQs = new RegExp(qs, "i");

      let total = await Monster.aggregate([
        { $match: { name: { $regex: parsedQs }, "flavor.campaign": { $elemMatch: { campaignId: req.params.id } } } },
        {
          $group: {
            _id: { $ifNull: ["$flavor.group", "$_id"] },
            id: { $first: "$_id" },
            name: { $first: "$name" },
            description: { $first: "$flavor.description" },
            avatar: { $first: "$flavor.portrait.avatar" },
            race: { $first: "$flavor.race" },
            alignment: { $first: "$flavor.alignment" },
            count: { $sum: 1 },
          },
        },
      ]);

      const monsters = await Monster.aggregate([
        { $match: { name: { $regex: parsedQs }, "flavor.campaign": { $elemMatch: { campaignId: req.params.id } } } },
        {
          $group: {
            _id: { $ifNull: ["$flavor.group", "$_id"] },
            id: { $first: "$_id" },
            name: { $first: "$name" },
            description: { $first: "$flavor.description" },
            avatar: { $first: "$flavor.portrait.avatar" },
            race: { $first: "$flavor.race" },
            alignment: { $first: "$flavor.alignment" },
            count: { $sum: 1 },
          },
        },
        { $sort: { name: 1 } },
        { $skip: parseInt(skip) ?? 0 },
        { $limit: parseInt(limit) ?? 0 },
      ]);

      res.status(200).json({ payload: { data: monsters, total: total.length } });
    } else {
      res.status(401).json({ message });
    }
  } catch (e) {
    res.status(400).json({ message: "Error: " + e });
  }
};
