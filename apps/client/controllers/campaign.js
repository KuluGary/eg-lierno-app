import getApiParams from "helpers/getApiParams";
import getServerSession from "helpers/getServerSession";
import jwt from "jsonwebtoken";
import Campaign from "models/campaign";
import User from "models/user";
import mailer from "nodemailer";

export const getCampaign = async (req, res) => {
  try {
    const campaignId = getApiParams("id", req);

    if (!!campaignId) {
      const campaign = await Campaign.findById(campaignId);

      res.status(200).json({ payload: campaign });
    } else {
      const session = await getServerSession(req);

      if (!!session) {
        const campaigns = await Campaign.find({
          $or: [{ players: { $all: [session.userId] } }, { dm: session.userId }],
        });

        res.status(200).json({ payload: campaigns });
      } else {
        res.status(401).json({ message: "Usuario sin autenticar." });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const postCampaign = async (req, res) => {
  try {
    const session = await getServerSession(req);

    if (!!session) {
      const campaign = req.body;
      campaign["createdBy"] = session["userId"];
      const newCampaign = new Campaign(campaign);

      newCampaign.save((err) => {
        if (err) return res.status(500).json({ message: err });

        res.status(200).json({ message: "Campaign añadida correctamente." });
      });
    } else {
      res.status(401).json({ message: "Usuario sin autenticar." });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const putCampaign = async (req, res) => {
  try {
    const session = await getServerSession(req);

    if (!!session) {
      const characterId = getApiParams("id", req);

      Campaign.findByIdAndUpdate(characterId, req.body, { upsert: true }, (err) => {
        if (err) return res.status(403).json({ message: "La campaña no ha podido ser modificada." });

        return res.status(200).json({ message: "Campaña modificada" });
      });
    } else {
      res.status(401).json({ message: "Usuario sin autenticar." });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const session = await getServerSession(req);

    if (!!session) {
      Campaign.findOneAndDelete({ _id: req.params.id, dm: session["userId"] }, (err) => {
        if (err) return res.status(403).json({ message: "La campaña no ha podido ser eliminado." });

        return res.status(200).json({ message: "La campaña ha sido eliminada" });
      });
    } else {
      res.status(401).json({ message: "Usuario sin autenticar." });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const activatePlayer = async (req, res) => {
  try {
    const { token } = req.query;
    const secret = process.env.SECRET;

    jwt.verify(token, secret, async (err, data) => {
      if (err || !data) return res.status({ message: "Token de activación invalido" });

      const { id, email } = data;

      const user = await User.findOne({ "metadata.email": email });

      if (!user) return res.status(403).json({ message: "No hay ningún usuario con este email." });

      const campaign = await Campaign.findById(id);
      const indexToModify = campaign.players.findIndex((player) => player.email === email);

      const player = {
        email,
        active: true,
        id: user._id?.toString(),
      };

      campaign.players[indexToModify] = player;

      Campaign.findByIdAndUpdate(id, campaign, (err) => {
        if (err) return res.status(403).json({ message: "No se ha podido activar al jugador" });

        res.redirect(`/campaigns/${id}`);
      });
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const sendActivationPlayer = async (req, res) => {
  try {
    const id = getApiParams("id", req);
    const email = getApiParams("email", req);
    const secret = process.env.SECRET;
    const campaign = await Campaign.findById(id);

    const token = jwt.sign({ email, id }, secret, { expiresIn: "7d" });

    const transporter = mailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.G_EMAIL,
        pass: process.env.G_PASS,
        clientId: process.env.G_OAUTH_CLIENT_ID,
        clientSecret: process.env.G_OAUTH_SECRET,
        refreshToken: process.env.G_OAUTH_REFRESH_TOKEN,
      },
    });

    const mailOptions = {
      from: process.env.G_MAIL,
      to: email,
      subject: `Has sido invitado a la campaña ${campaign?.name}`,
      html: acceptInvitation
        .replace("|USERNAME|", email)
        .replace("|CAMPAIGN|", campaign?.name)
        .replace("|URL|", `${process.env.NEXT_PUBLIC_CLIENT}/api/v1/campaigns/activation/activate?token=${token}`)
        .replace("|DATE|", `${new Date().getFullYear()}`),
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) return res.status(500).json({ message: "Error al enviar la invitación a " + email });

      return res.status(200).json({ message: `Invitación enviada a ${email}` });
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const getCampaignPlayers = async (req, res) => {
  try {
    const campaignId = getApiParams("id", req);

    const campaign = await Campaign.findById(campaignId);

    const playerEmails = Object.values(campaign.players.map(({ email }) => email));

    const players = await User.find({ "metadata.email": { $in: playerEmails } });

    const dm = await User.findOne({ _id: campaign.dm });

    res.status(200).json({
      payload: {
        dm: {
          id: dm._id,
          name: dm.username,
          avatar: dm.metadata.avatar,
          metadata: dm.metadata,
        },
        players: players.map((player) => ({
          id: player._id,
          name: player.username,
          avatar: player.metadata.avatar,
          metadata: player.metadata,
        })),
      },
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
