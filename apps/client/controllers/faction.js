import getApiParams from "helpers/getApiParams";
import getServerSession from "helpers/getServerSession";
import Faction from "models/faction";

export const getFactions = async (req, res) => {
  try {
    const factionId = getApiParams("id", req);

    if (!!factionId) {
      const faction = await Faction.findById(factionId);

      res.status(200).json({ payload: faction });
    } else {
      const session = await getServerSession(req);

      if (!!session) {
        const total = await Faction.find({ name: { $regex: parsedQs }, createdBy: session.userId }).count();

        const factions = await Faction.find({ name: { $regex: parsedQs }, createdBy: session.userId })
          .sort({ name: 1 })
          .skip(parseInt(skip ?? 0))
          .limit(parseInt(limit ?? 0));

        res.status(200).json({ payload: { data: factions, total } });
      } else {
        res.status(401).json({ message: "Usuario sin autenticar." });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const postFaction = async (req, res) => {
  try {
    const session = await getServerSession(req);

    if (!!session) {
      const faction = req.body;
      faction["createdBy"] = session["userId"];
      const newFaction = new Faction(npc);

      newFaction.save((err) => {
        if (err) return res.status(403).json({ message: err });

        res.status(200).json({ payload: newFaction._id });
      });
    } else {
      res.status(401).json({ message: "Usuario sin autenticar." });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const putFaction = async (req, res) => {
  try {
    const session = getServerSession(req);

    if (!!session) {
      const factionId = getApiParams("id", req);

      Faction.findOneAndUpdate(factionId, req.body, (err) => {
        if (err) return res.status(403).json({ message: "La facción no ha podido ser modificado." });

        return res.status(200).json({ message: "Facción modificada" });
      });
    } else {
      res.status(401).json({ message: "Usuario sin autenticar." });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const deleteFaction = async (req, res) => {
  try {
    const session = await getServerSession(req);

    if (!!session) {
      const factionId = getApiParams("id", req);

      Faction.findOneAndDelete({ _id: factionId, createdBy: session["userId"] }, (err) => {
        if (err) return res.status(403).json({ message: "La facción no ha podido ser eliminada." });

        return res.status(200).json({ message: "La facción ha sido eliminada" });
      });
    } else {
      res.status(401).json({ message: "Usuario sin autenticar." });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const getCampaignFactions = async (req, res) => {
  try {
    const session = await getServerSession(req);

    if (!!session) {
      const campaignId = await getApiParams("id", req);
      const { skip, limit, qs } = req.query;
      const parsedQs = new RegExp(qs, "i");

      const total = await Faction.find({
        $and: [{ campaigns: campaignId }, { $or: [{ unlocked: true }, { createdBy: session.userId }] }],
      }).count();

      const factions = await Faction.find({
        $and: [{ campaigns: campaignId }, { $or: [{ unlocked: true }, { createdBy: session.userId }] }],
      })
        .sort({ name: 1 })
        .skip(parseInt(skip ?? 0))
        .limit(parseInt(limit ?? 0));

      res.status(200).json({ payload: { data: factions, total } });
    } else {
      res.status(401).json({ message: "Usuario sin autenticar." });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
