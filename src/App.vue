<template>
  <div id="app">
    <div v-if="query.debug&&query.debug==1">
      <h3 @click="goOauth2(hrefParams)">去授权</h3>
      <h3 @click="goBack(hrefParams,true)">返回</h3>
      <pre style="font-size: 14px">{{query}}</pre>
      <pre style="font-size: 14px">{{hrefParams}}</pre>
      <pre style="font-size: 14px">{{cookie}}</pre>
    </div>
  </div>
</template>

<script>
  import {getParamsFromUrl, isBrower, makeUrl} from "./lib/util"

  export default {
    name: 'app',
    data() {
      return {
        page: "",
        hrefParams: {},
        query: {},
        cookies: "",
        cookie: ''
      }
    },
    created() {
      Log('浏览器信息', window.navigator.userAgent);
      //微信打开
      const hrefParams = getParamsFromUrl(location.href);
      this.hrefParams = hrefParams;
      this.query = hrefParams.query;
      this.cookie = document.cookie;
      if (hrefParams.query.debug) {

      } else if (isBrower("micromessenger")) {
        this.weixinInit();
      } else {
        //非微信打开
      }
    },
    methods: {
      weixinInit() {
        let p = getParamsFromUrl(location.href);
        if (!p.query) {
          alert("get参数不能为空");
          return
        }
        let openid = this.$cookies.get(`openid_${p.query.appid}`);
        if (openid) {
          console.log('cb', p.query.callback);
          let {protocol, hostname, port, path, query, hash} = getParamsFromUrl((p.query.callback));
          //console.log('query', query);
          if (!query) {
            query = {openid: openid}
          } else {
            query.openid = openid;
          }
          query.t = new Date().getTime();
          this.clearCookies();
          let red = makeUrl({protocol, hostname, port, path, query, hash});
          console.log('重定向地址', red);
          location.href = red;
        }
        else {
          this.goOauth2(p);
        }
      },
      goOauth2(p) {
        location.replace(`http://${(p.query.plat && p.query.plat === 'pro') ? "" : "test-"}wechat-repeater.hztywl.cn/wechat/plat/oauth/${p.query.appid}?url=${encodeURIComponent(location.href)}&scope=snsapi_userinfo`);
      },
      goBack(p, showRed = false) {
        let openid = this.$cookies.get(`openid_${p.query.appid}`);
        let {protocol, hostname, port, path, query, hash} = getParamsFromUrl((p.query.callback));
        //console.log('query', query);
        if (!query) {
          query = {openid: openid}
        } else {
          query.openid = openid;
        }
        query.t = new Date().getTime();
        this.clearCookies();
        let red = makeUrl({protocol, hostname, port, path, query, hash});
        console.log('重定向地址', red);
        if (showRed) alert(red);
        location.href = red;
      },
      clearCookies() {
        this.$cookies.keys().forEach((res) => {
          console.log(res, this.$cookies.remove(res, '/', '.hztywl.cn'));
        })
      }
    },
    watch: {}
  }
</script>

<style lang="scss"></style>
