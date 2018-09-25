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
          //http://wx.hztywl.cn/typay/oauth2.html?project=zsyy_test&service=smarthos.yygh.ApiyGHpaymentService.ghPayment&orgid=888&paymode=2&ddid=10000325&redirect=http%3A%2F%2Flocalhost%3A8080%2F%3Fversion%3D1.0.123%23%2Ftbook%2Fsucceed%3Fhzid%3D25325760512%26orgid%3D888%26orderid%3D&callback=http%253A%252F%252Fwx.hztywl.cn%252Ftypay%252F%253Fproject%253Dzsyy_test%2526service%253Dsmarthos.yygh.ApiyGHpaymentService.ghPayment%2526orgid%253D888%2526paymode%253D2%2526ddid%253D10000325%2526redirect%253Dhttp%25253A%25252F%25252Flocalhost%25253A8080%25252F%25253Fversion%25253D1.0.123%252523%25252Ftbook%25252Fsucceed%25253Fhzid%25253D25325760512%252526orgid%25253D888%252526orderid%25253D
          let {protocol, hostname, port, path, query, hash} = getParamsFromUrl((p.query.callback));
          console.log('query', query);
          if (!query) {
            query = {openid: openid}
          } else {
            query.openid = openid;
          }
          this.clearCookies();
          let red = makeUrl({protocol, hostname, port, path, query, hash});
          console.log('red', red);
          location.replace(red);
          //http://wx.hztywl.cn/typay/oauth2.html?project=zsyy_test&service=smarthos.yygh.ApiyGHpaymentService.ghPayment&orgid=888&paymode=2&ddid=10000326&redirect=http%3A%2F%2Flocalhost%3A8080%2F%3Fversion%3D1.0.123%23%2Ftbook%2Fsucceed%3Fhzid%3D25325760512%26orgid%3D888%26orderid%3D&callback=http%253A%252F%252Fwx.hztywl.cn%252Ftypay%252F%253Fproject%253Dzsyy_test%2526service%253Dsmarthos.yygh.ApiyGHpaymentService.ghPayment%2526orgid%253D888%2526paymode%253D2%2526ddid%253D10000326%2526redirect%253Dhttp%25253A%25252F%25252Flocalhost%25253A8080%25252F%25253Fversion%25253D1.0.123%252523%25252Ftbook%25252Fsucceed%25253Fhzid%25253D25325760512%252526orgid%25253D888%252526orderid%25253D&openid=o8yDv0yAMtjzSQB0oIDwDNkCflE8
          /*log({openid, red, query: p.query})
            .then((res) => {
              //location.replace(red);
            })
            .catch(e => {
              //location.replace(red);
            })*/
        }
        else if (type && type == "clear") {
          this.type = type;
          this.cookies = document.cookie;
        }
        else {
          location.replace(`http://${(p.query.plat && p.query.plat === 'pro') ? "" : "test-"}wechat-repeater.hztywl.cn/wechat/plat/oauth/${p.query.appid}?url=${encodeURIComponent(location.href)}&scope=snsapi_userinfo`);
          /*log({openid, query: p.query})
            .then(() => {
              location.replace(`http://${(p.query.plat && p.query.plat === 'pro') ? "" : "test-"}wechat-repeater.hztywl.cn/wechat/plat/oauth/${p.query.appid}?url=${encodeURIComponent(location.href)}&scope=snsapi_userinfo`);
            })
            .catch(e => {
              location.replace(`http://${(p.query.plat && p.query.plat === 'pro') ? "" : "test-"}wechat-repeater.hztywl.cn/wechat/plat/oauth/${p.query.appid}?url=${encodeURIComponent(location.href)}&scope=snsapi_userinfo`);
            })*/
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
        //alert(retUrl);
        //location.replace(retUrl);
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
