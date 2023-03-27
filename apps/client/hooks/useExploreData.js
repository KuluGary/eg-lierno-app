import { useState, useEffect } from "react";
import Api from "services/api";

const useExploreData = () => {
  const [loadingData, setLoadingData] = useState(false);
  const [spells, setSpells] = useState([]);
  const [items, setItems] = useState({});
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleItems = (apiItems) => {
    const newItems = {};

    apiItems.forEach((item) => {
      newItems[item.type] = [...(newItems[item.type] ?? []), item];
    });

    setItems(newItems);
  };

  const handleSpells = (apiSpells) => {
    const newSpells = {};

    apiSpells.forEach((spell) => {
      newSpells[spell.stats.level] = [...(newSpells[spell.stats.level] ?? []), spell];
    });

    setSpells(newSpells);
  };

  const handleClasses = (apiClasses) => {
    const newClasses = {};

    for (const charClass of apiClasses) {
      newClasses[charClass.game] = [...(newClasses[charClass.game] ?? []), charClass];
    }

    setClasses(newClasses)
  };

  const fetchData = async () => {
    setLoadingData(true);
    const setters = [handleItems, handleSpells, handleClasses];

    Promise.allSettled([Api.fetchInternal("/items"), Api.fetchInternal("/spells"), Api.fetchInternal("/classes")]).then(
      (response) => {
        response.forEach(({ status, value }, index) => {
          if (status === "fulfilled") {
            setters[index](value);
          }
        });
      }
    );
  };

  return {
    spells,
    items,
    classes,
    loadingData,
  };
};

export default useExploreData;
