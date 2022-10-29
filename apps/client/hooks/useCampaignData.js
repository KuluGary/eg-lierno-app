import { useEffect, useState } from "react";
import Api from "services/api";

const useCampaignData = (campaign) => {
  const [data, setData] = useState({
    dm: null,
    players: null,
    characters: null,
  });

  useEffect(() => {
    if (!!campaign) fetchData();
  }, [campaign]);

  const fetchData = async () => {
    const playerData = await Api.fetchInternal(`/campaigns/players/${campaign._id}`);

    setData((oldData) => ({
      ...oldData,
      ...playerData,
    }));
  };

  return data;
};

export default useCampaignData;
