const getApiParams = (key, req) => {
  const param = req?.query?.[key];

  if (!!param && Array.isArray(param) && param?.length === 1) {
    return param[0];
  }

  return param;
};

export default getApiParams;
