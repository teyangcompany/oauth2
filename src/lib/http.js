import axios from "axios";
import config from "./config"
import {makeRandom} from "./util"

export default function (service, options, conf) {
  let baseParams = config.base_params;
  baseParams.random = makeRandom(4);
  let data = {
    service,
    ...baseParams,
    ...options
  };

  let sign = hex_md5(hex_md5(config.password) + JSON.stringify(data));

  let axiosConfig = {
    method: "post",
    headers: {
      "sign": sign,
      "Content-Type": "application/json"
    },
    data: data
  }


  if (conf) {
    axiosConfig = Object.assign({}, axiosConfig, conf);
  }

  return axios(axiosConfig)
    .then((res) => {
      if (res.status == 200) {
        return res.data;
      }
    });
}
