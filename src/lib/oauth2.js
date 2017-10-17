import {getApiUrl, getAppid, isBrower} from "./util"
import http from "./http"
import {fromCache, userCache} from "./cache";

let APPID = "wx3d274480f31f6de2";

//wxb283692c5429f0e8 --pro
//wxe24cab30ebb1e366 --dev
let COMPONENT_APPID = "wxe24cab30ebb1e366";

function getParams() {
  let query = url("?");
  let hash = url("#");
  let params = Object.assign({}, query, hash);
  return params;
}

function getOpenidByCode(code, callback, cb) {
  let url = getApiUrl(callback);
  http("smarthos.wechat.user.get.bycode", {code}, {url}).then((res) => {
    if (res.code == 0 && res.obj) {
      userCache.set(res.obj);
      cb();
    }
    else {
      let msg = `根据${code}未获得openid`;
      alert(msg);
      console.log(msg);
    }
  });
}

function initWeixin(cb) {
  let p = getParams();
  if (!p.callback) {
    p.callback = "http://pat-test.gjwlyy.com/gjhlwyy/index.html?v2#/";
  } else {
    p.callback = decodeURIComponent(p.callback);
  }
  if (p.code) {
    getOpenidByCode(p.code, p.callback, cb);
  } else {
    APPID = getAppid(p.callback);
    if (p.appid) {
      APPID = p.appid;
    }

    if (p.callback.indexOf("www.gjwlyy.com") >= 0) {
      COMPONENT_APPID = "wxb283692c5429f0e8";
    }

    console.log(APPID, p.appid, COMPONENT_APPID);
    let href = location.href;
    let redirect_uri = encodeURIComponent(href);
    let jumpTo = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE&component_appid=${COMPONENT_APPID}#wechat_redirect`;
    location.replace(jumpTo);
  }

  //https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7d475d39a1ea1aa9&redirect_uri=http%3a%2f%2ftest-wechat-repeater.hztywl.cn%2f&response_type=code&scope=snsapi_userinfo&state=STATE&component_appid=wxe24cab30ebb1e366#wechat_redirect

}

export default (cb) => {
  /*微信打开*/
  if (isBrower("micromessenger")) {
    initWeixin(cb);
  }
  /*非微信打开*/
  else {
    userCache.set({id: "demo"});
    fromCache.set("http://pat-test.hztywl.cn/gjhlwyy/index.html?v2#/bind");
    //getParams();
    cb();
  }
}
