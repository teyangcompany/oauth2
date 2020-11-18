<template>
  <div id="app" style="font-size: 1em">
    <div v-if="query&&query.debug">
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
  import config from './lib/config'

  export default {
    name: 'app',
    data() {
      return {
        brower: '',
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
      this.query = hrefParams.query || {};
      this.cookie = document.cookie;
      if (this.query.debug) {
        eruda.init();
      }

      if (isBrower("micromessenger")) {
        this.brower = 'weixin';
        this.weixinInit();
      } else if (isBrower('alipayclient')) {
        this.brower = 'alipay';
        this.alipayInit();
      } else {
        //非微信支付宝打开
      }
    },
    methods: {
      alipayInit() {
        let p = getParamsFromUrl(location.href);
        if (!p.query) {
          alert("get参数不能为空");
          return
        }
        const APPID = config.alipay_appid[location.hostname];
        let cookie = this.$cookies.get('alipayuserid_' + APPID);
        if (cookie) {
          cookie = cookie.split('_');
          let {protocol, hostname, port, path, query, hash} = getParamsFromUrl((p.query.callback));
          if (!query) {
            query = {openid: cookie[0], next: cookie[1] || ''}
          } else {
            query.openid = cookie[0];
            query.next = cookie[1] || '';
          }
          query.t = new Date().getTime();
          this.clearCookies();
          let red = makeUrl({protocol, hostname, port, path, query, hash});
          console.log('重定向地址', red);
          location.href = red;
        } else {
          this.goOauth2();
        }

      },
      weixinInit() {
        let p = getParamsFromUrl(location.href);
        if (!p.query) {
          alert("get参数不能为空");
          return
        }
        let openid = this.$cookies.get(`openid_${p.query.appid}`)||'';
        if(!openid) openid=p.query.openid;
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
          //this.clearCookies();
          let red = makeUrl({protocol, hostname, port, path, query, hash});
          console.log('重定向地址', red);
          location.href = red;
        } else {
          this.goOauth2(p);
        }
      },

      //http://test-wechat-repeater.hztywl.cn/wechat/plat/oauth/wxa49f90b4ff678ef2?url=https%3a%2f%2fwww.baidu.com&scope=snsapi_userinfo
      goOauth2(p) {
        const {hostname} = location;
        const APPID = config.alipay_appid[location.hostname];
        if (this.brower === 'weixin') {
          location.replace(`http://${(p.query.plat && p.query.plat === 'pro') ? "" : "test-"}wechat-repeater.hztywl.cn/wechat/plat/oauth/${p.query.appid}?url=${encodeURIComponent(location.href)}&scope=snsapi_userinfo`);
        } else if (this.brower === 'alipay') {
          location.replace(config.alipay_oauth2[hostname] + '/alipay/oauth/' + APPID + '?scope=auth_user&url=' + encodeURIComponent(location.href));
        }
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
