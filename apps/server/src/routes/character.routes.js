const router = require("express").Router();

const {
  getCharacters,
  getDmCharacters,
  putCharacters,
  deleteCharacters,
  postCharacters,
  getCharacterInfo,
  postUserCharacters,
  getUserCharacters,
  getCharacterSheet,
} = require("../controllers/character");

router.get("/characters/:id?", getCharacters);

router.post("/characters", postCharacters);

router.put("/characters/:id", putCharacters);

router.delete("/character/:id", deleteCharacters);

router.get("/dm-characters", getDmCharacters);

router.get("/user/:id/characters", getUserCharacters);

router.get("/characters/sheet/pdf/:id", getCharacterSheet);

router.post("/characterinfo", getCharacterInfo);

router.post("/usercharacter/", postUserCharacters);

module.exports = router;
