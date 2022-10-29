import getApiParams from "helpers/getApiParams";
import getServerSession from "helpers/getServerSession";
import Character from "models/character";
import Monster from "models/monster";
import Npc from "models/npc";
import Tier from "models/tier";

export const getTier = async (req, res) => {
  try {
    const session = await getServerSession(req);

    if (!!session) {
      const tierId = getApiParams("id", req);

      if (!!tierId) {
        const tier = await Tier.findOne({ _id: tierId, createdBy: session.userId });

        if (!tier) return res.status(400).json({ message: "No tier found with this ID for this user." });

        return res.status(200).json({ payload: tier });
      } else {
        const tiers = await Tier.find({ createdBy: session.userId });

        return res.status(200).json({ payload: tiers });
      }
    } else {
      res.status(401).json({ message });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const postTier = async (req, res) => {
  try {
    const session = getServerSession(req);

    if (!!session) {
      const tier = req.body;
      tier["createdBy"] = session["userId"];
      const newTier = new Tier(tier);

      newTier.save((err) => {
        if (err) return res.status(403).json({ message: err });

        res.status(200).json({ payload: newTier._id });
      });
    } else {
      res.status(401).json({ message });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const putTier = async (req, res) => {
  try {
    const session = await getServerSession(req, res);

    if (!!session) {
      const tierId = getApiParams("id", req);

      Tier.findOneAndUpdate({ _id: tierId, createdBy: session.userId }, req.body, (err) => {
        if (err) return res.status(401).json({ message: err });

        return res.status(200).json({ message: "Tier modificado" });
      });
    } else {
      res.status(401).json({ message });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const deleteTier = async (req, res) => {
  try {
    const session = await getServerSession(req);

    if (!!session) {
      const tierId = getApiParams("id", req);

      await Tier.findOneAndDelete({ _id: tierId, createdBy: session.userId }, (err) => {
        if (err) return res.status(403).json({ message: "Error: " + err });

        return res.status(200).json({ message: "El tier ha sido eliminado" });
      });
    } else {
      res.status(401).json({ message });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const getTierByCreature = async (req, res) => {
  try {
    const tierId = getApiParams("tierId", req);
    const tierType = getApiParams("tierType", req);

    let payload = {};
    if (tierType === "npc") {
      payload = await Npc.find({ "flavor.group": tierId }, { _id: 1, "stats.challengeRating": 1 }).sort({
        "stats.challengeRating": 1,
      });
    } else if (tierType === "monster") {
      payload = await Monster.find({ "flavor.group": tierId }, { _id: 1, "stats.challengeRating": 1 }).sort({
        "stats.challengeRating": 1,
      });
    } else if (tierType === "character") {
      payload = await Character.find({ "flavor.group": tierId }, { _id: 1 });
    }

    res.status(200).json({ payload });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
