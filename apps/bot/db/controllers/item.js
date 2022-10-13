const Item = require("../models/item");

/**
 * Returns the wanted item from the DB
 * @param {string} itemName name of the item to get
 * @returns {object} the item from the DB
 */
module.exports.getItem = async (itemName) => {
  const item = await Item.findOne({ name: itemName });

  if (!!item) return item;
};
