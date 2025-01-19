import axios, { AxiosInstance, AxiosRequestConfig, Canceler } from 'axios';
import queryString from "query-string";

export const CANCEL_KEY = 'CANCEL_PROMISE';

const { CancelToken } = axios;

export interface IPromiseWithCancel<R> extends Promise<R> {
  [CANCEL_KEY]?: () => void;
}

interface IOptions {
  rawResponse?: boolean;
}

export default class Request {
  api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      withCredentials: true,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
      paramsSerializer: (params) => {
        return queryString.stringify(params, { arrayFormat: 'comma' });
      },
    });
  }

  // setBaseUrl(url: string) {
  //   this.api.defaults.baseURL = url;
  // }

  setToken(token?: string) {
    this.api.defaults.headers.common = {
      ...this.api.defaults.headers.common,
      Authorization: token ? `Bearer ${token}` : undefined,
    };
  }

  setDeviceInfo(deviceInfo: string) {
    this.api.defaults.headers.common = {
      ...this.api.defaults.headers.common,
      Device: deviceInfo,
    };
  }

  get = <T = any>(
    url: string,
    config: AxiosRequestConfig = {},
    options?: IOptions,
  ) => {
    let cancel: Canceler;

    const newConfig: AxiosRequestConfig = {
      ...config,
      params: {
        ...config.params,
      },
      cancelToken: new CancelToken((c) => {
        cancel = c;
      }),
    };

    const request: IPromiseWithCancel<T> = this.api
      .get(url, newConfig)
      .then((response) => {
        return options?.rawResponse ? response : response.data;
      })
      .catch((error) => {
        if (!!process.browser && !window?.navigator?.onLine) {
          error = {
            ...error,
            response: {
              data: {
                error: 'COMMON.INTERNET_CONNECTION_ERROR',
                msg: 'COMMON.INTERNET_CONNECTION_ERROR',
                errors: [{ msg: 'COMMON.INTERNET_CONNECTION_ERROR' }],
              },
            },
          };
        }
        throw error;
      });

    request[CANCEL_KEY] = () => cancel();

    return request;
  };

  post = <T = any>(
    url: string,
    body?: any,
    config: AxiosRequestConfig = {},
    options?: IOptions,
  ) => {
    let cancel: Canceler;

    const newConfig: AxiosRequestConfig = {
      ...config,
      params: {
        ...config.params,
      },
      cancelToken: new CancelToken((c) => {
        cancel = c;
      }),
    };

    const request: IPromiseWithCancel<T> = this.api
      .post(url, body, newConfig)
      .then((response) => {
        return options?.rawResponse ? response : response.data;
      })
      .catch((error) => {
        if (!!process.browser && !window?.navigator?.onLine) {
          error = {
            ...error,
            response: {
              data: {
                error: 'COMMON.INTERNET_CONNECTION_ERROR',
                msg: 'COMMON.INTERNET_CONNECTION_ERROR',
                errors: [{ msg: 'COMMON.INTERNET_CONNECTION_ERROR' }],
              },
            },
          };
        }
        throw error;
      });

    request[CANCEL_KEY] = () => cancel();

    return request;
  };

  put = <T = any>(
    url: string,
    body?: any,
    config: AxiosRequestConfig = {},
    options?: IOptions,
  ) => {
    let cancel: Canceler;

    const newConfig: AxiosRequestConfig = {
      ...config,
      params: {
        ...config.params,
      },
      cancelToken: new CancelToken((c) => {
        cancel = c;
      }),
    };

    const request: IPromiseWithCancel<T> = this.api
      .put(url, body, newConfig)
      .then((response) => {
        return options?.rawResponse ? response : response.data;
      })
      .catch((error) => {
        if (!!process.browser && !window?.navigator?.onLine) {
          error = {
            ...error,
            response: {
              data: {
                error: 'COMMON.INTERNET_CONNECTION_ERROR',
                msg: 'COMMON.INTERNET_CONNECTION_ERROR',
                errors: [{ msg: 'COMMON.INTERNET_CONNECTION_ERROR' }],
              },
            },
          };
        }
        throw error;
      });

    request[CANCEL_KEY] = () => cancel();

    return request;
  };

  patch = <T = any>(
    url: string,
    body?: any,
    config: AxiosRequestConfig = {},
    options?: IOptions,
  ) => {
    let cancel: Canceler;

    const newConfig: AxiosRequestConfig = {
      ...config,
      params: {
        ...config.params,
      },
      cancelToken: new CancelToken((c) => {
        cancel = c;
      }),
    };

    const request: IPromiseWithCancel<T> = this.api
      .patch(url, body, newConfig)
      .then((response) => {
        return options?.rawResponse ? response : response.data;
      })
      .catch((error) => {
        if (!!process.browser && !window?.navigator?.onLine) {
          error = {
            ...error,
            response: {
              data: {
                error: 'COMMON.INTERNET_CONNECTION_ERROR',
                msg: 'COMMON.INTERNET_CONNECTION_ERROR',
                errors: [{ msg: 'COMMON.INTERNET_CONNECTION_ERROR' }],
              },
            },
          };
        }
        throw error;
      });

    request[CANCEL_KEY] = () => cancel();

    return request;
  };

  delete = <T = any>(
    url: string,
    config: AxiosRequestConfig = {},
    options?: IOptions,
  ) => {
    let cancel: Canceler;

    const newConfig: AxiosRequestConfig = {
      ...config,
      params: {
        ...config.params,
      },
      cancelToken: new CancelToken((c) => {
        cancel = c;
      }),
    };

    const request: IPromiseWithCancel<T> = this.api
      .delete(url, newConfig)
      .then((response) => {
        return options?.rawResponse ? response : response.data;
      })
      .catch((error) => {
        if (!!process.browser && !window?.navigator?.onLine) {
          error = {
            ...error,
            response: {
              data: {
                error: 'COMMON.INTERNET_CONNECTION_ERROR',
                msg: 'COMMON.INTERNET_CONNECTION_ERROR',
                errors: [{ msg: 'COMMON.INTERNET_CONNECTION_ERROR' }],
              },
            },
          };
        }
        throw error;
      });

    request[CANCEL_KEY] = () => cancel();

    return request;
  };
}
