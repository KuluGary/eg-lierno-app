import getApiParams from "helpers/getApiParams";
import getServerSession from "helpers/getServerSession";
import Faction from "models/faction";
import Npc from "models/npc";
import mongoose from "mongoose";

export const getNpcs = async (req, res) => {
  try {
    const npcId = getApiParams("id", req);

    if (!!npcId) {
      const npc = await Npc.findById(npcId);

      res.status(200).json({ payload: npc });
    } else {
      const session = await getServerSession(req);

      if (!!session) {
        const { skip, limit, qs } = req.query;
        const parsedQs = new RegExp(qs, "i");

        let total = await Npc.aggregate([
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

        let npcs = await Npc.aggregate([
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

        res.status(200).json({ payload: { data: npcs, total: total.length } });
      } else {
        res.status(401).json({ message: "Usuario sin autenticar." });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const postNpc = async (req, res) => {
  try {
    const session = await getServerSession(req);

    if (!!session) {
      const npc = req.body;
      npc["createdBy"] = session["userId"];
      const newNpc = new Npc(npc);

      newNpc.save((err) => {
        if (err) return res.status(403).json({ message: err });

        res.status(200).json({ payload: newNpc._id });
      });
    } else {
      res.status(401).json({ message: "Usuario sin autenticar." });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const putNpc = async (req, res) => {
  try {
    const session = getServerSession(req);

    if (!!session) {
      const npcId = getApiParams("id", req);

      Npc.findByIdAndUpdate(npcId, req.body, (err) => {
        if (err) return res.status(403).json({ message: "El PNJ no ha podido ser modificado." });

        return res.status(200).json({ message: "PNJ modificado" });
      });
    } else {
      res.status(401).json({ message: "Usuario sin autenticar." });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const deleteNpc = async (req, res) => {
  try {
    const session = await getServerSession(req);

    if (!!session) {
      const npcId = getApiParams("id", req);

      Npc.findOneAndDelete({ _id: npcId, createdBy: session["userId"] }, (err) => {
        if (err) return res.status(403).json({ message: "El PNJ no ha podido ser eliminado." });

        return res.status(200).json({ message: "El PNJ ha sido eliminado" });
      });
    } else {
      res.status(401).json({ message: "Usuario sin autenticar." });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const getCampaignNpcs = async (req, res) => {
  try {
    const campaignId = await getApiParams("id", req);
    const { skip, limit, qs } = req.query;
    const parsedQs = new RegExp(qs, "i");

    const total = await Npc.aggregate([
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

    const npcs = await Npc.aggregate([
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

    res.status(200).json({ payload: { data: npcs, total: total.length } });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const getFactionNpcs = async (req, res) => {
  try {
    const factionId = getApiParams("id", req);
    const faction = await Faction.findById(factionId);
    const { skip, limit, qs } = req.query;
    const parsedQs = new RegExp(qs, "i");

    const npcIds = faction?.members?.npcs?.map((npc) => mongoose.Types.ObjectId(npc.id));

    const total = await Npc.aggregate([
      { $match: { name: { $regex: parsedQs }, _id: { $in: npcIds } } },
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

    const npcs = await Npc.aggregate([
      { $match: { name: { $regex: parsedQs }, _id: { $in: npcIds } } },
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

    res.status(200).json({ payload: { data: npcs, total: total.length } });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
