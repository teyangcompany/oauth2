<template>
  <div id="app">
    <div v-if="type=='clear'">
      <div style="font-size: 12px">
        {{cookies}}
      </div>
      <div @click="clearCookies">清除</div>
    </div>
  </div>
</template>

<script>
  import {fromCache, userCache} from "./lib/cache"
  import {getParamsFromUrl, isBrower, makeUrl} from "./lib/util"

  export default {
    name: 'app',
    data() {
      return {
        page: "",
        type: '',
        cookies: ""
      }
    },
    created() {
      Log('浏览器信息', window.navigator.userAgent);
      //微信打开
      if (isBrower("micromessenger")) {
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
        let {type} = p.query;
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
          this.clearCookies();
          let red = makeUrl({protocol, hostname, port, path, query, hash});
          console.log('重定向地址', red);
          location.replace(red);
        }
        else if (type && type == "clear") {
          this.type = type;
          this.cookies = document.cookie;
        }
        else {
          location.replace(`http://${(p.query.plat && p.query.plat === 'pro') ? "" : "test-"}wechat-repeater.hztywl.cn/wechat/plat/oauth/${p.query.appid}?url=${encodeURIComponent(location.href)}&scope=snsapi_userinfo`);
        }
      },
      goBack() {
        let user = userCache.get();
        let from = fromCache.get();
        let {protocol, hostname, port, path, query, hash} = getParamsFromUrl(from);
        if (typeof query == "undefined") {
          query = {};
        }
        query.openid = user.id;
        let retUrl = makeUrl({protocol, hostname, port, path, query, hash});
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
