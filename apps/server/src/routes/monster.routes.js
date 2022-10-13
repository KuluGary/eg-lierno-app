const router = require("express").Router();

const {
  getMonster,
  postMonster,
  putMonster,
  deleteMonster,
  postMonsterInfo,
  getCampaignMonsters,
} = require("../controllers/monster");

router.get("/monsters/:id?", getMonster);

router.post("/monsters", postMonster);

router.put("/monsters/:id", putMonster);

router.delete("/monster/:id", deleteMonster);

router.post("/monsterinfo", postMonsterInfo);

router.get("/campaigns/:id/monsters", getCampaignMonsters);

module.exports = router;
