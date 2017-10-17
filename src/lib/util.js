import config from "./config"

/**
 * 生成指定长度随机数
 * @param length
 * @returns {string}
 */
export function makeRandom(length) {
  let str = "0123456789", ret = "";
  for (let i = 0; i < length; i++) {
    ret += str.substr(Math.floor(Math.random() * str.length), 1);
  }
  return ret;
}

/**
 * 根据条件返回数组指定元素
 * @param array
 * @param fn
 * @returns {null}
 */
export function arrayFind(array, fn) {
  let index = array.findIndex(fn);
  return index > -1 ? array[index] : null;
}

/**
 * 判断浏览器类型
 * @param name
 * iphone
 * android
 * micromessenger
 * @returns {boolean}
 */
export function isBrower(name) {
  let UA = window.navigator.userAgent.toLowerCase();
  return UA.indexOf(name) > -1;
}


export function getAppid(callback) {
  let hostname = url("hostname", callback);
  let appid = "";
  for (let key in config.appid) {
    if (hostname == key) {
      appid = config.appid[key];
    }
  }
  if (!appid) {
    appid = config.appid[Object.keys(config.appid)[0]];
  }
  return appid;
}

/**
 * 根据来源获得api_url
 * @param callback
 * @returns {string}
 */
export function getApiUrl(callback) {
  let hostname = url("hostname", callback);
  let api_url = "";
  for (let key in config.api_url) {
    if (hostname == key) {
      api_url = config.api_url[key];
    }
  }
  if (!api_url) {
    api_url = config.api_url[Object.keys(config.api_url)[0]];
  }
  return api_url;
}

/**
 * 生成跳转链接
 * @param options
 * @returns {string}
 */
export function makeUrl(options) {
  let url = "";
  if (options.protocol) {
    url += options.protocol + "://"
  }
  if (options.hostname) {
    url += options.hostname
  }
  if (options.port && options.port != 80) {
    url += ":" + options.port
  }
  if (options.path) {
    url += options.path
  }
  if (options.query) {
    let q = "";
    for (let key in options.query) {
      if (options.query[key]) {
        q += `&${key}=${options.query[key]}`
      } else {
        q += `&${key}`
      }

    }
    q = q.substr(1);
    url += "?" + q
  }
  if (options.hash) {
    url += "#" + options.hash;
  }
  return url;
}

/**
 * 解析url参数
 * @param from
 * @returns {{protocol: *, hostname: *, port: *, path: *, query: *, hash: *}}
 */
export function getParamsFromUrl(from) {
  let protocol = url("protocol", from);
  let hostname = url("hostname", from);
  let port = url("port", from);
  let path = url("path", from);
  let query = url("?", from);
  let hash = url("hash", from);
  return {protocol, hostname, port, path, query, hash}
}
