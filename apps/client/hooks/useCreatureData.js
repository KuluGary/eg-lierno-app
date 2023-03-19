import { useState, useEffect } from "react";
import Api from "services/api";

const useCreatureData = (creature, type) => {
  const [loadingData, setLoadingData] = useState(false);
  const [spells, setSpells] = useState([]);
  const [items, setItems] = useState([]);
  const [tier, setTier] = useState(null);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    if (!!creature) fetchData();
  }, [creature]);

  const fetchData = async () => {
    setLoadingData(true);
    if (!!creature.stats.spells && creature.stats.spells.length > 0) {
      const spellIds = [];

      creature.stats.spells.forEach((spellcasting) => {
        Object.values(spellcasting.spells || {})?.forEach((spellLevel) => {
          spellIds.push(...spellLevel);
        });
      });

      const apiSpells = await Api.fetchInternal(`/spells?spellIds=${spellIds.map((spell) => spell.spellId).join(",")}`);

      setSpells(apiSpells);
    }

    const apiClasses = await Api.fetchInternal("/classes/");

    setClasses(apiClasses);

    if (!!creature?.stats?.equipment && Object.values(creature?.stats?.equipment)?.some((arr) => arr?.length > 0)) {
      const objects = [];

      for (const key in creature.stats.equipment || {}) {
        const element = creature.stats.equipment[key];

        if (Array.isArray(element)) {
          objects.push(...element.map((i) => i.id));
        }
      }

      let items = await Api.fetchInternal(`/items?itemIds=${objects.join(",")}`);

      items = items.map(({ _id, name, description }) => ({
        id: _id,
        name,
        description,
      }));

      setItems(items);
    }

    if (!!creature?.flavor.group && !!creature?.flavor?.group?.length > 1) {
      const tier = await Api.fetchInternal(`/tier/creature?tierType=${type}&tierId=${creature.flavor.group}`).then(
        (res) => res.map((el) => el._id)
      );

      setTier(tier);
    }

    setLoadingData(false);
  };

  return {
    loadingData,
    spells,
    items,
    tier,
    classes,
  };
};

export default useCreatureData;
