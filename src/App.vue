<template>
  <div id="app">
  </div>
</template>

<script>
  import {fromCache, userCache} from "./lib/cache"
  import {makeUrl, getParamsFromUrl, isBrower} from "./lib/util"

  export default {
    name: 'app',
    data() {
      return {
        page: ""
      }
    },
    created() {
      console.log(this.$cookies.keys(), this.$cookies.get("monitor_count"));
      //微信打开
      if (isBrower("micromessenger")) {
        this.weixinInit();
      } else {
        //非微信打开
      }

      //this.goBack();
    },
    methods: {
      weixinInit(){
        if (this.$cookies.get("openid")) {

        } else {

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
      }
    },

    watch: {}
  }
</script>

<style lang="scss"></style>
