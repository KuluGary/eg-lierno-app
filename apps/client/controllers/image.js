import { createToken, getOriginalImage, getSmallImage } from "services/image";
import imgurUploader from "imgur-uploader";
import formidable from "formidable";

export const postImage = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, _, files) => {
      if (err) return res.status(400).json({ message: err });
      const { original, crop } = files;

      const originalName = original.newFilename || original.originalFilename;

      const originalImage = await getOriginalImage(original.filepath);
      const token = await createToken(original.filepath);
      const avatar = await getSmallImage(crop.filepath);

      const uploadImage = (image, title = "test", type) => {
        return new Promise((resolve, reject) => {
          imgurUploader(image, { title }, process.env.IMGUR_CLIENT_ID)
            .then(({ link }) => resolve({ type, link }))
            .catch((err) => reject(err));
        });
      };

      Promise.all([
        uploadImage(originalImage, originalName, "original"),
        uploadImage(token, originalName, "token"),
        uploadImage(avatar, originalName, "avatar"),
      ])
        .then((images) => {
          res.status(200).json({ images });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: "Err: " + err });
        });
    });
  } catch (error) {
    console.error({ error });
    res.status(400).json({ message: error });
  }
};
