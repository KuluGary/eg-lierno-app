import sharp from "sharp";

const mask = process.env.SHARP_MASK_URL;
const template = process.env.SHARP_TEMPLATE_URL;
const token_size = process.env.TOKEN_SIZE || 260;

export const createToken = async (buffer) => {
  try {
    const maskFile = await fetch(mask)
      .then((res) => res.arrayBuffer())
      .then((res) => new Uint8Array(res));

    const templateFile = await fetch(template)
      .then((res) => res.arrayBuffer())
      .then((res) => new Uint8Array(res));

    return new Promise((resolve, reject) => {
      fetch(mask);
      sharp(buffer)
        .resize({ width: token_size })
        .composite([
          {
            input: maskFile,
            blend: "dest-in",
          },
          {
            input: templateFile,
          },
        ])
        .png()
        .toBuffer()
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  } catch (e) {
    console.error(e);
  }
};

export const getSmallImage = async (buffer) => {
  try {
    return new Promise((resolve, reject) => {
      sharp(buffer)
        .resize({ width: token_size })
        .png()
        .toBuffer()
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  } catch (e) {
    console.error(e);
  }
};

export const getOriginalImage = async (buffer) => {
  try {
    return new Promise((resolve, reject) => {
      sharp(buffer)
        .png()
        .toBuffer()
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  } catch (e) {
    console.error(e);
  }
};
