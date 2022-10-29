import getApiParams from "helpers/getApiParams";
import Class from "models/class";

export const getClasses = async (req, res) => {
  try {
    const classId = getApiParams("id", req);

    if (!!classId) {
      const classes = await Class.findById(classId);

      res.status(200).json({ payload: classes });
    } else {
      const classes = await Class.find({}).sort({ name: 1 });
      res.status(200).json({ payload: classes });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
