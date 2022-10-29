import { activateAccount } from "assets/email/activateAccount";
import bcrypt from "bcrypt";
import getServerSession from "helpers/getServerSession";
import jwt from "jsonwebtoken";
import User from "models/user";
import mailer from "nodemailer";

export const signUp = async (req, res) => {
  try {
    const { username, password, metadata } = req.body;
    const checkUser = await User.findOne({ $or: [{ username }, { "metadata.email": metadata.email }] });

    if (checkUser) return res.status(403).json({ message: "Usuario ya registrado" });

    bcrypt.hash(password, 10, (_, hash) => {
      const newUser = new User({
        username,
        password: hash,
        metadata,
        role: "USER",
      });

      newUser.save((err) => {
        if (err) return res.status(500).json({ message: err });

        const token = jwt.sing(
          {
            _id: newUser._id,
            username,
            password: hash,
          },
          process.env.SECRET_KEY,
          { expiresIn: "24h" }
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
          from: process.env.G_EMAIL,
          to: metadata.email,
          subject: "Activación de cuenta en Lierno App ✔",
          html: activateAccount
            .replace("|USERNAME|", username)
            .replace("|URL|", `${process.env.NEXT_PUBLIC_CLIENT}/api/v1/auth/activate/${token}`)
            .replace("|DATE|", `${new Date().getFullYear()}`),
        };

        transporter.sendMail(mailOptions, (err) => {
          if (err) return res.status(500).json({ message: "Error en la creación de cuenta: " + err });

          return res
            .status(200)
            .json({ message: "Cuenta registrada. Se ha enviado un mail de activación a " + metadata.email });
        });
      });
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (!result || err) return res.status(403).json({ message: "Contraseña incorrecta" });
      });

      res
        .status(200)
        .json({ name: user.username, image: user.metadata.avatar, email: user.metadata.email, id: user._id });
    } else {
      res.status(403).json({ message: "Nombre de usuario incorrecto" });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const getUser = async (req, res) => {
  try {
    if (!!req.params?.id) {
      const user = await User.findById(req.params.id, { username: 1, _id: 0 });

      res.status(200).json({ payload: user });
    } else {
      const session = await getServerSession(req);

      if (session) {
        const user = await User.findById(session.userId);

        res.status(200).json({ payload: user });
      } else {
        res.status(401).json({ message: "Usuario sin autenticar." });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const postUser = async (req, res) => {
  try {
    const token = getToken({ req });

    if (token) {
      const { profile } = req.body;

      if (!profile) return res.status(400).json({ message: "No se ha enviado un perfil actualizado." });

      User.findById(req.params.id, (_, user) => {
        if (!user) return res.status(404).send({ message: "No hay usuario con el ID seleccionado." });

        // @TODO: Implement dicord functions
        // if (profile.discordName) {
        //   if (user.metadata.discordName !== profile.discordName) {
        //     profile["discordId"] = discordUtils.get_userid(profile.discordName);
        //   }
        // }

        user.metadata = profile;

        user.save();
        res.json(200).send({ message: "Usuario actualizado." });
      });
    } else {
      res.status(401).json({ message: "Usuario sin autenticar." });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
