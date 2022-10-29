const Campaign = require("../models/campaign");
const User = require("../models/user");
const utils = require("../utils/utils");
const mailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;
const acceptInvitationTemplate = require("../utils/email-templates/accept-invitation");

module.exports.getCampaigns = async (req, res) => {
  try {
    const { valid, decoded, message } = utils.validateToken(req.headers.authorization);

    if (valid) {
      if (!!req.params.id) {
        const campaign = await Campaign.findById(req.params.id);

        res.status(200).json({ payload: campaign });
      } else {
        if (decoded.role === "SUPER_ADMIN") {
          const campaigns = await Campaign.find({});

          return res.status(200).json({ payload: campaigns });
        }

        const campaigns = await Campaign.find({
          $or: [{ players: { $all: [decoded.userId] } }, { dm: decoded.userId }],
        });

        res.status(200).json({ payload: campaigns });
      }
    } else {
      res.status(401).json({ message });
    }
  } catch (e) {
    res.status(400).json({ message: "Internal server error: " + e });
  }
};

module.exports.postCampaigns = async (req, res) => {
  try {
    const { valid, decoded, message } = utils.validateToken(req.headers.authorization);

    if (valid) {
      const campaign = req.body;
      campaign["createdBy"] = decoded["userId"];
      const newCampaign = new Campaign(campaign);

      newCampaign.save(function (err) {
        if (err) return res.json(500, { message: err });

        res.status(200).json({ message: "Campaña añadida correctamente" });
      });
    } else {
      res.status(401).json({ message });
    }
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

module.exports.putCampaigns = async (req, res) => {
  try {
    const { valid, decoded, message } = utils.validateToken(req.headers.authorization);

    if (valid) {
      Campaign.findOneAndUpdate({ _id: req.params.id, dm: decoded.userId }, req.body, { upsert: true }, (err) => {
        if (err) return res.status(403).json({ message: "La campaña no ha podido ser modificada." });

        return res.status(200).json({ message: "Campaña modificada" });
      });
    } else {
      res.status(401).json({ message });
    }
  } catch (e) {
    res.status(400).json({
      message: "La campaña no ha podido ser modificada.",
    });
  }
};

module.exports.sendActivationToPlayers = async (req, res) => {
  try {
    const { id, email } = req.params;
    const campaign = await Campaign.findById(id);

    const token = jwt.sign(
      {
        email,
        id,
      },
      secret,
      {
        expiresIn: "7d",
      }
    );

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
      html: acceptInvitationTemplate
        .replace("|USERNAME|", email)
        .replace("|CAMPAIGN|", campaign?.name)
        .replace("|URL|", `${process.env.SERVER_URL}/api/v1/campaigns/activate-player/${token}`)
        .replace("|DATE|", `${new Date().getFullYear()}`),
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) return res.status(500).json({ message: "Error al enviar la invitación a " + email });

      return res.status(200).json({ message: `Invitación enviada a ${email}` });
    });
  } catch (e) {
    res.status(400).json({
      message: "No se ha podido enviar la invitación.",
      error: e,
    });
  }
};

module.exports.activatePlayer = async (req, res) => {
  try {
    const { token } = req.params;

    jwt.verify(token, secret, async (_, data) => {
      if (!data) return res.status({ message: "Token de activación invalido" });

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

        res.redirect(`${process.env.CLIENT_URL}/campaigns/${id}`);
      });
    });
  } catch (e) {
    res.status(400).json({
      message: "No se ha podido aceptar al jugador.",
    });
  }
};
