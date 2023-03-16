import getApiParams from "helpers/getApiParams";
import getServerSession from "helpers/getServerSession";
import Spell from "models/spell";

export const getSpell = async (req, res) => {
  try {
    const id = getApiParams("id", req);

    if (!!id) {
      const spellIds = JSON.parse(id);

      if (spellIds.length > 1) {
        const spells = await Spell.find({ _id: { $in: spellIds } });

        res.status(200).json({ payload: spells });
      } else {
        const spell = await Spell.findById(spellIds[0]);

        res.status(200).json({ payload: spell });
      }
    } else {
      const session = await getServerSession(req);

      if (!!session) {
        const spells = await Spell.find({ $or: [{ public: true }, { public: false, createdBy: session.userId }] });

        return res.status(200).json({ payload: spells });
      } else {
        return res.status(401).json({ message: "Usuario sin autenticar." });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const postSpell = async (req, res) => {
  try {
    const session = await getServerSession(req);

    if (!!session) {
      const spell = req.body;
      spell["createdBy"] = session["userId"];
      const newSpell = new Spell(spell);

      newSpell.save((err) => {
        if (err) return res.status(403).json({ message: err });

        res.status(200).json({ payload: newSpell._id });
      });
    } else {
      res.status(401).json({ message: "Usuario sin autenticar." });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
