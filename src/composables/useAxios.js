import axios from 'axios';

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('accessToken');

  if (!token) {
    return { ok: false, message: 'No se encontró el token de acceso.' };
  }

  return {
    ok: true,
    config: {
      headers: {
        Authorization: token,
      },
    },
  };
};

export class useAxios {
  static async get(url, params) {
    const { ok, config, message } = getAuthHeaders();
    if (!ok) {
      return { ok: false, message };
    }
    const response = await axios.get(url, {
      params,
      headers: config.headers,
    });
    return response;
  }

  static async postUnauthenticated(url, body) {
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  }
  static async post(url, body, content = false) {
    const { ok, config, message } = getAuthHeaders();
    if (!ok) {
      return { ok: false, message };
    }
    const headers = !content
      ? config
      : {
          headers: {
            Authorization: config.headers.Authorization,
            'Content-Type': 'multipart/form-data',
          },
        };
    const response = await axios.post(url, body, headers);
    return response;
  }
  static async put(url, body) {
    const { ok, config, message } = getAuthHeaders();
    if (!ok) {
      return { ok: false, message };
    }
    const response = await axios.put(url, body, config);
    return response;
  }
  static async delete(url) {
    const { ok, config, message } = getAuthHeaders();
    if (!ok) {
      return { ok: false, message };
    }
    const response = await axios.delete(url, config);
    return response;
  }
}
