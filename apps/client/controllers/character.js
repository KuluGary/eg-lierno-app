import getApiParams from "helpers/getApiParams";
import getServerSession from "helpers/getServerSession";
import Character from "models/character";

export const getCharacters = async (req, res) => {
  try {
    const characterId = getApiParams("id", req);

    if (!!characterId) {
      const character = await Character.findById(characterId);

      res.status(200).json({ payload: character });
    } else {
      const session = await getServerSession(req);

      if (!!session) {
        const { skip, limit, qs } = req.query;
        const parsedQs = new RegExp(qs, "i");

        const total = await Character.aggregate([
          { $match: { name: { $regex: parsedQs }, createdBy: session.userId } },
          {
            $group: {
              _id: { $ifNull: ["$flavor.group", "$_id"] },
              id: { $first: "$_id" },
              name: { $first: "$name" },
              personality: { $first: "$flavor.personality" },
              avatar: { $first: "$flavor.portrait.avatar" },
              pronoun: { $first: "$flavor.traits.pronoun" },
              classes: { $first: "$flavor.stats.classes" },
              race: { $first: "$flavor.stats.race" },
              count: { $sum: 1 },
            },
          },
        ]);

        const characters = await Character.aggregate([
          { $match: { name: { $regex: parsedQs }, createdBy: session.userId } },
          {
            $group: {
              _id: { $ifNull: ["$flavor.group", "$_id"] },
              id: { $first: "$_id" },
              name: { $first: "$name" },
              personality: { $first: "$flavor.personality" },
              avatar: { $first: "$flavor.portrait.avatar" },
              pronoun: { $first: "$flavor.traits.pronoun" },
              classes: { $first: "$stats.classes" },
              race: { $first: "$stats.race" },
              count: { $sum: 1 },
            },
          },
          { $sort: { name: 1 } },
          { $skip: parseInt(skip) ?? 0 },
          { $limit: parseInt(limit) ?? 0 },
        ]);

        res.status(200).json({ payload: { data: characters, total: total.length } });
      } else {
        return res.status(401).json({ message: "Usuario sin autenticar." });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const postCharacter = async (req, res) => {
  try {
    const session = await getServerSession(req);
    if (!!session) {
      const character = req.body;
      character["createdBy"] = session["userId"];
      const newCharacter = new Character(character);

      newCharacter.save((err) => {
        if (err) return res.status(403).json({ message: err });

        res.status(200).json({ payload: newCharacter._id });
      });
    } else {
      res.status(401).json({ message: "Usuario sin autenticar." });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const putCharacter = async (req, res) => {
  try {
    const session = await getServerSession(req);

    if (session) {
      const characterId = getApiParams("id", req);

      Character.findOneAndUpdate({ _id: characterId, createdBy: session.userId }, req.body, (err) => {
        if (err) return res.status(403).json({ message: "El personaje no ha podido ser modificado." });

        return res.status(200).json({ message: "Personaje modificado" });
      });
    } else {
      return res.status(401).json({ message: "Usuario sin autenticar." });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const deleteCharacter = async (req, res) => {
  try {
    const session = await getServerSession(req);

    if (session) {
      const characterId = getApiParams("id", req);

      await Character.findOneAndDelete({ _id: characterId, createdBy: session.userId }, (err) => {
        if (err) return res.status(500).json({ message: err });

        return res.status(200).json({ message: "El personaje ha sido eliminado" });
      });
    } else {
      res.status(401).json({ message: "Usuario sin autenticar." });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
