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
        cookies: []
      }
    },
    created() {
      console.log(this.$cookies.keys());
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
          let {protocol, hostname, port, path, query, hash} = getParamsFromUrl(decodeURIComponent(p.query.callback));
          if (!query) {
            query = {openid: openid}
          } else {
            query.openid = openid;
          }
          location.replace(makeUrl({protocol, hostname, port, path, query, hash}));
        }
        else if (type && type == "clear") {
          this.type = type;
          this.cookies = this.$cookies.keys();
        }
        else {
          location.replace(`http://${(p.query.plat && p.query.plat === 'pro') ? "" : "test-"}wechat-repeater.hztywl.cn/wechat/plat/oauth/${p.query.appid}?url=${encodeURIComponent(location.href)}`);
        }
      },
      goBack() {
        let user = userCache.get();
        let from = fromCache.get();
        let {protocol, hostname, port, path, query, hash} = getParamsFromUrl(from);
        //console.log(getParamsFromUrl(from).hostname);
        if (typeof query == "undefined") {
          query = {};
        }
        query.openid = user.id;
        let retUrl = makeUrl({protocol, hostname, port, path, query, hash});
        console.log(this.$cookies.keys());
        //alert(retUrl);
        //location.replace(retUrl);
      },
      clearCookies() {
        this.cookies.forEach((res) => {
          console.log(res, this.$cookies.remove(res, '/', '.hztywl.cn'));
        })
      }
    },

    watch: {}
  }
</script>

<style lang="scss"></style>
