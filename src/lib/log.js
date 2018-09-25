import axios from "axios";

export default function (data) {
  let axiosConfig = {
    url: '//log.limingwei.name/api/log',
    method: "post",
    data: data
  };
  return axios(axiosConfig)
    .then((res) => {
      if (res.status == 200) {
        return res.data;
      }
    });
}
