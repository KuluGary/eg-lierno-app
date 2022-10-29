import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

const getServerSession = async (req) => {
  const secret = process.env.SECRET;
  const token = await getToken({ req, secret: secret, raw: true });

  return jwt.verify(token, secret, (err, data) => {
    if (err || !data) return null;

    return data;
  });
};

export default getServerSession;
