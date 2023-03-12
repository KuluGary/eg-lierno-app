export default class Api {
  static async fetchInternal(url, options) {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      withCredentials: true,
    };

    return fetch(`${process.env.NEXT_PUBLIC_CLIENT}api${url}`, {
      headers,
      credentials: "include",
      ...options,
    }).then(async (response) => {
      if (response.status >= 400 && response.status < 500) {
        throw new Error(json.message);
      }

      const json = await response.json();

      return json?.payload ?? json;
    });
  }

  static async fetchExternal(url, options) {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      withCredentials: true,
    };

    return fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}api${url}`, {
      headers,
      credentials: "include",
      ...options,
    }).then(async (response) => {
      if (response.status >= 400 && response.status < 500) {
        throw new Error(json.message);
      }

      const json = await response.json();

      return json?.payload ?? json;
    });
  }
}
